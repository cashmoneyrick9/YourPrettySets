import { ChevronDown, FileText, Hand, Package, Sparkles } from "lucide-react";
import { useState } from "react";

type KitGroupId = "set" | "application" | "aftercare";

type KitGroup = {
  id: KitGroupId;
  title: string;
  preview: string;
  items: string[];
  Icon: typeof Package;
};

const kitGroups: KitGroup[] = [
  {
    id: "set",
    title: "In the set",
    preview: "24 nails, Adhesive tabs",
    items: ["24 nails", "Adhesive tabs"],
    Icon: Package
  },
  {
    id: "application",
    title: "For application",
    preview: "Nail glue, Nail file, Cuticle pusher",
    items: ["Nail glue", "Nail file", "Cuticle pusher"],
    Icon: Hand
  },
  {
    id: "aftercare",
    title: "For aftercare",
    preview: "Alcohol wipe, Application card, Storage box",
    items: ["Alcohol wipe", "Application card", "Storage box"],
    Icon: Sparkles
  }
];

export function KitContents() {
  const [openGroup, setOpenGroup] = useState<KitGroupId>("set");

  return (
    <section className="section-block kit-section">
      <div className="section-heading">
        <p className="eyebrow">What's included</p>
        <h2>Everything ready for your set.</h2>
      </div>
      <div className="kit-layout">
        <div className="kit-summary">
          <div className="kit-summary__copy">
            <Sparkles aria-hidden="true" />
            <p>24 nails plus the tools to apply, wear, and store them.</p>
          </div>
          <div className="kit-flatlay" aria-label="Press-on nail kit contents">
            <div className="kit-flatlay__nails" aria-hidden="true">
              <span className="kit-flatlay__nail kit-flatlay__nail--one" />
              <span className="kit-flatlay__nail kit-flatlay__nail--two" />
              <span className="kit-flatlay__nail kit-flatlay__nail--three" />
              <span className="kit-flatlay__nail kit-flatlay__nail--four" />
              <span className="kit-flatlay__nail kit-flatlay__nail--five" />
              <span className="kit-flatlay__nail kit-flatlay__nail--six" />
            </div>
            <span className="kit-flatlay__tabs" aria-hidden="true" />
            <span className="kit-flatlay__glue" aria-hidden="true" />
            <span className="kit-flatlay__file" aria-hidden="true" />
            <span className="kit-flatlay__wipe" aria-hidden="true" />
            <span className="kit-flatlay__card" aria-hidden="true">
              <FileText aria-hidden="true" />
            </span>
            <span className="kit-flatlay__pouch" aria-hidden="true" />
          </div>
        </div>
        <div className="kit-accordion">
          {kitGroups.map(({ id, title, preview, items, Icon }) => {
            const isOpen = openGroup === id;
            const panelId = `kit-panel-${id}`;

            return (
              <article className={`kit-accordion__item${isOpen ? " kit-accordion__item--open" : ""}`} key={id}>
                <button
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  className="kit-accordion__button"
                  onClick={() => setOpenGroup(id)}
                  type="button"
                >
                  <span className="kit-accordion__icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="kit-accordion__heading">
                    <strong>{title}</strong>
                    {!isOpen && <small>{preview}</small>}
                  </span>
                  <ChevronDown aria-hidden="true" className="kit-accordion__chevron" />
                </button>
                {isOpen && (
                  <div className="kit-accordion__panel" id={panelId}>
                    {items.map((item) => (
                      <span className="kit-accordion__chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
        <a className="kit-care-link" href="#faq">
          See care tips <span aria-hidden="true">›</span>
        </a>
      </div>
    </section>
  );
}
