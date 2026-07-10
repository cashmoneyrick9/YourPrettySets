import { useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { includedSetItems, sizingFacts, wearEstimates } from "../data/storefrontFacts";
import { BrandButton } from "./BrandButton";

type KitDetailId = "nails" | "adhesive" | "prep" | "case";

type KitDetailItem = {
  copy: string;
  id: KitDetailId;
  images: {
    alt: string;
    src: string;
  }[];
  label: string;
  title: string;
};

const [pressOnNails, nailGlue, adhesiveTabs, nailFile, cuticleStick, alcoholWipe, storageCase] =
  includedSetItems;

function getKitDetailItems(readyToWear: boolean): KitDetailItem[] {
  return [
    {
      copy: readyToWear
        ? `Ready-to-wear sets include ${sizingFacts.readyToWearNailCount} ${pressOnNails.toLowerCase()} in multiple sizes.`
        : `${pressOnNails} are included with every set. Read Find Your Fit before ordering if you are unsure about sizing.`,
      id: "nails",
      images: [
        {
          alt: "Twenty-four press-on nails in multiple sizes with small fruit details",
          src: "/assets/nail-size-set.png"
        }
      ],
      label: "Nails",
      title: "A broader fit range"
    },
    {
      copy: `${nailGlue} and ${adhesiveTabs.toLowerCase()} are included. Glue is estimated at ${wearEstimates.glue}; tabs are estimated at ${wearEstimates.tabs}. Actual wear varies with ${wearEstimates.variables.map((item) => item.toLowerCase()).join(", ")}.`,
      id: "adhesive",
      images: [
        { alt: "Nail glue and adhesive tabs", src: "/assets/nail-glue.png" },
        { alt: "Adhesive tabs", src: "/assets/adhesive-tabs.png" }
      ],
      label: "Glue / tabs",
      title: "Choose your wear"
    },
    {
      copy: `${nailFile}, ${cuticleStick.toLowerCase()}, and ${alcoholWipe.toLowerCase()} are included for preparation and application.`,
      id: "prep",
      images: [
        { alt: "Nail file", src: "/assets/nail-file.png" },
        { alt: "Cuticle stick", src: "/assets/cuticle-pusher.png" },
        { alt: "Alcohol wipe", src: "/assets/alcohol-wipe.png" }
      ],
      label: "Prep tools",
      title: "Prep + apply kit"
    },
    {
      copy: `${storageCase} is included to help protect your nails between wears.`,
      id: "case",
      images: [{ alt: "Storage case", src: "/assets/storage-case.png" }],
      label: "Case + care",
      title: "Store + reuse"
    }
  ];
}

export function KitContents({ readyToWear = true }: { readyToWear?: boolean }) {
  const kitDetailItems = getKitDetailItems(readyToWear);
  const [activeItemId, setActiveItemId] = useState<KitDetailId>("nails");
  const activeItem = kitDetailItems.find((item) => item.id === activeItemId) ?? kitDetailItems[0];

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % kitDetailItems.length
        : (currentIndex - 1 + kitDetailItems.length) % kitDetailItems.length;
    const nextItem = kitDetailItems[nextIndex];

    setActiveItemId(nextItem.id);
    document.getElementById(`kit-detail-tab-${nextItem.id}`)?.focus();
  };

  return (
    <section className="section-block kit-section" aria-labelledby="kit-heading">
      <div className="section-heading kit-heading">
        <p className="eyebrow">THE COMPLETE SET</p>
        <h2 id="kit-heading">What’s Included</h2>
        <p>Everything you need for your set.</p>
      </div>

      <div className="kit-layout">
        <div className="kit-spread">
          <img
            alt="Press-on nail kit with tabs and tools"
            className="kit-spread__image"
            src="/assets/kit-contents-spread-v2.png"
          />
        </div>

        <div className="kit-detail-tabs" aria-label="Included kit items" role="tablist">
          {kitDetailItems.map((item, index) => {
            const isActive = item.id === activeItemId;

            return (
              <button
                aria-controls="kit-detail-panel"
                aria-selected={isActive}
                className={`kit-detail-tab${isActive ? " kit-detail-tab--active" : ""}`}
                id={`kit-detail-tab-${item.id}`}
                key={item.id}
                onClick={() => setActiveItemId(item.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                role="tab"
                type="button"
              >
                <span className={`kit-detail-tab__visual kit-detail-tab__visual--${item.id}`} aria-hidden="true">
                  <img alt="" src={item.images[0].src} />
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div
          aria-labelledby={`kit-detail-tab-${activeItem.id}`}
          className="kit-detail-panel"
          id="kit-detail-panel"
          role="tabpanel"
        >
          <div
            className={`kit-detail-panel__visual kit-detail-panel__visual--${activeItem.id}`}
            aria-label={`${activeItem.label} preview`}
          >
            {activeItem.images.map((image) => (
              <img alt={image.alt} key={image.alt} src={image.src} />
            ))}
          </div>
          <div className="kit-detail-panel__copy">
            <h3>{activeItem.title}</h3>
            <p>{activeItem.copy}</p>
          </div>
        </div>

        <BrandButton asChild className="kit-primary-link">
          <Link to="/help/application">
            APPLY YOUR SET <span aria-hidden="true">→</span>
          </Link>
        </BrandButton>
        <BrandButton asChild className="kit-faq-link">
          <Link to="/help/faq">Have a question? Visit our FAQ</Link>
        </BrandButton>
      </div>
    </section>
  );
}
