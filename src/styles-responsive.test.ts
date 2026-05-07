import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf-8");

describe("small mobile responsive CSS", () => {
  it("includes dedicated layout tightening for 320px screens", () => {
    expect(styles).toContain("@media (max-width: 360px)");
    expect(styles).toContain(".product-carousel");
    expect(styles).toContain("grid-auto-columns: minmax(206px, 252px)");
    expect(styles).toContain(".hero-photo");
    expect(styles).toContain("grid-template-areas: \"hero\"");
    expect(styles).toContain(".hero-copy");
    expect(styles).toContain("z-index: 1");
    expect(styles).toContain(".confidence-list");
    expect(styles).toContain("margin-top: 0");
    expect(styles).not.toContain("margin-top: -18px");
    expect(styles).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
    expect(styles).toContain(".hero-photo__nail");
    expect(styles).toContain("min-height: 42px");
    expect(styles).toContain(".collection-card__visual");
  });

  it("includes compact mobile header rules that hide the desktop nav", () => {
    expect(styles).toContain(".brand-header__mobile-actions");
    expect(styles).toContain(".brand-header__desktop-nav");
    expect(styles).toContain(".brand-header__mobile-menu");
    expect(styles).toContain("@media (max-width: 720px)");
    expect(styles).toContain(".brand-header__desktop-nav {\n    display: none;");
    expect(styles).toContain(".brand-header__mobile-actions {\n    display: flex;");
    expect(styles).toContain(".brand-header__mobile-menu {\n    display: grid;");
  });
});
