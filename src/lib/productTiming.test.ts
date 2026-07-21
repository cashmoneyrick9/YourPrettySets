import { describe, expect, it } from "vitest";
import { getProductArrivalEstimate } from "./productTiming";

describe("product arrival timing", () => {
  const saturdayJuly18 = new Date(2026, 6, 18, 12);

  it("combines ready-to-ship processing and transit business days", () => {
    expect(getProductArrivalEstimate("ready-to-ship", saturdayJuly18)).toEqual({
      arrivalLabel: "Jul 27–31",
      processingLabel: "1–3 business days",
      transitLabel: "5–7 business days"
    });
  });

  it("adapts the arrival range for made-to-order processing", () => {
    expect(getProductArrivalEstimate("made-to-order", saturdayJuly18)).toEqual({
      arrivalLabel: "Jul 28–Aug 3",
      processingLabel: "2–4 business days",
      transitLabel: "5–7 business days"
    });
  });
});
