import { describe, expect, it } from "vitest";
import {
  canonicalFaqItems,
  faqItemsById,
  helpHubDestinations,
  helpHubGroups,
  helpQuickTasks,
  helpRoutes,
  legacyHelpRedirects,
  productPageFaqIds,
  productPageFaqItems
} from "./helpContent";
import { shippingFacts, sizingFacts } from "./storefrontFacts";

describe("helpContent", () => {
  it("keeps the canonical Help route names and compatibility redirect together", () => {
    expect(
      Object.values(helpRoutes).map(({ href, title }) => [href, title])
    ).toEqual([
      ["/help", "The Press-On Guide"],
      ["/help/sizing", "Find Your Fit"],
      ["/help/application", "Apply Your Set"],
      ["/help/removal", "Remove & Reuse"],
      ["/help/shipping-returns", "Shipping, Returns & Order Issues"],
      ["/help/faq", "FAQ"],
      ["/help/contact", "Contact Support"]
    ]);
    expect(legacyHelpRedirects).toEqual([
      { from: "/help/how-to-apply", to: "/help/application" }
    ]);
  });

  it("places every hub destination in one task group", () => {
    const groupedIds = helpHubGroups.flatMap(({ destinationIds }) => destinationIds);

    expect(new Set(groupedIds).size).toBe(groupedIds.length);
    expect(new Set(groupedIds)).toEqual(new Set(Object.keys(helpHubDestinations)));
  });

  it("provides one canonical item for every required FAQ topic", () => {
    expect(canonicalFaqItems.map(({ id }) => id)).toEqual([
      "choose-size",
      "sizing-kits",
      "fit-problem",
      "included-items",
      "glue-or-tabs",
      "wear-time",
      "reuse",
      "removal",
      "processing",
      "shipping-price",
      "tracking",
      "returns",
      "damaged-incorrect-defective",
      "lost-package",
      "cancellations",
      "custom-orders"
    ]);
    expect(canonicalFaqItems.every(({ relatedLink }) => relatedLink.href.startsWith("/"))).toBe(true);
  });

  it("keeps the task-first hub answers tied to approved Help routes and facts", () => {
    expect(helpQuickTasks.map(({ id }) => id)).toEqual([
      "find-size",
      "apply",
      "track-order",
      "damaged-order",
      "shipping-times",
      "returns"
    ]);
    expect(helpQuickTasks.every(({ action }) => action.href.startsWith("/help"))).toBe(true);
    expect(helpQuickTasks.find(({ id }) => id === "find-size")?.summary).toContain(sizingFacts.presetRange);
    expect(helpQuickTasks.find(({ id }) => id === "shipping-times")?.summary).toContain(
      shippingFacts.carrierTransit
    );
  });

  it("derives changeable sizing and shipping details from storefront facts", () => {
    expect(faqItemsById["choose-size"].answer).toContain(sizingFacts.presetRange);
    expect(faqItemsById["sizing-kits"].answer).toContain(`$${sizingFacts.standaloneKitPrice}`);
    expect(faqItemsById.processing.answer).toContain(shippingFacts.readyToShipProcessing);
    expect(faqItemsById.processing.answer).toContain(shippingFacts.carrierTransit);
    expect(faqItemsById["shipping-price"].answer).toContain(`$${shippingFacts.freeShippingThreshold}`);
  });

  it("builds the concise Product-page subset from canonical FAQ objects", () => {
    expect(productPageFaqItems.map(({ id }) => id)).toEqual(productPageFaqIds);
    expect(productPageFaqItems.every((item) => faqItemsById[item.id] === item)).toBe(true);
  });
});
