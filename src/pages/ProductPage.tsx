import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Heart, ShoppingBag } from "lucide-react";
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
  const optionClassName = (option: Option) => option.toLowerCase().replace(/\s+/g, "-");
  const optionLabel = (option: Option) => (option === "Extra Long" ? "XL" : option);
  const optionListRef = useRef<HTMLDivElement>(null);
  const visibleOptionCount = 4;
  const defaultThumbWidth = Math.min(100, (visibleOptionCount / options.length) * 100);
  const [progressThumb, setProgressThumb] = useState({ left: 0, width: defaultThumbWidth });

  const updateScrollProgress = useCallback(() => {
    const optionList = optionListRef.current;

    if (!optionList) {
      return;
    }

    const scrollRange = Math.max(0, optionList.scrollWidth - optionList.clientWidth);
    const thumbWidth = optionList.scrollWidth > 0
      ? Math.min(100, (optionList.clientWidth / optionList.scrollWidth) * 100)
      : defaultThumbWidth;
    const scrollProgress = scrollRange > 0
      ? Math.min(1, Math.max(0, optionList.scrollLeft / scrollRange))
      : 0;

    setProgressThumb({
      left: scrollProgress * (100 - thumbWidth),
      width: thumbWidth
    });
  }, [defaultThumbWidth]);

  useEffect(() => {
    updateScrollProgress();

    const optionList = optionListRef.current;
    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(updateScrollProgress);

    if (optionList) {
      resizeObserver?.observe(optionList);
    }

    window.addEventListener("resize", updateScrollProgress);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [updateScrollProgress]);

  useEffect(() => {
    const optionList = optionListRef.current;
    const selectedButton = optionList?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');

    if (!optionList || !selectedButton || typeof optionList.scrollTo !== "function") {
      return;
    }

    const selectedLeft = selectedButton.offsetLeft;
    const selectedRight = selectedLeft + selectedButton.offsetWidth;
    const visibleLeft = optionList.scrollLeft;
    const visibleRight = visibleLeft + optionList.clientWidth;

    if (selectedLeft < visibleLeft) {
      optionList.scrollTo({ behavior: "smooth", left: selectedLeft });
    } else if (selectedRight > visibleRight) {
      optionList.scrollTo({ behavior: "smooth", left: selectedRight - optionList.clientWidth });
    }
  }, [selectedOption]);

  return (
    <fieldset className={`product-page__option-group product-page__option-group--${optionKind}`}>
      <legend className="product-page__option-legend">{label}</legend>
      <div className="product-page__option-heading">
        <span aria-hidden="true">{label}</span>
        {optionKind === "shape" ? (
          <Link className="product-page__option-guide" to="/help/sizing">
            View guide
          </Link>
        ) : null}
      </div>
      <div className="product-page__option-list" onScroll={updateScrollProgress} ref={optionListRef}>
        {options.map((option) => {
          const isSelected = selectedOption === option;
          const optionSlug = optionClassName(option);

          return (
            <button
              aria-label={option}
              aria-pressed={isSelected}
              className={`product-page__option-tile product-page__option-tile--${optionKind}`}
              key={option}
              onClick={() => onSelect(option)}
              type="button"
            >
              <span className="product-page__option-visual">
                <img
                  alt=""
                  aria-hidden="true"
                  className="product-page__nail-sample"
                  draggable="false"
                  role="presentation"
                  src={`/assets/product-options/${optionKind}-${optionSlug}.png`}
                />
                {isSelected ? (
                  <span aria-hidden="true" className="product-page__option-check">
                    <Check size={10} strokeWidth={3} />
                  </span>
                ) : null}
              </span>
              <span className="product-page__option-label">{optionLabel(option)}</span>
            </button>
          );
        })}
      </div>
      <div
        aria-hidden="true"
        className="product-page__option-progress"
        hidden={options.length <= visibleOptionCount}
      >
        <span
          className="product-page__option-progress-thumb"
          style={{ left: `${progressThumb.left}%`, width: `${progressThumb.width}%` }}
        />
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

          <section className="product-page__style-selector" aria-labelledby="product-style-title">
            <div className="product-page__style-header">
              <h2 id="product-style-title">Choose your style</h2>
              <p
                aria-label={`Selected style: ${selectedShape} shape, ${selectedLength} length`}
                aria-live="polite"
                className="product-page__style-selection"
              >
                {selectedShape} · {selectedLength === "Extra Long" ? "XL" : selectedLength}
              </p>
            </div>

            <ProductOptionGroup
              label="Shape"
              optionKind="shape"
              onSelect={setSelectedShape}
              options={product.shapeOptions}
              selectedOption={selectedShape}
            />
            <ProductOptionGroup
              label="Length"
              optionKind="length"
              onSelect={setSelectedLength}
              options={product.lengthOptions}
              selectedOption={selectedLength}
            />
          </section>

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
