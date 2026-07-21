import type { OrderType } from "../data/products";
import { getProductArrivalEstimate } from "../lib/productTiming";

export function ProductArrivalEstimate({ orderType }: { orderType: OrderType }) {
  const estimate = getProductArrivalEstimate(orderType);
  const processingLead = orderType === "ready-to-ship" ? "Ready in" : "Made in";

  return (
    <aside className="product-arrival" aria-label="Estimated order timing">
      <p className="product-arrival__primary">
        <span>Estimated arrival:</span> <strong>{estimate.arrivalLabel}</strong>
      </p>
      <p className="product-arrival__detail">
        {processingLead} {estimate.processingLabel}
        <span aria-hidden="true"> · </span>
        In transit {estimate.transitLabel}
      </p>
    </aside>
  );
}
