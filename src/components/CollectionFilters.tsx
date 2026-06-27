import { useState } from "react";
import { Link } from "react-router-dom";
import { collectionLabels, products } from "../data/products";
import { BrandButton } from "./BrandButton";
import { MobileCarousel } from "./MobileCarousel";
import { ProductPreviewCard } from "./ProductPreviewCard";

const moodCollections = collectionLabels.filter((label) => label !== "New Arrivals");

const featuredSets = [
  "Glazed Petal",
  "Sunset Sprinkle",
  "Pearl Wink",
  "Poolside Pop"
] as const;

function toCollectionSlug(title: string) {
  return title.toLowerCase().replace("/", "-").replace(/\s+/g, "-");
}

export function CollectionFilters() {
  const [selectedCollectionIndex, setSelectedCollectionIndex] = useState<number | null>(null);

  const activeCollection = selectedCollectionIndex === null ? null : moodCollections[selectedCollectionIndex];
  const activeCollectionProducts = activeCollection
    ? products.filter((product) => product.collections.includes(activeCollection))
    : [];
  const visibleCollectionProducts = activeCollectionProducts.slice(0, 4);
  const teaserCollectionProducts = activeCollectionProducts.slice(4, 6);
  const emptyTeaserSlots = Math.max(0, 2 - teaserCollectionProducts.length);

  return (
    <>
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
          autoRotateStopped={selectedCollectionIndex !== null}
          className="collection-carousel"
          containerClassName="collection-track"
          key={selectedCollectionIndex === null ? "collection-carousel-spinning" : `collection-carousel-${selectedCollectionIndex}`}
          options={{ align: "center", containScroll: false, loop: true, startIndex: selectedCollectionIndex ?? 0 }}
          scrollToIndex={selectedCollectionIndex}
          showArrows={false}
          slideClassName="collection-carousel__slide"
          viewportClassName="collection-carousel__viewport"
          slides={moodCollections.map((collection, index) => {
            const slug = toCollectionSlug(collection);
            const isSelected = index === selectedCollectionIndex;

            return (
              <button
                aria-pressed={isSelected}
                className={`collection-card collection-card--${slug}${isSelected ? " collection-card--active" : ""}`}
                key={collection}
                onClick={() => setSelectedCollectionIndex(index)}
                type="button"
              >
                <span className="collection-card__image" aria-hidden="true" />
                <span className="collection-card__label">{collection}</span>
              </button>
            );
          })}
        />

        <div className="collection-carousel__hint-wrap">
          <p className="collection-carousel__hint" aria-hidden="true">
            <span>←</span> Swipe to explore <span>→</span>
          </p>
        </div>

        {activeCollection ? (
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
                <ProductPreviewCard
                  id={`product-${product.slug}`}
                  key={product.id}
                  product={product}
                  state={{ fromHome: true }}
                  to={`/products/${product.slug}`}
                  variant="home"
                />
              ))}
            </div>
            <div className="collection-product-teaser" aria-hidden="true">
              {teaserCollectionProducts.map((product) => (
                <ProductPreviewCard
                  className="collection-product-teaser__card"
                  key={`${activeCollection}-teaser-${product.id}`}
                  product={product}
                  variant="home"
                />
              ))}
              {Array.from({ length: emptyTeaserSlots }, (_, index) => (
                <span
                  className="collection-product-card collection-product-teaser__card collection-product-teaser__placeholder"
                  key={`${activeCollection}-teaser-placeholder-${index}`}
                >
                  <span className="collection-product-card__image collection-product-teaser__placeholder-well" />
                </span>
              ))}
            </div>
            <Link className="collection-products__more" to="/shop">
              See more
            </Link>
          </div>
        ) : null}
      </section>

      <FeaturedSets />
    </>
  );
}

function FeaturedSets() {
  return (
    <section className="section-block featured-sets-section" aria-labelledby="featured-sets-title">
      <div className="section-heading featured-sets-heading">
        <div>
          <p className="eyebrow">Featured</p>
          <h2 id="featured-sets-title">Featured sets</h2>
        </div>
      </div>

      <MobileCarousel
        ariaLabel="Featured sets carousel"
        className="featured-sets-carousel"
        containerClassName="featured-sets-carousel__track"
        options={{ align: "start", containScroll: false, loop: false }}
        showArrows={false}
        slideClassName="featured-sets-carousel__slide"
        viewportClassName="featured-sets-carousel__viewport"
        slides={featuredSets.map((name) => (
          <Link aria-label={`View ${name}`} className="featured-set-card" key={name} to="/shop">
            <span className="featured-set-card__image" role="img" aria-label={`${name} placeholder image`} />
            <span className="featured-set-card__body">
              <h3>{name}</h3>
            </span>
          </Link>
        ))}
      />
    </section>
  );
}
