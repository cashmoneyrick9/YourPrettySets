import { describe, expect, it } from "vitest";
import {
  collectionLabels,
  detailTiers,
  findProductBySlug,
  lengthOptions,
  products,
  sizingKitProduct,
  shapeOptions
} from "./products";
import { sizingFacts } from "./storefrontFacts";

describe("product data", () => {
  it("offers Extra Short before the existing nail lengths", () => {
    expect(lengthOptions).toEqual(["Extra Short", "Short", "Medium", "Long", "Extra Long"]);
  });

  it("has the approved Shop All placeholder catalog count", () => {
    expect(products).toHaveLength(33);
    expect(products).not.toContain(sizingKitProduct);
    expect(products.some((product) => product.slug === sizingKitProduct.slug)).toBe(false);
  });

  it("registers the standalone sizing kit without adding it to the nail-set catalog", () => {
    expect(sizingKitProduct).toMatchObject({
      commerceStatus: "pending",
      id: "sizing-kit",
      kind: "sizing-kit",
      name: "Sizing Kit",
      price: sizingFacts.standaloneKitPrice,
      slug: "sizing-kit"
    });
    expect(findProductBySlug("sizing-kit")).toBe(sizingKitProduct);
    expect(findProductBySlug(products[0].slug)).toBe(products[0]);
    expect(findProductBySlug("not-a-product")).toBeUndefined();
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
