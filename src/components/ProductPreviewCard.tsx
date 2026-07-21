import { Link } from "react-router-dom";
import type { To } from "react-router-dom";
import type { Product } from "../data/products";

type ProductPreviewCardVariant = "shop" | "home";

type ProductPreviewCardProps = {
  ariaLabel?: string;
  className?: string;
  futureHref?: string;
  href?: string;
  id?: string;
  product: Product;
  state?: unknown;
  to?: To;
  variant?: ProductPreviewCardVariant;
};

function cardClassName(variant: ProductPreviewCardVariant, className?: string) {
  return [
    "product-preview-card",
    `product-preview-card--${variant}`,
    variant === "home" ? "collection-product-card" : "shop-product-card",
    className
  ]
    .filter(Boolean)
    .join(" ");
}

export function ProductPreviewCard({
  ariaLabel,
  className,
  futureHref,
  href,
  id,
  product,
  state,
  to,
  variant = "shop"
}: ProductPreviewCardProps) {
  const rootClassName = cardClassName(variant, className);
  const imageClassName =
    variant === "home"
      ? "product-preview-card__image collection-product-card__image"
      : "product-preview-card__image shop-product-card__image";
  const bodyClassName =
    variant === "home"
      ? "product-preview-card__body collection-product-card__body"
      : "product-preview-card__body shop-product-card__body";
  const content = (
    <>
      {product.media?.clean ? (
        <img alt={product.images.clean} className={imageClassName} src={product.media.clean} />
      ) : (
        <div className={imageClassName} role="img" aria-label={product.images.clean} />
      )}
      <div className={bodyClassName}>
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a aria-label={ariaLabel ?? `View ${product.name}`} className={rootClassName} href={href} id={id}>
        {content}
      </a>
    );
  }

  if (to || variant === "shop") {
    return (
      <Link
        aria-label={ariaLabel ?? `View ${product.name}`}
        className={rootClassName}
        id={id}
        state={state ?? (variant === "shop" ? { fromShop: true } : undefined)}
        to={to ?? futureHref ?? `/products/${product.slug}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <article className={rootClassName} data-future-href={futureHref}>
      {content}
    </article>
  );
}
