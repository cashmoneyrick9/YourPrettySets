import { useState } from "react";
import { Link } from "react-router-dom";
import { collectionLabels, products } from "../data/products";
import { BrandButton } from "./BrandButton";
import { MobileCarousel } from "./MobileCarousel";

const moodCollections = collectionLabels.filter((label) => label !== "New Arrivals");

function toCollectionSlug(title: string) {
  return title.toLowerCase().replace("/", "-").replace(/\s+/g, "-");
}

export function CollectionFilters() {
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0);

  const activeCollection = moodCollections[activeCollectionIndex];
  const activeCollectionProducts = products.filter((product) => product.collections.includes(activeCollection));
  const visibleCollectionProducts = activeCollectionProducts.slice(0, 4);
  const emptyCollectionSlots = Math.max(0, 4 - visibleCollectionProducts.length);

  return (
    <section className="section-block collection-section" id="shop-collections">
      <div className="section-heading collection-heading">
        <div>
          <p className="eyebrow">Collections</p>
          <h2>Browse</h2>
        </div>
        <BrandButton asChild className="collection-heading__link">
          <Link to="/shop">
            See all <span aria-hidden="true">→</span>
          </Link>
        </BrandButton>
      </div>

      <MobileCarousel
        ariaLabel="Shop by collection"
        autoRotate
        className="collection-carousel"
        containerClassName="collection-track"
        onSelectedIndexChange={setActiveCollectionIndex}
        options={{ align: "start", containScroll: false, loop: true }}
        showArrows={false}
        slideClassName="collection-carousel__slide"
        viewportClassName="collection-carousel__viewport"
        slides={moodCollections.map((collection, index) => {
          const slug = toCollectionSlug(collection);

          return (
            <button
              aria-pressed={index === activeCollectionIndex}
              className={`collection-card collection-card--${slug}${
                index === activeCollectionIndex ? " collection-card--active" : ""
              }`}
              key={collection}
              onClick={() => setActiveCollectionIndex(index)}
              type="button"
            >
              <span>{collection}</span>
            </button>
          );
        })}
      />

      <div className="collection-carousel__hint-wrap">
        <p className="collection-carousel__hint" aria-hidden="true">
          <span>←</span> Swipe to explore <span>→</span>
        </p>
      </div>

      <div className="collection-products" id="collection-products" aria-live="polite">
        <div className="collection-products__heading">
          <div>
            <p className="eyebrow">{activeCollection}</p>
            <h3>{activeCollection} sets</h3>
          </div>
          <span>{activeCollectionProducts.length} available</span>
        </div>
        <div className="collection-product-row">
          {visibleCollectionProducts.map((product) => (
            <a
              aria-label={`View ${product.name}`}
              className="collection-product-card"
              href={`#product-${product.slug}`}
              id={`product-${product.slug}`}
              key={product.id}
            >
              <span className="collection-product-card__blank" aria-hidden="true" />
            </a>
          ))}
          {Array.from({ length: emptyCollectionSlots }, (_, index) => (
            <div
              aria-hidden="true"
              className="collection-product-card collection-product-card--placeholder"
              key={`${activeCollection}-placeholder-${index}`}
            >
              <span className="collection-product-card__blank" />
            </div>
          ))}
        </div>
        <div className="collection-product-teaser" aria-hidden="true">
          <span className="collection-product-card collection-product-teaser__card">
            <span className="collection-product-card__blank" />
          </span>
          <span className="collection-product-card collection-product-teaser__card">
            <span className="collection-product-card__blank" />
          </span>
        </div>
        <Link className="collection-products__more" to="/shop">
          See more
        </Link>
      </div>
    </section>
  );
}
