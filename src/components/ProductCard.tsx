import type { Product } from "../data/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      {product.media?.clean ? (
        <img alt={product.images.clean} className="product-art product-art--image" src={product.media.clean} />
      ) : (
        <div className={`product-art product-art--${product.detailTier}`} aria-label={product.images.clean} role="img">
          <span className="product-art__nail product-art__nail--one" aria-hidden="true" />
          <span className="product-art__nail product-art__nail--two" aria-hidden="true" />
          <span className="product-art__nail product-art__nail--three" aria-hidden="true" />
          <span className="product-art__nail product-art__nail--four" aria-hidden="true" />
          <span className="product-art__nail product-art__nail--five" aria-hidden="true" />
        </div>
      )}
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </div>
    </article>
  );
}
