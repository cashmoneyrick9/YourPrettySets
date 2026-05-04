import { Gift, Hand, Package, Sparkles } from "lucide-react";

const kitItems = [
  "24 nails",
  "Adhesive tabs",
  "Nail glue",
  "Nail file",
  "Cuticle pusher",
  "Alcohol wipe",
  "Application card",
  "Storage box or bag"
];

export function KitContents() {
  return (
    <section className="section-block kit-section">
      <div className="section-heading">
        <p className="eyebrow">What's included</p>
        <h2>Everything needed to apply and care for your set.</h2>
      </div>
      <div className="kit-layout">
        <div className="kit-feature">
          <Sparkles aria-hidden="true" />
          <p>Includes 24 nails so you can find your best fit.</p>
        </div>
        <ul className="kit-list">
          {kitItems.map((item, index) => {
            const Icon = index % 3 === 0 ? Package : index % 3 === 1 ? Hand : Gift;

            return (
              <li key={item}>
                <Icon aria-hidden="true" />
                <span>{item}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
