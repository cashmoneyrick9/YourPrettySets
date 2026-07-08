import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf-8");
const indexHtml = readFileSync("index.html", "utf-8");
const expectedTypeRoles = [
  "--type-hero-title",
  "--type-section-title",
  "--type-subsection-title",
  "--type-product-title",
  "--type-body",
  "--type-caption",
  "--type-button",
  "--type-display-special"
];

function getDefinedTypeRoles(css: string) {
  return Array.from(new Set(Array.from(css.matchAll(/(--type-[\w-]+)\s*:/g), ([, token]) => token))).sort();
}

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

function getRuleBody(css: string, selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^{}]*)\\}`));

  return match?.[1] ?? "";
}

function getRuleBodies(css: string, selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return Array.from(
    css.matchAll(new RegExp(`(?:^|\\n)\\s*${escapedSelector}\\s*\\{([^{}]*)\\}`, "g")),
    ([, body]) => body
  );
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
    expect(styles).toContain("--type-product-title:");
    expect(styles).toContain("--type-body:");
    expect(styles).toContain("--type-caption:");
    expect(styles).toContain("--type-button:");
    expect(styles).toContain("--type-display-special:");
    expect(getDefinedTypeRoles(styles)).toEqual([...expectedTypeRoles].sort());
    expect(styles).not.toContain("--type-card-title:");
    expect(styles).not.toContain("--type-body-large:");
    expect(styles).not.toContain("--type-nav:");
    expect(styles).not.toContain("--type-footer-title:");
    expect(styles).not.toContain("--type-review-quote:");
    expect(styles).toContain("--weight-display:");
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

  it("tightens the mobile hero-to-Collections handoff without changing the hero fade", () => {
    const mobileRules = styles.slice(
      styles.indexOf("@media (max-width: 720px)"),
      styles.indexOf("@media (max-width: 360px)")
    );

    expect(mobileRules).toContain(".hero-section::after {");
    expect(mobileRules).toContain("height: 105px;");
    expect(mobileRules).toContain(".collection-section {\n    padding-top: 16px;\n  }");
    expect(mobileRules).not.toContain("margin-top: -");
  });

  it("maps homepage headings, buttons, and nav to typography roles", () => {
    expect(styles).toContain("font-family: var(--font-body);");
    expect(styles).toContain("font-family: var(--font-display);");
    expect(styles).toContain(".brand-header,\n.brand-header button,\n.brand-header a {");
    expect(styles).toContain(".hero-copy h1 {\n  color: inherit;\n  font-family: var(--font-display);");
    expect(styles).toContain(".hero-copy__accent {\n  color: #eab6b4;");
    expect(styles).toContain("font-size: var(--type-hero-title);");
    expect(styles).toContain(".section-heading h2 {\n  color: var(--site-text-primary);\n  font-family: var(--font-display);");
    expect(styles).toContain("font-size: var(--type-section-title);");
    expect(styles).toContain(".kit-heading h2 {\n  color: var(--site-text-primary);\n  font-family: var(--font-display);");
    expect(styles).toContain(".site-footer-email--restored .site-footer-email__title");
    expect(styles).toContain(".site-footer-email--restored .site-footer-email__button");
    expect(styles).toContain(".site-footer__column-title");
    expect(styles).toContain(".site-footer__text-link");
    expect(styles).toContain(".brand-header__desktop-nav a {\n  color: var(--site-text-muted);\n  font-size: var(--type-button);");
    expect(styles).toContain("--mobile-menu-active-type: clamp(1.85rem, 10.8vw, 3.2rem);");
    expect(styles).toContain("--mobile-menu-link-type: clamp(1.34rem, 6vw, 2.05rem);");
    expect(styles).toContain(".brand-header__mobile-submenu-link {\n  color: var(--site-text-primary);\n  font-family: var(--font-display);");
    expect(styles).toContain(".review-story-viewer__card blockquote {\n  color: var(--site-text-primary);\n  font-family: var(--font-display);\n  font-size: var(--type-display-special);");
    expect(styles).toContain(".site-footer__brand {\n  color: var(--footer-ink);\n  font-family: var(--font-display);\n  font-size: var(--type-display-special);");
    expect(styles).toContain("font-family: var(--font-cta);");
    expect(styles).not.toContain("font-family: Georgia, \"Times New Roman\", serif;");
  });

  it("keeps the lower footer panel square against the viewport edges", () => {
    const footerRule = getRuleBody(styles, ".site-shell .site-footer");

    expect(footerRule).toContain("--footer-ink: #ffffff;");
    expect(footerRule).toContain("--footer-accent: #ffffff;");
    expect(footerRule).toContain("--footer-line: rgba(255, 255, 255, 0.26);");
    expect(footerRule).toContain("background: #101417;");
    expect(footerRule).toContain("border-radius: 0;");
    expect(footerRule).toContain("color: var(--footer-ink);");
    expect(footerRule).toContain("overflow: hidden;");
    expect(footerRule).toContain("padding: clamp(62px, 10vw, 104px) 0 max(42px, env(safe-area-inset-bottom, 0px));");
  });

  it("backs the email card bottom corners with the footer panel color", () => {
    const shellRule = getRuleBody(styles, ".site-footer-email-shell");
    const shellBackingRule = getRuleBody(styles, ".site-footer-email-shell::after");
    const shellInnerRule = getRuleBody(styles, ".site-footer-email-shell > .site-footer__inner");

    expect(shellRule).toContain("background: var(--site-surface);");
    expect(shellRule).toContain("position: relative;");
    expect(shellBackingRule).toContain("background: #101417;");
    expect(shellBackingRule).toContain("bottom: 0;");
    expect(shellBackingRule).toContain("height: clamp(24px, 5vw, 36px);");
    expect(shellInnerRule).toContain("position: relative;");
    expect(shellInnerRule).toContain("z-index: 1;");
  });

  it("keeps leftover homepage typography debt bounded and removes dead text selectors", () => {
    expect(countOneOffTypographyRules(styles)).toBeLessThanOrEqual(40);
    expect(styles).toContain(".kit-detail-panel__copy h3 {\n  font-size: var(--type-body);");
    expect(styles).not.toContain(".confidence-card__copy h3");
    expect(styles).toContain(".kit-detail-tab span:last-child {\n  font-size: var(--type-caption);");
    expect(styles).toContain(".review-story-label {\n  color: var(--site-text-primary);\n  font-size: var(--type-caption);");
    expect(styles).toContain(".site-footer__love-note {\n  color: var(--footer-accent);\n  font-family: var(--font-display);\n  font-size: var(--type-body);");
    expect(styles).toContain(".site-footer__copyright p {\n  color: var(--footer-muted);\n  font-size: var(--type-caption);");
    expect(styles).toContain(".shop-empty-state button {\n  appearance: none;\n  background: var(--shop-ink);");
    expect(styles).toContain(".shop-empty-state button {\n  appearance: none;\n  background: var(--shop-ink);\n  border: 1px solid var(--shop-ink);\n  border-radius: 8px;\n  color: #ffffff;\n  cursor: pointer;\n  font: inherit;\n  font-size: var(--type-button);");
    expect(styles).toContain(".shop-sort-option {\n  appearance: none;\n  background: transparent;\n  border: 0;\n  border-radius: 6px;\n  color: var(--shop-ink);\n  cursor: pointer;\n  font: inherit;\n  font-size: var(--type-button);");
    expect(styles).not.toContain("font-size: 0.66rem;");
    expect(styles).not.toContain("font-size: 0.68rem;");
    expect(styles).not.toContain("var(--type-card-title)");
    expect(styles).not.toContain("var(--type-body-large)");
    expect(styles).not.toContain("var(--type-nav)");
    expect(styles).not.toContain(".collection-card__mood");
    expect(styles).not.toContain(".collection-card__title");
    expect(styles).not.toContain(".collection-card__description");
    expect(styles).not.toContain(".collection-card__cta");
    expect(styles).not.toContain(".collection-card span");
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
    expect(styles).toContain("background: rgba(255, 255, 255, 0.98);");
    expect(styles).not.toContain("rgba(221, 104, 133, 0.36) 0%");
    expect(styles).not.toContain("padding-top: max(14px, env(safe-area-inset-top))");
    expect(styles).toContain("body.header-scrolled::before");
    expect(styles).toContain(".brand-header--at-top,\n  .brand-header--scrolled");
    expect(styles).toContain("border-radius: 0;");
    expect(styles).toContain("padding-top: var(--mobile-header-offset);");
    expect(styles).toContain("--mobile-header-offset: calc(45px + env(safe-area-inset-top, 0px));");
  });

  it("keeps product page back control spacing compact on mobile", () => {
    expect(styles).toContain(".product-page {\n  background: var(--site-surface-raised);\n  color: var(--site-text-primary);\n  min-height: 100vh;\n  padding: 66px var(--space-page-inline) 0;");
    expect(styles).toContain(".product-page__inner {\n  display: grid;\n  gap: 13px;");
    expect(styles).toContain(".product-page .faq-help-section {\n  margin-inline: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain("padding-bottom: 0;");
    expect(styles).toContain(".product-page .kit-section {\n  margin-top: 18px;");
    expect(styles).toContain(".product-page + .site-footer-email-shell {\n  padding-top: 0;");
  });

  it("includes the locked S3 header and hero visual rules", () => {
    expect(styles).toContain("--color-sage-accent");
    expect(styles).toContain("--color-sage-accent: var(--site-accent);");
    expect(styles).toContain("--font-cta:");
    expect(styles).toContain("--hero-overlay-bottom");
    expect(styles).toContain("--hero-button-offset: 4px;");
    expect(styles).toContain("--hero-copy-gap: 20px;");
    expect(styles).toContain("--hero-copy-top: clamp(24px, 3.5vh, 42px);");
    expect(styles).toContain("--hero-mobile-min-height: clamp(520px, 68vh, 640px);");
    expect(styles).toContain(".brand-header--at-top");
    expect(styles).toContain(".brand-header--scrolled");
    expect(styles).toContain("border-radius: 8px;");
    expect(styles).toContain("position: fixed;");
    expect(styles).toContain("backdrop-filter: blur(14px);");
    expect(styles).toContain(".hero-photo {\n  aspect-ratio: 9 / 14;\n  background-color: var(--site-page-bg);\n  background-image: none;");
    expect(styles).toContain(".hero-photo__hand {\n  display: none;");
    expect(styles).toContain(".hero-section::after");
    expect(styles).toContain("min-height: var(--hero-mobile-min-height)");
    expect(styles).toContain("min-height: var(--hero-mobile-min-height, clamp(520px, 68vh, 640px))");
    expect(styles).toContain("scroll-padding-top: 84px");
    expect(styles).toContain("justify-self: center");
    expect(styles).toContain(".brand-header .brand-mark {\n    font-size: 24.92px;");
    expect(styles).toContain(".brand-header .brand-mark {\n    font-size: 21px;\n  }");
    expect(styles).toContain("max-height: min(650px, calc(94vh - 108px))");
    expect(styles).toContain("width: min(100%, 520px)");
    expect(styles).not.toContain(".hero-copy h1::after");
    expect(styles).not.toContain("86px 1px");
    expect(styles).toContain(".hero-section {\n  background: var(--site-page-bg);\n  display: grid;");
    expect(styles).toContain("padding: 0;");
    expect(styles).toContain("border-radius: 0;");
    expect(styles).toContain("grid-template-columns: 40px minmax(0, 1fr) 40px;");
    expect(styles).toContain("grid-column: 2;");
    expect(styles).toContain("font-size: 21px;");
    expect(styles).toContain("font-family: var(--font-cta);");
    expect(styles).toContain(".brand-header--scrolled .brand-header__icon-button");
    expect(styles).toContain("background: var(--site-surface);");
    expect(styles).toContain("bottom: -1px;");
    expect(styles).toContain("height: clamp(180px, 32vh, 220px);");
    expect(styles).toContain("left: 0;");
    expect(styles).toContain("right: 0;");
    expect(styles).toContain("border-radius: 0;");
    expect(styles).not.toContain(".hero-section::after,\n  .hero-copy,\n  .hero-photo");
    expect(styles).toContain("@media (max-width: 720px)");
    expect(styles).toContain("height: 105px;");
    expect(styles).toContain("rgba(255, 255, 255, 0.04) 18%");
    expect(styles).toContain("rgba(255, 255, 255, 0.14) 35%");
    expect(styles).toContain("rgba(255, 255, 255, 0.34) 55%");
    expect(styles).toContain("rgba(255, 255, 255, 0.68) 78%");
    expect(styles).toContain("var(--site-page-bg) 100%");
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
    expect(styles).toContain(".confidence-section {\n  background: var(--site-page-bg);");
    expect(styles).toContain("margin-top: 0;");
    expect(styles).toContain("padding: var(--space-section-y-tight) 0 var(--space-section-y-compact);");
    expect(styles).not.toContain("margin-top: clamp(-32px, -5vw, -18px)");
    expect(styles).not.toContain("margin-top: -22px");
    expect(styles).not.toContain("margin-top: -18px");
    expect(styles).toContain("--hero-overlay-bottom: var(--site-page-bg);");
    expect(styles).not.toContain("rgba(255, 250, 248, 0.44) 84%");
    expect(styles).not.toContain(".confidence-section::before");
    expect(styles).not.toContain(".confidence-section::after");
    expect(styles).not.toContain("top: clamp(-52px, -7vw, -34px)");
    expect(styles).not.toContain("height: clamp(82px, 12vw, 120px)");
    expect(styles).not.toContain("linear-gradient(180deg, #fbf6ee 0%, #fbf6ee 34%, #f7f0e6 100%)");
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
    expect(styles).toContain("rgba(255, 255, 255, 0.75) 55%");
    expect(styles).toContain("box-shadow: var(--site-shadow-subtle);");
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
    expect(styles).toContain("min-height: 172px;");
    expect(styles).toContain("min-height: 170px;");
    expect(styles).not.toContain(".confidence-card__visual");
    expect(styles).not.toContain(".confidence-card__visual--wear");
    expect(styles).not.toContain(".confidence-card__visual--hand");
    expect(styles).not.toContain(".confidence-card__visual-frame");
    expect(styles).not.toContain(".confidence-card__tray");
    expect(styles).not.toContain(".confidence-card__glue");
    expect(styles).not.toContain(".confidence-card__hand");
    expect(styles).not.toContain(".confidence-card__copy");
    expect(styles).not.toContain(".confidence-card__body");
    expect(styles).toContain(".confidence-card__number");
    expect(styles).toContain(".confidence-card {\n  align-content: center;");
    expect(styles).toContain(".confidence-card__number {\n  align-items: center;\n  background: transparent;\n  border-radius: 0;\n  color: var(--site-text-primary);");
    expect(styles).toContain("justify-self: center;");
    expect(styles).toContain("align-self: center;");
    expect(styles).not.toContain(".confidence-card__number {\n  align-items: center;\n  background: var(--site-text-primary);");
    expect(styles).not.toContain("height: 34px;\n  justify-content: center;\n  width: 34px;");
    expect(styles).not.toContain(".confidence-progress");
    expect(styles).not.toContain(".confidence-dots");
    expect(styles).toContain(".collection-carousel__hint");
    expect(styles).toContain(".collection-products");
    expect(styles).toContain(".collection-product-row");
    expect(styles).toContain(".collection-card__image");
    expect(styles).toContain(".collection-card__label");
    expect(styles).toContain(".collection-card[aria-pressed=\"true\"] {\n  box-shadow: var(--site-shadow-soft);");
    expect(styles).not.toContain(".collection-card[aria-pressed=\"true\"] {\n  background: var(--site-text-primary);");
    expect(styles).toContain("margin-inline: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain("max-width: none;");
    expect(styles).toContain(".collection-carousel__viewport");
    expect(styles).toContain("padding-inline: 18px;");
    expect(styles).toContain(".collection-carousel {\n    margin-left: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain("width: auto;");
    expect(styles).not.toContain(".collection-carousel,\n  .faq-topic-carousel {\n    margin-left: calc(50% - 50vw);");
    expect(styles).toContain(".collection-carousel__viewport {\n    padding-inline: 0;");
    expect(styles).toContain(".confidence-carousel__viewport {\n    overflow: hidden;");
    expect(styles).toContain("padding: 2px 18px 12px;");
    expect(styles).toContain("padding: 2px 0 12px;");
    expect(styles).toContain(".collection-carousel__slide");
    expect(styles).toContain("flex: 0 0 clamp(132px, 42vw, 168px);");
    expect(styles).toContain("grid-template-columns: repeat(2, 170px);");
    expect(styles).toContain("column-gap: var(--space-grid-gap);");
    expect(styles).toContain("justify-content: center;");
    expect(styles).toContain("row-gap: var(--space-grid-gap);");
    expect(styles).toContain(".product-preview-card");
    expect(styles).toContain(".collection-product-card__image");
    expect(styles).toContain("aspect-ratio: 4 / 5;");
    expect(styles).toContain(".collection-product-card__body");
    expect(styles).toContain("min-height: 245px;");
    expect(styles).not.toContain(".collection-product-card__blank");
    expect(styles).toContain(".collection-product-teaser");
    expect(styles).toContain("height: 96px;");
    expect(styles).toContain(".collection-product-teaser::after");
    expect(styles).toContain(
      "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 38%, var(--site-page-bg) 100%)"
    );
    expect(styles).toContain(".collection-products__more");
    expect(styles).toContain(".collection-products__more {\n  align-self: center;");
    expect(styles).toContain("justify-content: center;\n  margin-top: 6px;");
    expect(styles).toContain(".featured-sets-section");
    expect(styles).toContain(".featured-sets-carousel");
    expect(styles).toContain(".featured-set-card");
    expect(styles).toContain(".featured-sets-carousel .featured-sets-carousel__slide");
    expect(styles).toContain(".featured-set-card .product-preview-card__image");
    expect(styles).toContain(".featured-set-card .product-preview-card__body");
    expect(styles).toContain(".featured-set-card p");
    expect(styles).toContain("font-size: var(--type-body);");
    expect(styles).not.toContain(".featured-set-card__image");
    expect(styles).not.toContain(".featured-set-card__body");
    expect(styles).not.toContain(".carousel-progress__pill");
    expect(styles).not.toContain("grid-auto-columns: minmax(148px, 56vw);");
    expect(styles).not.toContain(".confidence-carousel__hint");
    expect(styles).toContain("scrollbar-width: none");
    expect(styles).not.toContain(".shop-more-grid");
    expect(styles).not.toContain(".weekly-set-section");
    expect(styles).toContain(".collection-section {\n    padding-bottom: var(--space-section-y-compact);");
    expect(styles).toContain("padding-top: 16px;");
    expect(styles).toContain(".collection-carousel {\n    margin-left: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain(".collection-products,\n  .collection-products__heading {\n    min-width: 0;");
    expect(styles).toContain(".collection-product-row,\n  .collection-product-teaser {\n    grid-template-columns: repeat(2, minmax(0, 1fr));");
    expect(styles).toContain(".collection-products__more {\n    max-width: 100%;\n    justify-self: center;\n    width: fit-content;");
    expect(styles).toContain("margin-left: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain("margin-right: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain(".reviews-polaroid-carousel .reviews-polaroid-carousel__slide");
    expect(styles).toContain(".reviews-polaroid-carousel__viewport {\n  min-width: 0;\n  overflow: visible;");
    expect(styles).toContain("width: 100%;");
    expect(styles).toContain(".reviews-polaroid-carousel .reviews-polaroid-carousel__track");
    expect(styles).toContain("margin-left: calc(-1 * var(--review-polaroid-gap));");
    expect(styles).toContain("background: #d9dde0;");
    expect(styles).toContain("aspect-ratio: 4 / 5;");
    expect(styles).toContain(".review-polaroid-card__body");
    expect(styles).toContain("text-align: center;");
    expect(styles).toContain("box-shadow: var(--site-shadow-soft);");
    expect(styles).toContain("border-radius: 8px;");
    expect(styles).not.toContain("--review-polaroid-photo-bg: linear-gradient");
    expect(styles).not.toContain(".review-polaroid-card__photo span");
    expect(styles).toContain("transform: rotate(var(--review-polaroid-rotation, 0deg));");
    expect(styles).toContain("--review-polaroid-width: clamp(154px, 44vw, 170px);");
    expect(styles).toContain("--review-polaroid-width: clamp(140px, 45vw, 154px);");
    expect(styles).toContain(".review-polaroid-card {\n    min-height: 245px;");
    expect(styles).toContain(".review-story-row {\n  -webkit-overflow-scrolling: touch;");
    expect(styles).toContain("margin-inline: calc(-1 * var(--space-page-inline));");
    expect(styles).toContain("overflow-x: auto;");
    expect(styles).toContain(".review-story-item {\n  align-items: center;");
    expect(styles).toContain("gap: 14px;");
    expect(styles).toContain("flex: 0 0 84px;");
    expect(styles).not.toContain(".review-story-item:focus-visible");
    expect(styles).toContain(".review-story-bubble {");
    expect(styles).toContain("background: var(--site-surface-soft);");
    expect(styles).toContain("cursor: pointer;");
    expect(styles).toContain("height: 82px;");
    expect(styles).toContain("-webkit-tap-highlight-color: transparent;");
    expect(styles).toContain("touch-action: manipulation;");
    expect(styles).toContain("width: 82px;");
    expect(styles).toContain("border: 1px solid var(--site-border-strong);");
    expect(styles).toContain(".review-story-bubble:focus-visible");
    expect(styles).toContain(".review-story-bubble:active {\n  box-shadow: none;\n  filter: none;");
    expect(styles).toContain(".review-story-viewer {");
    expect(styles).toContain("align-items: start;");
    expect(styles).toContain("position: fixed;");
    expect(styles).toContain("background: var(--site-surface);");
    expect(styles).toContain("--review-story-top-safe-area: calc(68px + env(safe-area-inset-top, 0px));");
    expect(styles).toContain("padding: 0;");
    expect(styles).toContain("-webkit-touch-callout: none;");
    expect(styles).toContain("-webkit-user-select: none;");
    expect(styles).toContain("user-select: none;");
    expect(styles).toContain(".review-story-viewer * {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  user-select: none;");
    expect(styles).not.toContain("body {\n  -webkit-user-select: none;");
    expect(styles).not.toContain("* {\n  -webkit-user-select: none;");
    expect(styles).not.toContain("rgba(255, 253, 250, 0.98)");
    expect(styles).not.toContain("linear-gradient(180deg, #ffffff 0%, #fffdfa 100%);");
    expect(styles).not.toContain("linear-gradient(180deg, #ffffff 0%, #fffaf7 100%);");
    expect(styles).toContain(".review-story-viewer__frame");
    expect(styles).toContain(".review-story-viewer__frame {\n  background: var(--site-surface);\n  border: 0;");
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
    expect(styles).toContain(".review-story-viewer__close:focus-visible {\n  outline: 2px solid color-mix(in srgb, var(--site-accent) 42%, transparent);");
    expect(styles).toContain(".review-story-viewer__card {\n  align-content: center;\n  background: var(--site-surface);");
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

  it("retires bare-bones mode in favor of shared visual tokens", () => {
    expect(styles).toContain("--site-page-bg: #ffffff;");
    expect(styles).toContain("--site-surface: #ffffff;");
    expect(styles).toContain("--site-surface-soft: #eef1f2;");
    expect(styles).toContain("--site-text-primary: #1f2428;");
    expect(styles).toContain("--site-text-muted: #667078;");
    expect(styles).toContain("--site-border: rgba(31, 36, 40, 0.14);");
    expect(styles).toContain("--site-border-strong: rgba(31, 36, 40, 0.32);");
    expect(styles).toContain("--site-accent: #5d6f7a;");
    expect(styles).toContain("--site-shadow-subtle: 0 12px 28px rgba(31, 36, 40, 0.08);");
    expect(styles).toContain("--site-shadow-soft: 0 8px 22px rgba(31, 36, 40, 0.045);");
    expect(styles).not.toContain("#fbf7f4");
    expect(styles).not.toContain("#f6efeb");
    expect(styles).not.toContain("#8f3f61");
    expect(styles).not.toContain("rgba(72, 52, 58");
    expect(styles).not.toContain("rgba(36, 31, 34");
    expect(styles).not.toContain("Temporary bare-bones review mode");
    expect(styles).not.toContain("--barebones-");
    expect(styles).not.toContain(".storefront-barebones");
    expect(styles).not.toContain(".site-shell--barebones");
  });

  it("keeps the mobile hero copy lifted into the upper image area", () => {
    expect(styles).toContain("--hero-copy-top: clamp(24px, 3.5vh, 42px);");
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

  it("keeps the FAQ Help section aligned to the shared neutral system", () => {
    const faqStart = styles.indexOf(".faq-help {");
    const footerStart = styles.indexOf(".site-shell .site-footer", faqStart);
    const faqStyles = styles.slice(faqStart, footerStart);

    expect(styles).toContain("padding-bottom: clamp(32px, 7vw, 56px);");
    expect(faqStyles).toContain("font-family: var(--font-display);");
    expect(faqStyles).toContain("font-variation-settings: \"opsz\" 144, \"SOFT\" 72, \"WONK\" 0;");
    expect(faqStyles).toContain("font-size: var(--type-subsection-title);");
    expect(faqStyles).toContain("margin-top: 0;");
    expect(faqStyles).not.toContain("margin-top: clamp(20px, 5vw, 34px);");
    expect(faqStyles).toContain(".faq-card {\n  background: transparent;");
    expect(faqStyles).toContain("border-radius: 0;");
    expect(faqStyles).toContain("border-top: 0;");
    expect(faqStyles).not.toContain("border-top: 1px solid var(--site-border-strong);");
    expect(faqStyles).toContain("box-shadow: none;");
    expect(faqStyles).toContain(".faq-image-header {\n  align-content: center;");
    expect(faqStyles).toContain("border-radius: 0;");
    expect(faqStyles).toContain("justify-items: center;");
    expect(faqStyles).toContain("margin-inline: calc(-1 * var(--space-page-inline));");
    expect(faqStyles).toContain("max-width: 1040px;");
    expect(faqStyles).toContain("min-height: clamp(190px, 34vw, 260px);");
    expect(faqStyles).toContain("padding: clamp(28px, 5vw, 44px) clamp(18px, 4vw, 26px);");
    expect(faqStyles).toContain("text-align: center;");
    expect(faqStyles).toContain(".faq-card__copy {\n  display: grid;\n  gap: 6px;\n  justify-items: center;");
    expect(faqStyles).toContain(".faq-card__copy p {\n  color: rgba(255, 255, 255, 0.82);\n  font-size: var(--type-body);");
    expect(faqStyles).not.toContain("font-size: clamp(1.45rem, 5vw, 2.05rem);");
    expect(faqStyles).not.toContain("font-size: clamp(0.88rem, 2vw, 0.95rem);");
    expect(faqStyles).toContain('url("/assets/hero-s3-summer.png")');
    expect(faqStyles).toContain("linear-gradient(90deg, rgba(16, 24, 32, 0.84)");
    expect(faqStyles).toContain(".faq-card__actions");
    expect(faqStyles).toContain("justify-content: center;");
    expect(faqStyles).toContain(".faq-card__primary-link");
    expect(faqStyles).toContain(".faq-card__secondary-link");
    expect(faqStyles).not.toContain(".faq-topic-carousel");
    expect(faqStyles).not.toContain(".faq-topic-grid");
    expect(faqStyles).not.toContain(".faq-topic-card");
    expect(faqStyles).not.toContain(".faq-cta-card__button--filled {\n  background: #000000;");
    expect(faqStyles).not.toContain(".faq-image-header {\n  border-radius: 0;\n  box-shadow:");
    expect(faqStyles).toContain("width: calc(100% + (2 * var(--space-page-inline)));");
    expect(faqStyles).toContain("width: auto;");
    expect(faqStyles).toContain("min-height: 40px;");
    expect(faqStyles).toContain("padding: 8px clamp(12px, 3vw, 16px);");
    expect(faqStyles).toContain("min-height: 34px;");
    expect(faqStyles).toContain("font-size: var(--type-button);");
    expect(faqStyles).toContain("font-size: var(--type-body);");
    expect(faqStyles).toContain(".faq-card__actions {\n    align-items: center;");
    expect(faqStyles).not.toContain(".faq-help__intro");
    expect(faqStyles).not.toContain(".faq-help__visual");
    expect(faqStyles).not.toContain(".faq-card__header--image");
    expect(faqStyles).not.toContain(".faq-question-card");
    expect(faqStyles).not.toContain(".faq-trust-strip");
    expect(faqStyles).not.toContain(".faq-trust-row");
    expect(faqStyles).not.toContain(".faq-trust-row__item");
    expect(faqStyles).not.toContain(".faq-trust-row__icon");
    expect(faqStyles).not.toContain(".faq-trust-row__copy");
    expect(faqStyles).toContain("border-radius: 8px;");
    expect(faqStyles).not.toContain("border-left: 0 !important;");
    expect(faqStyles).not.toContain("border-right: 0 !important;");
    expect(faqStyles).toContain("text-decoration: none;");
    expect(faqStyles).not.toMatch(/#(?:df7f91|e58a9b|dc5875|d94e73|fff7f8|fff5f6|fff0f1|fff6f7|f9d5d8)/i);
  });

  it("keeps the Shop All filter apply button readable outside bare-bones mode", () => {
    expect(styles).toContain(".shop-filter-panel__apply");
    expect(styles).not.toContain(".storefront-barebones .shop-filter-panel__apply");
    expect(styles).toContain("background: var(--shop-ink);");
    expect(styles).toContain("border-color: var(--shop-ink);");
    expect(styles).toContain("color: #ffffff;");
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
    expect(styles).toContain(".shop-tab-rail__tab {\n  appearance: none;\n  background: rgba(255, 255, 255, 0.82);");
    expect(styles).toContain("border-radius: 8px;");
    expect(styles).toContain(".shop-tab-rail__tab[aria-pressed=\"true\"] {\n  background: var(--shop-ink);");
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
    expect(sortButtonStyles).toContain("border: 1px solid var(--shop-border);");
    expect(sortButtonStyles).toContain("border-radius: 8px;");
    expect(sortButtonStyles).toContain("display: grid;");
    expect(sortButtonStyles).toContain("min-height: 44px;");
    expect(styles).toContain(".shop-sort-panel");
    expect(styles).toContain("box-shadow: var(--shop-shadow);");
    expect(styles).toContain(".shop-sort-option[aria-checked=\"true\"]");
    expect(styles).toContain(".shop-sort-option:hover,\n.shop-sort-option:focus-visible,\n.shop-sort-option[aria-checked=\"true\"]");
    expect(styles).toContain("color: #ffffff;");
    expect(styles).not.toContain(".shop-sort select");
  });

  it("keeps the approved footer mobile-first and tokenized", () => {
    expect(styles).toContain(".site-shell .site-footer {");
    expect(styles).toContain("--footer-soft: var(--site-surface-soft);");
    expect(styles).not.toContain("--footer-blush");
    expect(styles).toContain("background: #101417;");
    expect(styles).toContain("--footer-muted: rgba(255, 255, 255, 0.72);");
    expect(styles).toContain(".site-footer__love-note {\n  color: var(--footer-accent);");
    expect(styles).toContain(".site-footer-email--restored");
    expect(styles).toContain(".site-footer-email--image::before");
    expect(styles).toContain('background-image: url("/assets/hero-s3-summer.png");');
    expect(styles).toContain("filter: grayscale(1) brightness(0.48);");
    expect(styles).toContain(".site-footer-email--image::after");
    expect(styles).toContain("background: rgba(6, 10, 13, 0.34);");
    expect(styles).toContain(".site-footer-email--restored .site-footer-email__form");
    expect(styles).toContain("min-height: 48px;");
    expect(styles).toContain(".site-footer__brand-block");
    expect(styles).toContain(".site-footer__columns");
    expect(styles).toContain("grid-template-columns: repeat(3, minmax(0, 1fr));");
    expect(styles).toContain(".site-footer__inner {\n  display: grid;\n  gap: clamp(38px, 7vw, 62px);");
    expect(styles).toContain(".site-footer__brand-block {\n  display: grid;\n  gap: 9px;");
    expect(styles).toContain(".site-footer__columns {\n  display: grid;\n  gap: clamp(18px, 6vw, 40px);");
    expect(styles).toContain(".site-footer__column {\n  align-items: center;\n  display: grid;\n  gap: 12px;");
    expect(styles).toContain(".site-footer__column-title");
    expect(styles).toContain(".site-footer__column-title {\n  color: var(--footer-accent);");
    expect(styles).toContain("text-align: center;");
    expect(styles).toContain(".site-footer__link-list {\n  align-items: center;\n  display: grid;\n  gap: 4px;");
    expect(styles).toContain(".site-footer__text-link");
    expect(styles).toContain(".site-footer__social-link {\n  background: transparent;");
    expect(styles).toContain("justify-content: center;");
    expect(styles).toContain(".site-footer__text-link");
    expect(styles).toContain(".site-footer__social-link");
    expect(styles).toContain("border-radius: 0;");
    expect(styles).toContain("border-radius: 50%;");
    expect(styles).toContain("min-height: 36px;");
    expect(styles).toContain("@media (max-width: 480px)");
    expect(styles).toContain(".site-footer-email-shell + .site-footer {\n    --footer-link-size: 0.78rem;\n    padding-top: 46px;");
    expect(styles).toContain(".site-footer__inner {\n    gap: 28px;\n    padding-inline: 16px;");
    expect(styles).toContain(".site-footer__brand-block {\n    gap: 5px;");
    expect(styles).toContain(".site-footer__columns {\n    gap: 14px;\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n    justify-self: center;\n    width: min(100%, 306px);");
    expect(styles).toContain(".site-footer__column {\n    gap: 12px;");
    expect(styles).toContain(".site-footer__column-title {\n    font-size: 0.74rem;\n    font-weight: 760;\n    letter-spacing: 0.06em;");
    expect(styles).toContain(".site-footer__link-list {\n    gap: 5px;");
    expect(styles).toContain("white-space: nowrap;");
    expect(styles).toContain(".site-footer__social-links {\n    column-gap: 14px;\n    display: flex;");
    expect(styles).toContain("--footer-social-size: var(--type-button);");
    expect(styles).toContain("--footer-social-tracking: 0;");
    expect(styles).toContain(".site-footer__social-link {\n  background: transparent;");
    expect(styles).toContain("border: 0;");
    expect(styles).toContain("color: var(--footer-accent);");
    expect(styles).toContain("padding: 0;");
    expect(styles).toContain("height: 36px;");
    expect(styles).toContain("width: 36px;");
    expect(styles).toContain(".site-footer__social-icon");
    expect(styles).toContain("height: 22px;");
    expect(styles).toContain("width: 22px;");
    expect(styles).toContain(".site-footer__social-link:hover");
    expect(styles).not.toContain(".site-footer__column--policies");
    expect(styles).not.toContain("grid-template-columns: repeat(2, max-content);");
    expect(styles).not.toContain(".site-footer__policy-bar");
    expect(styles).not.toContain(".site-footer__shop-link");
    for (const socialRule of styles.matchAll(/\.site-footer__social-links\s*\{[^}]*\}/g)) {
      expect(socialRule[0]).not.toContain("border");
      expect(socialRule[0]).not.toContain("display: grid");
    }
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
    expect(styles).toContain(".brand-header__mobile-actions .brand-header__icon-button {\n    background: transparent;\n    border: 0;\n    box-shadow: none;");
    expect(styles).toContain(".brand-header__mobile-menu {\n    display: grid;");
  });

  it("presents the mobile menu as an editorial split-screen selector", () => {
    expect(styles).toContain(".brand-header__mobile-menu-dialog");
    expect(styles).toContain(".brand-header__mobile-menu-selector");
    expect(styles).toContain(".brand-header__mobile-menu-content");
    expect(styles).toContain(".brand-header--menu-open .brand-header__mobile-menu--default");
    expect(styles).toContain("grid-template-columns: 1fr;");
    expect(styles).toContain(".brand-header--menu-open .brand-header__mobile-menu--expanded");
    expect(styles).toContain("grid-template-columns: minmax(0, 38%) minmax(0, 62%);");
    expect(styles).toContain(".brand-header__mobile-menu-selector--default");
    expect(styles).toContain(".brand-header__mobile-menu-selector--expanded");
    expect(styles).toContain("background: #eab6b4;");
    expect(styles).toContain("background: #fffdfb;");
    expect(styles).toContain("border-left: 1px solid rgba(31, 36, 40, 0.13);");
    expect(styles).toContain(".brand-header__mobile-menu-content--default");
    expect(styles).toContain(".brand-header__mobile-menu-content--expanded");
    expect(styles).toContain(".brand-header__mobile-selector-indicator");
    expect(styles).toContain(".brand-header__mobile-menu--default .brand-header__mobile-selector-indicator");
    expect(styles).toContain(".brand-header__mobile-menu--expanded .brand-header__mobile-selector-indicator");
    expect(styles).toContain("opacity: 0;");
    expect(styles).toContain("opacity: 1;");
    expect(styles).toContain("height: clamp(32px, 10vw, 48px);");
    expect(styles).not.toContain(".brand-header__mobile-submenu {\n  border-left: 1px solid");
    expect(styles).not.toContain(".brand-header__mobile-menu-content {\n    border-radius:");
  });

  it("separates default centered menu layout from expanded wheel selector CSS", () => {
    const rootSelectorItemRule = getRuleBody(styles, ".brand-header__mobile-selector-item");
    expect(rootSelectorItemRule).toContain("font-family: var(--font-display);");
    expect(rootSelectorItemRule).not.toContain("font-family: var(--font-body);");
    expect(styles).toContain(
      ".brand-header .brand-header__mobile-selector-item {\n  font-family: var(--font-display);"
    );

    const activeSelectorItemRule = getRuleBody(styles, ".brand-header__mobile-selector-item--active");
    expect(activeSelectorItemRule).toContain("text-transform: none;");
    expect(activeSelectorItemRule).not.toContain("text-transform: uppercase;");

    const baseSelectorItemRules = getRuleBodies(styles, ".brand-header__mobile-selector-item");

    for (const ruleBody of baseSelectorItemRules) {
      expect(ruleBody).not.toContain("position: absolute;");
      expect(ruleBody).not.toContain("transform: translate(-50%");
      expect(ruleBody).not.toContain("left: 57%;");
    }

    const defaultSelectorItemRule = getRuleBody(
      styles,
      ".brand-header__mobile-menu--default .brand-header__mobile-selector-item"
    );
    expect(defaultSelectorItemRule).toContain("position: static;");
    expect(defaultSelectorItemRule).toContain("transform: none;");

    const expandedSelectorItemRule = getRuleBody(
      styles,
      ".brand-header__mobile-menu--expanded .brand-header__mobile-selector-item"
    );
    expect(expandedSelectorItemRule).toContain("position: absolute;");
    expect(expandedSelectorItemRule).toContain("transform: translate(-50%");

    expect(styles).toContain(
      ".brand-header__mobile-menu--expanded .brand-header__mobile-selector-item--offset-0"
    );
    expect(styles).not.toContain("\n  .brand-header__mobile-selector-item--offset-0 {");
    expect(styles).toContain(
      ".brand-header__mobile-menu--default .brand-header__mobile-selector-indicator {\n    opacity: 0;"
    );
    expect(styles).toContain(
      ".brand-header__mobile-menu--expanded .brand-header__mobile-selector-indicator {\n    opacity: 1;"
    );

    const defaultContentRule = getRuleBody(styles, ".brand-header__mobile-menu-content--default");
    expect(defaultContentRule).toContain("opacity: 0;");
    expect(defaultContentRule).toContain("pointer-events: none;");
    expect(defaultContentRule).toContain("position: absolute;");
    expect(defaultContentRule).toContain("transform: translateX(32px);");
    expect(defaultContentRule).toContain("visibility: hidden;");

    const expandedContentRule = getRuleBody(styles, ".brand-header__mobile-menu-content--expanded");
    expect(expandedContentRule).toContain("opacity: 1;");
    expect(expandedContentRule).toContain("position: relative;");
    expect(expandedContentRule).toContain("transform: translateX(0);");
    expect(expandedContentRule).toContain("visibility: visible;");
  });

  it("keeps the mobile selector motion calm and respects reduced motion", () => {
    expect(styles).toContain("@keyframes mobile-submenu-enter");
    expect(styles).toContain("@keyframes mobile-menu-default-enter");
    expect(styles).toContain("@keyframes mobile-menu-selector-expand");
    expect(styles).toContain("transform: translateY(8px);");
    expect(styles).toContain("animation: mobile-submenu-enter 320ms cubic-bezier(0.22, 1, 0.36, 1);");
    expect(styles).toContain("animation: mobile-menu-default-enter 440ms cubic-bezier(0.22, 1, 0.36, 1);");
    expect(styles).toContain("animation: mobile-menu-selector-expand 520ms cubic-bezier(0.22, 1, 0.36, 1);");
    expect(styles).toContain(
      "transition:\n    opacity 420ms cubic-bezier(0.22, 1, 0.36, 1),\n    transform 420ms cubic-bezier(0.22, 1, 0.36, 1),\n    font-size 420ms cubic-bezier(0.22, 1, 0.36, 1),\n    color 420ms ease;"
    );
    expect(styles).toContain(
      "transition:\n    opacity 320ms cubic-bezier(0.22, 1, 0.36, 1),\n    transform 320ms cubic-bezier(0.22, 1, 0.36, 1);"
    );
    expect(styles).toContain(
      "transition:\n      opacity 480ms cubic-bezier(0.22, 1, 0.36, 1),\n      transform 540ms cubic-bezier(0.22, 1, 0.36, 1),\n      visibility 0ms linear 540ms;"
    );
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).toContain(".brand-header__mobile-menu-selector,\n  .brand-header__mobile-selector-item");
    expect(styles).toContain(".brand-header__mobile-selector-item,\n  .brand-header__mobile-menu-content,\n  .brand-header__mobile-submenu-panel");
    expect(styles).toContain("animation: none;");
    expect(styles).toContain("transition: opacity 120ms ease;");
  });

  it("keeps the open mobile menu close button aligned to the right edge", () => {
    expect(styles).toContain(".brand-header--menu-open .brand-header__mobile-actions {");
    expect(styles).toContain("right: 8px;");
    expect(styles).toContain(
      ".brand-header--menu-open .brand-header__mobile-actions .brand-header__icon-button:first-child {\n    background: transparent;"
    );
    expect(styles).toContain(
      ".brand-header--menu-open .brand-header__mobile-actions .brand-header__icon-button:last-child {\n    display: none;"
    );
  });
});
