import { Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { products, type Product } from "../data/products";

export function getRelatedProducts(currentProduct: Product, limit = 4) {
  return products
    .filter((candidate) => candidate.id !== currentProduct.id)
    .map((candidate, index) => ({
      candidate,
      index,
      score:
        candidate.collections.filter((collection) => currentProduct.collections.includes(collection)).length * 10
        + Number(candidate.orderType === currentProduct.orderType) * 3
        + Number(candidate.detailTier === currentProduct.detailTier) * 2
        + Number(candidate.isPopular)
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

function RelatedProductCard({ product }: { product: Product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <article className="related-product-card">
      <Link aria-label={`View ${product.name}`} className="related-product-card__link" to={`/products/${product.slug}`}>
        <div className="related-product-card__media">
          {product.media?.clean ? (
            <img alt={product.images.clean} src={product.media.clean} />
          ) : (
            <span aria-label={product.images.clean} role="img" />
          )}
        </div>
        <div className="related-product-card__body">
          <span>{product.orderType === "ready-to-ship" ? "Ready to ship" : "Made to order"}</span>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      </Link>
      <button
        aria-label={`${isFavorite ? "Remove" : "Favorite"} ${product.name}`}
        aria-pressed={isFavorite}
        className="related-product-card__favorite"
        onClick={() => setIsFavorite((current) => !current)}
        type="button"
      >
        <Heart aria-hidden="true" fill={isFavorite ? "currentColor" : "none"} size={16} strokeWidth={1.8} />
      </button>
    </article>
  );
}

export function RelatedProducts({ product }: { product: Product }) {
  const relatedProducts = getRelatedProducts(product);

  return (
    <section className="related-products" aria-labelledby="related-products-title">
      <div className="product-section-heading related-products__heading">
        <p className="eyebrow">Keep browsing</p>
        <h2 id="related-products-title">More sets you may like</h2>
      </div>
      <div className="related-products__grid">
        {relatedProducts.map((relatedProduct) => (
          <RelatedProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
      <Link className="related-products__shop-link" to="/shop">
        Shop all sets <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
