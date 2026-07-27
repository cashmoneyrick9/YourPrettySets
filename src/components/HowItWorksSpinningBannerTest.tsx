import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { CAROUSEL_AUTO_ROTATE_SPEED_PX_PER_SECOND } from "./MobileCarousel";
import "./HowItWorksSpinningBannerTest.css";

const fallbackLoopDistancePx = 900;
const fallbackLoopDurationSeconds =
  fallbackLoopDistancePx / CAROUSEL_AUTO_ROTATE_SPEED_PX_PER_SECOND;

const selectedSteps = [
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
];

function BannerPanel({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      aria-hidden={duplicate ? "true" : undefined}
      className={`how-it-works-banner-test__panel how-it-works-banner-test__panel--steps${
        duplicate ? " how-it-works-banner-test__panel--duplicate" : ""
      }`}
    >
      {selectedSteps.map((step) => (
        <div aria-label={step.label} className="how-it-works-banner-test__step" key={step.label} role="img">
          <img
            alt=""
            aria-hidden="true"
            decoding="async"
            loading={duplicate ? "lazy" : "eager"}
            src={step.imageSrc}
          />
        </div>
      ))}
    </div>
  );
}

export function HowItWorksSpinningBannerTest() {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;

    if (!track || !viewport) return;

    const syncLoopDuration = () => {
      const panel = track.querySelector<HTMLElement>(".how-it-works-banner-test__panel");
      const loopDistancePx = panel?.getBoundingClientRect().width ?? 0;

      if (loopDistancePx <= 0) return;

      track.style.setProperty(
        "--how-it-works-banner-loop-duration",
        `${loopDistancePx / CAROUSEL_AUTO_ROTATE_SPEED_PX_PER_SECOND}s`
      );
    };

    syncLoopDuration();

    const resizeObserver = new ResizeObserver(syncLoopDuration);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section
      aria-labelledby="how-it-works-banner-test-label"
      className="how-it-works-banner-test"
      data-testid="how-it-works-banner-test"
    >
      <div className="section-heading confidence-section__heading how-it-works-banner-test__heading">
        <p className="eyebrow">HOW IT WORKS</p>
        <h2 id="how-it-works-banner-test-label">3 EASY STEPS</h2>
      </div>
      <div
        aria-label="Continuous three-step How It Works banner. Focus or touch to pause movement."
        className={`how-it-works-banner-test__viewport how-it-works-banner-test__viewport--selected${
          isPaused ? " how-it-works-banner-test__viewport--paused" : ""
        }`}
        onBlur={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onPointerCancel={() => setIsPaused(false)}
        onPointerDown={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
        onPointerUp={() => setIsPaused(false)}
        ref={viewportRef}
        role="group"
        tabIndex={0}
      >
        <div
          className="how-it-works-banner-test__track"
          data-rotate-speed={CAROUSEL_AUTO_ROTATE_SPEED_PX_PER_SECOND}
          ref={trackRef}
          style={
            {
              "--how-it-works-banner-loop-duration": `${fallbackLoopDurationSeconds}s`
            } as CSSProperties
          }
        >
          <BannerPanel />
          <BannerPanel duplicate />
        </div>
      </div>
    </section>
  );
}
