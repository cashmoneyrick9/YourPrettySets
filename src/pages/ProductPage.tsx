import { useState } from "react";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { products } from "../data/products";
import type { Product } from "../data/products";

function ProductArt({ product }: { product: Product }) {
  return (
    <div
      aria-label={product.images.clean}
      className={`product-page__art product-art product-art--${product.detailTier}`}
      role="img"
    >
      <span className="product-art__nail product-art__nail--one" />
      <span className="product-art__nail product-art__nail--two" />
      <span className="product-art__nail product-art__nail--three" />
      <span className="product-art__nail product-art__nail--four" />
      <span className="product-art__nail product-art__nail--five" />
    </div>
  );
}

function ProductOptionGroup<Option extends string>({
  label,
  options,
  selectedOption,
  onSelect
}: {
  label: string;
  options: readonly Option[];
  selectedOption: Option;
  onSelect: (option: Option) => void;
}) {
  return (
    <fieldset className="product-page__option-group">
      <legend>{label}</legend>
      <div className="product-page__option-list">
        {options.map((option) => (
          <button
            aria-pressed={selectedOption === option}
            key={option}
            onClick={() => onSelect(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ProductBuyingFlow({ product }: { product: Product }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedLength, setSelectedLength] = useState(product.lengthOptions[0]);
  const [selectedShape, setSelectedShape] = useState(product.shapeOptions[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const openedFromShop = Boolean((location.state as { fromShop?: boolean } | null)?.fromShop);

  function handleBackToShop() {
    if (openedFromShop) {
      navigate(-1);
      return;
    }

    navigate("/shop");
  }

  return (
    <main className="product-page">
      <div className="product-page__inner">
        <button className="product-page__back-button" onClick={handleBackToShop} type="button">
          <ArrowLeft aria-hidden="true" size={16} strokeWidth={2} />
          Back to shop
        </button>

        <section className="product-page__media" aria-label={`${product.name} preview`}>
          <ProductArt product={product} />
        </section>

        <section className="product-page__buying-panel" aria-labelledby="product-title">
          <div className="product-page__summary">
            <p className="product-page__eyebrow">Ready-to-wear set</p>
            <div className="product-page__title-row">
              <h1 id="product-title">{product.name}</h1>
              <p className="product-page__price">${product.price}</p>
            </div>
            <p className="product-page__description">{product.description}</p>
          </div>

          <ProductOptionGroup
            label="Length"
            onSelect={setSelectedLength}
            options={product.lengthOptions}
            selectedOption={selectedLength}
          />
          <ProductOptionGroup
            label="Shape"
            onSelect={setSelectedShape}
            options={product.shapeOptions}
            selectedOption={selectedShape}
          />

          <div className="product-page__cta-row">
            <button className="product-page__add-button" type="button">
              <ShoppingBag aria-hidden="true" size={18} strokeWidth={2} />
              Add to cart
            </button>
            <button
              aria-label={`Favorite ${product.name}`}
              aria-pressed={isFavorite}
              className="product-page__favorite-button"
              onClick={() => setIsFavorite((current) => !current)}
              type="button"
            >
              <Heart aria-hidden="true" fill={isFavorite ? "currentColor" : "none"} size={19} strokeWidth={2} />
            </button>
          </div>

          <ul className="product-page__reassurance" aria-label="Product reassurance">
            <li>Made to order</li>
            <li>Prep kit included</li>
            <li>Choose length + shape</li>
            <li>Sizing handled separately</li>
          </ul>

          <section className="product-page__details" aria-labelledby="set-details-title">
            <h2 id="set-details-title">Set details</h2>
            <ul>
              <li>10 handmade nails</li>
              <li>Prep kit included</li>
              <li>Reusable with tabs</li>
              <li>Handmade finish</li>
            </ul>
          </section>
        </section>
      </div>
    </main>
  );
}

export function ProductPage() {
  const { slug } = useParams();
  const product = products.find((catalogProduct) => catalogProduct.slug === slug);

  if (!product) {
    return (
      <main className="product-page product-page--not-found">
        <section className="product-page__not-found">
          <p className="product-page__eyebrow">Product</p>
          <h1>Set not found</h1>
          <p>That set is not available right now.</p>
          <Link className="product-page__shop-link" to="/shop">
            Back to shop
          </Link>
        </section>
      </main>
    );
  }

  return <ProductBuyingFlow key={product.slug} product={product} />;
}
