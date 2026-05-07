import { useState } from "react";
import { CollectionFilters } from "../components/CollectionFilters";
import { KitContents } from "../components/KitContents";
import { ProductCard } from "../components/ProductCard";
import { products } from "../data/products";

const confidenceSteps = [
  { label: "Pick your set", helper: "Find the look you want", visual: "set" },
  { label: "Choose your wear", helper: "Glue or tabs", visual: "wear" },
  { label: "Press on pretty", helper: "Ready in minutes", visual: "press" }
];

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
const faqs = ["What comes with each set?", "How long do press-ons last?", "Can I reuse them?"];

const weeklyProducts = products.filter((product) => product.collections.includes("New Arrivals")).slice(0, 4);
const weeklyProduct = weeklyProducts[0];
const peekProduct = weeklyProducts[1];
const shopMoreProducts = products.filter((product) =>
  ["golden-hour", "vacation-crush", "soft-serve"].includes(product.id)
);

export function HomePage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const activeStep = confidenceSteps[activeStepIndex];
  const activeReview = reviews[activeReviewIndex];
  const nextReview = reviews[(activeReviewIndex + 1) % reviews.length];
  const showPreviousStep = () => {
    setActiveStepIndex((current) => (current === 0 ? confidenceSteps.length - 1 : current - 1));
  };
  const showNextStep = () => {
    setActiveStepIndex((current) => (current === confidenceSteps.length - 1 ? 0 : current + 1));
  };
  const showPreviousReview = () => {
    setActiveReviewIndex((current) => (current === 0 ? reviews.length - 1 : current - 1));
  };
  const showNextReview = () => {
    setActiveReviewIndex((current) => (current === reviews.length - 1 ? 0 : current + 1));
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
        <div className="confidence-carousel" aria-live="polite">
          <button className="confidence-carousel__button" type="button" onClick={showPreviousStep} aria-label="Previous step">
            ‹
          </button>
          <article className={`confidence-card confidence-card--${activeStep.visual}`}>
              <span className="confidence-card__visual" aria-hidden="true">
                <span className="confidence-card__nail confidence-card__nail--one" />
                <span className="confidence-card__nail confidence-card__nail--two" />
                <span className="confidence-card__nail confidence-card__nail--three" />
                <span className="confidence-card__nail confidence-card__nail--four" />
              </span>
            <span className="confidence-card__copy">
              <strong className="confidence-card__label">{activeStep.label}</strong>
              <span className="confidence-card__helper">{activeStep.helper}</span>
            </span>
          </article>
          <button className="confidence-carousel__button" type="button" onClick={showNextStep} aria-label="Next step">
            ›
          </button>
        </div>
        <div className="confidence-dots" aria-label="Step carousel controls">
          {confidenceSteps.map((step, index) => (
            <button
              aria-label={`Show ${step.label}`}
              aria-pressed={index === activeStepIndex}
              className={`confidence-dots__dot${index === activeStepIndex ? " confidence-dots__dot--active" : ""}`}
              key={step.label}
              onClick={() => setActiveStepIndex(index)}
              type="button"
            />
          ))}
        </div>
      </section>

      <CollectionFilters />
      <section className="section-block weekly-set-section" id="this-weeks-set">
        <div className="section-heading weekly-set-heading">
          <div>
            <p className="eyebrow">Curated this week</p>
            <h2>This week's set</h2>
          </div>
          <span className="weekly-set-count">1 of {weeklyProducts.length}</span>
        </div>
        <div className="weekly-set-layout">
          <article className="weekly-set-card" id={`product-${weeklyProduct.slug}`}>
            <div className={`weekly-set-art product-art product-art--${weeklyProduct.detailTier}`} aria-label={weeklyProduct.images.clean}>
              <span className="product-art__nail product-art__nail--one" />
              <span className="product-art__nail product-art__nail--two" />
              <span className="product-art__nail product-art__nail--three" />
              <span className="product-art__nail product-art__nail--four" />
              <span className="product-art__nail product-art__nail--five" />
            </div>
            <div className="weekly-set-card__body">
              <div>
                <h3>{weeklyProduct.name}</h3>
                <p>Soft pink, ready for everyday plans.</p>
              </div>
              <strong>${weeklyProduct.price}</strong>
            </div>
            <div className="weekly-set-card__actions">
              <a className="primary-button" href={`#product-${weeklyProduct.slug}`}>
                Shop this set
              </a>
              <a className="weekly-set-card__link" href="#shop-more">
                Browse all new sets
              </a>
            </div>
          </article>
          <div className="weekly-set__peek" aria-label={`Next set preview: ${peekProduct.name}`}>
            <div className={`product-art product-art--${peekProduct.detailTier}`} aria-hidden="true">
              <span className="product-art__nail product-art__nail--one" />
              <span className="product-art__nail product-art__nail--two" />
              <span className="product-art__nail product-art__nail--three" />
            </div>
            <span className="weekly-set__peek-arrow" aria-hidden="true">
              ›
            </span>
          </div>
        </div>
      </section>
      <section className="section-block shop-more-section" id="shop-more">
        <div className="section-heading">
          <p className="eyebrow">More to shop</p>
          <h2>Shop more</h2>
        </div>
        <div className="shop-more-grid">
          {shopMoreProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
        <a className="review-more-link" href="#reviews">
          See more reviews <span aria-hidden="true">›</span>
        </a>
      </section>

      <section className="section-block faq-teaser" id="faq">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Quick answers</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <a key={faq} href="/faq">
              {faq}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
