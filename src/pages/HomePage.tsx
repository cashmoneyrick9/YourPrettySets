import { useState } from "react";
import { Link } from "react-router-dom";
import { FeaturedSets } from "../components/FeaturedSets";
import { HomeCollections } from "../components/HomeCollections";
import { MobileCarousel } from "../components/MobileCarousel";
import { ReviewsPolaroidStrip } from "../components/ReviewsPolaroidStrip";

const confidenceSteps = [
  {
    number: "1"
  },
  {
    number: "2"
  },
  {
    number: "3"
  }
];

export function HomePage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  return (
    <main id="home">
      <section className="hero-section">
        <div className="hero-photo" aria-hidden="true">
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
          <Link className="primary-button" to="/shop">
            Shop sets
          </Link>
        </div>
      </section>

      <HomeCollections />

      <FeaturedSets />

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
            >
              <span className="confidence-card__number">
                {step.number}
              </span>
            </article>
          ))}
        />
      </section>

      <ReviewsPolaroidStrip />
    </main>
  );
}
