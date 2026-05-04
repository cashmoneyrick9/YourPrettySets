import type { Product } from "../data/products";
import { ProductCard } from "./ProductCard";

type ProductCarouselProps = {
  title: string;
  eyebrow?: string;
  products: Product[];
};

export function ProductCarousel({ title, eyebrow, products }: ProductCarouselProps) {
  return (
    <section className="section-block">
      <div className="section-heading">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      <div className="product-carousel" aria-label={title}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
