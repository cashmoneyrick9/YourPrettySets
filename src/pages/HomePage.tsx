import { useState } from "react";
import { CollectionFilters } from "../components/CollectionFilters";
import { FaqSection } from "../components/FaqSection";
import { KitContents } from "../components/KitContents";
import { MobileCarousel } from "../components/MobileCarousel";
import { products } from "../data/products";

const confidenceSteps = [
  { number: "1" },
  { number: "2" },
  { number: "3" }
];

const reviewProductById = Object.fromEntries(products.map((product) => [product.id, product]));

const reviews = [
  {
    buyer: "Taylor K.",
    productId: "blush-crush",
    fit: "Square Short",
    quote: "I was nervous to try press-ons, but this set was easy to apply and looked polished all week."
  },
  {
    buyer: "Jasmine L.",
    productId: "golden-hour",
    fit: "Almond Medium",
    quote: "Golden Hour made my birthday dinner feel finished. The shimmer looked pretty in photos without being too much."
  },
  {
    buyer: "Maya R.",
    productId: "sea-glass",
    fit: "Almond Medium",
    quote: "Sea Glass survived a beach weekend, packing cubes, and sunscreen hands. I still got compliments on day four."
  },
  {
    buyer: "Nia P.",
    productId: "soft-serve",
    fit: "Round Short",
    quote: "Soft Serve looked clean for work and still felt pretty for dinner after. I loved how natural the length felt."
  },
  {
    buyer: "Brianna S.",
    productId: "date-night-gloss",
    fit: "Coffin Medium",
    quote: "I put these on before a date night and they instantly made my outfit feel more pulled together."
  },
  {
    buyer: "Camille D.",
    productId: "mint-to-be",
    fit: "Oval Short",
    quote: "Mint To Be was playful but still easy to wear every day. The color felt fresh without clashing with everything."
  },
  {
    buyer: "Lauren M.",
    productId: "pink-french",
    fit: "Square Short",
    quote: "Pink French is the set I would tell beginners to try first. Simple, clean, and so much easier than booking a salon."
  },
  {
    buyer: "Ari T.",
    productId: "birthday-candle",
    fit: "Almond Long",
    quote: "Birthday Candle looked fun in every picture from brunch. They felt special but still stayed comfortable."
  },
  {
    buyer: "Sofia G.",
    productId: "office-crush",
    fit: "Round Short",
    quote: "Office Crush gave me a neat manicure for the week without looking plain. The tabs held better than I expected."
  },
  {
    buyer: "Kayla B.",
    productId: "vacation-crush",
    fit: "Coffin Medium",
    quote: "Vacation Crush was the easiest thing I packed. I applied them at the hotel and they looked fresh the whole trip."
  },
  {
    buyer: "Emily C.",
    productId: "something-blue",
    fit: "Oval Medium",
    quote: "Something Blue was soft enough for a bridal shower but still had detail up close. It photographed beautifully."
  },
  {
    buyer: "Renee W.",
    productId: "main-character",
    fit: "Stiletto Long",
    quote: "Main Character is exactly the name. I wore them to a concert and got stopped twice in the bathroom line."
  }
].map((review) => {
  const product = reviewProductById[review.productId];

  if (!product) {
    throw new Error(`Missing review product: ${review.productId}`);
  }

  return {
    ...review,
    meta: `${review.fit} · $${product.price}`,
    productName: product.name,
    productUrl: `/shop/${product.slug}`
  };
});

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

                return (
                  <figure
                    aria-hidden={isActive ? undefined : "true"}
                    className={`review-card review-card--product${
                      isActive ? " review-card--active" : " review-card--peek"
                    }`}
                    data-card-index={cardIndex}
                    data-review-index={reviewIndex}
                    key={review.productId}
                  >
                    <span className="review-card__stars review-card__stars--product" aria-label="5 out of 5 stars">
                      ★★★★★
                    </span>
                    <blockquote>{review.quote}</blockquote>
                    <figcaption className="review-card__buyer">
                      <strong>{review.buyer}</strong>
                      <span>
                        <span className="review-card__verified" aria-hidden="true">
                          ✓
                        </span>
                        Verified Buyer
                      </span>
                    </figcaption>
                    <div className="reviewed-set" aria-label={`Reviewed set: ${review.productName}`}>
                      <p className="reviewed-set__label">REVIEWED SET</p>
                      <div className="reviewed-set__details">
                        <span className="reviewed-set__thumbnail" aria-hidden="true">
                          <span />
                        </span>
                        <div className="reviewed-set__copy">
                          <strong>{review.productName}</strong>
                          <span>{review.meta}</span>
                        </div>
                      </div>
                      <a className="reviewed-set__link" href={review.productUrl} tabIndex={isActive ? undefined : -1}>
                        SHOP THIS SET <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </figure>
                );
              })}
        />
      </section>

      <FaqSection />
    </main>
  );
}
