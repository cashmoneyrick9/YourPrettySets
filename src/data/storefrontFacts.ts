export const supportDetails = {
  email: "yourprettysets@gmail.com",
  mailto: "mailto:yourprettysets@gmail.com"
} as const;

const standaloneKitPrice = 10;
const customOrderKitPrice = 0;
const customOrdersStatus = "waitlist-only";

export const sizingFacts = {
  presetRange: "00–14",
  readyToWearNailCount: 24,
  standaloneKitPrice,
  standaloneKitPriceLabel: `$${standaloneKitPrice}`,
  customOrderKitPrice,
  customOrderKitPriceLabel: customOrderKitPrice === 0 ? "Free" : `$${customOrderKitPrice}`,
  customOrdersStatus,
  customOrdersStatusLabel: "Waitlist-only"
} as const;

export const includedSetItems = [
  "Press-on nails",
  "Nail glue",
  "Adhesive tabs",
  "Nail file",
  "Cuticle stick",
  "Alcohol wipe",
  "Storage case"
] as const;

export const wearEstimates = {
  glue: "1–3+ weeks",
  tabs: "7–14 days",
  variables: [
    "Nail preparation",
    "Application",
    "Lifestyle",
    "Water exposure",
    "Natural nail condition",
    "Daily activity"
  ]
} as const;

const shippingFlatRate = 7;
const freeShippingThreshold = 65;
const freeShippingService = "priority shipping";

export const shippingFacts = {
  readyToShipProcessing: "1–3 business days",
  madeToOrderProcessing: "2–4 business days",
  carrierTransit: "5–7 business days",
  flatRate: shippingFlatRate,
  flatRateLabel: `Approximately $${shippingFlatRate}`,
  freeShippingThreshold,
  freeShippingService,
  freeShippingLabel: `Free ${freeShippingService}`,
  trackingIncluded: true,
  trackingLabel: "Included with every order",
  customOrderTiming: "Varies with design complexity and the current queue"
} as const;

export const orderPolicyFacts = {
  cancellationWindowHours: 24,
  issueReportingWindowDays: 7,
  standardReturnsAccepted: false,
  cancellationRule:
    "Orders may be cancelled within 24 hours of purchase, provided painting or production has not started."
} as const;

export const helpContentMetadata = {
  lastUpdated: "July 9, 2026"
} as const;
