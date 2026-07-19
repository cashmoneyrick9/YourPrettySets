import { Link } from "react-router-dom";
import { ChevronRight, CircleHelp, Mail, Package, Pipette, RotateCcw, Ruler } from "lucide-react";
import {
  HelpArticleShell,
  HelpCallout,
  HelpFactList,
  HelpFaqAccordion,
  HelpImagePanel,
  HelpIssueChecklist,
  HelpPolicyBlock,
  HelpRelatedLinks,
  HelpSearch,
  HelpSection,
  HelpStepList,
  HelpSupportCta,
  type HelpContentsItem,
  type HelpLink
} from "@/components/help";
import {
  faqItemsById,
  getRelatedGuides,
  helpFaqGroups,
  helpHubDestinations,
  helpRoutes,
  type HelpArticleRouteId
} from "@/data/helpContent";
import {
  includedSetItems,
  orderPolicyFacts,
  shippingFacts,
  sizingFacts,
  supportDetails,
  wearEstimates
} from "@/data/storefrontFacts";

function articleRelatedLinks(routeId: HelpArticleRouteId): HelpLink[] {
  return getRelatedGuides(routeId).map((route) => ({
    description: route.summary,
    title: route.title,
    to: route.href
  }));
}

function formatNaturalList(items: readonly string[]) {
  if (items.length < 2) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function StandardArticleEnding({ routeId }: { routeId: HelpArticleRouteId }) {
  return (
    <>
      <HelpRelatedLinks links={articleRelatedLinks(routeId)} />
      <HelpSupportCta
        body="Use the guide first. If your question is still unresolved, send the details that will help support understand the issue."
        title="Still need a hand?"
      />
    </>
  );
}

const sizingContents = [
  { id: "sizing-system", label: "How sizing works" },
  { id: "ready-to-wear-fit", label: "Ready-to-wear fit" },
  { id: "sizing-kit", label: "Sizing kits" },
  { id: "fit-responsibility", label: "If a size is wrong" },
  { id: "fit-help", label: "When you are unsure" }
] as const satisfies readonly HelpContentsItem[];

const applicationContents = [
  { id: "included", label: "What comes with your set" },
  { id: "choose-adhesive", label: "Choose glue or tabs" },
  { id: "prepare-natural-nails", label: "Prepare your nails" },
  { id: "select-and-arrange", label: "Select and arrange" },
  { id: "apply-with-glue", label: "Apply with nail glue" },
  { id: "apply-with-tabs", label: "Apply with adhesive tabs" },
  { id: "aftercare", label: "Aftercare and wear" },
  { id: "application-problems", label: "Common problems" },
  { id: "next-removal", label: "Remove your set" }
] as const satisfies readonly HelpContentsItem[];

const removalContents = [
  { id: "removal-principles", label: "Before removal" },
  { id: "remove-tabs", label: "Adhesive tabs" },
  { id: "remove-glue", label: "Nail glue" },
  { id: "clean-store", label: "Clean and store" },
  { id: "reuse-expectations", label: "Reuse expectations" },
  { id: "stop-and-contact", label: "When to stop" }
] as const satisfies readonly HelpContentsItem[];

const shippingContents = [
  { id: "processing-transit", label: "Processing and transit" },
  { id: "shipping-rates", label: "Shipping and tracking" },
  { id: "returns", label: "Returns" },
  { id: "order-problems", label: "Damaged or incorrect orders" },
  { id: "lost-packages", label: "Lost packages" },
  { id: "cancellations", label: "Cancellations" }
] as const satisfies readonly HelpContentsItem[];

const contactContents = [
  { id: "contact-email", label: "Email support" },
  { id: "fit-questions", label: "Fit questions" },
  { id: "order-questions", label: "Order questions" },
  { id: "report-an-issue", label: "Damaged or incorrect items" },
  { id: "what-to-include", label: "What to include" },
  { id: "self-service", label: "Self-service guides" }
] as const satisfies readonly HelpContentsItem[];

export function HelpHubPage() {
  const topicLinks = [
    { label: "Sizing", href: helpRoutes.sizing.href, icon: Ruler },
    { label: "Application", href: helpRoutes.application.href, icon: Pipette },
    { label: "Removal & Reuse", href: helpRoutes.removal.href, icon: RotateCcw },
    { label: "Shipping, Returns & Order Issues", href: helpRoutes.shippingReturns.href, icon: Package },
    { label: "FAQ", href: helpRoutes.faq.href, icon: CircleHelp },
    { label: "Contact", href: helpRoutes.contact.href, icon: Mail }
  ] as const;

  const pathGroups = [
    {
      id: "before-order",
      eyebrow: "Before you order",
      title: "Start with the right fit",
      intro: "Understand the broad ready-to-wear size range or check fit with a sizing kit before choosing a set.",
      image: "/assets/nail-size-set.png",
      imageAlt: "Pale blush press-on nails arranged from larger to smaller sizes",
      links: [
        { label: "Find Your Fit", href: helpHubDestinations.sizing.href },
        { label: "Sizing Kit", href: helpHubDestinations.sizingKitProduct.href },
        { label: "Common pre-purchase questions", href: "/help/faq#faq-fit-and-sizing" }
      ]
    },
    {
      id: "apply-care",
      eyebrow: "Apply and care",
      title: "Make application feel simple",
      intro: "Choose your adhesive, follow the guided application sequence, then remove and store each nail with care.",
      image: "/assets/help/apply-press-on-alignment.jpg",
      imageAlt: "Hands aligning a pale blush press-on above a clean natural nail",
      links: [
        { label: "Apply Your Set", href: helpHubDestinations.application.href },
        { label: "Remove & Reuse", href: helpHubDestinations.removal.href },
        { label: "Wear and care guidance", href: "/help/application#aftercare" }
      ]
    },
    {
      id: "order-help",
      eyebrow: "Order help",
      title: "Find the right next step",
      intro: "Check timing, delivery, and issue guidance without searching through a long policy page first.",
      image: "/assets/hero-s3-summer.png",
      imageAlt: "Floral press-on nail set presented in a blush storage case",
      links: [
        { label: "Shipping and timing", href: `${helpRoutes.shippingReturns.href}#processing-transit` },
        { label: "Damaged or incorrect order", href: helpHubDestinations.damagedOrder.href },
        { label: "Lost package", href: helpHubDestinations.lostPackage.href },
        { label: "Cancellations", href: helpHubDestinations.cancellations.href }
      ]
    }
  ] as const;

  const mostAsked = [
    faqItemsById["choose-size"],
    faqItemsById["wear-time"],
    faqItemsById.reuse,
    faqItemsById.removal,
    faqItemsById["included-items"]
  ];

  return (
    <main className="help-page help-page--hub help-hub--editorial">
      <div className="help-page__inner help-hub help-hub-editorial">
        <header className="help-hub-editorial__intro">
          <div className="help-page__heading help-hub-editorial__heading">
            <p className="eyebrow">{helpRoutes.hub.eyebrow}</p>
            <h1>{helpRoutes.hub.title}</h1>
            <p>{helpRoutes.hub.summary}</p>
            <a className="help-hub-editorial__browse-button" href="#help-mobile-topics">
              Browse topics
            </a>
          </div>
          <HelpSearch />
        </header>

        <div className="help-paths" aria-label="Press-on help by task">
          {pathGroups.map((group, index) => (
            <section className="help-path" id={`help-path-${group.id}`} key={group.id} aria-labelledby={`help-path-${group.id}-title`}>
              <div className="help-path__media">
                <img alt={group.imageAlt} src={group.image} />
                <span aria-hidden="true" className="help-path__number">0{index + 1}</span>
              </div>
              <div className="help-path__content">
                <p className="help-path__eyebrow">{group.eyebrow}</p>
                <h2 id={`help-path-${group.id}-title`}>{group.title}</h2>
                <p className="help-path__intro">{group.intro}</p>
                <ul className="help-path__links">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href}>
                        <span>{link.label}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <section className="help-most-asked" aria-labelledby="help-most-asked-title">
          <div className="help-most-asked__heading">
            <p className="eyebrow">Frequently asked questions</p>
            <h2 id="help-most-asked-title">Most asked</h2>
            <Link to="/help/faq">Browse every question <span aria-hidden="true">→</span></Link>
          </div>
          <HelpFaqAccordion items={mostAsked} />
          <Link className="help-most-asked__mobile-link" to="/help/faq">
            View all FAQs <span aria-hidden="true">→</span>
          </Link>
        </section>

        <nav aria-labelledby="help-mobile-topics-title" className="help-mobile-topics" id="help-mobile-topics">
          <h2 id="help-mobile-topics-title">Browse by topic</h2>
          <ul>
            {topicLinks.map((topic) => {
              const Icon = topic.icon;

              return (
                <li key={topic.href}>
                  <Link to={topic.href}>
                    <Icon aria-hidden="true" size={18} strokeWidth={1.5} />
                    <span>{topic.label}</span>
                    <ChevronRight aria-hidden="true" size={17} strokeWidth={1.5} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <HelpSupportCta
          body="If the guide does not cover your fit, product, or order question, send support the details that will help explain it."
          className="help-hub-editorial__support"
          title="Still need personal help?"
        />
      </div>
    </main>
  );
}

export function SizingGuidePage() {
  return (
    <HelpArticleShell
      contents={sizingContents}
      eyebrow={helpRoutes.sizing.eyebrow}
      intro={helpRoutes.sizing.summary}
      title={helpRoutes.sizing.title}
    >
      <HelpSection
        id="sizing-system"
        title="How the sizing system works"
        intro={`YourPrettySets preset nail sizes span ${sizingFacts.presetRange}. The number identifies the nail size. Because the storefront does not yet have an approved measurement chart, compare physical samples with a sizing kit when you need an exact match.`}
      >
        <HelpCallout variant="important" title="Exact measurements are still being finalized">
          <p>
            An approved millimeter-to-size chart is not available in the storefront yet. This guide does not guess at
            those mappings. Use a sizing kit or contact support when you need an exact match.
          </p>
        </HelpCallout>
      </HelpSection>

      <HelpSection
        id="ready-to-wear-fit"
        title="Ready-to-wear sets give you a broad range"
        intro={`Every ready-to-wear set contains ${sizingFacts.readyToWearNailCount} nails. The broad ${sizingFacts.presetRange} range is intended to reduce sizing problems, while recognizing that individual fit can still vary.`}
      >
        <HelpImagePanel
          alt="Twenty-four pale blush press-on nails arranged from larger to smaller sizes"
          caption={`The ${sizingFacts.readyToWearNailCount}-nail ready-to-wear format gives you multiple sizes to compare before application.`}
          src="/assets/nail-size-set.png"
        />
        <HelpCallout variant="tip">
          <p>Lay out the best match for every finger before applying any glue or adhesive tab.</p>
        </HelpCallout>
      </HelpSection>

      <HelpSection
        id="sizing-kit"
        title="When to use a sizing kit"
        intro="A sizing kit lets you compare physical samples before a future order."
      >
        <HelpFactList
          items={[
            {
              label: "Standalone sizing kit",
              value: sizingFacts.standaloneKitPriceLabel,
              detail: "For sizing help without an active custom-set order."
            },
            {
              label: "With a custom-set order",
              value: sizingFacts.customOrderKitPriceLabel,
              detail: "A sizing kit connected to a custom order does not add a kit charge."
            },
            {
              label: "Custom orders",
              value: sizingFacts.customOrdersStatusLabel,
              detail: "Open the current signup page for waitlist status instead of attempting to place an order now."
            }
          ]}
        />
        <HelpCallout variant="status" title="Sizing-kit checkout is not connected yet">
          <p>
            The <Link to="/products/sizing-kit">Sizing Kit product page</Link> shows the confirmed product and price,
            but online ordering is not available yet.
          </p>
        </HelpCallout>
      </HelpSection>

      <HelpSection id="fit-responsibility" title="If a selected size is wrong">
        <HelpPolicyBlock
          title="A fair fit approach"
          intro={`Ready-to-wear ${sizingFacts.readyToWearNailCount}-nail sets and sizing kits are provided to reduce sizing risk.`}
        >
          <p>
            Customers are responsible for sizes they independently select, so an incorrect customer-selected size is
            generally not eligible for free replacement. If YourPrettySets makes the sizing or fulfillment error, the
            company will make it right.
          </p>
        </HelpPolicyBlock>
      </HelpSection>

      <HelpSection id="fit-help" title="When you are unsure">
        <HelpIssueChecklist
          title="Send a useful fit question"
          intro="Before ordering or applying, email support with:"
          items={[
            "The set or product you are considering",
            "Whether you are choosing ready-to-wear or waiting for a custom order",
            "A clear description of which fingers or sample sizes are uncertain",
            "Clear photos only when they help explain the fit question"
          ]}
        />
      </HelpSection>

      <StandardArticleEnding routeId="sizing" />
    </HelpArticleShell>
  );
}

export function ApplicationGuidePage() {
  return (
    <HelpArticleShell
      className="help-application--guided"
      eyebrow={helpRoutes.application.eyebrow}
      intro={helpRoutes.application.summary}
      title={helpRoutes.application.title}
    >
      <nav aria-label="Application steps" className="application-jump-nav">
        <p>Application steps</p>
        <ol>
          {applicationContents.map((item, index) => (
            <li key={item.id}>
              <a href={`#${item.id}`}><span>{index + 1}</span>{item.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <section className="application-step application-step--included" id="included" aria-labelledby="included-title">
        <div className="application-step__content">
          <p className="application-step__eyebrow">Step 01</p>
          <h2 id="included-title">Set out what comes with your set</h2>
          <p>Keep every item within reach before opening either adhesive.</p>
          <ul className="application-kit-list">
            {includedSetItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <figure className="application-step__image">
          <img alt="Press-on application supplies with adhesive tabs, nail glue, alcohol wipe, file, cuticle stick, and storage case" src="/assets/kit-contents-spread-v2.png" />
          <figcaption>Both application methods are included, so choose one path for this wear.</figcaption>
        </figure>
      </section>

      <section className="application-step" id="choose-adhesive" aria-labelledby="choose-adhesive-title">
        <header className="application-step__header">
          <p className="application-step__eyebrow">Step 02</p>
          <h2 id="choose-adhesive-title">Choose nail glue or adhesive tabs</h2>
          <p>Choose based on the wear window you hope for, then follow only that adhesive’s application instructions.</p>
        </header>
        <div className="application-adhesive-choice">
          <article>
            <p className="application-adhesive-choice__label">Nail glue</p>
            <strong>Approximately {wearEstimates.glue}</strong>
            <p>Estimated wear only. Follow the directions supplied with the included glue.</p>
          </article>
          <article>
            <p className="application-adhesive-choice__label">Adhesive tabs</p>
            <strong>Approximately {wearEstimates.tabs}</strong>
            <p>Estimated wear only. Tabs have their own application and removal path.</p>
          </article>
        </div>
        <aside className="application-note application-note--important">
          <strong>Wear time is not guaranteed.</strong>
          <span>Preparation, application, lifestyle, water exposure, natural nail condition, and daily activity all affect wear.</span>
        </aside>
      </section>

      <section className="application-step" id="prepare-natural-nails" aria-labelledby="prepare-natural-nails-title">
        <header className="application-step__header">
          <p className="application-step__eyebrow">Step 03</p>
          <h2 id="prepare-natural-nails-title">Prepare your natural nails</h2>
        </header>
        <ol className="application-procedure">
          <li><strong>Clean and dry.</strong><span>Wash your hands, dry them completely, and begin with clean natural nails.</span></li>
          <li><strong>Prepare gently.</strong><span>Use the included cuticle stick and nail file carefully. Avoid aggressive filing or forcing any prep step.</span></li>
          <li><strong>Use the alcohol wipe.</strong><span>Wipe each natural nail and let it dry fully. Avoid touching the prepared surface afterward.</span></li>
        </ol>
      </section>

      <section className="application-step application-step--visual" id="select-and-arrange" aria-labelledby="select-and-arrange-title">
        <figure className="application-step__image">
          <img alt="Hands aligning a pale blush press-on above a clean natural nail with application tools nearby" src="/assets/help/apply-press-on-alignment.jpg" />
          <figcaption>Check the alignment and fit before lowering the press-on.</figcaption>
        </figure>
        <div className="application-step__content">
          <p className="application-step__eyebrow">Step 04</p>
          <h2 id="select-and-arrange-title">Select and arrange every nail</h2>
          <p>Lay out the closest-fitting press-on for each finger before opening the adhesive. Each nail should sit in line with the natural nail without resting on surrounding skin.</p>
          <Link className="application-inline-link" to="/help/sizing">Review Find Your Fit <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <div className="application-methods">
        <section className="application-step application-step--method" id="apply-with-glue" aria-labelledby="apply-with-glue-title">
          <header className="application-step__header">
            <p className="application-step__eyebrow">Step 05 · Glue path</p>
            <h2 id="apply-with-glue-title">Apply with nail glue</h2>
          </header>
          <ol className="application-procedure application-procedure--compact">
            <li><strong>Read the glue directions.</strong><span>Follow the supplied application and hold guidance.</span></li>
            <li><strong>Confirm the fit.</strong><span>Check that the correct press-on is ready before adding glue.</span></li>
            <li><strong>Align carefully.</strong><span>Keep the press-on in line with the natural nail and off surrounding skin.</span></li>
            <li><strong>Press steadily.</strong><span>Hold it as directed without shifting it side to side.</span></li>
          </ol>
        </section>

        <section className="application-step application-step--method application-step--method-tabs" id="apply-with-tabs" aria-labelledby="apply-with-tabs-title">
          <header className="application-step__header">
            <p className="application-step__eyebrow">Step 06 · Tab path</p>
            <h2 id="apply-with-tabs-title">Apply with adhesive tabs</h2>
          </header>
          <ol className="application-procedure application-procedure--compact">
            <li><strong>Match the tab.</strong><span>Choose one that fits the natural nail without touching surrounding skin.</span></li>
            <li><strong>Press it flat.</strong><span>Apply it to the clean, dry nail without folds or trapped gaps.</span></li>
            <li><strong>Remove the film.</strong><span>Lift only the protective film and keep the adhesive clean.</span></li>
            <li><strong>Align and press.</strong><span>Lower the correct press-on and press it steadily into place.</span></li>
          </ol>
        </section>
      </div>

      <section className="application-step application-step--aftercare" id="aftercare" aria-labelledby="aftercare-title">
        <header className="application-step__header">
          <p className="application-step__eyebrow">Step 07</p>
          <h2 id="aftercare-title">Support the wear with simple aftercare</h2>
          <p>Glue wear is estimated at approximately {wearEstimates.glue}; tab wear at approximately {wearEstimates.tabs}. These are ranges, not guarantees.</p>
        </header>
        <div className="application-aftercare-grid">
          <ul>
            <li>Follow the adhesive instructions before exposing the set to water.</li>
            <li>Limit prolonged water exposure when practical and dry hands thoroughly.</li>
            <li>Avoid using press-ons as tools for opening, scraping, or prying.</li>
            <li>If a nail lifts, remove and reapply it according to the adhesive directions instead of forcing it down.</li>
          </ul>
          <aside className="application-note">
            <strong>What changes wear</strong>
            <span>{formatNaturalList(wearEstimates.variables.map((item) => item.toLowerCase()))}.</span>
          </aside>
        </div>
      </section>

      <section className="application-step" id="application-problems" aria-labelledby="application-problems-title">
        <header className="application-step__header">
          <p className="application-step__eyebrow">Step 08</p>
          <h2 id="application-problems-title">Check common application problems</h2>
        </header>
        <dl className="application-troubleshooting">
          <div><dt>Lifts early</dt><dd><strong>Recheck prep.</strong> Oil, moisture, shifting during application, and water exposure can weaken the bond.</dd></div>
          <div><dt>Sits on skin</dt><dd><strong>Stop and resize.</strong> Choose a closer fit and realign before using adhesive.</dd></div>
          <div><dt>Rocks or leaves a gap</dt><dd><strong>Do not force it.</strong> The size or curve may not match that nail.</dd></div>
          <div><dt>Fit feels uncertain</dt><dd><strong>Ask before applying.</strong> Use Find Your Fit or contact support while the set is still unapplied.</dd></div>
        </dl>
      </section>

      <section className="application-next" id="next-removal" aria-labelledby="next-removal-title">
        <img alt="Pale blush press-on nails being loosened gently in comfortably warm water" src="/assets/help/remove-adhesive-tabs-warm-water.jpg" />
        <div>
          <p className="application-step__eyebrow">Step 09 · When wear is finished</p>
          <h2 id="next-removal-title">Move next to removal</h2>
          <p>Removal depends on the adhesive you used. Do not pull, peel, or pry through resistance.</p>
          <Link to="/help/removal">Open Remove & Reuse <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </HelpArticleShell>
  );
}

export function RemovalGuidePage() {
  return (
    <HelpArticleShell
      contents={removalContents}
      eyebrow={helpRoutes.removal.eyebrow}
      intro={helpRoutes.removal.summary}
      title={helpRoutes.removal.title}
    >
      <HelpSection id="removal-principles" title="Start with the adhesive you used">
        <HelpCallout variant="important" title="Never force a press-on off">
          <p>Do not pull, peel, or pry through resistance. Stop and reassess whenever a nail does not release easily.</p>
        </HelpCallout>
        <p>Keep track of whether the set was applied with adhesive tabs or nail glue. The two methods do not share the same removal guidance.</p>
      </HelpSection>

      <HelpSection id="remove-tabs" title="Remove adhesive tabs with warm-water assistance">
        <HelpImagePanel
          alt="Fingertips with pale blush press-ons resting in a shallow bowl of comfortably warm water"
          caption="Warm-water soaking can assist adhesive-tab removal. It is not the glue-removal method."
          src="/assets/help/remove-adhesive-tabs-warm-water.jpg"
        />
        <HelpStepList
          items={[
            { title: "Use comfortably warm water", body: "Rest the fingertips in a shallow bowl of comfortably warm—not hot—water." },
            { title: "Give the tabs time", body: "Let the warm water assist the adhesive. Do not pull at a nail that still feels firmly attached." },
            { title: "Check for an easy release", body: "Only begin lifting an edge when it moves without force. Work slowly and stop at resistance." },
            { title: "Repeat instead of forcing", body: "Return the fingertips to the water and allow more time if any nail remains secure." }
          ]}
        />
      </HelpSection>

      <HelpSection id="remove-glue" title="Nail-glue removal is still being finalized">
        <HelpCallout variant="status" title="A YourPrettySets removal product is in development">
          <p>
            The planned glue-removal solution is coming soon. It is not available, not currently included, and does not
            have a finalized product page. Until it is ready, follow only the removal directions supplied with the included glue.
          </p>
        </HelpCallout>
        <HelpStepList
          items={[
            { title: "Keep the tab method separate", body: "Warm water can assist adhesive tabs, but it is not presented here as a nail-glue removal method." },
            { title: "Follow the supplied glue guidance", body: "Use only the removal directions provided with the actual included glue product." },
            { title: "Stop at resistance", body: "Do not pry or peel a glued nail. Contact support when the supplied directions do not resolve the issue." }
          ]}
        />
      </HelpSection>

      <HelpSection id="clean-store" title="Clean and store the press-ons carefully">
        <HelpStepList
          items={[
            { title: "Check each press-on", body: "Set aside any nail that is cracked, warped, or otherwise no longer physically suitable for reuse." },
            { title: "Remove only loose residue", body: "Clear away adhesive only when it releases without scraping, bending, or thinning the press-on." },
            { title: "Let the set dry", body: "Make sure the press-ons are clean and completely dry before storage." },
            { title: "Use the storage case", body: "Return each nail to the included case so the shape and finish stay protected between wears." }
          ]}
        />
      </HelpSection>

      <HelpSection id="reuse-expectations" title="Reuse depends on the condition of the set">
        <HelpPolicyBlock title="Reusable, without a promised wear count">
          <p>
            YourPrettySets sets are marketed as reusable when they are removed correctly, cleaned properly, stored carefully,
            and still physically suitable for reuse. There is no guaranteed number of reuses.
          </p>
        </HelpPolicyBlock>
      </HelpSection>

      <HelpSection id="stop-and-contact" title="Stop and contact support when">
        <HelpIssueChecklist
          title="Ask before continuing"
          items={[
            "A nail will not release without force",
            "The supplied adhesive directions are missing or unclear",
            "A press-on is cracked, warped, or damaged during removal",
            "You are unsure which adhesive was used",
            "An order or product issue may have contributed to the problem"
          ]}
        />
      </HelpSection>

      <StandardArticleEnding routeId="removal" />
    </HelpArticleShell>
  );
}

export function ShippingReturnsPage() {
  return (
    <HelpArticleShell
      contents={shippingContents}
      eyebrow={helpRoutes.shippingReturns.eyebrow}
      intro={helpRoutes.shippingReturns.summary}
      title={helpRoutes.shippingReturns.title}
    >
      <HelpSection
        id="processing-transit"
        title="Processing comes before carrier transit"
        intro="Processing is the time used to prepare your order. Transit begins after the carrier receives it."
      >
        <HelpFactList
          items={[
            { label: "Ready-to-ship processing", value: `Approximately ${shippingFacts.readyToShipProcessing}` },
            { label: "Made-to-order processing", value: `Approximately ${shippingFacts.madeToOrderProcessing}` },
            { label: "Carrier transit", value: `Approximately ${shippingFacts.carrierTransit}`, detail: "Separate from processing and not a guaranteed delivery date." },
            { label: "Custom orders", value: "Timing varies", detail: `${shippingFacts.customOrderTiming}. Custom orders are currently ${sizingFacts.customOrdersStatusLabel.toLowerCase()}.` }
          ]}
        />
      </HelpSection>

      <HelpSection id="shipping-rates" title="Shipping rates and tracking">
        <HelpFactList
          items={[
            { label: `Orders below $${shippingFacts.freeShippingThreshold}`, value: `Temporary flat rate of ${shippingFacts.flatRateLabel.toLowerCase()}` },
            { label: `Orders $${shippingFacts.freeShippingThreshold}+`, value: shippingFacts.freeShippingLabel },
            { label: "Tracking", value: shippingFacts.trackingLabel }
          ]}
        />
        <HelpCallout variant="tip" title="Carrier estimates can change">
          <p>Tracking is the best current source after shipment, but a carrier estimate is not a guaranteed arrival date.</p>
        </HelpCallout>
      </HelpSection>

      <HelpSection id="returns" title="Handmade sets and standard returns">
        <HelpPolicyBlock title="Standard returns are not accepted">
          <p>
            Because the sets are handmade, standard returns are not accepted. Product and fulfillment problems are still
            reviewed fairly through the issue process below.
          </p>
        </HelpPolicyBlock>
      </HelpSection>

      <HelpSection id="order-problems" title="Damaged, incorrect, or defective items">
        <HelpIssueChecklist
          title={`Contact support within ${orderPolicyFacts.issueReportingWindowDays} days`}
          intro="The reporting window begins at confirmed delivery. Include:"
          items={["Your order details", "A clear description of the problem", "Clear photos that show the issue"]}
        />
        <p>
          Each case is reviewed individually. A possible resolution may be a repair, replacement, or another appropriate
          solution; an automatic refund or replacement is not promised. Individual nails with a legitimate fulfillment
          issue follow the same reporting window and case review.
        </p>
        <HelpCallout variant="important" title={`After ${orderPolicyFacts.issueReportingWindowDays} days`}>
          <p>Repair or replacement nails may require payment, although YourPrettySets may decide otherwise based on the case.</p>
        </HelpCallout>
      </HelpSection>

      <HelpSection id="lost-packages" title="Lost packages and carrier problems">
        <HelpStepList
          items={[
            { title: "Check the tracking record", body: "Keep the tracking number and note the last carrier update." },
            { title: "Contact YourPrettySets", body: "Email support with your order details and tracking information so YourPrettySets can investigate with you." },
            { title: "Allow an investigation", body: "YourPrettySets will help investigate, and a carrier claim may be required." },
            { title: "Wait for the outcome", body: "The investigation determines the next appropriate step, so a refund or replacement cannot be confirmed in advance." }
          ]}
        />
      </HelpSection>

      <HelpSection id="cancellations" title="Cancellations">
        <blockquote className="help-policy-quote">{orderPolicyFacts.cancellationRule}</blockquote>
        <p>
          If painting or production begins within the first {orderPolicyFacts.cancellationWindowHours} hours, cancellation
          may no longer be possible. Contact support promptly with the order details if you need to ask.
        </p>
      </HelpSection>

      <StandardArticleEnding routeId="shippingReturns" />
    </HelpArticleShell>
  );
}

export function FaqPage() {
  const faqContents = helpFaqGroups.map((group) => ({
    id: `faq-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    label: group.title
  }));

  return (
    <HelpArticleShell
      contents={faqContents}
      eyebrow={helpRoutes.faq.eyebrow}
      intro={helpRoutes.faq.summary}
      title={helpRoutes.faq.title}
    >
      {helpFaqGroups.map((group, index) => (
        <HelpSection
          id={faqContents[index].id}
          key={group.title}
          title={group.title}
        >
          <HelpFaqAccordion items={group.itemIds.map((itemId) => faqItemsById[itemId])} />
        </HelpSection>
      ))}

      <HelpRelatedLinks links={articleRelatedLinks("faq")} title="Read the detailed guides" />
      <HelpSupportCta
        body="If a concise answer does not cover your situation, send support the relevant fit, product, or order details."
        title="Didn’t find your answer?"
      />
    </HelpArticleShell>
  );
}

export function ContactSupportPage() {
  return (
    <HelpArticleShell
      contents={contactContents}
      eyebrow={helpRoutes.contact.eyebrow}
      intro={helpRoutes.contact.summary}
      title={helpRoutes.contact.title}
    >
      <HelpSection id="contact-email" title="Email the public support address">
        <div className="help-contact-email">
          <a className="help-contact-email__link" href={supportDetails.mailto}>{supportDetails.email}</a>
          <p>Support does not publish a guaranteed response time. Clear, complete details make the question easier to review.</p>
        </div>
      </HelpSection>

      <HelpSection id="fit-questions" title="For a fit question">
        <p>
          Name the set or sizing product, explain which finger or size is uncertain, and say whether the question is about
          a ready-to-wear set or the custom-order waitlist. Review <Link to="/help/sizing">Find Your Fit</Link> first.
        </p>
      </HelpSection>

      <HelpSection id="order-questions" title="For an order question">
        <p>
          Include the name and email used for the order, the order number if available, and a clear description of what
          you need help understanding. For timing, tracking, cancellations, or delivery problems, review the order-help guide first.
        </p>
      </HelpSection>

      <HelpSection id="report-an-issue" title="For a damaged, incorrect, or defective item">
        <HelpCallout variant="important" title={`Report the issue within ${orderPolicyFacts.issueReportingWindowDays} days`}>
          <p>The reporting period begins at confirmed delivery. Cases are reviewed individually.</p>
        </HelpCallout>
        <p>Describe what arrived, what is wrong, and which part of the order is affected. Add clear photos that show the problem.</p>
      </HelpSection>

      <HelpSection id="what-to-include" title="What to include in your email">
        <HelpIssueChecklist
          title="Support checklist"
          items={[
            "Your name and the email used for the order",
            "Order number, when available",
            "The product or set name",
            "A short, specific description of the question or problem",
            "Clear photos for damage, defect, incorrect-item, or fit issues when relevant",
            "Tracking details for a lost-package or carrier question"
          ]}
        />
      </HelpSection>

      <div className="help-contact-self-service" id="self-service">
        <HelpRelatedLinks links={articleRelatedLinks("contact")} title="Self-service help" />
      </div>

      <aside className="help-contact-final" aria-labelledby="help-contact-final-title">
        <h2 id="help-contact-final-title">Ready to contact support?</h2>
        <a className="help-contact-final__link" href={supportDetails.mailto}>
          Email {supportDetails.email} <span aria-hidden="true">→</span>
        </a>
      </aside>
    </HelpArticleShell>
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
