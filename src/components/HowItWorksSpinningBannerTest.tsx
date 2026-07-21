import { useState } from "react";
import "./HowItWorksSpinningBannerTest.css";

const bannerSteps = [
  {
    body: "Find a design that feels like you.",
    number: "01",
    title: "Choose your set"
  },
  {
    body: "Choose your preferred shape and length.",
    number: "02",
    title: "Customize your fit"
  },
  {
    body: "Use glue or adhesive tabs—your choice.",
    number: "03",
    title: "Apply your way"
  }
];

function BannerPanel({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      aria-hidden={duplicate ? "true" : undefined}
      className={`how-it-works-banner-test__panel${duplicate ? " how-it-works-banner-test__panel--duplicate" : ""}`}
    >
      <img
        alt=""
        aria-hidden="true"
        decoding="async"
        loading={duplicate ? "lazy" : "eager"}
        src="/assets/how-it-works-banner-test/how-it-works-panorama.jpg"
      />
      <div className="how-it-works-banner-test__steps">
        {bannerSteps.map((step) => (
          <div className="how-it-works-banner-test__step" key={step.number}>
            <span className="how-it-works-banner-test__number">{step.number}</span>
            <strong>{step.title}</strong>
            <p>{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HowItWorksSpinningBannerTest() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      aria-labelledby="how-it-works-banner-test-label"
      className="how-it-works-banner-test"
      data-testid="how-it-works-banner-test"
    >
      <p className="how-it-works-banner-test__label" id="how-it-works-banner-test-label">
        HOW IT WORKS
      </p>
      <div
        aria-label="Continuous How It Works banner. Focus or touch to pause movement."
        className={`how-it-works-banner-test__viewport${isPaused ? " how-it-works-banner-test__viewport--paused" : ""}`}
        onBlur={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onPointerCancel={() => setIsPaused(false)}
        onPointerDown={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
        onPointerUp={() => setIsPaused(false)}
        role="group"
        tabIndex={0}
      >
        <div className="how-it-works-banner-test__track">
          <BannerPanel />
          <BannerPanel duplicate />
        </div>
      </div>
    </section>
  );
}
