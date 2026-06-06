import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf-8");
const indexHtml = readFileSync("index.html", "utf-8");

function countOneOffTypographyRules(css: string) {
  const typographyProps = ["font-size", "font-weight", "line-height", "letter-spacing", "font-family"] as const;
  const tokenizedValue = /var\(|inherit|normal|initial|unset|currentColor|auto/;
  let count = 0;

  for (const rule of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const body = rule[2];
    const hasOneOff = typographyProps.some((prop) => {
      const declarations = body.matchAll(new RegExp(`${prop}\\s*:\\s*([^;]+);`, "g"));

      return Array.from(declarations).some((declaration) => !tokenizedValue.test(declaration[1].trim()));
    });

    if (hasOneOff) {
      count += 1;
    }
  }

  return count;
}

describe("small mobile responsive CSS", () => {
  it("defines the homepage typography system and loads the intended fonts", () => {
    expect(styles).toContain("@import url(\"https://fonts.googleapis.com/css2?family=Fraunces");
    expect(styles).toContain("family=Manrope:wght@400..800");
    expect(styles).toContain("display=swap");
    expect(styles).toContain("--font-body: \"Manrope\"");
    expect(styles).toContain("--font-display: \"Fraunces\"");
    expect(styles).toContain("--type-hero-title:");
    expect(styles).toContain("--type-section-title:");
    expect(styles).toContain("--type-subsection-title:");
    expect(styles).toContain("--type-body:");
    expect(styles).toContain("--type-caption:");
    expect(styles).toContain("--type-button:");
    expect(styles).toContain("--type-nav:");
    expect(styles).toContain("--weight-display:");
    expect(styles).toContain("--type-review-quote:");
    expect(styles).toContain("--weight-body:");
    expect(styles).toContain("--weight-strong:");
    expect(styles).toContain("--leading-tight:");
    expect(styles).toContain("--leading-body:");
    expect(styles).toContain("--tracking-caption:");
  });

  it("defines the homepage spacing role system", () => {
    expect(styles).toContain("--space-page-inline:");
    expect(styles).toContain("--space-section-y:");
    expect(styles).toContain("--space-section-y-compact:");
    expect(styles).toContain("--space-section-y-tight:");
    expect(styles).toContain("--space-heading-gap:");
    expect(styles).toContain("--space-card-padding:");
    expect(styles).toContain("--space-card-padding-tight:");
    expect(styles).toContain("--space-card-padding-feature:");
    expect(styles).toContain("--space-card-gap:");
    expect(styles).toContain("--space-carousel-gap:");
    expect(styles).toContain("--space-form-gap:");
    expect(styles).toContain("--space-footer-y:");
    expect(styles).toContain("--space-footer-card-padding:");
  });

  it("maps homepage headings, buttons, and nav to typography roles", () => {
    expect(styles).toContain("font-family: var(--font-body);");
    expect(styles).toContain("font-family: var(--font-display);");
    expect(styles).toContain(".brand-header,\n.brand-header button,\n.brand-header a {");
    expect(styles).toContain(".hero-copy h1 {\n  color: inherit;\n  font-family: var(--font-display);");
    expect(styles).toContain("font-size: var(--type-hero-title);");
    expect(styles).toContain(".section-heading h2 {\n  color: #2f2630;\n  font-family: var(--font-display);");
    expect(styles).toContain("font-size: var(--type-section-title);");
    expect(styles).toContain(".kit-heading h2 {\n  color: #000000;\n  font-family: var(--font-display);");
    expect(styles).toContain(".site-footer-email--restored .site-footer-email__title");
    expect(styles).toContain(".site-footer-email--restored .site-footer-email__button");
    expect(styles).toContain(".site-footer__shop-link");
    expect(styles).toContain("font-family: var(--font-cta);");
    expect(styles).not.toContain("font-family: Georgia, \"Times New Roman\", serif;");
  });

  it("keeps leftover homepage typography debt bounded and removes dead text selectors", () => {
    expect(countOneOffTypographyRules(styles)).toBeLessThanOrEqual(40);
    expect(styles).toContain(".kit-detail-panel__copy h3 {\n  font-size: var(--type-card-title);");
    expect(styles).toContain(".review-story-label {\n  color: #241f22;");
    expect(styles).toContain("font-size: 0.66rem;");
    expect(styles).not.toContain(".collection-card__mood");
    expect(styles).not.toContain(".collection-card__title");
    expect(styles).not.toContain(".collection-card__description");
    expect(styles).not.toContain(".collection-card__cta");
    expect(styles).not.toContain(".review-card__number");
    expect(styles).not.toContain(".reviewed-set__copy");
    expect(styles).toContain(".site-footer-email--restored");
    expect(styles).not.toContain(".site-footer-email,\n");
    expect(styles).not.toContain(".site-footer-system");
    expect(styles).not.toContain("site-footer__toggle");
    expect(styles).not.toContain("site-footer__panel");
  });

  it("uses a fixed mobile top bar with safe-area paint and hero offset", () => {
    expect(indexHtml).toContain('name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"');
    expect(styles).toContain("@supports (height: env(safe-area-inset-top))");
    expect(styles).toContain("--mobile-header-offset: calc(51px + env(safe-area-inset-top, 0px));");
    expect(styles).toContain("padding: calc(4px + env(safe-area-inset-top, 0px)) 14px 8px;");
    expect(styles).toContain("body::before");
    expect(styles).toContain("height: env(safe-area-inset-top)");
    expect(styles).toContain("body.header-at-top::before");
    expect(styles).toContain("background: rgba(255, 253, 249, 0.98);");
    expect(styles).not.toContain("rgba(221, 104, 133, 0.36) 0%");
    expect(styles).not.toContain("padding-top: max(14px, env(safe-area-inset-top))");
    expect(styles).toContain("body.header-scrolled::before");
    expect(styles).toContain(".brand-header--at-top,\n  .brand-header--scrolled");
    expect(styles).toContain("border-radius: 0;");
    expect(styles).toContain("padding-top: var(--mobile-header-offset);");
    expect(styles).toContain("--mobile-header-offset: calc(45px + env(safe-area-inset-top, 0px));");
  });

  it("includes the locked S3 header and hero visual rules", () => {
    expect(styles).toContain("--color-sage-accent");
    expect(styles).toContain("--color-sage-accent: #adba85;");
    expect(styles).toContain("--font-cta:");
    expect(styles).toContain("--hero-overlay-bottom");
    expect(styles).toContain("--hero-button-offset: 4px;");
    expect(styles).toContain("--hero-copy-gap: 20px;");
    expect(styles).toContain("--hero-copy-top: clamp(58px, 8vh, 84px);");
    expect(styles).toContain("--hero-mobile-min-height: clamp(520px, 68vh, 640px);");
    expect(styles).toContain(".brand-header--at-top");
    expect(styles).toContain(".brand-header--scrolled");
    expect(styles).toContain("border-radius: 8px;");
    expect(styles).toContain("position: fixed;");
    expect(styles).toContain("backdrop-filter: blur(14px);");
    expect(styles).toContain("background-image: url(\"/assets/hero-s3-summer.png\")");
    expect(styles).toContain(".hero-photo__hand {\n  display: none;");
    expect(styles).toContain(".hero-section::after");
    expect(styles).toContain("min-height: var(--hero-mobile-min-height)");
    expect(styles).toContain("min-height: var(--hero-mobile-min-height, clamp(520px, 68vh, 640px))");
    expect(styles).toContain("scroll-padding-top: 84px");
    expect(styles).toContain("justify-self: center");
    expect(styles).toContain("max-height: min(650px, calc(94vh - 108px))");
    expect(styles).toContain("width: min(100%, 520px)");
    expect(styles).not.toContain(".hero-copy h1::after");
    expect(styles).not.toContain("86px 1px");
    expect(styles).toContain(".hero-section {\n  display: grid;");
    expect(styles).toContain("padding: 0;");
    expect(styles).toContain("border-radius: 0;");
    expect(styles).toContain("grid-template-columns: 40px minmax(0, 1fr) 40px;");
    expect(styles).toContain("grid-column: 2;");
    expect(styles).toContain("font-size: 21px;");
    expect(styles).toContain("font-family: var(--font-cta);");
    expect(styles).toContain(".brand-header--scrolled .brand-header__icon-button");
    expect(styles).toContain("background: transparent;");
    expect(styles).toContain("bottom: -1px;");
    expect(styles).toContain("height: clamp(180px, 32vh, 220px);");
    expect(styles).toContain("left: 0;");
    expect(styles).toContain("right: 0;");
    expect(styles).toContain("border-radius: 0;");
    expect(styles).not.toContain(".hero-section::after,\n  .hero-copy,\n  .hero-photo");
    expect(styles).toContain("@media (max-width: 720px)");
    expect(styles).toContain("height: 105px;");
    expect(styles).toContain("rgba(251, 246, 238, 0.04) 18%");
    expect(styles).toContain("rgba(251, 246, 238, 0.14) 35%");
    expect(styles).toContain("rgba(251, 246, 238, 0.34) 55%");
    expect(styles).toContain("rgba(251, 246, 238, 0.68) 78%");
    expect(styles).toContain("#fbf6ee 100%");
  });

  it("includes dedicated layout tightening for 320px screens", () => {
    expect(styles).toContain("@media (max-width: 360px)");
    expect(styles).toContain(".product-carousel");
    expect(styles).toContain("grid-auto-columns: minmax(206px, 252px)");
    expect(styles).toContain(".hero-photo");
    expect(styles).toContain("grid-template-areas: \"hero\"");
    expect(styles).toContain(".hero-copy");
    expect(styles).toContain("z-index: 1");
    expect(styles).toContain(".confidence-carousel");
    expect(styles).not.toContain(".confidence-carousel__button");
    expect(styles).toContain("align-self: start;");
    expect(styles).toContain("padding: var(--hero-copy-top) clamp(24px, 6vw, 42px) 0;");
    expect(styles).toContain("gap: var(--hero-copy-gap);");
    expect(styles).toContain("margin-top: var(--hero-button-offset);");
    expect(styles).toContain("--hero-mobile-min-height: 540px;");
    expect(styles).toContain(".confidence-section {\n  background:");
    expect(styles).toContain("margin-top: 0;");
    expect(styles).toContain("padding: var(--space-section-y-tight) 0 var(--space-section-y-compact);");
    expect(styles).not.toContain("margin-top: clamp(-32px, -5vw, -18px)");
    expect(styles).not.toContain("margin-top: -22px");
    expect(styles).not.toContain("margin-top: -18px");
    expect(styles).toContain("--hero-overlay-bottom: rgba(255, 250, 248, 0.58);");
    expect(styles).not.toContain("rgba(255, 250, 248, 0.44) 84%");
    expect(styles).not.toContain(".confidence-section::before");
    expect(styles).not.toContain(".confidence-section::after");
    expect(styles).not.toContain("top: clamp(-52px, -7vw, -34px)");
    expect(styles).not.toContain("height: clamp(82px, 12vw, 120px)");
    expect(styles).toContain("linear-gradient(180deg, #fbf6ee 0%, #fbf6ee 34%, #f7f0e6 100%)");
    expect(styles).not.toContain("backdrop-filter: blur(18px) saturate(1.05)");
    expect(styles).not.toContain("backdrop-filter: blur(12px) saturate(1.03)");
    expect(styles).not.toContain("rgba(255, 253, 249, 0.55) 28%");
    expect(styles).not.toContain("rgba(255, 253, 249, 0.9) 68%");
    expect(styles).not.toContain("0 14px 26px rgba(93, 48, 67, 0.07)");
    expect(styles).not.toContain("0 18px 38px rgba(93, 48, 67, 0.12)");
    expect(styles).not.toContain("0 1px 0 rgba(255, 255, 255, 0.7) inset");
    expect(styles).toContain("z-index: 1;");
    expect(styles).toContain(".confidence-carousel__viewport");
    expect(styles).toContain(".confidence-carousel__viewport::after");
    expect(styles).toContain("height: 52px;");
    expect(styles).toContain("height: 34px;");
    expect(styles).toContain("rgba(251, 246, 238, 0.75) 55%");
    expect(styles).toContain("0 10px 20px rgba(92, 65, 50, 0.055),\n    0 3px 8px rgba(92, 65, 50, 0.035)");
    expect(styles).not.toContain("mask-image: linear-gradient(");
    expect(styles).toContain(".confidence-carousel:focus-visible");
    expect(styles).not.toContain(".confidence-card--peek");
    expect(styles).toContain(".confidence-carousel__track");
    expect(styles).toContain("-webkit-overflow-scrolling: touch;");
    expect(styles).not.toMatch(/\.confidence-carousel__track\s*\{[^}]*scroll-snap-type: x mandatory;/);
    expect(styles).not.toContain(".confidence-carousel--auto-paused .confidence-carousel__track");
    expect(styles).not.toContain(".confidence-carousel--interacting .confidence-carousel__track");
    expect(styles).not.toContain(".confidence-carousel__track {\n    animation");
    expect(styles).toContain(".confidence-carousel__slide");
    expect(styles).toContain("padding: 10px 0 52px;");
    expect(styles).toContain("padding: 6px 0 34px;");
    expect(styles).not.toContain("--confidence-card-height");
    expect(styles).not.toContain(".confidence-carousel[data-track-index=\"1\"] .confidence-carousel__track");
    expect(styles).not.toContain("margin-left: calc(-100% + var(--confidence-peek) - var(--confidence-gap))");
    expect(styles).not.toMatch(/\.confidence-carousel__track\s*\{[^}]*cursor: grab;/);
    expect(styles).not.toContain(".confidence-carousel--dragging");
    expect(styles).not.toMatch(/\.confidence-carousel--interacting\s+\.confidence-carousel__track\s*\{[^}]*cursor: grabbing;/);
    expect(styles).toContain("touch-action: pan-x pan-y;");
    expect(styles).not.toMatch(/\.collection-track\s*\{[^}]*scroll-snap-type: x mandatory;/);
    expect(styles).not.toContain("animation: confidence-loop");
    expect(styles).not.toContain(".confidence-carousel--paused .confidence-carousel__track");
    expect(styles).not.toContain("animation-play-state: paused;");
    expect(styles).not.toContain("@keyframes confidence-loop");
    expect(styles).not.toContain(".confidence-carousel__track--resetting");
    expect(styles).toContain("overflow: visible;");
    expect(styles).toContain("--confidence-card-width: min(80vw, 306px);");
    expect(styles).toContain("--confidence-card-width: min(78vw, 282px);");
    expect(styles).toContain("min-height: 154px;");
    expect(styles).toContain("min-height: 148px;");
    expect(styles).not.toContain(".confidence-card__visual");
    expect(styles).not.toContain(".confidence-card__visual--wear");
    expect(styles).not.toContain(".confidence-card__visual--hand");
    expect(styles).not.toContain(".confidence-card__visual-frame");
    expect(styles).not.toContain(".confidence-card__tray");
    expect(styles).not.toContain(".confidence-card__glue");
    expect(styles).not.toContain(".confidence-card__hand");
    expect(styles).not.toContain(".confidence-card__copy");
    expect(styles).not.toContain(".confidence-card__body");
    expect(styles).not.toContain(".confidence-card__number");
    expect(styles).not.toContain(".confidence-progress");
    expect(styles).not.toContain(".confidence-dots");
    expect(styles).toContain(".collection-carousel__hint");
    expect(styles).toContain(".collection-products");
    expect(styles).toContain(".collection-product-row");
    expect(styles).toContain("margin-inline: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain("max-width: none;");
    expect(styles).toContain(".collection-carousel__viewport");
    expect(styles).toContain("padding-inline: 18px;");
    expect(styles).toContain(".collection-carousel,\n  .faq-topic-carousel {\n    margin-left: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain("width: auto;");
    expect(styles).not.toContain(".collection-carousel,\n  .faq-topic-carousel {\n    margin-left: calc(50% - 50vw);");
    expect(styles).toContain(".collection-carousel__viewport,\n  .faq-topic-carousel__viewport {\n    padding-inline: 0;");
    expect(styles).toContain(".confidence-carousel__viewport {\n    overflow: hidden;");
    expect(styles).toContain("padding: 2px 18px 12px;");
    expect(styles).toContain("padding: 10px 18px 8px;");
    expect(styles).toContain("padding: 2px 0 12px;");
    expect(styles).toContain(".collection-carousel__slide");
    expect(styles).toContain("flex: 0 0 clamp(132px, 42vw, 168px);");
    expect(styles).toContain("grid-template-columns: repeat(2, 170px);");
    expect(styles).toContain("column-gap: var(--space-grid-gap);");
    expect(styles).toContain("justify-content: center;");
    expect(styles).toContain("row-gap: var(--space-grid-gap);");
    expect(styles).toContain("height: 245px;");
    expect(styles).toContain(".collection-product-teaser");
    expect(styles).toContain("height: 70px;");
    expect(styles).toContain(".collection-product-teaser {\n  column-gap: var(--space-grid-gap);");
    expect(styles).toContain("height: 70px;\n  justify-content: center;\n  margin-top: 6px;");
    expect(styles).toContain("linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 88%)");
    expect(styles).toContain(".collection-products__more");
    expect(styles).toContain(".collection-products__more {\n  align-self: center;");
    expect(styles).toContain("justify-content: center;\n  margin-top: 6px;");
    expect(styles).not.toContain(".carousel-progress__pill");
    expect(styles).not.toContain("grid-auto-columns: minmax(148px, 56vw);");
    expect(styles).not.toContain(".confidence-carousel__hint");
    expect(styles).toContain("scrollbar-width: none");
    expect(styles).not.toContain(".shop-more-grid");
    expect(styles).not.toContain(".weekly-set-section");
    expect(styles).toContain(".collection-section {\n    padding-bottom: var(--space-section-y-compact);");
    expect(styles).toContain(".collection-carousel {\n    margin-left: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain(".collection-products,\n  .collection-products__heading {\n    min-width: 0;");
    expect(styles).toContain(".collection-product-row,\n  .collection-product-teaser {\n    grid-template-columns: repeat(2, minmax(0, 1fr));");
    expect(styles).toContain(".collection-products__more {\n    max-width: 100%;\n    justify-self: center;\n    width: fit-content;");
    expect(styles).toContain("margin-left: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain("margin-right: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain(".review-story-row {\n  -webkit-overflow-scrolling: touch;");
    expect(styles).toContain("margin-inline: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain("overflow-x: auto;");
    expect(styles).toContain(".review-story-item {\n  align-items: center;");
    expect(styles).toContain("gap: 14px;");
    expect(styles).toContain("flex: 0 0 84px;");
    expect(styles).not.toContain(".review-story-item:focus-visible");
    expect(styles).toContain(".review-story-bubble {");
    expect(styles).toContain("background: #f5f5f7;");
    expect(styles).toContain("cursor: pointer;");
    expect(styles).toContain("height: 82px;");
    expect(styles).toContain("-webkit-tap-highlight-color: transparent;");
    expect(styles).toContain("touch-action: manipulation;");
    expect(styles).toContain("width: 82px;");
    expect(styles).toContain("border: 1px solid rgba(36, 31, 34, 0.74);");
    expect(styles).toContain(".review-story-bubble:focus-visible");
    expect(styles).toContain(".review-story-bubble:active {\n  box-shadow: none;\n  filter: none;");
    expect(styles).toContain(".review-story-viewer {");
    expect(styles).toContain("align-items: start;");
    expect(styles).toContain("position: fixed;");
    expect(styles).toContain("background: #ffffff;");
    expect(styles).toContain("--review-story-top-safe-area: calc(68px + env(safe-area-inset-top, 0px));");
    expect(styles).toContain("padding: 0;");
    expect(styles).toContain("-webkit-touch-callout: none;");
    expect(styles).toContain("-webkit-user-select: none;");
    expect(styles).toContain("user-select: none;");
    expect(styles).toContain(".review-story-viewer * {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  user-select: none;");
    expect(styles).not.toContain("body {\n  -webkit-user-select: none;");
    expect(styles).not.toContain("* {\n  -webkit-user-select: none;");
    expect(styles).not.toContain("rgba(255, 255, 255, 0.98)");
    expect(styles).not.toContain("rgba(255, 253, 250, 0.98)");
    expect(styles).not.toContain("linear-gradient(180deg, #ffffff 0%, #fffdfa 100%);");
    expect(styles).not.toContain("linear-gradient(180deg, #ffffff 0%, #fffaf7 100%);");
    expect(styles).toContain(".review-story-viewer__frame");
    expect(styles).toContain(".review-story-viewer__frame {\n  background: #ffffff;\n  border: 0;");
    expect(styles).toContain("box-shadow: none !important;");
    expect(styles).toContain("border-radius: 0;");
    expect(styles).toContain("height: 100svh;");
    expect(styles).toContain("max-width: none;");
    expect(styles).toContain("padding: 0;");
    expect(styles).toContain("position: relative;");
    expect(styles).toContain("width: 100%;");
    expect(styles).toContain(".review-story-viewer__progress");
    expect(styles).toContain("left: max(10px, env(safe-area-inset-left, 0px));");
    expect(styles).toContain("position: absolute;");
    expect(styles).toContain("right: max(10px, env(safe-area-inset-right, 0px));");
    expect(styles).toContain("top: max(10px, env(safe-area-inset-top, 0px));");
    expect(styles).toContain("grid-template-columns: repeat(10, minmax(0, 1fr));");
    expect(styles).toContain("--story-duration: 6000ms;");
    expect(styles).toContain(".review-story-viewer__progress-segment[data-state=\"complete\"]");
    expect(styles).toContain(".review-story-viewer__progress-fill");
    expect(styles).toContain("animation: review-story-progress var(--story-duration) linear forwards;");
    expect(styles).toContain("@keyframes review-story-progress");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).toContain(".review-story-viewer__tap-zone");
    expect(styles).toContain("-webkit-tap-highlight-color: transparent;");
    expect(styles).toContain("top: var(--review-story-top-safe-area);");
    expect(styles).toContain("width: 48%;");
    expect(styles).toContain(".review-story-viewer__tap-zone:active,\n.review-story-viewer__tap-zone:focus,\n.review-story-viewer__tap-zone:focus-visible");
    expect(styles).toContain(".review-story-viewer__tap-zone:active,\n.review-story-viewer__tap-zone:focus,\n.review-story-viewer__tap-zone:focus-visible {\n  background: transparent;\n  border: 0;\n  box-shadow: none;\n  outline: none;");
    expect(styles).toContain(".review-story-viewer__close");
    expect(styles).toContain(".review-story-viewer__close {");
    expect(styles).toContain("align-items: center;");
    expect(styles).toContain("appearance: none;");
    expect(styles).toContain("background: transparent;");
    expect(styles).toContain(".review-story-viewer__close:active {\n  background: transparent;\n  box-shadow: none;\n  filter: none;");
    expect(styles).toContain(".review-story-viewer__close:focus-visible {\n  outline: 2px solid rgba(23, 19, 20, 0.55);");
    expect(styles).toContain(".review-story-viewer__card {\n  align-content: center;\n  background: #ffffff;");
    expect(styles).toContain("border: 0 !important;");
    expect(styles).toContain("border-radius: 0;");
    expect(styles).not.toContain("/* Temporary story hitbox debug overlay. */");
    expect(styles).not.toContain(".story-debug-hitboxes");
    expect(styles).not.toContain("background: #fffdfc;");
    expect(styles).not.toContain("border: 1px solid rgba(23, 19, 20, 0.12);");
    expect(styles).not.toContain("border: 1px solid rgba(23, 19, 20, 0.1) !important;");
    expect(styles).not.toContain("background: rgba(10, 8, 10, 0.86);");
    expect(styles).not.toContain("background: #111111;");
    expect(styles).not.toContain("outline: 1.5px solid rgba(36, 31, 34, 0.74);");
    expect(styles).not.toContain(".review-story-viewer__tap-zone:focus-visible {\n  outline:");
    expect(styles).not.toContain(".review-story-bubble::after");
    expect(styles).not.toContain("radial-gradient(circle at 50% 38%");
    expect(styles).not.toContain("--review-card-min-height");
    expect(styles).not.toContain(".review-card--product");
    expect(styles).not.toContain(".reviewed-set {");
    expect(styles).not.toContain(".review-carousel {");
    expect(styles).not.toContain(".review-carousel__button");
    expect(styles).not.toContain(".review-card--peek {\n    display: none;");
    expect(styles).toContain("aspect-ratio: 1020 / 573;");
    expect(styles).not.toContain("min-height: 166px;");
    expect(styles).not.toContain("min-height: 158px;");
    expect(styles).toContain("position: absolute;");
    expect(styles).toContain("--type-section-title: 1.8rem;");
    expect(styles).toContain("padding: var(--space-section-y-tight) 0 var(--space-section-y-compact);");
  });

  it("does not force tiny mobile viewports wider than the screen", () => {
    expect(styles).not.toContain("min-width: 320px");
    expect(styles).toContain("min-width: 0");
    expect(styles).toContain("overflow-x: hidden;");
    expect(styles).toContain(".site-footer {\n    padding: var(--space-footer-y) var(--space-page-inline) var(--space-section-y-compact);");
  });

  it("keeps the bare-bones mobile hero copy compact for structure review", () => {
    expect(styles).toContain("--barebones-mobile-header-offset: 45px;");
    expect(styles).toContain("--barebones-hero-section-height: 635px;");
    expect(styles).toContain("--barebones-hero-copy-top: 23px;");
    expect(styles).toContain("--barebones-hero-copy-inline: 29px;");
    expect(styles).toContain("--barebones-hero-copy-bottom: 1px;");
    expect(styles).toContain("--barebones-hero-copy-height: 263.36px;");
    expect(styles).toContain("@media (max-width: 720px) {");
    expect(styles).toContain(".storefront-barebones .hero-copy {\n    height: var(--barebones-hero-copy-height);");
    expect(styles).toContain(
      "padding: var(--barebones-hero-copy-top) var(--barebones-hero-copy-inline) var(--barebones-hero-copy-bottom);"
    );
    expect(styles).toContain("height: var(--barebones-hero-copy-height);");
    expect(styles).toContain(".storefront-barebones .hero-section {\n    height: var(--barebones-hero-section-height);");
    expect(styles).toContain("padding-top: var(--barebones-mobile-header-offset);");
    expect(styles).toContain(".hero-photo--asset-preserved::before");
    expect(styles).toContain("border-color: transparent !important;");
  });

  it("sizes the bare-bones How It Works heading from mobile review tokens", () => {
    expect(styles).toContain("--barebones-confidence-heading-height: 85.06px;");
    expect(styles).toContain("--barebones-confidence-eyebrow-height: 20.48px;");
    expect(styles).toContain("--barebones-confidence-eyebrow-offset: -3px;");
    expect(styles).toContain(".storefront-barebones .confidence-section__heading {\n    height: var(--barebones-confidence-heading-height);");
    expect(styles).toContain(".storefront-barebones .confidence-section__heading .eyebrow");
    expect(styles).toContain("height: var(--barebones-confidence-eyebrow-height);");
    expect(styles).toContain("line-height: var(--barebones-confidence-eyebrow-height);");
    expect(styles).toContain("transform: translateY(var(--barebones-confidence-eyebrow-offset));");
  });

  it("keeps bare-bones header action buttons white without circular outlines", () => {
    expect(styles).toContain("--barebones-mobile-brand-size: 25px;");
    expect(styles).toContain(".site-shell--barebones .brand-mark {\n    font-size: var(--barebones-mobile-brand-size);");
    expect(styles).toContain(".site-shell--barebones .brand-header {\n  border-color: transparent !important;");
    expect(styles).toContain(".site-shell--barebones .brand-header__icon-button");
    expect(styles).toContain("background: #ffffff !important;");
    expect(styles).toContain("border-color: transparent !important;");
    expect(styles).toContain("color: #000000 !important;");
    expect(styles).toContain(
      ".site-shell--barebones .brand-header__icon-button svg,\n.site-shell--barebones .brand-header__icon-button svg *"
    );
    expect(styles).toContain("stroke: #000000 !important;");
    expect(styles).toContain(".storefront-barebones .kit-primary-link,\n.storefront-barebones .kit-primary-link span");
    expect(styles).toContain("color: #ffffff !important;");
  });

  it("keeps the What’s Included kit image frameless and visually larger", () => {
    expect(styles).toContain(".kit-spread {\n  align-items: center;");
    expect(styles).toContain("aspect-ratio: 1020 / 573;");
    expect(styles).toContain("border: 0;");
    expect(styles).toContain("padding: 0;");
    expect(styles).toContain(".kit-spread__image");
    expect(styles).toContain("object-fit: contain;");
    expect(styles).not.toContain("object-fit: cover;");
    expect(styles).not.toContain(".collection-card__mood,\n.kit-spread,\n.review-product__art");
  });

  it("keeps the FAQ Help section black and white", () => {
    const faqStart = styles.indexOf(".faq-help {");
    const footerStart = styles.indexOf(".site-shell .site-footer", faqStart);
    const faqStyles = styles.slice(faqStart, footerStart);

    expect(faqStyles).toContain("place-items: center;");
    expect(faqStyles).toContain("font-family: var(--font-display);");
    expect(faqStyles).toContain("font-variation-settings: \"opsz\" 144, \"SOFT\" 72, \"WONK\" 0;");
    expect(faqStyles).toContain("font-size: var(--type-section-title);");
    expect(faqStyles).toContain(".faq-help__intro {\n  border-color: transparent;");
    expect(faqStyles).toContain(".faq-topic-carousel");
    expect(faqStyles).toContain(".faq-topic-grid {\n  display: flex;");
    expect(faqStyles).toContain("margin-inline: calc(-1 * var(--space-page-inline));");
    expect(faqStyles).toContain(".faq-topic-carousel__viewport");
    expect(faqStyles).toContain("padding-inline: var(--space-page-inline);");
    expect(faqStyles).toContain("padding: 4px 0 6px;");
    expect(faqStyles).toContain("touch-action: pan-y pinch-zoom;");
    expect(faqStyles).toContain("flex: 0 0 clamp(138px, 38vw, 166px);");
    expect(faqStyles).not.toContain(".faq-topic-carousel__dots");
    expect(faqStyles).toContain(".faq-topic-card--active {\n  background: #f5f5f5;");
    expect(faqStyles).not.toContain(".faq-topic-card svg");
    expect(faqStyles).not.toContain(".faq-cta-card__button--filled {\n  background: #000000;");
    expect(faqStyles).toContain(".faq-support-footer");
    expect(faqStyles).toContain(".faq-support-footer__button");
    expect(faqStyles).toContain("border: 1px solid #000000;");
    expect(faqStyles).toContain(".faq-support-footer__contact");
    expect(faqStyles).toContain("border-radius: 8px;");
    expect(faqStyles).toContain("min-height: 54px;");
    expect(styles).toContain("flex-basis: clamp(132px, 39vw, 158px);");
    expect(styles).toContain("min-height: 50px;");
    expect(faqStyles).toContain("min-height: 46px;");
    expect(faqStyles).toContain("border-left: 0 !important;");
    expect(faqStyles).toContain("border-right: 0 !important;");
    expect(faqStyles).toContain("text-decoration: none;");
    expect(faqStyles).not.toMatch(/#(?:df7f91|e58a9b|dc5875|d94e73|fff7f8|fff5f6|fff0f1|fff6f7|f9d5d8)/i);
  });

  it("keeps the Shop All filter apply button readable in bare-bones mode", () => {
    expect(styles).toContain(".shop-filter-panel__apply");
    expect(styles).toContain(".storefront-barebones .shop-filter-panel__apply");
    expect(styles).toContain("background: #000000 !important;");
    expect(styles).toContain("color: #ffffff !important;");
    expect(styles).toContain("-webkit-tap-highlight-color: transparent;");
  });

  it("makes the Shop All collection tab rail feel like a real horizontal control", () => {
    const railStart = styles.indexOf(".shop-tab-rail {");
    const railEnd = styles.indexOf(".shop-tab-rail::-webkit-scrollbar", railStart);
    const railStyles = styles.slice(railStart, railEnd);

    expect(railStyles).toContain("-webkit-overflow-scrolling: touch;");
    expect(railStyles).toContain("overscroll-behavior-inline: contain;");
    expect(railStyles).toContain("touch-action: pan-x pan-y;");
    expect(styles).toContain(".shop-tab-rail--dragging");
  });

  it("presents the Shop All sort as a real button with an option panel", () => {
    const controlsStart = styles.indexOf(".shop-controls {");
    const controlsEnd = styles.indexOf(".shop-filter-toggle,", controlsStart);
    const controlsStyles = styles.slice(controlsStart, controlsEnd);
    const sortButtonStart = styles.indexOf(".shop-sort-button {");
    const sortButtonEnd = styles.indexOf(".shop-sort-button__label", sortButtonStart);
    const sortButtonStyles = styles.slice(sortButtonStart, sortButtonEnd);

    expect(controlsStyles).toContain("display: grid;");
    expect(controlsStyles).toContain("grid-template-columns: minmax(86px, auto) minmax(0, 1fr);");
    expect(sortButtonStyles).toContain("border: 1px solid #000000;");
    expect(sortButtonStyles).toContain("display: grid;");
    expect(sortButtonStyles).toContain("min-height: 42px;");
    expect(styles).toContain(".shop-sort-panel");
    expect(styles).toContain(".shop-sort-option[aria-checked=\"true\"]");
    expect(styles).toContain(".shop-sort-option:hover,\n.shop-sort-option:focus-visible,\n.shop-sort-option[aria-checked=\"true\"]");
    expect(styles).toContain("color: #ffffff !important;");
    expect(styles).not.toContain(".shop-sort select");
  });

  it("keeps the approved footer mobile-first and softly separated", () => {
    expect(styles).toContain(".site-shell .site-footer,\n.site-shell--barebones .site-footer {");
    expect(styles).toContain("--footer-blush: #f5f5f7;");
    expect(styles).toContain("background-image: linear-gradient(180deg, #ffffff 0%, #fff9f7 100%) !important;");
    expect(styles).toContain(".site-footer-email--restored");
    expect(styles).toContain(".site-footer-email--restored .site-footer-email__form");
    expect(styles).toContain(".site-footer__shop-link");
    expect(styles).toContain(".site-footer__shop-nav {\n    margin-inline: calc(var(--space-footer-inline) * -1);");
    expect(styles).toContain("border-radius: 0 !important;");
    expect(styles).toContain("min-height: 49px;");
    expect(styles).toContain(".site-footer__policy-bar");
    expect(styles).toContain("grid-template-columns: repeat(4, minmax(0, 1fr));");
    expect(styles).toContain(".site-footer__social-links");
    expect(styles).toContain(".site-footer__love-note");
    expect(styles).toContain(".site-footer__copyright");
  });

  it("keeps removed footer trust-strip CSS out of the current footer", () => {
    expect(styles).not.toContain(".site-footer__trust-strip");
    expect(styles).not.toContain(".site-footer__trust-item");
    expect(styles).not.toContain(".footer-email-capture");
    expect(styles).not.toContain(".cohesive-footer-preview");
  });

  it("includes compact mobile header rules that hide the desktop nav", () => {
    expect(styles).toContain(".brand-header__mobile-actions");
    expect(styles).toContain(".brand-header__desktop-nav");
    expect(styles).toContain(".brand-header__mobile-menu");
    expect(styles).toContain("@media (max-width: 720px)");
    expect(styles).toContain(".brand-header__desktop-nav {\n    display: none;");
    expect(styles).toContain(".brand-header__mobile-actions {\n    display: contents;");
    expect(styles).toContain(".brand-header__mobile-menu {\n    display: grid;");
  });

  it("keeps the open mobile menu close button aligned to the right edge", () => {
    expect(styles).toContain(".brand-header--menu-open .brand-header__mobile-actions {");
    expect(styles).toContain("right: 8px;");
    expect(styles).toContain(
      ".brand-header--menu-open .brand-header__mobile-actions .brand-header__icon-button:last-child {\n    display: none;"
    );
  });
});
