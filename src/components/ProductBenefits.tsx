type ProductBenefitIconKind = "brush" | "kit" | "reuse" | "styles";

type BenefitIconProps = {
  kind: ProductBenefitIconKind;
};

function ProductBenefitIcon({ kind }: BenefitIconProps) {
  if (kind === "brush") {
    return (
      <svg aria-hidden="true" data-icon="hand-painted" focusable="false" viewBox="0 0 40 40">
        <path d="M7.5 31.5V20c0-6.7 3-11.5 6.8-11.5S21 13.3 21 20v11.5H7.5Z" />
        <path d="m24 10.8 5.2-5.2 5.2 5.2-5.2 5.2Z" />
        <path d="m26.6 13.4-8.1 8.1-1 4 4-1 8.1-8.1" />
        <path d="m19.4 20.6 3 3" />
      </svg>
    );
  }

  if (kind === "reuse") {
    return (
      <svg aria-hidden="true" data-icon="rewear" focusable="false" viewBox="0 0 40 40">
        <path d="M15.2 31V19.3c0-5.7 2-9.3 4.8-9.3s4.8 3.6 4.8 9.3V31Z" />
        <path d="M32.3 17.2A12.8 12.8 0 0 0 11.6 9L8.8 12" />
        <path d="M8.8 7.4V12h4.7" />
        <path d="M7.7 22.8A12.8 12.8 0 0 0 28.4 31l2.8-3" />
        <path d="M31.2 32.6V28h-4.7" />
      </svg>
    );
  }

  if (kind === "kit") {
    return (
      <svg aria-hidden="true" data-icon="application-kit" focusable="false" viewBox="0 0 40 40">
        <rect height="22" rx="4" width="29" x="5.5" y="11.5" />
        <path d="M13 11.5v-3h14v3M5.5 18h29" />
        <path d="M12.5 23v6M9.5 26h6" />
        <path d="M23 22h6.5v7.5H23ZM24.7 19.5h3.1" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" data-icon="style-range" focusable="false" viewBox="0 0 40 40">
      <path d="M4.8 32V20.5c0-5.3 1.8-8.8 4.4-8.8s4.4 3.5 4.4 8.8V32Z" />
      <path d="M15.4 32V16.8c0-6.3 2.1-10.3 4.8-10.3s4.8 4 4.8 10.3V32Z" />
      <path d="M26.7 32V18.7c0-5.9 1.8-9.6 4.3-9.6s4.3 3.7 4.3 9.6V32Z" />
      <path d="M3.5 32h33" />
    </svg>
  );
}

const productBenefitItems = [
  { icon: "brush", label: "Painted by hand" },
  { icon: "reuse", label: "Made to rewear" },
  { icon: "kit", label: "Application kit included" },
  { icon: "styles", label: "Six shapes · Five lengths" }
] as const;

export function ProductBenefits() {
  return (
    <aside className="product-benefits" aria-label="Why this set works">
      <div className="product-benefits__grid">
        {productBenefitItems.map((benefit) => (
          <div className="product-benefit" key={benefit.label}>
            <span className="product-benefit__icon">
              <ProductBenefitIcon kind={benefit.icon} />
            </span>
            <span>{benefit.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
