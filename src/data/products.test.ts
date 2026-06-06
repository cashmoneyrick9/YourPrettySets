import { describe, expect, it } from "vitest";
import {
  collectionLabels,
  detailTiers,
  lengthOptions,
  products,
  shapeOptions
} from "./products";

describe("product data", () => {
  it("has the approved Shop All placeholder catalog count", () => {
    expect(products).toHaveLength(33);
  });

  it("lets every product support every launch length and shape", () => {
    for (const product of products) {
      expect(product.lengthOptions).toEqual(lengthOptions);
      expect(product.shapeOptions).toEqual(shapeOptions);
    }
  });

  it("uses only approved collections and detail tiers", () => {
    const allowedCollections = new Set(collectionLabels);
    const allowedTiers = new Set(detailTiers.map((tier) => tier.id));

    for (const product of products) {
      expect(allowedTiers.has(product.detailTier)).toBe(true);
      expect(product.collections.length).toBeGreaterThan(0);
      for (const collection of product.collections) {
        expect(allowedCollections.has(collection)).toBe(true);
      }
    }
  });

  it("includes clean and editorial placeholder image descriptions", () => {
    for (const product of products) {
      expect(product.images.clean).toContain(product.name);
      expect(product.images.editorial).toContain(product.name);
    }
  });
});
