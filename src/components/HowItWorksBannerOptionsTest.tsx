import { useState } from "react";
import "./HowItWorksSpinningBannerTest.css";
import "./HowItWorksBannerOptionsTest.css";

type BannerStep = {
  imageSrc: string;
  label: string;
};

type BannerOption = {
  cleanImageSrc?: string;
  description: string;
  id: "a" | "b" | "c" | "d" | "e";
  imageSrc?: string;
  label: string;
  shortLabel: string;
  steps?: BannerStep[];
};

const bannerOptions: BannerOption[] = [
  {
    description: "A minimal product-kit ribbon with no hands.",
    id: "a",
    imageSrc: "/assets/how-it-works-banner-test/how-it-works-option-a-products.jpg",
    label: "Product objects only",
    shortLabel: "A · Objects"
  },
  {
    description: "One centered application moment with a few supporting tools.",
    id: "b",
    imageSrc: "/assets/how-it-works-banner-test/how-it-works-option-b-application.jpg",
    label: "Application moment",
    shortLabel: "B · Apply"
  },
  {
    description: "Choose, apply, and wear arranged as one loose customer journey.",
    id: "c",
    imageSrc: "/assets/how-it-works-banner-test/how-it-works-option-c-journey.jpg",
    label: "Subtle customer journey",
    shortLabel: "C · Journey"
  },
  {
    cleanImageSrc: "/assets/how-it-works-banner-test/how-it-works-option-d-clean.jpg",
    description: "Generated editorial type as a visual mockup, plus a clean production base.",
    id: "d",
    imageSrc: "/assets/how-it-works-banner-test/how-it-works-option-d-typography.jpg",
    label: "Editorial typography",
    shortLabel: "D · Type"
  },
  {
    description: "Choose a set, choose glue or tabs, then wear—three white scenes with oversized integrated type.",
    id: "e",
    label: "Three-step journey",
    shortLabel: "E · Journey + Type",
    steps: [
      {
        imageSrc: "/assets/how-it-works-banner-test/how-it-works-option-e-v4-choose.jpg",
        label: "Choose your set. Find the design that feels like you."
      },
      {
        imageSrc: "/assets/how-it-works-banner-test/how-it-works-option-e-v4-method.jpg",
        label: "Choose your method. Choose the hold that works for you."
      },
      {
        imageSrc: "/assets/how-it-works-banner-test/how-it-works-option-e-v4-wear.jpg",
        label: "Wear. Press on and enjoy your finished set."
      }
    ]
  }
];

function OptionPanel({
  duplicate = false,
  imageSrc,
  steps
}: {
  duplicate?: boolean;
  imageSrc?: string;
  steps?: BannerStep[];
}) {
  return (
    <div
      aria-hidden={duplicate ? "true" : undefined}
      className={`how-it-works-banner-test__panel${steps ? " how-it-works-options-test__panel--steps" : ""}${
        duplicate ? " how-it-works-banner-test__panel--duplicate" : ""
      }`}
    >
      {steps ? (
        steps.map((step) => (
          <div aria-label={step.label} className="how-it-works-options-test__step" key={step.label} role="img">
            <img
              alt=""
              aria-hidden="true"
              decoding="async"
              loading={duplicate ? "lazy" : "eager"}
              src={step.imageSrc}
            />
          </div>
        ))
      ) : (
        <img alt="" aria-hidden="true" decoding="async" loading={duplicate ? "lazy" : "eager"} src={imageSrc} />
      )}
    </div>
  );
}

export function HowItWorksBannerOptionsTest() {
  const [activeOptionId, setActiveOptionId] = useState<BannerOption["id"]>("e");
  const [isPaused, setIsPaused] = useState(false);
  const [showCleanOptionD, setShowCleanOptionD] = useState(false);
  const activeOption = bannerOptions.find((option) => option.id === activeOptionId) ?? bannerOptions[0];
  const activeImageSrc =
    activeOption.id === "d" && showCleanOptionD && activeOption.cleanImageSrc
      ? activeOption.cleanImageSrc
      : activeOption.imageSrc;
  const activePanelKey = activeOption.steps ? `${activeOption.id}-steps` : activeImageSrc;

  return (
    <section
      aria-labelledby="how-it-works-options-label"
      className="how-it-works-options-test"
      data-testid="how-it-works-banner-options-test"
    >
      <div className="how-it-works-options-test__heading">
        <p className="eyebrow">IMAGE TEST</p>
        <h2 id="how-it-works-options-label">Compare the directions</h2>
        <p>No winner is selected. Use the controls to review each moving panorama.</p>
      </div>

      <div aria-label="How It Works image options" className="how-it-works-options-test__controls" role="group">
        {bannerOptions.map((option) => (
          <button
            aria-pressed={activeOption.id === option.id}
            className="how-it-works-options-test__option"
            key={option.id}
            onClick={() => {
              setActiveOptionId(option.id);
              setShowCleanOptionD(false);
            }}
            type="button"
          >
            {option.shortLabel}
          </button>
        ))}
      </div>

      {activeOption.id === "d" ? (
        <div aria-label="Option D image version" className="how-it-works-options-test__versions" role="group">
          <button
            aria-pressed={!showCleanOptionD}
            className="how-it-works-options-test__version"
            onClick={() => setShowCleanOptionD(false)}
            type="button"
          >
            Typography mockup
          </button>
          <button
            aria-pressed={showCleanOptionD}
            className="how-it-works-options-test__version"
            onClick={() => setShowCleanOptionD(true)}
            type="button"
          >
            Clean image
          </button>
        </div>
      ) : null}

      <div aria-live="polite" className="how-it-works-options-test__selection">
        <strong>{activeOption.label}</strong>
        <span>{activeOption.description}</span>
      </div>

      <div
        aria-label={`${activeOption.label} moving banner preview. Focus or touch to pause movement.`}
        className={`how-it-works-banner-test__viewport how-it-works-options-test__viewport${
          activeOption.steps ? " how-it-works-options-test__viewport--steps" : ""
        }${
          isPaused ? " how-it-works-banner-test__viewport--paused" : ""
        }`}
        onBlur={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onPointerCancel={() => setIsPaused(false)}
        onPointerDown={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
        onPointerUp={() => setIsPaused(false)}
        role="group"
        tabIndex={0}
      >
        <div className="how-it-works-banner-test__track" key={activePanelKey}>
          <OptionPanel imageSrc={activeImageSrc} steps={activeOption.steps} />
          <OptionPanel duplicate imageSrc={activeImageSrc} steps={activeOption.steps} />
        </div>
      </div>
    </section>
  );
}
