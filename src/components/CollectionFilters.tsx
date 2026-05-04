import { collectionLabels } from "../data/products";

const visibleCollections = collectionLabels.filter((label) => label !== "New Arrivals");

export function CollectionFilters() {
  return (
    <section className="section-block collection-section" id="shop-collections">
      <div className="section-heading">
        <p className="eyebrow">Shop by collection</p>
        <h2>Browse by the plan, mood, or moment.</h2>
      </div>
      <div className="collection-grid">
        {visibleCollections.map((collection) => (
          <a
            className="collection-card"
            href={`#collection-${collection.toLowerCase().replace("/", "-").replace(/\s+/g, "-")}`}
            key={collection}
          >
            {collection}
          </a>
        ))}
      </div>
    </section>
  );
}
