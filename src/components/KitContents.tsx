import { useState } from "react";

type KitPanelId = "fit" | "prep";
type PrepItem = {
  imageSrc?: string;
  label: string;
};

const prepItems: PrepItem[] = [
  { imageSrc: "/assets/adhesive-tabs.png", label: "Adhesive tabs" },
  { imageSrc: "/assets/nail-glue.png", label: "Nail glue" },
  { imageSrc: "/assets/nail-file.png", label: "Nail file" },
  { imageSrc: "/assets/cuticle-pusher.png", label: "Cuticle pusher" },
  { imageSrc: "/assets/alcohol-wipe.png", label: "Alcohol wipe" },
  { imageSrc: "/assets/storage-case.png", label: "Storage case/card" }
];

export function KitContents() {
  const [openPanel, setOpenPanel] = useState<KitPanelId>("fit");

  return (
    <section className="section-block kit-section" aria-labelledby="kit-heading">
      <div className="section-heading kit-heading">
        <p className="eyebrow">THE COMPLETE SET</p>
        <h2 id="kit-heading">What’s Included</h2>
        <p>Everything you need for your set.</p>
      </div>

      <div className="kit-layout">
        <div className="kit-spread">
          <img
            alt="Press-on nail kit with tabs and tools"
            className="kit-spread__image"
            src="/assets/kit-contents-spread-v2.png"
          />
        </div>

        <div className="kit-accordion" aria-label="Included kit details">
          <article className={`kit-accordion__item${openPanel === "fit" ? " kit-accordion__item--open" : ""}`}>
            <button
              aria-controls="kit-panel-fit"
              aria-expanded={openPanel === "fit"}
              className="kit-accordion__button"
              onClick={() => setOpenPanel("fit")}
              type="button"
            >
              <span className="kit-accordion__number">1</span>
              <span className="kit-accordion__summary">
                <span className="kit-accordion__title">Made to fit</span>
                <span className="kit-accordion__preview">24 nails in multiple sizes</span>
              </span>
              <span className="kit-accordion__chevron" aria-hidden="true">
                {openPanel === "fit" ? "−" : "+"}
              </span>
            </button>
            {openPanel === "fit" && (
              <div className="kit-accordion__panel" id="kit-panel-fit">
                <div className="kit-size-row" aria-label="Example nail sizes">
                  <img
                    alt="Twenty-four press-on nails in multiple sizes with small fruit details"
                    className="kit-size-row__image"
                    src="/assets/nail-size-set.png"
                  />
                </div>
              </div>
            )}
          </article>

          <article className={`kit-accordion__item${openPanel === "prep" ? " kit-accordion__item--open" : ""}`}>
            <button
              aria-controls="kit-panel-prep"
              aria-expanded={openPanel === "prep"}
              className="kit-accordion__button"
              onClick={() => setOpenPanel("prep")}
              type="button"
            >
              <span className="kit-accordion__number">2</span>
              <span className="kit-accordion__summary">
                <span className="kit-accordion__title">Prep + apply kit</span>
                <span className="kit-accordion__preview">Tabs, glue, file, wipe + pusher</span>
              </span>
              <span className="kit-accordion__chevron" aria-hidden="true">
                {openPanel === "prep" ? "−" : "+"}
              </span>
            </button>
            {openPanel === "prep" && (
              <div className="kit-accordion__panel" id="kit-panel-prep">
                <div className="kit-item-grid" aria-label="Prep and application items">
                  {prepItems.map((item) => (
                    <span className="kit-item-card" key={item.label}>
                      <img className="kit-item-card__image" src={item.imageSrc} alt="" aria-hidden="true" />
                      <span>{item.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        <a className="kit-primary-link" href="#faq">
          HOW TO APPLY &amp; CARE <span aria-hidden="true">→</span>
        </a>
        <a className="kit-faq-link" href="#faq">
          Have a question? Visit our FAQ
        </a>
      </div>
    </section>
  );
}
