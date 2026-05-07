import { CollectionFilters } from "../components/CollectionFilters";
import { KitContents } from "../components/KitContents";
import { ProductCarousel } from "../components/ProductCarousel";
import { featuredProducts, newArrivals } from "../data/products";

const confidenceSteps = [
  { label: "Pick your set", visual: "set" },
  { label: "Choose your wear", visual: "wear" },
  { label: "Press on pretty", visual: "press" }
];

const reviews = [
  {
    quote: "The set looked dressed up without feeling hard to wear.",
    name: "Everyday customer"
  },
  {
    quote: "Pretty enough for photos, practical enough for the week.",
    name: "Beauty shopper"
  },
  {
    quote: "The 24-nail set made finding a fit feel less stressful.",
    name: "First-time press-on buyer"
  }
];

const faqs = ["What comes with each set?", "How long do press-ons last?", "Can I reuse them?"];

export function HomePage() {
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
        <ol className="confidence-list">
          {confidenceSteps.map((step, index) => (
            <li className={`confidence-card confidence-card--${step.visual}`} key={step.label}>
              <span className="confidence-card__visual" aria-hidden="true">
                <span className="confidence-card__nail confidence-card__nail--one" />
                <span className="confidence-card__nail confidence-card__nail--two" />
                <span className="confidence-card__nail confidence-card__nail--three" />
              </span>
              <span className="confidence-card__label">{step.label}</span>
              {index === confidenceSteps.length - 1 ? (
                <span className="confidence-card__arrow" aria-hidden="true">
                  ›
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <div className="confidence-dots" aria-hidden="true">
          <span className="confidence-dots__dot confidence-dots__dot--active" />
          <span className="confidence-dots__dot" />
          <span className="confidence-dots__dot" />
        </div>
      </section>

      <CollectionFilters />
      <ProductCarousel eyebrow="Fresh sets" title="New Arrivals" products={newArrivals} />
      <div id="featured-sets">
        <ProductCarousel eyebrow="Customer moodboard" title="Featured Sets" products={featuredProducts} />
      </div>
      <KitContents />

      <section className="section-block reviews-section">
        <div className="section-heading">
          <p className="eyebrow">Placeholder reviews</p>
          <h2>Pretty notes from future customers</h2>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <figure key={review.quote}>
              <blockquote>{review.quote}</blockquote>
              <figcaption>{review.name}</figcaption>
            </figure>
          ))}
        </div>
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
