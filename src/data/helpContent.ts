import {
  includedSetItems,
  orderPolicyFacts,
  shippingFacts,
  sizingFacts,
  wearEstimates
} from "./storefrontFacts";

export type HelpRouteId =
  | "hub"
  | "sizing"
  | "application"
  | "removal"
  | "shippingReturns"
  | "faq"
  | "contact";

export type HelpArticleRouteId = Exclude<HelpRouteId, "hub">;

export interface HelpRouteMetadata {
  id: HelpRouteId;
  href: string;
  navigationLabel: string;
  title: string;
  eyebrow: string;
  summary: string;
}

export const helpRoutes = {
  hub: {
    id: "hub",
    href: "/help",
    navigationLabel: "Help",
    title: "The Press-On Guide",
    eyebrow: "Help",
    summary: "Find clear guidance for fit, application, removal, care, and order questions."
  },
  sizing: {
    id: "sizing",
    href: "/help/sizing",
    navigationLabel: "Find Your Fit",
    title: "Find Your Fit",
    eyebrow: "Before you order",
    summary: "Understand the sizing system, ready-to-wear fit, and when to use a sizing kit."
  },
  application: {
    id: "application",
    href: "/help/application",
    navigationLabel: "Apply Your Set",
    title: "Apply Your Set",
    eyebrow: "Apply and care",
    summary: "Prepare your natural nails, choose glue or tabs, and apply your set step by step."
  },
  removal: {
    id: "removal",
    href: "/help/removal",
    navigationLabel: "Remove & Reuse",
    title: "Remove & Reuse",
    eyebrow: "Apply and care",
    summary: "Remove your set without force, then clean and store reusable nails with care."
  },
  shippingReturns: {
    id: "shippingReturns",
    href: "/help/shipping-returns",
    navigationLabel: "Shipping, Returns & Order Issues",
    title: "Shipping, Returns & Order Issues",
    eyebrow: "Order help",
    summary: "Review timing, shipping rates, cancellations, returns, and help for order problems."
  },
  faq: {
    id: "faq",
    href: "/help/faq",
    navigationLabel: "FAQ",
    title: "FAQ",
    eyebrow: "More help",
    summary: "Get concise answers to the questions customers ask most often."
  },
  contact: {
    id: "contact",
    href: "/help/contact",
    navigationLabel: "Contact Support",
    title: "Contact Support",
    eyebrow: "More help",
    summary: "Find the right details to include when you need help with fit, a product, or an order."
  }
} as const satisfies Record<HelpRouteId, HelpRouteMetadata>;

export const legacyHelpRedirects = [
  {
    from: "/help/how-to-apply",
    to: helpRoutes.application.href
  }
] as const;

export type HelpHubDestinationId =
  | HelpArticleRouteId
  | "sizingKitProduct"
  | "damagedOrder"
  | "lostPackage"
  | "cancellations"
  | "customOrderWaitlist";

export type HelpDestinationKind = "guide" | "product" | "waitlist";

export interface HelpHubDestination {
  id: HelpHubDestinationId;
  href: string;
  label: string;
  description: string;
  kind: HelpDestinationKind;
}

export const helpHubDestinations = {
  sizing: {
    id: "sizing",
    href: helpRoutes.sizing.href,
    label: helpRoutes.sizing.title,
    description: helpRoutes.sizing.summary,
    kind: "guide"
  },
  sizingKitProduct: {
    id: "sizingKitProduct",
    href: "/products/sizing-kit",
    label: "Sizing Kit",
    description: `See the ${sizingFacts.standaloneKitPriceLabel} standalone kit for sizing help without an active custom order.`,
    kind: "product"
  },
  application: {
    id: "application",
    href: helpRoutes.application.href,
    label: helpRoutes.application.title,
    description: helpRoutes.application.summary,
    kind: "guide"
  },
  removal: {
    id: "removal",
    href: helpRoutes.removal.href,
    label: helpRoutes.removal.title,
    description: helpRoutes.removal.summary,
    kind: "guide"
  },
  shippingReturns: {
    id: "shippingReturns",
    href: helpRoutes.shippingReturns.href,
    label: helpRoutes.shippingReturns.title,
    description: helpRoutes.shippingReturns.summary,
    kind: "guide"
  },
  damagedOrder: {
    id: "damagedOrder",
    href: `${helpRoutes.shippingReturns.href}#order-problems`,
    label: "Damaged or incorrect order",
    description: `See what to send support within ${orderPolicyFacts.issueReportingWindowDays} days of confirmed delivery.`,
    kind: "guide"
  },
  lostPackage: {
    id: "lostPackage",
    href: `${helpRoutes.shippingReturns.href}#lost-packages`,
    label: "Lost package",
    description: "Follow the tracking and investigation process for a carrier problem.",
    kind: "guide"
  },
  cancellations: {
    id: "cancellations",
    href: `${helpRoutes.shippingReturns.href}#cancellations`,
    label: "Cancel an order",
    description: `Review the ${orderPolicyFacts.cancellationWindowHours}-hour cancellation rule and contact support promptly.`,
    kind: "guide"
  },
  faq: {
    id: "faq",
    href: helpRoutes.faq.href,
    label: helpRoutes.faq.navigationLabel,
    description: helpRoutes.faq.summary,
    kind: "guide"
  },
  contact: {
    id: "contact",
    href: helpRoutes.contact.href,
    label: helpRoutes.contact.title,
    description: helpRoutes.contact.summary,
    kind: "guide"
  },
  customOrderWaitlist: {
    id: "customOrderWaitlist",
    href: "/shop/custom-orders",
    label: "Custom-order waitlist",
    description: "Open the current custom-order signup. Custom orders are not available to place yet.",
    kind: "waitlist"
  }
} as const satisfies Record<HelpHubDestinationId, HelpHubDestination>;

export interface HelpHubGroup {
  id: "beforeOrder" | "applyAndCare" | "orderHelp" | "moreHelp";
  title: string;
  intro: string;
  destinationIds: readonly HelpHubDestinationId[];
}

export const helpHubGroups = [
  {
    id: "beforeOrder",
    title: "Before you order",
    intro: "Start with fit and sizing help.",
    destinationIds: ["sizing", "sizingKitProduct"]
  },
  {
    id: "applyAndCare",
    title: "Apply and care",
    intro: "Choose your adhesive, apply carefully, and protect your set for reuse.",
    destinationIds: ["application", "removal"]
  },
  {
    id: "orderHelp",
    title: "Order help",
    intro: "Check timing, shipping, cancellations, and next steps when something is wrong.",
    destinationIds: ["shippingReturns", "damagedOrder", "lostPackage", "cancellations"]
  },
  {
    id: "moreHelp",
    title: "More help",
    intro: "Scan quick answers, contact support, or join the custom-order waitlist.",
    destinationIds: ["faq", "contact", "customOrderWaitlist"]
  }
] as const satisfies readonly HelpHubGroup[];

export const relatedGuideIds = {
  sizing: ["application", "contact"],
  application: ["sizing", "removal", "faq"],
  removal: ["application", "faq", "contact"],
  shippingReturns: ["faq", "contact"],
  faq: ["sizing", "application", "shippingReturns"],
  contact: ["sizing", "shippingReturns", "faq"]
} as const satisfies Record<HelpArticleRouteId, readonly HelpArticleRouteId[]>;

export function getRelatedGuides(routeId: HelpArticleRouteId) {
  return relatedGuideIds[routeId].map((relatedRouteId) => helpRoutes[relatedRouteId]);
}

export interface HelpContentLink {
  label: string;
  href: string;
}

export type HelpFaqCategory = "Fit and sizing" | "Application and care" | "Orders and support";

export type HelpFaqId =
  | "choose-size"
  | "sizing-kits"
  | "fit-problem"
  | "included-items"
  | "glue-or-tabs"
  | "wear-time"
  | "reuse"
  | "removal"
  | "processing"
  | "shipping-price"
  | "tracking"
  | "returns"
  | "damaged-incorrect-defective"
  | "lost-package"
  | "cancellations"
  | "custom-orders";

export interface HelpFaqItem {
  id: HelpFaqId;
  category: HelpFaqCategory;
  question: string;
  answer: string;
  relatedLink: HelpContentLink;
}

function formatList(values: readonly string[]) {
  if (values.length <= 1) {
    return values[0] ?? "";
  }

  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

const includedItemsList = formatList(includedSetItems.map((item) => item.toLowerCase()));
const wearVariablesList = formatList(wearEstimates.variables.map((variable) => variable.toLowerCase()));
const customOrderKitPriceLabel = sizingFacts.customOrderKitPriceLabel.toLowerCase();
const trackingIncludedSentence = shippingFacts.trackingIncluded
  ? "Tracking is included with every order."
  : "Tracking availability is shown with the order details.";
const standardReturnsSentence = orderPolicyFacts.standardReturnsAccepted
  ? "Review the current return instructions before sending anything back."
  : "Because each set is handmade, standard returns are not accepted.";

export const faqItemsById = {
  "choose-size": {
    id: "choose-size",
    category: "Fit and sizing",
    question: "How do I choose my size?",
    answer: `Ready-to-wear sets include ${sizingFacts.readyToWearNailCount} nails across preset sizes ${sizingFacts.presetRange}. That broad range is intended to reduce sizing problems, but it cannot guarantee every customer a perfect fit. Custom sets require a sizing kit.`,
    relatedLink: {
      label: `Read ${helpRoutes.sizing.title}`,
      href: helpRoutes.sizing.href
    }
  },
  "sizing-kits": {
    id: "sizing-kits",
    category: "Fit and sizing",
    question: "How do sizing kits work?",
    answer: `A sizing kit is required for a custom set. It is ${customOrderKitPriceLabel} when connected to a custom-set order, while a standalone kit for sizing help without an active custom order costs ${sizingFacts.standaloneKitPriceLabel}. Custom orders are ${sizingFacts.customOrdersStatus}, and online checkout for the standalone kit is not connected yet.`,
    relatedLink: {
      label: "View the Sizing Kit",
      href: helpHubDestinations.sizingKitProduct.href
    }
  },
  "fit-problem": {
    id: "fit-problem",
    category: "Fit and sizing",
    question: "What if my set does not fit?",
    answer: `Ready-to-wear ${sizingFacts.readyToWearNailCount}-nail sets and sizing kits are provided to reduce sizing risk. If an independently selected size is incorrect, free replacement is generally not available. If YourPrettySets makes the sizing or fulfillment error, we will make it right.`,
    relatedLink: {
      label: "Get fit guidance",
      href: helpRoutes.sizing.href
    }
  },
  "included-items": {
    id: "included-items",
    category: "Application and care",
    question: "What comes with each set?",
    answer: `Every set includes ${includedItemsList}.`,
    relatedLink: {
      label: `Prepare to ${helpRoutes.application.title}`,
      href: helpRoutes.application.href
    }
  },
  "glue-or-tabs": {
    id: "glue-or-tabs",
    category: "Application and care",
    question: "Should I use nail glue or adhesive tabs?",
    answer: `Both are included. Nail glue has an estimated wear window of approximately ${wearEstimates.glue}; adhesive tabs have an estimated wear window of approximately ${wearEstimates.tabs}. Choose based on how long you hope to wear the set, then follow the instructions for that adhesive.`,
    relatedLink: {
      label: "Compare application methods",
      href: helpRoutes.application.href
    }
  },
  "wear-time": {
    id: "wear-time",
    category: "Application and care",
    question: "How long can a set stay on?",
    answer: `With nail glue, estimated wear is approximately ${wearEstimates.glue}. With adhesive tabs, it is approximately ${wearEstimates.tabs}. These are estimates, not guarantees; wear varies with ${wearVariablesList}.`,
    relatedLink: {
      label: "Read wear and aftercare guidance",
      href: helpRoutes.application.href
    }
  },
  reuse: {
    id: "reuse",
    category: "Application and care",
    question: "Can I reuse my press-ons?",
    answer: "YourPrettySets sets are marketed as reusable when they are removed correctly, cleaned properly, stored carefully, and still physically suitable for reuse. There is no guaranteed number of wears.",
    relatedLink: {
      label: `Read ${helpRoutes.removal.title}`,
      href: helpRoutes.removal.href
    }
  },
  removal: {
    id: "removal",
    category: "Application and care",
    question: "How do I remove a set?",
    answer: "Removal depends on the adhesive. Warm-water soaking can assist with adhesive tabs; never pull or force a nail off. A YourPrettySets glue-removal solution is in development and is not available or included yet.",
    relatedLink: {
      label: "Read the removal guide",
      href: helpRoutes.removal.href
    }
  },
  processing: {
    id: "processing",
    category: "Orders and support",
    question: "How long will my order take?",
    answer: `Ready-to-ship orders take approximately ${shippingFacts.readyToShipProcessing} to process; made-to-order sets take approximately ${shippingFacts.madeToOrderProcessing}. Carrier transit is separate and is estimated at approximately ${shippingFacts.carrierTransit}. Custom timing ${shippingFacts.customOrderTiming.toLowerCase()} and is not fixed.`,
    relatedLink: {
      label: "See order timing details",
      href: helpRoutes.shippingReturns.href
    }
  },
  "shipping-price": {
    id: "shipping-price",
    category: "Orders and support",
    question: "How much is shipping?",
    answer: `Orders below $${shippingFacts.freeShippingThreshold} currently have a temporary flat shipping rate of approximately $${shippingFacts.flatRate}. Orders of $${shippingFacts.freeShippingThreshold} or more receive free ${shippingFacts.freeShippingService}.`,
    relatedLink: {
      label: "Read shipping details",
      href: helpRoutes.shippingReturns.href
    }
  },
  tracking: {
    id: "tracking",
    category: "Orders and support",
    question: "Will I receive tracking?",
    answer: `${trackingIncludedSentence} If tracking stops updating or the carrier reports a problem, contact support so YourPrettySets can help investigate.`,
    relatedLink: {
      label: "See order-issue guidance",
      href: helpRoutes.shippingReturns.href
    }
  },
  returns: {
    id: "returns",
    category: "Orders and support",
    question: "Can I return my order?",
    answer: `${standardReturnsSentence} Damaged, incorrect, or defective items should be reported within ${orderPolicyFacts.issueReportingWindowDays} days of confirmed delivery so the issue can be reviewed fairly.`,
    relatedLink: {
      label: "Read the returns policy",
      href: helpRoutes.shippingReturns.href
    }
  },
  "damaged-incorrect-defective": {
    id: "damaged-incorrect-defective",
    category: "Orders and support",
    question: "What if my order arrives damaged, incorrect, or defective?",
    answer: `Email support within ${orderPolicyFacts.issueReportingWindowDays} days of confirmed delivery with your order details and clear photos. Each case is reviewed individually; possible resolutions include repair, replacement, or another appropriate solution, not an automatic refund or replacement. After that window, repair or replacement nails may require payment depending on the case.`,
    relatedLink: {
      label: "See what to include",
      href: helpRoutes.contact.href
    }
  },
  "lost-package": {
    id: "lost-package",
    category: "Orders and support",
    question: "What happens if my package is lost?",
    answer: "Contact support with your order and tracking details. YourPrettySets will help investigate, and a carrier claim may be required. A refund or replacement is not automatic before the investigation is complete.",
    relatedLink: {
      label: "Read the lost-package process",
      href: helpRoutes.shippingReturns.href
    }
  },
  cancellations: {
    id: "cancellations",
    category: "Orders and support",
    question: "Can I cancel an order?",
    answer: `${orderPolicyFacts.cancellationRule} If painting or production begins during the first ${orderPolicyFacts.cancellationWindowHours} hours, cancellation may no longer be possible.`,
    relatedLink: {
      label: "Read the cancellation details",
      href: helpRoutes.shippingReturns.href
    }
  },
  "custom-orders": {
    id: "custom-orders",
    category: "Orders and support",
    question: "Can I place a custom order?",
    answer: `Custom orders are ${sizingFacts.customOrdersStatus}. The existing signup page shows the current waitlist status; it does not open an order or provide fixed timing.`,
    relatedLink: {
      label: "Join the custom-order waitlist",
      href: helpHubDestinations.customOrderWaitlist.href
    }
  }
} as const satisfies Record<HelpFaqId, HelpFaqItem>;

export const canonicalFaqItems = Object.values(faqItemsById);

export const helpFaqGroups = [
  {
    title: "Fit and sizing",
    itemIds: ["choose-size", "sizing-kits", "fit-problem"]
  },
  {
    title: "Application and care",
    itemIds: ["included-items", "glue-or-tabs", "wear-time", "reuse", "removal"]
  },
  {
    title: "Orders and support",
    itemIds: [
      "processing",
      "shipping-price",
      "tracking",
      "returns",
      "damaged-incorrect-defective",
      "lost-package",
      "cancellations",
      "custom-orders"
    ]
  }
] as const satisfies readonly { title: HelpFaqCategory; itemIds: readonly HelpFaqId[] }[];

export const productPageFaqIds = [
  "choose-size",
  "wear-time",
  "reuse",
  "glue-or-tabs",
  "processing",
  "custom-orders",
  "fit-problem"
] as const satisfies readonly HelpFaqId[];

export const productPageFaqItems = productPageFaqIds.map((itemId) => faqItemsById[itemId]);
