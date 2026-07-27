import type { CSSProperties } from "react";
import { collectionLabels, products } from "../data/products";
import { MobileCarousel } from "./MobileCarousel";

type ReviewPolaroid = {
  image: string;
  isMockup: true;
  name: string;
  occasion: (typeof collectionLabels)[number];
  productId: string;
  rotation: string;
};

const reviewPolaroids: ReviewPolaroid[] = [
  {
    image: "/assets/reviews/mockups/birthday-candle.jpg",
    isMockup: true,
    name: "Sarah",
    occasion: "Birthday",
    productId: "birthday-candle",
    rotation: "-2.5deg"
  },
  {
    image: "/assets/reviews/mockups/date-night-gloss.jpg",
    isMockup: true,
    name: "Ava",
    occasion: "Date Night",
    productId: "date-night-gloss",
    rotation: "2deg"
  },
  {
    image: "/assets/reviews/mockups/vacation-crush.jpg",
    isMockup: true,
    name: "Mia",
    occasion: "Vacation",
    productId: "vacation-crush",
    rotation: "-1deg"
  },
  {
    image: "/assets/reviews/mockups/lace-veil.jpg",
    isMockup: true,
    name: "Lina",
    occasion: "Bridal",
    productId: "lace-veil",
    rotation: "3.25deg"
  },
  {
    image: "/assets/reviews/mockups/soft-serve.jpg",
    isMockup: true,
    name: "Noor",
    occasion: "Everyday",
    productId: "soft-serve",
    rotation: "-3deg"
  },
  {
    image: "/assets/reviews/mockups/office-crush.jpg",
    isMockup: true,
    name: "Jade",
    occasion: "Work/Neutral",
    productId: "office-crush",
    rotation: "1.5deg"
  },
  {
    image: "/assets/reviews/mockups/main-character.jpg",
    isMockup: true,
    name: "Zoe",
    occasion: "Statement",
    productId: "main-character",
    rotation: "4deg"
  }
];

function captionFor(polaroid: ReviewPolaroid) {
  return `${polaroid.name}'s ${polaroid.occasion.toLowerCase()} set`;
}

function productNameFor(productId: string) {
  const product = products.find(({ id }) => id === productId);

  if (!product) throw new Error(`Unknown review mockup product: ${productId}`);

  return product.name;
}

export function ReviewsPolaroidStrip() {
  return (
    <section className="section-block reviews-section reviews-polaroid-strip" id="reviews">
      <div className="section-heading review-heading reviews-polaroid-strip__heading">
        <p className="eyebrow">CUSTOMER LOVE</p>
        <h2>Customer keepsakes</h2>
      </div>

      <MobileCarousel
        ariaLabel="Customer review keepsake carousel"
        autoRotate
        className="reviews-polaroid-carousel"
        containerClassName="reviews-polaroid-carousel__track"
        options={{ align: "center", containScroll: false, loop: true }}
        showArrows={false}
        slideClassName="reviews-polaroid-carousel__slide"
        viewportClassName="reviews-polaroid-carousel__viewport"
        slides={reviewPolaroids.map((polaroid) => (
          <article
            className="review-polaroid-card"
            data-content-status={polaroid.isMockup ? "mockup" : undefined}
            data-product-id={polaroid.productId}
            key={`${polaroid.name}-${polaroid.occasion}`}
            style={{ "--review-polaroid-rotation": polaroid.rotation } as CSSProperties}
          >
            <div className="review-polaroid-card__photo">
              <img
                alt={`Prototype mock review showing ${productNameFor(polaroid.productId)} press-on nails`}
                decoding="async"
                height="1000"
                loading="lazy"
                src={polaroid.image}
                width="800"
              />
            </div>
            <div className="review-polaroid-card__body">
              <p className="review-polaroid-card__caption">{captionFor(polaroid)}</p>
            </div>
          </article>
        ))}
      />
    </section>
  );
}
