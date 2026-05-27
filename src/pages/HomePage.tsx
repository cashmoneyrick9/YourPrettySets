import { PointerEvent as ReactPointerEvent, UIEvent, useEffect, useRef, useState } from "react";
import { CollectionFilters } from "../components/CollectionFilters";
import { KitContents } from "../components/KitContents";

const confidenceDriftPixelsPerSecond = 36;
const confidenceInteractionPauseMs = 3000;
const confidenceSteps = [
  { number: "1" },
  { number: "2" },
  { number: "3" }
];
const confidencePrimaryLoopIndex = 1;
const confidenceCarouselCards = Array.from({ length: 3 }, (_, loopIndex) =>
  confidenceSteps.map((step, stepIndex) => ({
    isLoopBuffer: loopIndex !== confidencePrimaryLoopIndex,
    loopIndex,
    step,
    stepIndex
  }))
).flat();

const reviews = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12"
].map((number) => ({ number }));

const reviewedSetCard = {
  buyer: "Taylor K.",
  meta: "Square Short · From $35",
  productName: "Soft Pink",
  productUrl: "/shop",
  quote: "I was nervous to try press-ons, but this set was easy to apply and looked polished all week."
};

const reviewCarouselCards = reviews.map((review, reviewIndex) => ({
  cardIndex: reviewIndex,
  review,
  reviewIndex
}));

const faqs = [
  {
    answer: "Each set includes 24 nails, adhesive tabs, nail glue, a nail file, cuticle pusher, alcohol wipe, application card, and storage.",
    question: "What comes with each set?"
  },
  {
    answer: "Wear time depends on prep and adhesive choice. Tabs are best for short wear, while glue is better for longer plans.",
    question: "How long do press-ons last?"
  },
  {
    answer: "Yes, with careful removal and storage between wears.",
    question: "Can I reuse them?"
  }
];

export function HomePage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isStepAutoPaused, setIsStepAutoPaused] = useState(false);
  const [isStepInteracting, setIsStepInteracting] = useState(false);
  const [confidenceProgressPills, setConfidenceProgressPills] = useState(() => confidenceSteps.map(() => 0));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );
  const [activeReviewCardIndex, setActiveReviewCardIndex] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const stepTrackRef = useRef<HTMLDivElement>(null);
  const reviewTrackRef = useRef<HTMLDivElement>(null);
  const isReviewRecenteringRef = useRef(false);
  const isReviewAutoPausedRef = useRef(false);
  const isStepAutoPausedRef = useRef(false);
  const isStepInteractingRef = useRef(false);
  const reviewAnimationFrameRef = useRef<number | null>(null);
  const reviewAutoPauseTimeoutRef = useRef<number | null>(null);
  const reviewIsVisibleRef = useRef(true);
  const reviewLastFrameTimeRef = useRef<number | null>(null);
  const reviewVirtualScrollLeftRef = useRef<number | null>(null);
  const stepAnimationFrameRef = useRef<number | null>(null);
  const stepAutoPauseTimeoutRef = useRef<number | null>(null);
  const stepDragStateRef = useRef<{ pointerId: number; startScrollLeft: number; startX: number } | null>(null);
  const stepIsVisibleRef = useRef(true);
  const stepLastFrameTimeRef = useRef<number | null>(null);
  const stepVirtualScrollLeftRef = useRef<number | null>(null);

  const getConfidenceCardDistance = (track: HTMLElement) => {
    const firstCard = track.querySelector<HTMLElement>(".confidence-card");
    if (!firstCard) return 0;

    const trackStyles = window.getComputedStyle(track);
    const parsedColumnGap = Number.parseFloat(trackStyles.columnGap);
    const parsedGap = Number.isFinite(parsedColumnGap) ? parsedColumnGap : Number.parseFloat(trackStyles.gap);
    const gap = Number.isFinite(parsedGap) ? parsedGap : 0;

    return firstCard.offsetWidth + gap;
  };

  const normalizeConfidenceScrollLeft = (scrollLeft: number, cardDistance: number) => {
    const loopDistance = cardDistance * confidenceSteps.length;
    if (cardDistance <= 0 || loopDistance <= 0) return scrollLeft;

    const primaryLoopOffset = loopDistance * confidencePrimaryLoopIndex;
    const relativeOffset = ((scrollLeft - primaryLoopOffset) % loopDistance + loopDistance) % loopDistance;
    return primaryLoopOffset + relativeOffset;
  };

  const remapConfidenceScrollLeftFromOuterBuffer = (scrollLeft: number, cardDistance: number) => {
    const loopDistance = cardDistance * confidenceSteps.length;
    if (cardDistance <= 0 || loopDistance <= 0 || !Number.isFinite(scrollLeft)) return scrollLeft;

    const totalLoopDistance = loopDistance * 3;
    if (scrollLeft <= cardDistance || scrollLeft >= totalLoopDistance - cardDistance) {
      return normalizeConfidenceScrollLeft(scrollLeft, cardDistance);
    }

    return scrollLeft;
  };

  const updateActiveConfidenceStepFromTrack = (track: HTMLElement, scrollLeft = track.scrollLeft) => {
    const cardDistance = getConfidenceCardDistance(track);
    const loopDistance = cardDistance * confidenceSteps.length;
    if (cardDistance <= 0 || loopDistance <= 0) return;

    const normalizedScrollLeft = normalizeConfidenceScrollLeft(scrollLeft, cardDistance);
    const primaryLoopOffset = loopDistance * confidencePrimaryLoopIndex;
    const relativeOffset = normalizedScrollLeft - primaryLoopOffset;
    const roundedStep = Math.round(relativeOffset / cardDistance);
    if (!Number.isFinite(roundedStep) || !Number.isFinite(relativeOffset)) return;

    const relativeStep = ((roundedStep % confidenceSteps.length) + confidenceSteps.length) % confidenceSteps.length;
    const progressThroughSteps = Math.max(0, Math.min(confidenceSteps.length, relativeOffset / cardDistance));
    const pillProgress = confidenceSteps.map((_, stepIndex) => {
      const rawProgress = (progressThroughSteps - stepIndex) * 100;
      return Math.max(0, Math.min(100, rawProgress));
    });

    setActiveStepIndex(relativeStep);
    setConfidenceProgressPills(pillProgress);
  };

  const scrollConfidenceStepIntoView = (stepIndex: number, behavior: ScrollBehavior = "smooth") => {
    const track = stepTrackRef.current;
    const cards = [...(track?.querySelectorAll<HTMLElement>(".confidence-card") ?? [])];
    const targetCard = cards.find(
      (card) => card.dataset.stepIndex === String(stepIndex) && !card.classList.contains("confidence-card--loop-buffer")
    );
    if (!track || !targetCard) return;

    const targetIndex = cards.indexOf(targetCard);
    const cardDistance = getConfidenceCardDistance(track);
    if (targetIndex < 0 || cardDistance <= 0) return;

    const centerOffset = (track.clientWidth - targetCard.offsetWidth) / 2;
    const measuredScrollLeft = targetCard.offsetLeft - centerOffset;
    const fallbackScrollLeft = targetIndex * cardDistance;
    const targetScrollLeft =
      Number.isFinite(measuredScrollLeft) && (targetCard.offsetLeft > 0 || track.clientWidth > 0)
        ? measuredScrollLeft
        : fallbackScrollLeft;

    if (typeof track.scrollTo === "function") {
      track.scrollTo({ behavior, left: Math.max(0, targetScrollLeft) });
    } else {
      track.scrollLeft = Math.max(0, targetScrollLeft);
    }
    stepVirtualScrollLeftRef.current = track.scrollLeft;
    updateActiveConfidenceStepFromTrack(track);
  };

  const pauseConfidenceAutoDrift = () => {
    if (prefersReducedMotion) return;

    stepVirtualScrollLeftRef.current = stepTrackRef.current?.scrollLeft ?? null;
    isStepAutoPausedRef.current = true;
    setIsStepAutoPaused(true);
    if (stepAutoPauseTimeoutRef.current !== null) {
      window.clearTimeout(stepAutoPauseTimeoutRef.current);
    }
    stepAutoPauseTimeoutRef.current = window.setTimeout(() => {
      isStepAutoPausedRef.current = false;
      setIsStepAutoPaused(false);
      stepAutoPauseTimeoutRef.current = null;
    }, confidenceInteractionPauseMs);
  };

  const settleConfidenceTrack = (track: HTMLElement) => {
    const cardDistance = getConfidenceCardDistance(track);
    if (cardDistance <= 0) return;

    const sourceScrollLeft = stepVirtualScrollLeftRef.current ?? track.scrollLeft;
    const roundedCard = Math.round(sourceScrollLeft / cardDistance);
    if (!Number.isFinite(roundedCard)) return;

    const targetScrollLeft = Math.max(0, roundedCard * cardDistance);

    stepVirtualScrollLeftRef.current = targetScrollLeft;
    if (typeof track.scrollTo === "function") {
      track.scrollTo({ behavior: "smooth", left: targetScrollLeft });
    } else {
      track.scrollLeft = targetScrollLeft;
    }
    updateActiveConfidenceStepFromTrack(track, targetScrollLeft);
  };

  useEffect(() => {
    const centerInitialCard = () => scrollConfidenceStepIntoView(0, "auto");

    if (typeof window.requestAnimationFrame !== "function") {
      centerInitialCard();
      return undefined;
    }

    const frameId = window.requestAnimationFrame(centerInitialCard);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => setPrefersReducedMotion(motionQuery.matches);
    handleMotionChange();
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", handleMotionChange);
    } else {
      motionQuery.addListener?.(handleMotionChange);
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", handleMotionChange);
      } else {
        motionQuery.removeListener?.(handleMotionChange);
      }
    };
  }, []);

  useEffect(() => {
    const track = stepTrackRef.current;
    if (!track || prefersReducedMotion || typeof window.requestAnimationFrame !== "function") {
      return undefined;
    }

    const section = track.closest("#how-it-works");
    let observer: IntersectionObserver | null = null;
    if (section && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(([entry]) => {
        stepIsVisibleRef.current = entry.isIntersecting;
      });
      observer.observe(section);
    }

    const advanceDrift = (timestamp: number) => {
      if (stepLastFrameTimeRef.current !== null && !isStepAutoPausedRef.current && stepIsVisibleRef.current) {
        const elapsed = Math.min(timestamp - stepLastFrameTimeRef.current, 80);
        const cardDistance = getConfidenceCardDistance(track);
        const loopDistance = cardDistance * confidenceSteps.length;

        if (cardDistance > 0 && loopDistance > 0) {
          const primaryLoopOffset = loopDistance * confidencePrimaryLoopIndex;
          const loopStart = primaryLoopOffset;
          const loopEnd = primaryLoopOffset + loopDistance;
          if (stepVirtualScrollLeftRef.current === null) {
            stepVirtualScrollLeftRef.current = track.scrollLeft;
          }
          let nextScrollLeft =
            stepVirtualScrollLeftRef.current + (elapsed * confidenceDriftPixelsPerSecond) / 1000;

          if (nextScrollLeft >= loopEnd) {
            nextScrollLeft -= loopDistance;
          } else if (nextScrollLeft < loopStart) {
            nextScrollLeft += loopDistance;
          }

          stepVirtualScrollLeftRef.current = nextScrollLeft;
          track.scrollLeft = nextScrollLeft;
          updateActiveConfidenceStepFromTrack(track, nextScrollLeft);
        }
      }

      stepLastFrameTimeRef.current = timestamp;
      stepAnimationFrameRef.current = window.requestAnimationFrame(advanceDrift);
    };

    stepAnimationFrameRef.current = window.requestAnimationFrame(advanceDrift);

    return () => {
      if (stepAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(stepAnimationFrameRef.current);
      }
      observer?.disconnect();
      stepLastFrameTimeRef.current = null;
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (stepAutoPauseTimeoutRef.current !== null) {
        window.clearTimeout(stepAutoPauseTimeoutRef.current);
      }
    };
  }, []);

  const handleStepScroll = (event: UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    const cardDistance = getConfidenceCardDistance(track);
    const currentScrollLeft = track.scrollLeft;
    const scrollLeft = remapConfidenceScrollLeftFromOuterBuffer(currentScrollLeft, cardDistance);
    if (Math.abs(scrollLeft - currentScrollLeft) > 0.5) {
      track.scrollLeft = scrollLeft;
    }
    if (isStepAutoPausedRef.current || isStepInteractingRef.current) {
      stepVirtualScrollLeftRef.current = scrollLeft;
    }
    updateActiveConfidenceStepFromTrack(track, scrollLeft);
  };

  const handleStepPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    const startX = Number.isFinite(event.clientX) ? event.clientX : 0;
    pauseConfidenceAutoDrift();
    if (event.pointerType && event.pointerType !== "mouse") return;

    stepDragStateRef.current = {
      pointerId: event.pointerId,
      startScrollLeft: stepVirtualScrollLeftRef.current ?? track.scrollLeft,
      startX
    };
    isStepInteractingRef.current = true;
    setIsStepInteracting(true);
    track.setPointerCapture?.(event.pointerId);
  };

  const handleStepPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = stepDragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const currentX = Number.isFinite(event.clientX) ? event.clientX : dragState.startX;
    const nextScrollLeft = dragState.startScrollLeft - (currentX - dragState.startX);
    event.currentTarget.scrollLeft = nextScrollLeft;
    const cardDistance = getConfidenceCardDistance(event.currentTarget);
    const scrollLeft = remapConfidenceScrollLeftFromOuterBuffer(event.currentTarget.scrollLeft, cardDistance);
    if (Math.abs(scrollLeft - event.currentTarget.scrollLeft) > 0.5) {
      event.currentTarget.scrollLeft = scrollLeft;
    }
    stepVirtualScrollLeftRef.current = scrollLeft;
    updateActiveConfidenceStepFromTrack(event.currentTarget, scrollLeft);
    event.preventDefault();
  };

  const endStepInteraction = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = stepDragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    stepDragStateRef.current = null;
    isStepInteractingRef.current = false;
    setIsStepInteracting(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    settleConfidenceTrack(event.currentTarget);
  };

  const getCenteredReviewScrollLeft = (track: HTMLElement, card: HTMLElement) =>
    card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;

  const getReviewCardDistance = (track: HTMLElement) => {
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".review-card"));
    if (cards.length >= 2) {
      const measuredDistance = cards[1].offsetLeft - cards[0].offsetLeft;
      if (measuredDistance > 0) return measuredDistance;
    }

    const firstCard = cards[0];
    if (!firstCard) return 0;
    const trackStyles = window.getComputedStyle(track);
    const parsedColumnGap = Number.parseFloat(trackStyles.columnGap);
    const parsedGap = Number.isFinite(parsedColumnGap) ? parsedColumnGap : Number.parseFloat(trackStyles.gap);
    const gap = Number.isFinite(parsedGap) ? parsedGap : 0;
    return firstCard.offsetWidth + gap;
  };

  const updateActiveReviewFromTrack = (track: HTMLElement, scrollLeft = track.scrollLeft) => {
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".review-card"));
    if (cards.length === 0) return;

    const trackCenter = scrollLeft + track.clientWidth / 2;
    const nearestCard = cards.reduce((nearest, card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const nearestCenter = nearest.offsetLeft + nearest.offsetWidth / 2;
      return Math.abs(cardCenter - trackCenter) < Math.abs(nearestCenter - trackCenter) ? card : nearest;
    }, cards[0]);

    const nextCardIndex = Number(nearestCard.dataset.cardIndex);
    if (!Number.isFinite(nextCardIndex)) return;

    setActiveReviewCardIndex(nextCardIndex);
  };

  const pauseReviewAutoDrift = () => {
    if (prefersReducedMotion) return;

    reviewVirtualScrollLeftRef.current = reviewTrackRef.current?.scrollLeft ?? null;
    isReviewAutoPausedRef.current = true;
    if (reviewAutoPauseTimeoutRef.current !== null) {
      window.clearTimeout(reviewAutoPauseTimeoutRef.current);
    }
    reviewAutoPauseTimeoutRef.current = window.setTimeout(() => {
      isReviewAutoPausedRef.current = false;
      reviewAutoPauseTimeoutRef.current = null;
    }, confidenceInteractionPauseMs);
  };

  const centerReviewCardByIndex = (cardIndex: number) => {
    const track = reviewTrackRef.current;
    const card = track?.querySelector<HTMLElement>(`.review-card[data-card-index="${cardIndex}"]`);
    if (!track || !card) return;

    isReviewRecenteringRef.current = true;
    track.scrollLeft = getCenteredReviewScrollLeft(track, card);
    reviewVirtualScrollLeftRef.current = track.scrollLeft;
    window.setTimeout(() => {
      isReviewRecenteringRef.current = false;
    }, 0);
  };

  const handleReviewScroll = () => {
    if (isReviewRecenteringRef.current) return;

    const track = reviewTrackRef.current;
    const cards = Array.from(track?.querySelectorAll<HTMLElement>(".review-card") ?? []);
    if (!track || cards.length === 0) return;

    const scrollLeft = track.scrollLeft;
    if (isReviewAutoPausedRef.current) {
      reviewVirtualScrollLeftRef.current = scrollLeft;
    }
    updateActiveReviewFromTrack(track, scrollLeft);
  };

  useEffect(() => {
    centerReviewCardByIndex(0);
  }, []);

  useEffect(() => {
    const track = reviewTrackRef.current;
    if (!track || prefersReducedMotion || typeof window.requestAnimationFrame !== "function") {
      return undefined;
    }

    const section = track.closest("#reviews");
    let observer: IntersectionObserver | null = null;
    if (section && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(([entry]) => {
        reviewIsVisibleRef.current = entry.isIntersecting;
      });
      observer.observe(section);
    }

    const advanceDrift = (timestamp: number) => {
      if (reviewLastFrameTimeRef.current !== null && !isReviewAutoPausedRef.current && reviewIsVisibleRef.current) {
        const elapsed = Math.min(timestamp - reviewLastFrameTimeRef.current, 80);
        const cardDistance = getReviewCardDistance(track);
        const maxScrollLeft = track.scrollWidth - track.clientWidth;

        if (cardDistance > 0 && maxScrollLeft > 0) {
          if (reviewVirtualScrollLeftRef.current === null) {
            reviewVirtualScrollLeftRef.current = track.scrollLeft;
          }
          let nextScrollLeft =
            reviewVirtualScrollLeftRef.current + (elapsed * confidenceDriftPixelsPerSecond) / 1000;

          if (nextScrollLeft > maxScrollLeft) {
            nextScrollLeft = 0;
          }

          reviewVirtualScrollLeftRef.current = nextScrollLeft;
          track.scrollLeft = nextScrollLeft;
          updateActiveReviewFromTrack(track, nextScrollLeft);
        }
      }

      reviewLastFrameTimeRef.current = timestamp;
      reviewAnimationFrameRef.current = window.requestAnimationFrame(advanceDrift);
    };

    reviewAnimationFrameRef.current = window.requestAnimationFrame(advanceDrift);

    return () => {
      if (reviewAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(reviewAnimationFrameRef.current);
      }
      observer?.disconnect();
      reviewLastFrameTimeRef.current = null;
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (reviewAutoPauseTimeoutRef.current !== null) {
        window.clearTimeout(reviewAutoPauseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main className="storefront-barebones" id="home">
      <section className="hero-section">
        <div className="hero-photo hero-photo--asset-preserved" aria-hidden="true">
          <div className="hero-photo__hand" aria-hidden="true">
            <span className="hero-photo__finger hero-photo__finger--one">
              <span className="hero-photo__nail hero-photo__nail--one" />
            </span>
            <span className="hero-photo__finger hero-photo__finger--two">
              <span className="hero-photo__nail hero-photo__nail--two" />
            </span>
            <span className="hero-photo__finger hero-photo__finger--three">
              <span className="hero-photo__nail hero-photo__nail--three" />
            </span>
            <span className="hero-photo__finger hero-photo__finger--four">
              <span className="hero-photo__nail hero-photo__nail--four" />
            </span>
          </div>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Handmade ready-to-wear press-ons</p>
          <h1>
            Ready-to-wear sets for <em className="hero-copy__accent">pretty plans</em>
          </h1>
          <p>Salon quality press-ons that are easy, affordable, and made to last.</p>
          <a className="primary-button" href="#shop-collections">
            Shop sets
          </a>
        </div>
      </section>

      <CollectionFilters />

      <section className="section-block confidence-section" id="how-it-works">
        <div className="section-heading confidence-section__heading">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>3 EASY STEPS</h2>
        </div>
        <div
          aria-label="How It Works carousel"
          aria-live="polite"
          className={`confidence-carousel${prefersReducedMotion ? "" : " confidence-carousel--drifting"}${
            isStepAutoPaused ? " confidence-carousel--auto-paused" : ""
          }${isStepInteracting ? " confidence-carousel--interacting" : ""
          }`}
          data-active-step={confidenceSteps[activeStepIndex].number}
          onFocusCapture={pauseConfidenceAutoDrift}
        >
          <div className="confidence-carousel__viewport">
            <div
              className="confidence-carousel__track"
              onPointerCancel={endStepInteraction}
              onPointerDown={handleStepPointerDown}
              onPointerMove={handleStepPointerMove}
              onPointerUp={endStepInteraction}
              onScroll={handleStepScroll}
              ref={stepTrackRef}
            >
              {confidenceCarouselCards.map(({ isLoopBuffer, loopIndex, step, stepIndex }, cardIndex) => (
                <article
                  aria-current={!isLoopBuffer && stepIndex === activeStepIndex ? "step" : undefined}
                  aria-hidden={isLoopBuffer ? "true" : undefined}
                  className={`confidence-card${stepIndex === activeStepIndex ? " confidence-card--active" : ""}${
                    isLoopBuffer ? " confidence-card--loop-buffer" : ""
                  }`}
                  data-step-index={stepIndex}
                  key={`${loopIndex}-${step.number}-${cardIndex}`}
                >
                </article>
              ))}
            </div>
          </div>
          <div className="confidence-carousel__controls">
            <div className="confidence-progress" aria-hidden="true">
              {confidenceProgressPills.map((progress, index) => (
                <span className="confidence-progress__pill" key={confidenceSteps[index].number}>
                  <span className="confidence-progress__fill" style={{ width: `${progress}%` }} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <KitContents />

      <section className="section-block reviews-section" id="reviews">
        <div className="section-heading review-heading">
          <p className="eyebrow">CUSTOMER LOVE</p>
          <h2>Loved by first-time press-on buyers</h2>
        </div>
        <div className="review-carousel" aria-label="Customer review carousel" onFocusCapture={pauseReviewAutoDrift}>
          <div className="review-carousel__viewport">
            <div
              className="review-carousel__track"
              onScroll={handleReviewScroll}
              onPointerDown={pauseReviewAutoDrift}
              ref={reviewTrackRef}
            >
              {reviewCarouselCards.map(({ cardIndex, review, reviewIndex }) => {
                const isActive = cardIndex === activeReviewCardIndex;
                const isReviewedSetCard = reviewIndex === 1;

                return (
                  <figure
                    aria-hidden={isActive ? undefined : "true"}
                    className={`review-card${isActive ? " review-card--active" : " review-card--peek"}${
                      isReviewedSetCard ? " review-card--product" : ""
                    }`}
                    data-card-index={cardIndex}
                    data-review-index={reviewIndex}
                    key={`${cardIndex}-${review.number}`}
                  >
                    {isReviewedSetCard ? (
                      <>
                        <span className="review-card__stars review-card__stars--product" aria-label="5 out of 5 stars">
                          ★★★★★
                        </span>
                        <blockquote>{reviewedSetCard.quote}</blockquote>
                        <figcaption className="review-card__buyer">
                          <strong>{reviewedSetCard.buyer}</strong>
                          <span>
                            <span className="review-card__verified" aria-hidden="true">
                              ✓
                            </span>
                            Verified Buyer
                          </span>
                        </figcaption>
                        <div className="reviewed-set" aria-label={`Reviewed set: ${reviewedSetCard.productName}`}>
                          <p className="reviewed-set__label">REVIEWED SET</p>
                          <div className="reviewed-set__details">
                            <span className="reviewed-set__thumbnail" aria-hidden="true">
                              <span />
                            </span>
                            <div className="reviewed-set__copy">
                              <strong>{reviewedSetCard.productName}</strong>
                              <span>{reviewedSetCard.meta}</span>
                            </div>
                          </div>
                          <a
                            className="reviewed-set__link"
                            href={reviewedSetCard.productUrl}
                            tabIndex={isActive ? undefined : -1}
                          >
                            SHOP THIS SET <span aria-hidden="true">→</span>
                          </a>
                        </div>
                      </>
                    ) : (
                      <span className="review-card__number">{review.number}</span>
                    )}
                  </figure>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block faq-teaser" id="faq">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2>Quick answers</h2>
          </div>
          <a className="faq-care-link" href="#faq">
            Care tips
          </a>
        </div>
        <a className="faq-start-strip" href="#how-it-works">
          <span aria-hidden="true">?</span>
          <p>New to press-ons? Start here.</p>
        </a>
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = activeFaqIndex === index;
            const panelId = `faq-answer-${index}`;

            return (
              <article className={`faq-item${isOpen ? " faq-item--open" : ""}`} key={faq.question}>
                <button
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  className="faq-item__button"
                  onClick={() => setActiveFaqIndex(index)}
                  type="button"
                >
                  <span>{faq.question}</span>
                  <span aria-hidden="true">⌄</span>
                </button>
                {isOpen && (
                  <p className="faq-item__answer" id={panelId}>
                    {faq.answer}
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <div className="faq-contact-cta">
          <span>Still unsure?</span>
          <a href="#contact">Contact us</a>
        </div>
      </section>
    </main>
  );
}
