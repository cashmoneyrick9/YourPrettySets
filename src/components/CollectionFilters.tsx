import { collectionLabels } from "../data/products";

const topCollections = collectionLabels.filter((label) =>
  ["Everyday", "Date Night", "Vacation"].includes(label)
);

export function CollectionFilters() {
  return (
    <section className="section-block collection-section" id="shop-collections">
      <div className="section-heading collection-heading">
        <div>
          <p className="eyebrow">Collections</p>
          <h2>Browse by the plan, mood, or moment.</h2>
        </div>
        <a className="collection-heading__link" href="#shop-more">
          See all
        </a>
      </div>
      <div className="collection-grid">
        {topCollections.map((collection) => (
          <a
            className={`collection-card collection-card--${collection.toLowerCase().replace("/", "-").replace(/\s+/g, "-")}`}
            href={`#collection-${collection.toLowerCase().replace("/", "-").replace(/\s+/g, "-")}`}
            key={collection}
          >
            <span className="collection-card__visual" aria-hidden="true">
              <span className="collection-card__nail collection-card__nail--one" />
              <span className="collection-card__nail collection-card__nail--two" />
              <span className="collection-card__nail collection-card__nail--three" />
              <span className="collection-card__nail collection-card__nail--four" />
              <span className="collection-card__nail collection-card__nail--five" />
            </span>
            <span>{collection}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
