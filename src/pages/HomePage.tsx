import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { CollectionFilters } from "../components/CollectionFilters";
import { KitContents } from "../components/KitContents";
import { ProductCard } from "../components/ProductCard";
import { products } from "../data/products";

const confidenceSteps = [
  { number: "01", label: "Pick your set", helper: "Find the look you want", visual: "set" },
  { number: "02", label: "Choose your wear", helper: "Glue or tabs", visual: "wear" },
  { number: "03", label: "Press on pretty", helper: "Ready in minutes", visual: "press" }
];

const confidenceRotationDelay = 5200;
const loopedConfidenceSteps = [...confidenceSteps, confidenceSteps[0]];

function renderConfidenceVisual(visual: string) {
  if (visual === "wear") {
    return (
      <>
        <span className="confidence-card__glue" />
        <span className="confidence-card__tabs">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
      </>
    );
  }

  if (visual === "press") {
    return (
      <span className="confidence-card__hand">
        <span className="confidence-card__finger confidence-card__finger--one" />
        <span className="confidence-card__finger confidence-card__finger--two" />
        <span className="confidence-card__finger confidence-card__finger--three" />
      </span>
    );
  }

  return (
    <span className="confidence-card__tray">
      <span className="confidence-card__nail confidence-card__nail--one" />
      <span className="confidence-card__nail confidence-card__nail--two" />
      <span className="confidence-card__nail confidence-card__nail--three" />
      <span className="confidence-card__nail confidence-card__nail--four" />
      <span className="confidence-card__nail confidence-card__nail--five" />
    </span>
  );
}

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
  const [isStepResetting, setIsStepResetting] = useState(false);
  const [activeWeeklyIndex, setActiveWeeklyIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [activeShopMoreIndex, setActiveShopMoreIndex] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const visibleStepIndex = activeStepIndex % confidenceSteps.length;
  const activeStep = confidenceSteps[visibleStepIndex];
  const isStepRotationPaused = useRef(false);
  const activeWeeklyProduct = weeklyProducts[activeWeeklyIndex];
  const activeReview = reviews[activeReviewIndex];
  const activeShopMoreProduct = shopMoreProducts[activeShopMoreIndex];
  const nextShopMoreProduct = shopMoreProducts[(activeShopMoreIndex + 1) % shopMoreProducts.length];
  const visibleShopMoreProducts = [activeShopMoreProduct, nextShopMoreProduct];
  const nextReview = reviews[(activeReviewIndex + 1) % reviews.length];
  useEffect(() => {
    const rotationId = window.setInterval(() => {
      if (!isStepRotationPaused.current) {
        setActiveStepIndex((current) => (current >= confidenceSteps.length ? 1 : current + 1));
      }
    }, confidenceRotationDelay);

    return () => window.clearInterval(rotationId);
  }, []);

  useEffect(() => {
    if (!isStepResetting) {
      return;
    }

    const resetId = window.requestAnimationFrame(() => {
      setIsStepResetting(false);
    });

    return () => window.cancelAnimationFrame(resetId);
  }, [isStepResetting]);

  const pauseStepRotation = () => {
    isStepRotationPaused.current = true;
  };

  const showNextStepWithoutPausing = () => {
    setActiveStepIndex((current) => (current >= confidenceSteps.length ? 1 : current + 1));
  };
  const showPreviousStep = () => {
    pauseStepRotation();
    setActiveStepIndex((current) => (current <= 0 ? confidenceSteps.length - 1 : current - 1));
  };
  const showNextStep = () => {
    pauseStepRotation();
    showNextStepWithoutPausing();
  };
  const handleStepKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPreviousStep();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNextStep();
    }
  };
  const handleStepTransitionEnd = () => {
    if (activeStepIndex === confidenceSteps.length) {
      setIsStepResetting(true);
      setActiveStepIndex(0);
    }
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
          <h1>Ready-to-wear sets for pretty plans</h1>
          <p>Handmade press-on sets for everyday style, special plans, and salon-looking moments at home.</p>
          <a className="primary-button" href="#shop-collections">
            Shop sets
          </a>
        </div>
      </section>

      <section className="section-block confidence-section" id="how-it-works">
        <div className="section-heading">
          <p className="eyebrow">Ready to wear</p>
          <h2>Ready in three steps</h2>
        </div>
        <div
          aria-label="How it works rotating steps"
          aria-live="polite"
          className="confidence-carousel"
          data-active-step={activeStep.number}
          data-track-index={activeStepIndex}
          onKeyDown={handleStepKeyDown}
          onPointerDown={pauseStepRotation}
          tabIndex={0}
        >
          <div className="confidence-carousel__viewport">
            <div
              className={`confidence-carousel__track${isStepResetting ? " confidence-carousel__track--resetting" : ""}`}
              onTransitionEnd={handleStepTransitionEnd}
            >
              {loopedConfidenceSteps.map((step, stepIndex) => {
                const isLoopClone = stepIndex === confidenceSteps.length;
                const isActiveTrackCard = stepIndex === activeStepIndex || (isLoopClone && activeStepIndex === confidenceSteps.length);

                return (
                  <article
                    aria-hidden={!isActiveTrackCard}
                    className={`confidence-card confidence-card--${step.visual}${isLoopClone ? " confidence-card--loop-clone" : ""}`}
                    key={`${step.number}-${isLoopClone ? "clone" : "step"}`}
                  >
                    <span className="confidence-card__visual" aria-hidden="true">
                      <span className="confidence-card__visual-frame">{renderConfidenceVisual(step.visual)}</span>
                    </span>
                    <span className="confidence-card__copy">
                      <strong className="confidence-card__label">
                        {step.number} {step.label}
                      </strong>
                      <span className="confidence-card__helper">{step.helper}</span>
                    </span>
                  </article>
                );
              })}
            </div>
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
