import { PointerEvent as ReactPointerEvent, UIEvent, useEffect, useRef, useState } from "react";
import { CollectionFilters } from "../components/CollectionFilters";
import { KitContents } from "../components/KitContents";
import { ProductCard } from "../components/ProductCard";
import { products } from "../data/products";

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
  {
    detail: "Oval · Short",
    product: "Date Night",
    quote: "The set looked dressed up without feeling hard to wear.",
    name: "Everyday customer",
    tier: "mid"
  },
  {
    detail: "Almond · Medium",
    product: "Golden Hour",
    quote: "Pretty enough for photos, practical enough for the week.",
    name: "Beauty shopper",
    tier: "detailed"
  },
  {
    detail: "Round · Short",
    product: "Blush Crush",
    quote: "The 24-nail set made finding a fit feel less stressful.",
    name: "First-time press-on buyer",
    tier: "simple"
  }
];

const reviewChips = ["Easy fit", "Photo-ready", "Beginner friendly"];
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

const weeklyProducts = products.filter((product) => product.collections.includes("New Arrivals")).slice(0, 4);
const shopMoreProducts = products.filter((product) =>
  ["golden-hour", "vacation-crush", "soft-serve"].includes(product.id)
);

export function HomePage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isStepAutoPaused, setIsStepAutoPaused] = useState(false);
  const [isStepInteracting, setIsStepInteracting] = useState(false);
  const [confidenceProgressPills, setConfidenceProgressPills] = useState(() => confidenceSteps.map(() => 0));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );
  const [activeWeeklyIndex, setActiveWeeklyIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [activeShopMoreIndex, setActiveShopMoreIndex] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const stepTrackRef = useRef<HTMLDivElement>(null);
  const activeWeeklyProduct = weeklyProducts[activeWeeklyIndex];
  const activeReview = reviews[activeReviewIndex];
  const activeShopMoreProduct = shopMoreProducts[activeShopMoreIndex];
  const nextShopMoreProduct = shopMoreProducts[(activeShopMoreIndex + 1) % shopMoreProducts.length];
  const visibleShopMoreProducts = [activeShopMoreProduct, nextShopMoreProduct];
  const nextReview = reviews[(activeReviewIndex + 1) % reviews.length];
  const isStepAutoPausedRef = useRef(false);
  const isStepInteractingRef = useRef(false);
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
    const currentScrollLeft = event.currentTarget.scrollLeft;
    if (isStepAutoPausedRef.current || isStepInteractingRef.current) {
      stepVirtualScrollLeftRef.current = currentScrollLeft;
    }
    updateActiveConfidenceStepFromTrack(event.currentTarget, currentScrollLeft);
  };

  const handleStepPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    const startX = Number.isFinite(event.clientX) ? event.clientX : 0;
    pauseConfidenceAutoDrift();
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
    const scrollLeft = event.currentTarget.scrollLeft;
    stepVirtualScrollLeftRef.current = scrollLeft;
    updateActiveConfidenceStepFromTrack(event.currentTarget, scrollLeft);
    event.preventDefault();
  };

  const endStepInteraction = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = stepDragStateRef.current;
    if (dragState && dragState.pointerId !== event.pointerId) return;

    stepDragStateRef.current = null;
    isStepInteractingRef.current = false;
    setIsStepInteracting(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    settleConfidenceTrack(event.currentTarget);
  };

  const showPreviousWeeklySet = () => {
    setActiveWeeklyIndex((current) => (current === 0 ? weeklyProducts.length - 1 : current - 1));
  };
  const showNextWeeklySet = () => {
    setActiveWeeklyIndex((current) => (current === weeklyProducts.length - 1 ? 0 : current + 1));
  };
  const showPreviousReview = () => {
    setActiveReviewIndex((current) => (current === 0 ? reviews.length - 1 : current - 1));
  };
  const showNextReview = () => {
    setActiveReviewIndex((current) => (current === reviews.length - 1 ? 0 : current + 1));
  };
  const showPreviousShopMoreProduct = () => {
    setActiveShopMoreIndex((current) => (current === 0 ? shopMoreProducts.length - 1 : current - 1));
  };
  const showNextShopMoreProduct = () => {
    setActiveShopMoreIndex((current) => (current === shopMoreProducts.length - 1 ? 0 : current + 1));
  };

  return (
    <main id="home">
      <section className="hero-section">
        <div className="hero-photo" aria-label="Glossy pink press-on nail set on a soft spring vanity">
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

      <section className="section-block confidence-section" id="how-it-works">
        <div className="section-heading confidence-section__heading">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>3 easy steps</h2>
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
            <p className="confidence-carousel__hint" aria-hidden="true">
              <span>←</span> Swipe to explore <span>→</span>
            </p>
          </div>
        </div>
      </section>

      <CollectionFilters />
      <section className="section-block weekly-set-section" id="this-weeks-set">
        <div className="section-heading weekly-set-heading">
          <div>
            <p className="eyebrow">Curated this week</p>
            <h2>This week's set</h2>
          </div>
          <span className="weekly-set-count">
            {activeWeeklyIndex + 1} of {weeklyProducts.length}
          </span>
        </div>
        <div className="weekly-set-layout" aria-live="polite">
          <article className="weekly-set-card" id={`product-${activeWeeklyProduct.slug}`}>
            <div className={`weekly-set-art product-art product-art--${activeWeeklyProduct.detailTier}`} aria-label={activeWeeklyProduct.images.clean}>
              <span className="product-art__nail product-art__nail--one" />
              <span className="product-art__nail product-art__nail--two" />
              <span className="product-art__nail product-art__nail--three" />
              <span className="product-art__nail product-art__nail--four" />
              <span className="product-art__nail product-art__nail--five" />
            </div>
            <div className="weekly-set-card__body">
              <div>
                <h3>{activeWeeklyProduct.name}</h3>
                <p>{activeWeeklyProduct.description}</p>
              </div>
              <strong>${activeWeeklyProduct.price}</strong>
            </div>
            <div className="weekly-set-card__actions">
              <a className="primary-button" href={`#product-${activeWeeklyProduct.slug}`}>
                Shop this set
              </a>
              <a className="weekly-set-card__link" href="#shop-more">
                Browse all new sets
              </a>
            </div>
          </article>
          <div className="weekly-set-controls" aria-label="Weekly set carousel controls">
            <button
              aria-label="Previous weekly set"
              className="weekly-set-carousel__button"
              onClick={showPreviousWeeklySet}
              type="button"
            >
              ‹
            </button>
            <div className="weekly-set-dots" aria-hidden="true">
              {weeklyProducts.map((product, index) => (
                <span
                  className={`weekly-set-dots__dot${index === activeWeeklyIndex ? " weekly-set-dots__dot--active" : ""}`}
                  key={product.id}
                />
              ))}
            </div>
            <button
              aria-label="Next weekly set"
              className="weekly-set-carousel__button"
              onClick={showNextWeeklySet}
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      </section>
      <section className="section-block shop-more-section" id="shop-more">
        <div className="section-heading shop-more-heading">
          <div>
            <p className="eyebrow">More to shop</p>
            <h2>Shop more</h2>
          </div>
          <span className="shop-more-count">
            {activeShopMoreIndex + 1} of {shopMoreProducts.length}
          </span>
        </div>
        <div className="shop-more-carousel" aria-live="polite">
          <button
            aria-label="Previous shop more product"
            className="shop-more-carousel__button"
            onClick={showPreviousShopMoreProduct}
            type="button"
          >
            ‹
          </button>
          <div className="shop-more-carousel__viewport">
            <div className="shop-more-carousel__track">
              {visibleShopMoreProducts.map((product, index) => (
                <div
                  className={`shop-more-carousel__card${index === 0 ? " shop-more-carousel__card--active" : ""}`}
                  key={product.id}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          <button
            aria-label="Next shop more product"
            className="shop-more-carousel__button"
            onClick={showNextShopMoreProduct}
            type="button"
          >
            ›
          </button>
        </div>
      </section>
      <KitContents />

      <section className="section-block reviews-section" id="reviews">
        <div className="section-heading">
          <p className="eyebrow">Customer notes</p>
          <h2>Pretty notes from customers</h2>
        </div>
        <div className="review-proof-row" aria-label="Review highlights">
          {reviewChips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
        <div className="review-carousel">
          <button className="review-carousel__button" type="button" onClick={showPreviousReview} aria-label="Previous review">
            ‹
          </button>
          <figure className="review-card">
            <div className="review-card__stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <blockquote>{activeReview.quote}</blockquote>
            <figcaption>{activeReview.name}</figcaption>
            <div className="review-product">
              <span className={`review-product__art review-product__art--${activeReview.tier}`} aria-hidden="true">
                <span className="review-product__nail review-product__nail--one" />
                <span className="review-product__nail review-product__nail--two" />
                <span className="review-product__nail review-product__nail--three" />
              </span>
              <span>
                <strong>{activeReview.product}</strong>
                <small>{activeReview.detail}</small>
              </span>
            </div>
          </figure>
          <div className="review-card review-card--peek" aria-hidden="true">
            <span className="review-card__stars">★★★★★</span>
            <span className={`review-product__art review-product__art--${nextReview.tier}`}>
              <span className="review-product__nail review-product__nail--one" />
              <span className="review-product__nail review-product__nail--two" />
              <span className="review-product__nail review-product__nail--three" />
            </span>
          </div>
          <button className="review-carousel__button review-carousel__button--next" type="button" onClick={showNextReview} aria-label="Next review">
            ›
          </button>
        </div>
        <div className="review-dots" aria-label="Review carousel controls">
          {reviews.map((review, index) => (
            <button
              aria-label={`Show review from ${review.name}`}
              aria-pressed={index === activeReviewIndex}
              className={`review-dots__dot${index === activeReviewIndex ? " review-dots__dot--active" : ""}`}
              key={review.name}
              onClick={() => setActiveReviewIndex(index)}
              type="button"
            />
          ))}
        </div>
        <a className="review-more-link" href="#contact">
          See more reviews <span aria-hidden="true">›</span>
        </a>
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
