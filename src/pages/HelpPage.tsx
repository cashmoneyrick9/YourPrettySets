import { Link } from "react-router-dom";

type HelpCard = {
  body: string;
  href: string;
  title: string;
};

const helpCards: HelpCard[] = [
  {
    body: "Find the best fit before choosing your set.",
    href: "/help/sizing",
    title: "Sizing Guide"
  },
  {
    body: "Prep, apply, remove, and store your press-ons cleanly.",
    href: "/help/how-to-apply",
    title: "How to Apply & Remove"
  },
  {
    body: "Placeholder timing, delivery, and issue-window guidance.",
    href: "/help/shipping-returns",
    title: "Shipping & Returns"
  },
  {
    body: "Quick answers for ordering, wear time, reuse, and fit.",
    href: "/help/faq",
    title: "FAQ"
  },
  {
    body: "Reach support for sizing, order, or product questions.",
    href: "/help/contact",
    title: "Contact Support"
  }
];

const helpContent: Record<string, { body: string; eyebrow: string; title: string }> = {
  sizing: {
    body: "Use a sizing kit for the safest fit, or measure each natural nail in millimeters and match it to the closest available size. Final sizing copy can be refined when the product flow is locked.",
    eyebrow: "Help",
    title: "Sizing Guide"
  },
  "how-to-apply": {
    body: "Prep clean nails, choose glue or tabs, press firmly, and remove gently so your set can be stored and reused. This page is intentionally simple until the application guide is finalized.",
    eyebrow: "Help",
    title: "How to Apply & Remove"
  },
  "shipping-returns": {
    body: "Shipping and return details are placeholder structure for now. Current direction is standard shipping, free shipping over the selected threshold, and support for damaged, incorrect, or missing orders.",
    eyebrow: "Help",
    title: "Shipping & Returns"
  },
  faq: {
    body: "Common ordering questions will live here, including sizing, wear time, glue versus tabs, reuse, processing, and custom-order availability.",
    eyebrow: "Help",
    title: "FAQ"
  },
  contact: {
    body: "For now, support is available by email at hello@yourprettysets.com. A fuller support flow can be added after order handling is decided.",
    eyebrow: "Help",
    title: "Contact Support"
  }
};

export function HelpHubPage() {
  return (
    <main className="help-page help-page--hub">
      <section className="help-page__inner" aria-labelledby="help-page-title">
        <div className="help-page__heading">
          <p className="eyebrow">Help</p>
          <h1 id="help-page-title">The Press-On Guide</h1>
          <p>Simple support pages for fit, application, shipping, FAQs, and contact.</p>
        </div>

        <div className="help-page__grid">
          {helpCards.map((card) => (
            <Link aria-label={card.title} className="help-card" key={card.href} to={card.href}>
              <span className="help-card__title">{card.title}</span>
              <span className="help-card__body">{card.body}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export function HelpSubpage({ page }: { page: keyof typeof helpContent }) {
  const content = helpContent[page];

  return (
    <main className="help-page">
      <section className="help-page__inner help-page__inner--article" aria-labelledby="help-article-title">
        <Link className="help-page__back-link" to="/help">
          Back to Help
        </Link>
        <div className="help-page__heading">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1 id="help-article-title">{content.title}</h1>
          <p>{content.body}</p>
        </div>
      </section>
    </main>
  );
}

export function PolicyPlaceholderPage({ title }: { title: "Privacy" | "Terms" }) {
  return (
    <main className="help-page">
      <section className="help-page__inner help-page__inner--article" aria-labelledby="policy-page-title">
        <div className="help-page__heading">
          <p className="eyebrow">Policies</p>
          <h1 id="policy-page-title">{title}</h1>
          <p>This placeholder keeps the footer route real while final policy wording is still undecided.</p>
        </div>
      </section>
    </main>
  );
}
