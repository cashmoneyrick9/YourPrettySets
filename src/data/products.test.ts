import { describe, expect, it } from "vitest";
import {
  buildProductVariant,
  collectionLabels,
  detailTiers,
  findProductBySlug,
  getProductVariant,
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
      expect(product.variants).toHaveLength(shapeOptions.length * lengthOptions.length);
    }
  });

  it("generates stable unique SKUs for every shape and length combination", () => {
    const product = products[0];
    const skus = product.variants?.map((variant) => variant.sku) ?? [];

    expect(new Set(skus).size).toBe(shapeOptions.length * lengthOptions.length);
    expect(getProductVariant(product, "Almond", "Extra Short")).toMatchObject({
      availability: "available",
      length: "Extra Short",
      shape: "Almond",
      sku: "BLUSH-CRUSH-ALM-XS"
    });
    expect(buildProductVariant("blush-crush", "Coffin", "Medium", { priceOverride: 22 })).toMatchObject({
      priceOverride: 22,
      sku: "BLUSH-CRUSH-COF-M"
    });
  });

  it("provides a backward-compatible generated variant when stored variants are absent", () => {
    const legacyProduct = { ...products[0], variants: undefined };

    expect(getProductVariant(legacyProduct, "Oval", "Long")).toMatchObject({
      availability: "available",
      sku: "BLUSH-CRUSH-OVL-L"
    });
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

  it("gives every catalog product one canonical clean media asset", () => {
    for (const product of products) {
      expect(product.media?.clean).toBe(`/assets/products/${product.id}.jpg`);
    }
  });
});
