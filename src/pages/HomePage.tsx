import { CollectionFilters } from "../components/CollectionFilters";
import { KitContents } from "../components/KitContents";
import { ProductCarousel } from "../components/ProductCarousel";
import { featuredProducts, newArrivals } from "../data/products";

const howItWorks = [
  "Choose your ready-to-wear set.",
  "Pick your length and shape.",
  "Apply with glue or tabs.",
  "Wear, remove, and store with care."
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
        <div className="hero-copy">
          <p className="eyebrow">Handmade ready-to-wear press-ons</p>
          <h1>Art on Miniature Canvases</h1>
          <p>
            Pretty press-on sets made for everyday style, special plans, and salon-looking moments
            at home.
          </p>
          <a className="primary-button" href="#shop-collections">
            Shop ready-to-wear
          </a>
        </div>
        <div className="hero-product-spread" aria-label="Spring and summer nail set spread">
          <span className="nail-tile nail-tile--coral">Coral</span>
          <span className="nail-tile nail-tile--mint">Mint</span>
          <span className="nail-tile nail-tile--sky">Sky</span>
          <span className="nail-tile nail-tile--peach">Peach</span>
        </div>
      </section>

      <ProductCarousel eyebrow="Fresh sets" title="New Arrivals" products={newArrivals} />
      <CollectionFilters />
      <ProductCarousel eyebrow="Customer moodboard" title="Featured Sets" products={featuredProducts} />
      <KitContents />

      <section className="section-block steps-section" id="how-it-works">
        <div className="section-heading">
          <p className="eyebrow">Simple wear</p>
          <h2>How it works</h2>
        </div>
        <ol className="steps-list">
          {howItWorks.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

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
