import { useState } from "react";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaqSection } from "../components/FaqSection";
import { KitContents } from "../components/KitContents";
import { products } from "../data/products";
import type { Product } from "../data/products";

function ProductOptionGroup<Option extends string>({
  label,
  optionKind,
  options,
  selectedOption,
  onSelect
}: {
  label: string;
  optionKind: "length" | "shape";
  options: readonly Option[];
  selectedOption: Option;
  onSelect: (option: Option) => void;
}) {
  return (
    <fieldset className={`product-page__option-group product-page__option-group--${optionKind}`}>
      <legend>{label}</legend>
      <div className="product-page__option-list">
        {options.map((option) => (
          <button
            aria-label={option}
            aria-pressed={selectedOption === option}
            className={`product-page__option-tile product-page__option-tile--${optionKind}`}
            key={option}
            onClick={() => onSelect(option)}
            type="button"
          >
            <span className="product-page__option-placeholder" role="presentation" aria-hidden="true" />
            <span className="product-page__option-copy">
              <span className="product-page__option-label">{option}</span>
            </span>
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
  const routeState = location.state as { fromHome?: boolean; fromShop?: boolean } | null;
  const openedFromPreviousPage = Boolean(routeState?.fromHome || routeState?.fromShop);

  function handleBackToShop() {
    if (openedFromPreviousPage) {
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
          <div
            className="product-page__image-placeholder"
            role="img"
            aria-label={`${product.name} image placeholder`}
          />
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
            optionKind="length"
            onSelect={setSelectedLength}
            options={product.lengthOptions}
            selectedOption={selectedLength}
          />
          <ProductOptionGroup
            label="Shape"
            optionKind="shape"
            onSelect={setSelectedShape}
            options={product.shapeOptions}
            selectedOption={selectedShape}
          />

          <div
            aria-label={`Selected style: ${selectedLength} length, ${selectedShape} shape`}
            aria-live="polite"
            className="product-page__selected-summary"
          >
            <span className="product-page__selected-summary-eyebrow">Selected style</span>
            <span className="product-page__selected-summary-value">
              {selectedLength} length · {selectedShape} shape
            </span>
          </div>

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
        </section>
      </div>
      <KitContents />
      <FaqSection />
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
