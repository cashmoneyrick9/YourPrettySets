import { useState } from "react";
import { CollectionFilters } from "../components/CollectionFilters";
import { FaqSection } from "../components/FaqSection";
import { KitContents } from "../components/KitContents";
import { MobileCarousel } from "../components/MobileCarousel";

const confidenceSteps = [
  { number: "1" },
  { number: "2" },
  { number: "3" }
];

const reviewStoryLabels = ["Sarah", "Custom Set", "Birthday Nails", "Etsy Review", "Bridal Set"];

export function HomePage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

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
        <MobileCarousel
          ariaLabel="How It Works carousel"
          autoRotate
          className="confidence-carousel"
          containerClassName="confidence-carousel__track"
          dataActiveStep={confidenceSteps[activeStepIndex].number}
          onSelectedIndexChange={setActiveStepIndex}
          options={{ align: "center", containScroll: false, loop: true }}
          showArrows={false}
          slideClassName="confidence-carousel__slide"
          viewportClassName="confidence-carousel__viewport"
          slides={confidenceSteps.map((step, stepIndex) => (
            <article
              aria-current={stepIndex === activeStepIndex ? "step" : undefined}
              className={`confidence-card${stepIndex === activeStepIndex ? " confidence-card--active" : ""}`}
              data-step-index={stepIndex}
              key={step.number}
            />
          ))}
        />
      </section>
      <KitContents />

      <section className="section-block reviews-section" id="reviews">
        <div className="section-heading review-heading">
          <p className="eyebrow">CUSTOMER LOVE</p>
          <h2>Loved by first-time press-on buyers</h2>
        </div>
        <div className="review-story-row" aria-label="Review story placeholders">
          {reviewStoryLabels.map((label) => (
            <button className="review-story-item" key={label} type="button">
              <span className="review-story-bubble" aria-hidden="true" />
              <span className="review-story-label">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <FaqSection />
    </main>
  );
}
