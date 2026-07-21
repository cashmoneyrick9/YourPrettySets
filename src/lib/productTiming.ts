import type { OrderType } from "../data/products";
import { shippingFacts } from "../data/storefrontFacts";

type BusinessDayRange = {
  maximum: number;
  minimum: number;
};

export type ProductArrivalEstimate = {
  arrivalLabel: string;
  processingLabel: string;
  transitLabel: string;
};

function parseBusinessDayRange(value: string): BusinessDayRange {
  const values = value.match(/\d+/g)?.map(Number) ?? [];
  const minimum = values[0] ?? 0;

  return {
    minimum,
    maximum: values[1] ?? minimum
  };
}

function addBusinessDays(startDate: Date, numberOfDays: number) {
  const result = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < numberOfDays) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded += 1;
    }
  }

  return result;
}

function formatArrivalRange(startDate: Date, endDate: Date) {
  const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
  const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });

  if (startMonth === endMonth) {
    return `${startMonth} ${startDate.getDate()}–${endDate.getDate()}`;
  }

  return `${startMonth} ${startDate.getDate()}–${endMonth} ${endDate.getDate()}`;
}

export function getProductArrivalEstimate(orderType: OrderType, startDate = new Date()): ProductArrivalEstimate {
  const processingLabel = orderType === "ready-to-ship"
    ? shippingFacts.readyToShipProcessing
    : shippingFacts.madeToOrderProcessing;
  const processing = parseBusinessDayRange(processingLabel);
  const transit = parseBusinessDayRange(shippingFacts.carrierTransit);
  const earliestArrival = addBusinessDays(startDate, processing.minimum + transit.minimum);
  const latestArrival = addBusinessDays(startDate, processing.maximum + transit.maximum);

  return {
    arrivalLabel: formatArrivalRange(earliestArrival, latestArrival),
    processingLabel,
    transitLabel: shippingFacts.carrierTransit
  };
}
