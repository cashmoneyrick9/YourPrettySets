import type { CSSProperties } from "react";
import { collectionLabels } from "../data/products";
import { MobileCarousel } from "./MobileCarousel";

type ReviewPolaroid = {
  name: string;
  occasion: (typeof collectionLabels)[number];
  rotation: string;
  tone: string;
};

const reviewPolaroids: ReviewPolaroid[] = [
  { name: "Sarah", occasion: "Birthday", rotation: "-2.5deg", tone: "peach" },
  { name: "Ava", occasion: "Date Night", rotation: "2deg", tone: "rose" },
  { name: "Mia", occasion: "Vacation", rotation: "-1deg", tone: "seafoam" },
  { name: "Lina", occasion: "Bridal", rotation: "3.25deg", tone: "lilac" },
  { name: "Noor", occasion: "Everyday", rotation: "-3deg", tone: "butter" },
  { name: "Jade", occasion: "Work/Neutral", rotation: "1.5deg", tone: "sky" },
  { name: "Zoe", occasion: "Statement", rotation: "4deg", tone: "coral" }
];

function captionFor(polaroid: ReviewPolaroid) {
  return `${polaroid.name}'s ${polaroid.occasion.toLowerCase()} set`;
}

export function ReviewsPolaroidStrip() {
  return (
    <section className="section-block reviews-section reviews-polaroid-strip" id="reviews">
      <div className="section-heading review-heading reviews-polaroid-strip__heading">
        <p className="eyebrow">CUSTOMER LOVE</p>
        <h2>Customer keepsakes</h2>
      </div>

      <MobileCarousel
        ariaLabel="Customer review polaroid strip"
        autoRotate
        className="reviews-polaroid-carousel"
        containerClassName="reviews-polaroid-carousel__track"
        options={{ align: "center", containScroll: false, loop: true }}
        showArrows={false}
        slideClassName="reviews-polaroid-carousel__slide"
        viewportClassName="reviews-polaroid-carousel__viewport"
        slides={reviewPolaroids.map((polaroid) => (
          <article
            className={`review-polaroid-card review-polaroid-card--${polaroid.tone}`}
            key={`${polaroid.name}-${polaroid.occasion}`}
            style={{ "--review-polaroid-rotation": polaroid.rotation } as CSSProperties}
          >
            <div className="review-polaroid-card__photo" aria-hidden="true">
              <span />
            </div>
            <p className="review-polaroid-card__caption">{captionFor(polaroid)}</p>
          </article>
        ))}
      />
    </section>
  );
}
