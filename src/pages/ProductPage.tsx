import { useState } from "react";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaqSection } from "../components/FaqSection";
import { KitContents } from "../components/KitContents";
import { ProductMediaGallery } from "../components/ProductMediaGallery";
import { findProductBySlug } from "../data/products";
import type { Product, SizingKitProduct } from "../data/products";
import { sizingFacts } from "../data/storefrontFacts";

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

        <ProductMediaGallery product={product} />

        <section className="product-page__buying-panel" aria-labelledby="product-title">
          <div className="product-page__summary">
            <p className="product-page__eyebrow">
              {product.orderType === "ready-to-ship" ? "Ready-to-wear set" : "Made-to-order set"}
            </p>
            <div className="product-page__title-row">
              <h1 id="product-title">{product.name}</h1>
              <p className="product-page__price">${product.price}</p>
            </div>
            <p className="product-page__description">{product.description}</p>
            <p className="product-page__fit-help">
              Not sure about fit? Read <Link to="/help/sizing">Find Your Fit</Link> before ordering.
            </p>
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
      <KitContents readyToWear={product.orderType === "ready-to-ship"} />
      <FaqSection />
    </main>
  );
}

function SizingKitProductPage({ product }: { product: SizingKitProduct }) {
  const customOrderKitPrice =
    sizingFacts.customOrderKitPrice === 0 ? "free" : `$${sizingFacts.customOrderKitPrice}`;

  return (
    <main className="product-page product-page--sizing-kit">
      <div className="product-page__inner">
        <Link className="product-page__back-button" to="/help/sizing">
          <ArrowLeft aria-hidden="true" size={16} strokeWidth={2} />
          Back to Find Your Fit
        </Link>

        <section className="product-page__media" aria-label={`${product.name} preview`}>
          <div
            className="product-page__image-placeholder"
            role="img"
            aria-label={`${product.name} image placeholder`}
          />
        </section>

        <section className="product-page__buying-panel" aria-labelledby="product-title">
          <div className="product-page__summary">
            <p className="product-page__eyebrow">Sizing support</p>
            <div className="product-page__title-row">
              <h1 id="product-title">{product.name}</h1>
              <p className="product-page__price">${product.price}</p>
            </div>
            <p className="product-page__description">{product.description}</p>
          </div>

          <div
            aria-label="Sizing Kit purchase status"
            className="product-page__selected-summary product-page__commerce-status"
            role="status"
          >
            <span className="product-page__selected-summary-eyebrow">Store status</span>
            <span className="product-page__selected-summary-value">Online checkout coming soon</span>
            <p>
              Online purchasing is not connected yet. This page does not collect payment or create an order.
            </p>
          </div>

          <section className="product-page__sizing-kit-details" aria-labelledby="sizing-kit-details-title">
            <h2 id="sizing-kit-details-title">When to use a sizing kit</h2>
            <ul>
              <li>Choose the standalone kit when you want sizing help without an active custom order.</li>
              <li>
                Sizing kits connected to custom-set orders are {customOrderKitPrice}. Custom orders are {sizingFacts.customOrdersStatus}.
              </li>
            </ul>
          </section>

          <div className="product-page__support-links" aria-label="Sizing kit help links">
            <Link className="product-page__shop-link" to="/help/sizing">
              Read Find Your Fit
            </Link>
            <Link to="/shop/custom-orders">Join the custom-order waitlist</Link>
            <Link to="/help/contact">Contact Support</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export function ProductPage() {
  const { slug } = useParams();
  const product = findProductBySlug(slug);

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

  if (product.kind === "sizing-kit") {
    return <SizingKitProductPage product={product} />;
  }

  return <ProductBuyingFlow key={product.slug} product={product} />;
}
