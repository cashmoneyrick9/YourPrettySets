import { useState } from "react";
import { CollectionFilters } from "../components/CollectionFilters";
import { FaqSection } from "../components/FaqSection";
import { KitContents } from "../components/KitContents";
import { MobileCarousel } from "../components/MobileCarousel";
import { StoryStrip, StoryViewer, type StoryItem } from "../components/story";

const confidenceSteps = [
  { number: "1" },
  { number: "2" },
  { number: "3" }
];

const reviewStories: StoryItem[] = [
  {
    id: "sarah",
    label: "Sarah",
    title: "Sarah",
    quote: "Sarah said her first set felt easy to apply, stayed put, and looked polished for the whole weekend.",
    source: "Verified customer"
  },
  {
    id: "birthday-set",
    label: "Birthday Set",
    title: "Birthday Set",
    quote: "Birthday Set made my plans feel instantly more put together without needing a salon appointment.",
    source: "Verified customer"
  },
  {
    id: "bridal-nails",
    label: "Bridal Nails",
    title: "Bridal Nails",
    quote: "A soft bridal set with a clean fit, pretty finish, and enough sizes to find the right match.",
    source: "Verified customer"
  },
  {
    id: "etsy-review",
    label: "Etsy Review",
    title: "Etsy Review",
    quote: "A five-star Etsy note about fast shipping, careful packaging, and nails that looked even better in person.",
    source: "Etsy review"
  },
  {
    id: "custom-set",
    label: "Custom Set",
    title: "Custom Set",
    quote: "The custom set felt personal without being overdone, with a shape and color that matched the request.",
    source: "Verified customer"
  },
  {
    id: "sizing-kit",
    label: "Sizing Kit",
    title: "Sizing Kit",
    quote: "The sizing step made ordering feel clear, simple, and less stressful before choosing the final set.",
    source: "Verified customer"
  },
  {
    id: "vacation-nails",
    label: "Vacation Nails",
    title: "Vacation Nails",
    quote: "Vacation nails that packed easily, photographed beautifully, and held up through a full trip.",
    source: "Verified customer"
  },
  {
    id: "chrome-set",
    label: "Chrome Set",
    title: "Chrome Set",
    quote: "A clean chrome finish that felt elevated, smooth, and wearable with every outfit.",
    source: "Verified customer"
  },
  {
    id: "press-on-win",
    label: "Press-On Win",
    title: "Press-On Win",
    quote: "A first press-on win: quick application, no appointment, and a salon-style look at home.",
    source: "Verified customer"
  },
  {
    id: "five-stars",
    label: "Five Stars",
    title: "Five Stars",
    quote: "Five stars for the fit, finish, and the kind of details that made the set feel special.",
    source: "Verified customer"
  }
];

export function HomePage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

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
          <a className="primary-button" href="/shop">
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
        <StoryStrip stories={reviewStories} onOpenStory={setActiveStoryIndex} />
      </section>

      {activeStoryIndex !== null ? (
        <StoryViewer
          activeIndex={activeStoryIndex}
          onActiveIndexChange={setActiveStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          stories={reviewStories}
        />
      ) : null}

      <FaqSection />
    </main>
  );
}
