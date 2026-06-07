import { useMemo, useRef, useState } from "react";
import { detailTiers, products, type CollectionLabel, type DetailTier, type Product } from "../data/products";
import { ProductPreviewCard } from "../components/ProductPreviewCard";

type CollectionTab = "All" | "New" | Exclude<CollectionLabel, "New Arrivals">;
type PriceFilter = "under-20" | "20-30" | "30-plus";
type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

const collectionTabs: CollectionTab[] = [
  "All",
  "New",
  "Everyday",
  "Date Night",
  "Vacation",
  "Bridal",
  "Birthday",
  "Work/Neutral",
  "Statement"
];

const priceFilters: { id: PriceFilter; label: string; matches: (product: Product) => boolean }[] = [
  { id: "under-20", label: "Under $20", matches: (product) => product.price < 20 },
  { id: "20-30", label: "$20-$30", matches: (product) => product.price >= 20 && product.price <= 30 },
  { id: "30-plus", label: "$30+", matches: (product) => product.price >= 30 }
];

const detailFilterLabels: Record<DetailTier, string> = {
  simple: "Simple",
  mid: "Mid",
  detailed: "Detailed"
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" }
];

const sortLabels = Object.fromEntries(sortOptions.map((option) => [option.value, option.label])) as Record<SortOption, string>;

const tabRailDragThreshold = 12;

const productOrder = new Map(products.map((product, index) => [product.id, index]));

function compareDefaultOrder(left: Product, right: Product) {
  return (productOrder.get(left.id) ?? 0) - (productOrder.get(right.id) ?? 0);
}

function formatCount(count: number) {
  return `${count} ${count === 1 ? "set" : "sets"}`;
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9$]+/g, " ").replace(/\s+/g, " ").trim();
}

function getProductSearchText(product: Product) {
  const matchingPriceLabels = priceFilters.filter((filter) => filter.matches(product)).map((filter) => filter.label);
  const searchableParts = [
    product.name,
    product.collections.join(" "),
    detailFilterLabels[product.detailTier],
    product.detailTier,
    product.isNew ? "new" : "",
    product.isPopular ? "popular most popular" : "",
    `$${product.price}`,
    ...matchingPriceLabels
  ];

  return normalizeSearchText(searchableParts.join(" "));
}

function toggleValue<T>(currentValues: T[], nextValue: T) {
  return currentValues.includes(nextValue)
    ? currentValues.filter((currentValue) => currentValue !== nextValue)
    : [...currentValues, nextValue];
}

export function ShopPage() {
  const tabRailDrag = useRef({ hasDragged: false, isDragging: false, startScrollLeft: 0, startX: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTabRailDragging, setIsTabRailDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<CollectionTab>("All");
  const [selectedPrices, setSelectedPrices] = useState<PriceFilter[]>([]);
  const [selectedDetailTiers, setSelectedDetailTiers] = useState<DetailTier[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const visibleProducts = useMemo(() => {
    const normalizedSearch = normalizeSearchText(searchTerm);

    return products
      .filter((product) => {
        if (activeTab === "New" && !product.isNew) {
          return false;
        }

        if (activeTab !== "All" && activeTab !== "New" && !product.collections.includes(activeTab)) {
          return false;
        }

        if (
          selectedPrices.length > 0 &&
          !selectedPrices.some((priceFilter) => priceFilters.find((filter) => filter.id === priceFilter)?.matches(product))
        ) {
          return false;
        }

        if (selectedDetailTiers.length > 0 && !selectedDetailTiers.includes(product.detailTier)) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        return getProductSearchText(product).includes(normalizedSearch);
      })
      .sort((left, right) => {
        if (sortOption === "price-asc") {
          return left.price - right.price || compareDefaultOrder(left, right);
        }

        if (sortOption === "price-desc") {
          return right.price - left.price || compareDefaultOrder(left, right);
        }

        if (sortOption === "popular") {
          return Number(right.isPopular) - Number(left.isPopular) || compareDefaultOrder(left, right);
        }

        return Number(right.isNew) - Number(left.isNew) || compareDefaultOrder(left, right);
      });
  }, [activeTab, searchTerm, selectedDetailTiers, selectedPrices, sortOption]);

  const normalizedSearchTerm = searchTerm.trim();

  function clearFilters() {
    setSearchTerm("");
    setActiveTab("All");
    setSelectedPrices([]);
    setSelectedDetailTiers([]);
  }

  function chooseSortOption(nextSortOption: SortOption) {
    setSortOption(nextSortOption);
    setIsSortOpen(false);
  }

  function handleTabRailPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      return;
    }

    tabRailDrag.current = {
      hasDragged: false,
      isDragging: true,
      startScrollLeft: event.currentTarget.scrollLeft,
      startX: event.clientX
    };
  }

  function handleTabRailPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!tabRailDrag.current.isDragging || event.pointerType === "touch" || event.pointerType === "pen") {
      return;
    }

    const deltaX = event.clientX - tabRailDrag.current.startX;
    if (Math.abs(deltaX) <= tabRailDragThreshold && !tabRailDrag.current.hasDragged) {
      return;
    }

    if (!tabRailDrag.current.hasDragged) {
      tabRailDrag.current.hasDragged = true;
      setIsTabRailDragging(true);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    event.currentTarget.scrollLeft = tabRailDrag.current.startScrollLeft - deltaX;
    event.preventDefault();
  }

  function endTabRailDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!tabRailDrag.current.isDragging) {
      return;
    }

    tabRailDrag.current.isDragging = false;
    setIsTabRailDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    window.setTimeout(() => {
      tabRailDrag.current.hasDragged = false;
    }, 0);
  }

  function handleTabRailClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!tabRailDrag.current.hasDragged) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    tabRailDrag.current.hasDragged = false;
  }

  return (
    <main className="shop-page" id="shop">
      <section className="shop-page__inner" aria-labelledby="shop-page-title">
        <div className="shop-page__heading">
          <h1 id="shop-page-title">Shop All</h1>
          <p aria-live="polite">{formatCount(visibleProducts.length)}</p>
        </div>

        <div className="shop-search-block">
          <label className="sr-only" htmlFor="shop-search">
            Search sets
          </label>
          <div className="shop-search-field">
            <input
              className="shop-search"
              id="shop-search"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search sets"
              type="search"
              value={searchTerm}
            />
            {normalizedSearchTerm ? (
              <button
                aria-label={`Clear search for "${normalizedSearchTerm}"`}
                className="shop-search-clear"
                onClick={() => setSearchTerm("")}
                type="button"
              >
                x
              </button>
            ) : null}
          </div>
          {normalizedSearchTerm ? (
            <p className="shop-search-status" aria-live="polite">
              {`${formatCount(visibleProducts.length)} found for "${normalizedSearchTerm}"`}
            </p>
          ) : null}
        </div>

        <div className="shop-controls">
          <button
            aria-expanded={isFilterOpen}
            aria-controls="shop-filter-panel"
            className="shop-filter-toggle"
            type="button"
            onClick={() => {
              setIsFilterOpen((currentValue) => !currentValue);
              setIsSortOpen(false);
            }}
          >
            {isFilterOpen ? "Hide filters" : "Filter"}
          </button>

          <div className="shop-sort">
            <button
              aria-controls="shop-sort-panel"
              aria-expanded={isSortOpen}
              className="shop-sort-button"
              type="button"
              onClick={() => {
                setIsSortOpen((currentValue) => !currentValue);
                setIsFilterOpen(false);
              }}
            >
              <span className="shop-sort-button__label">Sort</span>
              <span className="shop-sort-button__value">{sortLabels[sortOption]}</span>
            </button>

            {isSortOpen ? (
              <div className="shop-sort-panel" id="shop-sort-panel" role="radiogroup" aria-label="Sort sets">
                {sortOptions.map((option) => (
                  <button
                    aria-checked={sortOption === option.value}
                    className="shop-sort-option"
                    key={option.value}
                    onClick={() => chooseSortOption(option.value)}
                    role="radio"
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {isFilterOpen ? (
          <section className="shop-filter-panel" id="shop-filter-panel" aria-label="Catalog filters">
            <fieldset>
              <legend>Price</legend>
              {priceFilters.map((filter) => (
                <label key={filter.id}>
                  <input
                    checked={selectedPrices.includes(filter.id)}
                    onChange={() => setSelectedPrices((currentValues) => toggleValue(currentValues, filter.id))}
                    type="checkbox"
                  />
                  <span>{filter.label}</span>
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>Detail level</legend>
              {detailTiers.map((tier) => (
                <label key={tier.id}>
                  <input
                    checked={selectedDetailTiers.includes(tier.id)}
                    onChange={() => setSelectedDetailTiers((currentValues) => toggleValue(currentValues, tier.id))}
                    type="checkbox"
                  />
                  <span>{detailFilterLabels[tier.id]}</span>
                </label>
              ))}
            </fieldset>

            <div className="shop-filter-panel__actions">
              <button type="button" onClick={clearFilters}>
                Clear
              </button>
              <button className="shop-filter-panel__apply" type="button" onClick={() => setIsFilterOpen(false)}>
                Apply
              </button>
            </div>
          </section>
        ) : null}

        <div
          className={isTabRailDragging ? "shop-tab-rail shop-tab-rail--dragging" : "shop-tab-rail"}
          aria-label="Collection tabs"
          onClickCapture={handleTabRailClickCapture}
          onPointerCancel={endTabRailDrag}
          onPointerDown={handleTabRailPointerDown}
          onPointerLeave={endTabRailDrag}
          onPointerMove={handleTabRailPointerMove}
          onPointerUp={endTabRailDrag}
        >
          {collectionTabs.map((tab) => (
            <button
              aria-pressed={activeTab === tab}
              className={activeTab === tab ? "shop-tab-rail__tab shop-tab-rail__tab--active" : "shop-tab-rail__tab"}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="shop-product-grid" aria-live="polite">
            {visibleProducts.map((product) => (
              <ProductPreviewCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="shop-empty-state" aria-live="polite">
            <p>No sets found for "{normalizedSearchTerm}"</p>
            <button type="button" onClick={() => setSearchTerm("")}>
              Clear search
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
