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

export type HelpQuickTaskId =
  | "find-size"
  | "apply"
  | "track-order"
  | "damaged-order"
  | "shipping-times"
  | "returns";

export interface HelpQuickTask {
  id: HelpQuickTaskId;
  title: string;
  summary: string;
  answer: string;
  steps?: readonly string[];
  action: HelpContentLink;
}

export const helpQuickTasks = [
  {
    id: "find-size",
    title: "Find my size",
    summary: `${sizingFacts.readyToWearNailCount} nails across preset sizes ${sizingFacts.presetRange} give you a broad fit range.`,
    answer:
      "Lay out the closest match for every finger before applying adhesive. Exact millimeter mappings are still being finalized, so use a physical sizing kit when you need certainty.",
    steps: ["Compare every nail before application", "Keep each press-on off the surrounding skin", "Use a sizing kit when the fit is uncertain"],
    action: { label: "Open Find Your Fit", href: helpRoutes.sizing.href }
  },
  {
    id: "apply",
    title: "How to apply",
    summary: "Prep clean, dry nails; choose glue or tabs; align each press-on; then press steadily.",
    answer:
      "Choose your adhesive based on the wear you want, but complete the same preparation and fit check first. Nail glue and adhesive tabs have separate application paths.",
    steps: ["Clean, dry, and prep every natural nail", "Lay out the correct press-on for each finger", "Follow the glue or tab instructions", "Avoid shifting the nail while pressing"],
    action: { label: "Open the application steps", href: helpRoutes.application.href }
  },
  {
    id: "track-order",
    title: "Track my order",
    summary: shippingFacts.trackingLabel,
    answer:
      "Use the tracking record as the best current source after shipment. If it stops updating or the carrier reports a problem, send support your order and tracking details.",
    action: { label: "See tracking and lost-package help", href: `${helpRoutes.shippingReturns.href}#lost-packages` }
  },
  {
    id: "damaged-order",
    title: "Fix a damaged order",
    summary: `Report damaged, incorrect, or defective items within ${orderPolicyFacts.issueReportingWindowDays} days of confirmed delivery.`,
    answer:
      "Email support with the order details, a clear description, and photos that show the issue. Each case is reviewed individually; a refund or replacement is not automatic.",
    steps: ["Include the order details", "Describe exactly what arrived", "Attach clear photos of the issue"],
    action: { label: "See the order-issue process", href: `${helpRoutes.shippingReturns.href}#order-problems` }
  },
  {
    id: "shipping-times",
    title: "Shipping times",
    summary: `Allow approximately ${shippingFacts.readyToShipProcessing} to process ready-to-ship orders, then approximately ${shippingFacts.carrierTransit} for carrier transit.`,
    answer: `Made-to-order processing is approximately ${shippingFacts.madeToOrderProcessing}. Processing and transit are separate, and carrier estimates are not guaranteed delivery dates.`,
    action: { label: "See all shipping details", href: `${helpRoutes.shippingReturns.href}#processing-transit` }
  },
  {
    id: "returns",
    title: "Returns",
    summary: standardReturnsSentence,
    answer: `Damaged, incorrect, or defective items are handled through the order-issue process when reported within ${orderPolicyFacts.issueReportingWindowDays} days of confirmed delivery.`,
    action: { label: "Read returns and order issues", href: `${helpRoutes.shippingReturns.href}#returns` }
  }
] as const satisfies readonly HelpQuickTask[];

export interface HelpSearchEntry {
  id: string;
  title: string;
  context: string;
  href: string;
  keywords: readonly string[];
}

const helpSectionSearchEntries = [
  {
    id: "find-your-fit",
    title: "Find Your Fit",
    context: "Sizing, ready-to-wear fit, and choosing a sizing kit",
    href: helpRoutes.sizing.href,
    keywords: ["size", "sizing", "fit", "measure", "measurement", "24 nails", "00 14"]
  },
  {
    id: "sizing-kit",
    title: "Sizing Kit",
    context: `${sizingFacts.standaloneKitPriceLabel} standalone sizing help`,
    href: helpHubDestinations.sizingKitProduct.href,
    keywords: ["size samples", "custom set", "fit kit", "measure nails", "ten dollars"]
  },
  {
    id: "apply-your-set",
    title: "Apply Your Set",
    context: "Prepare, choose an adhesive, and apply step by step",
    href: helpRoutes.application.href,
    keywords: ["application", "apply", "install", "put on", "press ons"]
  },
  {
    id: "application-included",
    title: "What comes with each set",
    context: "Press-ons, adhesives, prep tools, and storage case",
    href: `${helpRoutes.application.href}#included`,
    keywords: ["included", "kit", "box", "nail glue", "tabs", "file", "cuticle stick", "alcohol wipe"]
  },
  {
    id: "application-adhesive",
    title: "Choose nail glue or adhesive tabs",
    context: "Compare the two included application methods",
    href: `${helpRoutes.application.href}#choose-adhesive`,
    keywords: ["adhesive", "glue", "tabs", "wear", "how long"]
  },
  {
    id: "application-prep",
    title: "Prepare your natural nails",
    context: "Clean, dry, and prep before applying adhesive",
    href: `${helpRoutes.application.href}#prepare-natural-nails`,
    keywords: ["prep", "clean", "alcohol wipe", "file", "cuticle", "before application"]
  },
  {
    id: "application-fit",
    title: "Select and arrange your press-ons",
    context: "Check every nail's fit before using adhesive",
    href: `${helpRoutes.application.href}#select-and-arrange`,
    keywords: ["arrange", "layout", "match", "select", "size", "fit"]
  },
  {
    id: "application-glue",
    title: "Apply with nail glue",
    context: `Application steps and an estimated ${wearEstimates.glue} wear window`,
    href: `${helpRoutes.application.href}#apply-with-glue`,
    keywords: ["glue application", "long wear", "hold", "bond"]
  },
  {
    id: "application-tabs",
    title: "Apply with adhesive tabs",
    context: `Application steps and an estimated ${wearEstimates.tabs} wear window`,
    href: `${helpRoutes.application.href}#apply-with-tabs`,
    keywords: ["sticky tabs", "tab application", "adhesive stickers", "short wear"]
  },
  {
    id: "application-aftercare",
    title: "Aftercare and wear expectations",
    context: "Water exposure, daily activity, lifting, and realistic wear",
    href: `${helpRoutes.application.href}#aftercare`,
    keywords: ["care", "wear time", "last", "water", "lifting", "reuse"]
  },
  {
    id: "application-problems",
    title: "Common application problems",
    context: "Help with early lifting, gaps, rocking, and fit",
    href: `${helpRoutes.application.href}#application-problems`,
    keywords: ["troubleshoot", "problem", "lifting", "gap", "rocks", "does not fit"]
  },
  {
    id: "remove-and-reuse",
    title: "Remove & Reuse",
    context: "Removal guidance for tabs and nail glue",
    href: helpRoutes.removal.href,
    keywords: ["remove", "removal", "take off", "soak", "warm water", "clean", "store", "reuse"]
  },
  {
    id: "shipping-timing",
    title: "Processing and shipping timing",
    context: "Separate order processing from carrier transit",
    href: `${helpRoutes.shippingReturns.href}#processing-transit`,
    keywords: ["shipping", "delivery", "arrival", "processing", "transit", "how long", "tracking"]
  },
  {
    id: "damaged-order",
    title: "Damaged or incorrect order",
    context: "What to send support for an order issue",
    href: helpHubDestinations.damagedOrder.href,
    keywords: ["damaged", "defective", "wrong item", "incorrect", "broken", "replacement"]
  },
  {
    id: "lost-package",
    title: "Lost package",
    context: "Tracking, investigation, and possible carrier claims",
    href: helpHubDestinations.lostPackage.href,
    keywords: ["lost", "missing", "carrier", "tracking stopped", "not delivered", "package"]
  },
  {
    id: "cancel-order",
    title: "Cancel an order",
    context: `The ${orderPolicyFacts.cancellationWindowHours}-hour cancellation rule`,
    href: helpHubDestinations.cancellations.href,
    keywords: ["cancel", "cancellation", "change order", "production", "painting"]
  },
  {
    id: "contact-support",
    title: "Contact Support",
    context: "Get personal help with fit, products, or an order",
    href: helpRoutes.contact.href,
    keywords: ["contact", "email", "support", "help", "customer service"]
  }
] as const satisfies readonly HelpSearchEntry[];

const faqCategoryAnchors: Record<HelpFaqCategory, string> = {
  "Fit and sizing": "faq-fit-and-sizing",
  "Application and care": "faq-application-and-care",
  "Orders and support": "faq-orders-and-support"
};

export const helpSearchEntries: readonly HelpSearchEntry[] = [
  ...helpSectionSearchEntries,
  ...canonicalFaqItems.map((item) => ({
    id: `faq-${item.id}`,
    title: item.question,
    context: `FAQ · ${item.category}`,
    href: `${helpRoutes.faq.href}#${faqCategoryAnchors[item.category]}`,
    keywords: [item.answer, item.category, item.relatedLink.label]
  }))
];

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
