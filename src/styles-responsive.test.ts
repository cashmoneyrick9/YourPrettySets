import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf-8");

describe("small mobile responsive CSS", () => {
  it("includes the locked S3 header and hero visual rules", () => {
    expect(styles).toContain("--color-sage-accent");
    expect(styles).toContain("--color-sage-accent: #adba85;");
    expect(styles).toContain("--font-cta:");
    expect(styles).toContain("--hero-overlay-bottom");
    expect(styles).toContain(".brand-header--at-top");
    expect(styles).toContain(".brand-header--scrolled");
    expect(styles).toContain("border-radius: 8px;");
    expect(styles).toContain("position: fixed;");
    expect(styles).toContain("backdrop-filter: blur(14px);");
    expect(styles).toContain("background-image: url(\"/assets/hero-s3-summer.png\")");
    expect(styles).toContain(".hero-photo__hand {\n  display: none;");
    expect(styles).toContain(".hero-section::after");
    expect(styles).toContain("min-height: clamp(520px, 68vh, 640px)");
    expect(styles).toContain("scroll-padding-top: 84px");
    expect(styles).toContain("justify-self: center");
    expect(styles).toContain("max-height: min(650px, calc(94vh - 108px))");
    expect(styles).toContain("width: min(100%, 520px)");
    expect(styles).toContain(".hero-copy h1::after");
    expect(styles).toContain(".hero-section {\n  display: grid;");
    expect(styles).toContain("padding: 0;");
    expect(styles).toContain("border-radius: 0;");
    expect(styles).toContain("grid-template-columns: 38px minmax(0, 1fr) auto 38px;");
    expect(styles).toContain("grid-column: 2;");
    expect(styles).toContain("font-size: 1.08rem;");
    expect(styles).toContain("font-family: var(--font-cta);");
    expect(styles).toContain(".brand-header--scrolled .brand-header__icon-button");
    expect(styles).toContain("background: transparent;");
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
    expect(styles).toContain(".confidence-carousel__button");
    expect(styles).toContain("margin-top: 0");
    expect(styles).not.toContain("margin-top: -18px");
    expect(styles).toContain("grid-template-columns: minmax(76px, 0.72fr) minmax(0, 1fr)");
    expect(styles).toContain(".collection-card__visual");
    expect(styles).toContain(".confidence-card__visual");
    expect(styles).toContain(".confidence-dots");
    expect(styles).toContain("scrollbar-width: none");
    expect(styles).toContain(".shop-more-grid::-webkit-scrollbar");
    expect(styles).toContain(".review-proof-row {\n    flex-wrap: wrap;");
    expect(styles).toContain(".collection-section {\n    padding-bottom: 24px;");
    expect(styles).toContain(".weekly-set-section {\n    padding-top: 24px;");
    expect(styles).toContain(".review-carousel {\n    gap: 8px;");
    expect(styles).toContain(".review-card--peek {\n    display: none;");
    expect(styles).toContain("position: static;");
    expect(styles).toContain("font-size: 1.58rem");
    expect(styles).toContain("padding: 10px 12px 18px");
  });

  it("does not force tiny mobile viewports wider than the screen", () => {
    expect(styles).not.toContain("min-width: 320px");
    expect(styles).toContain("min-width: 0");
    expect(styles).toContain(".site-footer {\n    padding: 26px 14px 24px;");
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
});
