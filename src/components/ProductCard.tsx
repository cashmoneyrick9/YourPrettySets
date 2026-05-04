import type { Product } from "../data/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className={`product-art product-art--${product.detailTier}`} aria-label={product.images.clean}>
        <span>{product.images.clean}</span>
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </div>
    </article>
  );
}
