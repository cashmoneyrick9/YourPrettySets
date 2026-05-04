import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf-8");

describe("small mobile responsive CSS", () => {
  it("includes dedicated layout tightening for 320px screens", () => {
    expect(styles).toContain("@media (max-width: 360px)");
    expect(styles).toContain(".product-carousel");
    expect(styles).toContain("grid-auto-columns: minmax(206px, 252px)");
    expect(styles).toContain(".nail-tile");
    expect(styles).toContain("min-height: 104px");
  });
});
