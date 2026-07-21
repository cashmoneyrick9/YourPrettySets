import type { KeyboardEvent } from "react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { includedSetItems, sizingFacts, wearEstimates } from "../data/storefrontFacts";

const [pressOnNails, nailGlue, adhesiveTabs, nailFile, cuticleStick, alcoholWipe, storageCase] = includedSetItems;

const productKitItems = [
  {
    alt: "Twenty-four blush press-on nails arranged by size on a cool white studio surface",
    body: `Ready-to-wear sets include ${sizingFacts.readyToWearNailCount} ${pressOnNails.toLowerCase()} across multiple sizes to reduce fit guesswork.`,
    id: "nails",
    image: "/assets/kit/kit-nails.jpg",
    label: "Nails",
    meta: `${sizingFacts.readyToWearNailCount} nails · Sizes ${sizingFacts.presetRange}`
  },
  {
    alt: "Nail glue and clear adhesive tabs arranged on a cool white studio surface",
    body: `${nailGlue} and ${adhesiveTabs.toLowerCase()} are included, so you can choose the wear that fits your plans.`,
    id: "adhesives",
    image: "/assets/kit/kit-adhesives.jpg",
    label: "Glue / tabs",
    meta: `Glue ${wearEstimates.glue} · Tabs ${wearEstimates.tabs}`
  },
  {
    alt: "Nail file, wooden cuticle stick, and alcohol prep wipe on a cool white studio surface",
    body: `${nailFile}, ${cuticleStick.toLowerCase()}, and ${alcoholWipe.toLowerCase()} support a clean, careful application.`,
    id: "prep",
    image: "/assets/kit/kit-prep-tools.jpg",
    label: "Prep tools",
    meta: "File · Cuticle stick · Alcohol wipe"
  },
  {
    alt: "Clear press-on nail storage case and soft care cloth on a cool white studio surface",
    body: `${storageCase} is included to help protect your press-ons between wears. Remove gently, clean, and store them for next time.`,
    id: "care",
    image: "/assets/kit/kit-case-care.jpg",
    label: "Case + care",
    meta: "Store carefully · Remove gently · Rewear"
  }
] as const;

export function ProductKitDrawers({ readyToWear }: { readyToWear: boolean }) {
  const [activeId, setActiveId] = useState<(typeof productKitItems)[number]["id"]>("nails");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeItem = productKitItems.find((item) => item.id === activeId) ?? productKitItems[0];

  const moveTabFocus = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const keyOffsets: Partial<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 };
    let nextIndex = currentIndex;

    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = productKitItems.length - 1;
    else if (keyOffsets[event.key]) nextIndex = (currentIndex + keyOffsets[event.key]! + productKitItems.length) % productKitItems.length;
    else return;

    event.preventDefault();
    setActiveId(productKitItems[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  const body = activeItem.id === "nails" && !readyToWear
    ? `${pressOnNails} are included with every made-to-order set, prepared in the sizes confirmed for your order.`
    : activeItem.body;
  const meta = activeItem.id === "nails" && !readyToWear
    ? "Press-on nail set · Selected sizes"
    : activeItem.meta;

  return (
    <section className="product-kit-showcase" aria-labelledby="product-kit-showcase-title">
      <div className="product-section-heading product-kit-showcase__heading">
        <p className="eyebrow">The complete set</p>
        <h2 id="product-kit-showcase-title">Everything arrives together</h2>
        <p>Tap through the pieces included with every set.</p>
      </div>

      <div className="product-kit-showcase__shell">
        <div aria-label="Kit contents" className="product-kit-showcase__tabs" role="tablist">
          {productKitItems.map((item, index) => {
            const isActive = item.id === activeId;

            return (
              <button
                aria-controls="product-kit-showcase-panel"
                aria-selected={isActive}
                className="product-kit-showcase__tab"
                id={`product-kit-tab-${item.id}`}
                key={item.id}
                onClick={() => setActiveId(item.id)}
                onKeyDown={(event) => moveTabFocus(event, index)}
                ref={(node) => { tabRefs.current[index] = node; }}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`product-kit-showcase__tab-media product-kit-showcase__tab-media--${item.id}`}
                >
                  <img alt="" src={item.image} />
                </span>
                <span className="product-kit-showcase__tab-label">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div
          aria-labelledby={`product-kit-tab-${activeItem.id}`}
          className="product-kit-showcase__panel"
          id="product-kit-showcase-panel"
          role="tabpanel"
        >
          <div className={`product-kit-showcase__media product-kit-showcase__media--${activeItem.id}`}>
            <img alt={activeItem.alt} src={activeItem.image} />
          </div>
          <div className="product-kit-showcase__copy">
            <p className="eyebrow">{activeItem.label}</p>
            <h3>{meta}</h3>
            <p>{body}</p>
          </div>
        </div>
      </div>

      <Link className="product-kit-showcase__guide" to="/help/application">
        View the application guide <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
