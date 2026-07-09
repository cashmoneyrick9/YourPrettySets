import { useState } from "react";
import { Link } from "react-router-dom";
import { featuredProducts, newArrivals, products, type Product } from "../data/products";
import { BrandButton } from "./BrandButton";
import { MobileCarousel } from "./MobileCarousel";
import { ProductPreviewCard } from "./ProductPreviewCard";

type HomeShoppingOption = {
  description?: string;
  href: string;
  id: string;
  label: string;
  products?: Product[];
};

const homeShoppingOptions: HomeShoppingOption[] = [
  {
    id: "ready-to-ship",
    label: "Ready to Ship",
    href: "/shop/ready-to-ship",
    products: products.filter((product) => product.orderType === "ready-to-ship")
  },
  {
    id: "made-to-order",
    label: "Made to Order",
    href: "/shop/made-to-order",
    products: products.filter((product) => product.orderType === "made-to-order")
  },
  {
    id: "custom-orders",
    label: "Custom Orders",
    href: "/shop/custom-orders",
    description: "Start a made-for-you request when you want a specific color story, event, or nail-art idea."
  },
  {
    id: "new-arrivals",
    label: "New Arrivals",
    href: "/shop?collection=New%20Arrivals",
    products: newArrivals
  },
  {
    id: "best-sellers",
    label: "Best Sellers",
    href: "/shop",
    products: featuredProducts
  }
];

function toOptionSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function HomeCollections() {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasInteractedWithBrowse, setHasInteractedWithBrowse] = useState(false);

  const activeOption = selectedOptionIndex === null ? null : homeShoppingOptions[selectedOptionIndex];
  const activeOptionProducts = activeOption?.products ?? [];
  const visibleOptionProducts = activeOptionProducts.slice(0, 4);
  const teaserOptionProducts = activeOptionProducts.slice(4, 6);
  const emptyTeaserSlots = Math.max(0, 2 - teaserOptionProducts.length);

  return (
    <section className="section-block collection-section" id="shop-collections">
      <div className="section-heading collection-heading">
        <div>
          <p className="eyebrow">Shop</p>
          <h2>Browse</h2>
        </div>
        <BrandButton asChild className="collection-heading__link">
          <Link to="/shop">
            See all <span aria-hidden="true">→</span>
          </Link>
        </BrandButton>
      </div>

      <MobileCarousel
        ariaLabel="Shop by buying path"
        autoRotate
        autoRotateStopped={hasInteractedWithBrowse || selectedOptionIndex !== null}
        className="collection-carousel"
        containerClassName="collection-track"
        options={{ align: "center", containScroll: false, loop: true, startIndex: selectedOptionIndex ?? 0 }}
        scrollToIndex={selectedOptionIndex}
        showArrows={false}
        slideClassName="collection-carousel__slide"
        viewportClassName="collection-carousel__viewport"
        slides={homeShoppingOptions.map((option, index) => {
          const slug = toOptionSlug(option.label);
          const isSelected = index === selectedOptionIndex;

          return (
            <button
              aria-pressed={isSelected}
              className={`collection-card collection-card--${slug}${isSelected ? " collection-card--active" : ""}`}
              key={option.id}
              onClick={() => {
                setHasInteractedWithBrowse(true);
                setSelectedOptionIndex(isSelected ? null : index);
              }}
              type="button"
            >
              <span className="collection-card__image" aria-hidden="true" />
              <span className="collection-card__label">{option.label}</span>
            </button>
          );
        })}
      />

      <div className="collection-carousel__hint-wrap">
        <p className="collection-carousel__hint" aria-hidden="true">
          <span>←</span> Swipe to explore <span>→</span>
        </p>
      </div>

      {activeOption ? (
        <div className="collection-products" id="collection-products" aria-live="polite">
          <div className="collection-products__heading">
            <div>
              <p className="eyebrow">{activeOption.label}</p>
              <h3>{activeOption.products ? `${activeOption.label} sets` : activeOption.label}</h3>
            </div>
            {activeOption.products ? <span>{activeOptionProducts.length} available</span> : null}
          </div>
          {activeOption.products ? (
            <>
              <div className="collection-product-row">
                {visibleOptionProducts.map((product) => (
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
              {teaserOptionProducts.length || emptyTeaserSlots ? (
                <div className="collection-product-teaser" aria-hidden="true">
                  {teaserOptionProducts.map((product) => (
                    <ProductPreviewCard
                      className="collection-product-teaser__card"
                      key={`${activeOption.id}-teaser-${product.id}`}
                      product={product}
                      variant="home"
                    />
                  ))}
                  {Array.from({ length: emptyTeaserSlots }, (_, index) => (
                    <span
                      className="collection-product-card collection-product-teaser__card collection-product-teaser__placeholder"
                      key={`${activeOption.id}-teaser-placeholder-${index}`}
                    >
                      <span className="collection-product-card__image collection-product-teaser__placeholder-well" />
                    </span>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="collection-custom-preview">
              <span className="collection-custom-preview__image" aria-hidden="true" />
              <div className="collection-custom-preview__body">
                <p className="eyebrow">Design request preview</p>
                <p>{activeOption.description}</p>
              </div>
            </div>
          )}
          <Link className="collection-products__more" to={activeOption.href}>
            See more
          </Link>
        </div>
      ) : null}
    </section>
  );
}
