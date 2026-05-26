import { useState } from "react";

type KitPanelId = "fit" | "prep";

const sizeTiles = ["0", "1", "3", "4", "5", "6", "8", "10"];

const prepItems = ["Adhesive tabs", "Nail glue", "Nail file", "Cuticle pusher", "Alcohol wipe", "Storage pouch/card"];

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
            src="/assets/kit-contents-spread.png"
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
                <p>Extra sizes help you find the best fit for each finger before applying.</p>
                <div className="kit-size-row" aria-label="Example nail sizes">
                  {sizeTiles.map((size, index) => (
                    <span className="kit-size-tile" key={size}>
                      <span className={`kit-size-tile__nail kit-size-tile__nail--${index}`} aria-hidden="true" />
                      <span>{size}</span>
                    </span>
                  ))}
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
                    <span className="kit-item-tile" key={item}>
                      <span className="kit-item-tile__shape" aria-hidden="true" />
                      <span>{item}</span>
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
