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

export function HomePage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeReviewCardIndex, setActiveReviewCardIndex] = useState(0);

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
        <MobileCarousel
          ariaLabel="Customer review carousel"
          autoRotate
          className="review-carousel"
          containerClassName="review-carousel__track"
          onSelectedIndexChange={setActiveReviewCardIndex}
          options={{ align: "center", containScroll: false, loop: true }}
          showArrows={false}
          slideClassName="review-carousel__slide"
          viewportClassName="review-carousel__viewport"
          slides={reviews.map((review, reviewIndex) => {
                const cardIndex = reviewIndex;
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
        />
      </section>

      <FaqSection />
    </main>
  );
}
