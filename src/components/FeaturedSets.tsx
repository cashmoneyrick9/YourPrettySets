import { featuredProducts } from "../data/products";
import { MobileCarousel } from "./MobileCarousel";
import { ProductPreviewCard } from "./ProductPreviewCard";

export function FeaturedSets() {
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
        slides={featuredProducts.map((product) => (
          <ProductPreviewCard
            className="featured-set-card"
            key={product.id}
            product={product}
            state={{ fromHome: true }}
            to={`/products/${product.slug}`}
            variant="home"
          />
        ))}
      />
    </section>
  );
}
