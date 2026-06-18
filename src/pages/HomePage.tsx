import { useState } from "react";
import { Link } from "react-router-dom";
import { CollectionFilters } from "../components/CollectionFilters";
import { MobileCarousel } from "../components/MobileCarousel";
import { ReviewsPolaroidStrip } from "../components/ReviewsPolaroidStrip";

const confidenceSteps = [
  {
    number: "1",
    title: "Pick your set",
    copy: "Browse the ready-to-wear drops and choose the set that matches your plans."
  },
  {
    number: "2",
    title: "Choose glue or tabs",
    copy: "Use nail glue for longer wear or adhesive tabs when you want easier removal."
  },
  {
    number: "3",
    title: "Apply and wear",
    copy: "Prep, press, and keep the included tools nearby for touch-ups or reuse."
  }
];

export function HomePage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  return (
    <main id="home">
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
          <Link className="primary-button" to="/shop">
            Shop sets
          </Link>
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
            >
              <span className="confidence-card__number" aria-hidden="true">
                {step.number}
              </span>
              <div className="confidence-card__copy">
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </article>
          ))}
        />
      </section>

      <ReviewsPolaroidStrip />
    </main>
  );
}
