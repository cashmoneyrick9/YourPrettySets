import { Link } from "react-router-dom";
import {
  HelpArticleShell,
  HelpCallout,
  HelpFactList,
  HelpFaqAccordion,
  HelpIssueChecklist,
  HelpPolicyBlock,
  HelpRelatedLinks,
  HelpSearch,
  HelpSection,
  HelpStepList,
  HelpSupportCta,
  HelpTaskList,
  type HelpContentsItem,
  type HelpLink
} from "@/components/help";
import {
  faqItemsById,
  getRelatedGuides,
  helpFaqGroups,
  helpQuickTasks,
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
import { siteMedia } from "@/data/siteMedia";
import "../help-task-first.css";

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
  { id: "policy-glance", label: "At a glance" },
  { id: "processing-transit", label: "Processing and transit" },
  { id: "shipping-rates", label: "Shipping and tracking" },
  { id: "order-problems", label: "Damaged or incorrect orders" },
  { id: "lost-packages", label: "Lost packages" },
  { id: "cancellations", label: "Cancellations" },
  { id: "returns", label: "Returns" }
] as const satisfies readonly HelpContentsItem[];

const contactContents = [
  { id: "contact-paths", label: "Choose your help path" },
  { id: "fit-questions", label: "Fit questions" },
  { id: "order-questions", label: "Order questions" },
  { id: "report-an-issue", label: "Damaged or incorrect items" },
  { id: "what-to-include", label: "What to include" },
  { id: "self-service", label: "Self-service guides" },
  { id: "contact-email", label: "Email support" }
] as const satisfies readonly HelpContentsItem[];

export function HelpHubPage() {
  return (
    <main className="help-page help-page--hub help-hub--task-first">
      <div className="help-page__inner help-hub help-task-hub">
        <header className="help-task-hub__intro">
          <div className="help-page__heading help-task-hub__heading">
            <p className="eyebrow">Press-On Help</p>
            <h1>What do you need help with?</h1>
            <p>Start with the task in front of you. The short answer is here; the full guide is optional.</p>
          </div>
          <HelpSearch />
        </header>

        <section className="help-task-hub__tasks" aria-labelledby="help-task-hub-title">
          <div className="help-task-hub__section-heading">
            <p className="eyebrow">Quick help</p>
            <h2 id="help-task-hub-title">Tap your task</h2>
            <p>The key answer stays visible. Open a row only when you want the next steps.</p>
          </div>
          <HelpTaskList tasks={helpQuickTasks} />
        </section>

        <nav aria-labelledby="help-task-more-title" className="help-task-hub__more">
          <div>
            <p className="eyebrow">More help</p>
            <h2 id="help-task-more-title">Keep going only if you need to</h2>
          </div>
          <ul>
            <li><Link to={helpRoutes.removal.href}>Remove and reuse <span aria-hidden="true">→</span></Link></li>
            <li><Link to={helpRoutes.faq.href}>View every FAQ <span aria-hidden="true">→</span></Link></li>
            <li><Link to={helpRoutes.contact.href}>Contact support <span aria-hidden="true">→</span></Link></li>
          </ul>
        </nav>

        <HelpSupportCta
          body="Send the details that explain your fit, product, or order question. There is no need to read every guide first."
          className="help-task-hub__support"
          title="Still need a person?"
        />
      </div>
    </main>
  );
}

export function SizingGuidePage() {
  return (
    <HelpArticleShell
      contents={sizingContents}
      contentsLabel="In this guide"
      eyebrow={helpRoutes.sizing.eyebrow}
      intro={helpRoutes.sizing.summary}
      quickAnswer={
        <p>
          Every ready-to-wear set includes {sizingFacts.readyToWearNailCount} nails across preset sizes {sizingFacts.presetRange}.
          Lay out every finger before applying adhesive, and use a physical sizing kit when you need an exact match.
        </p>
      }
      title={helpRoutes.sizing.title}
      variant="guide"
    >
      <HelpSection
        eyebrow="Chapter 01"
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
        eyebrow="Chapter 02"
        id="ready-to-wear-fit"
        title="Ready-to-wear sets give you a broad range"
        intro={`Every ready-to-wear set contains ${sizingFacts.readyToWearNailCount} nails. The broad ${sizingFacts.presetRange} range is intended to reduce sizing problems, while recognizing that individual fit can still vary.`}
      >
        <figure className="help-instructional-media">
          <img alt={siteMedia.kit.nails.alt} decoding="async" loading="lazy" src={siteMedia.kit.nails.src} />
          <figcaption>The 24-nail format gives you several sizes to compare before application.</figcaption>
        </figure>
        <HelpCallout variant="tip">
          <p>Lay out the best match for every finger before applying any glue or adhesive tab.</p>
        </HelpCallout>
      </HelpSection>

      <HelpSection
        eyebrow="Chapter 03"
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

      <HelpSection eyebrow="Chapter 04" id="fit-responsibility" title="If a selected size is wrong">
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

      <HelpSection eyebrow="Chapter 05" id="fit-help" title="When you are unsure">
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
      contents={applicationContents}
      contentsLabel="In this guide"
      eyebrow={helpRoutes.application.eyebrow}
      intro={helpRoutes.application.summary}
      quickAnswer={
        <p>
          Prep clean, dry nails first. Lay out every size, choose either glue or tabs, align each press-on off the skin,
          and press steadily without shifting it.
        </p>
      }
      title={helpRoutes.application.title}
      variant="guide"
    >
      <section className="application-step application-step--included" id="included" aria-labelledby="included-title">
        <div className="application-step__content">
          <p className="application-step__eyebrow">Step 01</p>
          <h2 id="included-title">Set out what comes with your set</h2>
          <p>Keep every item within reach before opening either adhesive.</p>
          <ul className="application-kit-list">
            {includedSetItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
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
          <img alt={siteMedia.help.applicationAlignment.alt} decoding="async" loading="lazy" src={siteMedia.help.applicationAlignment.src} />
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

      <section className="application-next application-next--text" id="next-removal" aria-labelledby="next-removal-title">
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
      contentsLabel="In this guide"
      eyebrow={helpRoutes.removal.eyebrow}
      intro={helpRoutes.removal.summary}
      quickAnswer={
        <p>
          Removal depends on the adhesive. Warm water can assist adhesive tabs; nail glue follows the supplied glue
          directions. Never pull, peel, or pry through resistance.
        </p>
      }
      title={helpRoutes.removal.title}
      variant="guide"
    >
      <HelpSection eyebrow="Chapter 01" id="removal-principles" title="Start with the adhesive you used">
        <HelpCallout variant="important" title="Never force a press-on off">
          <p>Do not pull, peel, or pry through resistance. Stop and reassess whenever a nail does not release easily.</p>
        </HelpCallout>
        <p>Keep track of whether the set was applied with adhesive tabs or nail glue. The two methods do not share the same removal guidance.</p>
      </HelpSection>

      <HelpSection eyebrow="Chapter 02" id="remove-tabs" title="Remove adhesive tabs with warm-water assistance">
        <figure className="help-instructional-media">
          <img alt={siteMedia.help.adhesiveTabRemoval.alt} decoding="async" loading="lazy" src={siteMedia.help.adhesiveTabRemoval.src} />
          <figcaption>Use comfortably warm water for adhesive tabs only. Stop whenever a nail resists.</figcaption>
        </figure>
        <HelpStepList
          items={[
            { title: "Use comfortably warm water", body: "Rest the fingertips in a shallow bowl of comfortably warm—not hot—water." },
            { title: "Give the tabs time", body: "Let the warm water assist the adhesive. Do not pull at a nail that still feels firmly attached." },
            { title: "Check for an easy release", body: "Only begin lifting an edge when it moves without force. Work slowly and stop at resistance." },
            { title: "Repeat instead of forcing", body: "Return the fingertips to the water and allow more time if any nail remains secure." }
          ]}
        />
      </HelpSection>

      <HelpSection eyebrow="Chapter 03" id="remove-glue" title="Nail-glue removal is still being finalized">
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

      <HelpSection eyebrow="Chapter 04" id="clean-store" title="Clean and store the press-ons carefully">
        <HelpStepList
          items={[
            { title: "Check each press-on", body: "Set aside any nail that is cracked, warped, or otherwise no longer physically suitable for reuse." },
            { title: "Remove only loose residue", body: "Clear away adhesive only when it releases without scraping, bending, or thinning the press-on." },
            { title: "Let the set dry", body: "Make sure the press-ons are clean and completely dry before storage." },
            { title: "Use the storage case", body: "Return each nail to the included case so the shape and finish stay protected between wears." }
          ]}
        />
      </HelpSection>

      <HelpSection eyebrow="Chapter 05" id="reuse-expectations" title="Reuse depends on the condition of the set">
        <HelpPolicyBlock title="Reusable, without a promised wear count">
          <p>
            YourPrettySets sets are marketed as reusable when they are removed correctly, cleaned properly, stored carefully,
            and still physically suitable for reuse. There is no guaranteed number of reuses.
          </p>
        </HelpPolicyBlock>
      </HelpSection>

      <HelpSection eyebrow="Chapter 06" id="stop-and-contact" title="Stop and contact support when">
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
      contentsLabel="Order help"
      eyebrow={helpRoutes.shippingReturns.eyebrow}
      intro={helpRoutes.shippingReturns.summary}
      quickAnswer={
        <p>
          Processing happens before the estimated {shippingFacts.carrierTransit} carrier transit window. Tracking is
          included, standard returns are not accepted, and order issues should be reported within {orderPolicyFacts.issueReportingWindowDays} days.
        </p>
      }
      title={helpRoutes.shippingReturns.title}
      variant="policy"
    >
      <HelpSection
        className="help-policy-glance"
        eyebrow="Key facts"
        id="policy-glance"
        title="At a glance"
        intro="The current timing, shipping, tracking, and issue-reporting details in one place."
      >
        <HelpFactList
          items={[
            { label: "Ready-to-ship processing", value: `Approximately ${shippingFacts.readyToShipProcessing}` },
            { label: "Made-to-order processing", value: `Approximately ${shippingFacts.madeToOrderProcessing}` },
            { label: "Carrier transit", value: `Approximately ${shippingFacts.carrierTransit}`, detail: "Separate from processing and not a guaranteed delivery date." },
            { label: `Orders below $${shippingFacts.freeShippingThreshold}`, value: `Temporary flat rate of ${shippingFacts.flatRateLabel.toLowerCase()}` },
            { label: `Orders $${shippingFacts.freeShippingThreshold}+`, value: shippingFacts.freeShippingLabel },
            { label: "Tracking", value: shippingFacts.trackingLabel },
            { label: "Report an order issue", value: `Within ${orderPolicyFacts.issueReportingWindowDays} days of confirmed delivery` }
          ]}
        />
      </HelpSection>

      <HelpSection
        id="processing-transit"
        title="Processing comes before carrier transit"
        intro="Processing is the time used to prepare your order. Transit begins after the carrier receives it."
      >
        <p>{shippingFacts.customOrderTiming}. Custom orders are currently {sizingFacts.customOrdersStatusLabel.toLowerCase()}.</p>
      </HelpSection>

      <HelpSection id="shipping-rates" title="Shipping rates and tracking">
        <HelpCallout variant="tip" title="Carrier estimates can change">
          <p>Tracking is the best current source after shipment, but a carrier estimate is not a guaranteed arrival date.</p>
        </HelpCallout>
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

      <HelpSection id="returns" title="Handmade sets and standard returns">
        <HelpPolicyBlock title="Standard returns are not accepted">
          <p>
            Because the sets are handmade, standard returns are not accepted. Product and fulfillment problems are still
            reviewed fairly through the issue process above.
          </p>
        </HelpPolicyBlock>
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
      contentsDefaultOpen
      contentsLabel="Browse questions"
      eyebrow={helpRoutes.faq.eyebrow}
      intro={helpRoutes.faq.summary}
      title={helpRoutes.faq.title}
      variant="utility"
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
      className="help-contact--utility"
      contents={contactContents}
      contentsLabel="On this page"
      eyebrow={helpRoutes.contact.eyebrow}
      intro={helpRoutes.contact.summary}
      title={helpRoutes.contact.title}
      variant="utility"
    >
      <section aria-labelledby="contact-paths-title" className="help-contact-paths" id="contact-paths">
        <header className="help-contact-paths__header">
          <p className="help-section__eyebrow">Start here</p>
          <h2 id="contact-paths-title">What do you need help with?</h2>
          <p>Choose the closest path so you can gather the right details before emailing support.</p>
        </header>

        <div className="help-contact-paths__list">
          <article className="help-contact-path" id="fit-questions">
            <span aria-hidden="true">01</span>
            <div>
              <h3>Fit question</h3>
              <p>
                Name the set or sizing product, explain which finger or size is uncertain, and say whether the question is
                about a ready-to-wear set or the custom-order waitlist.
              </p>
              <Link to="/help/sizing">Review Find Your Fit <span aria-hidden="true">→</span></Link>
            </div>
          </article>

          <article className="help-contact-path" id="order-questions">
            <span aria-hidden="true">02</span>
            <div>
              <h3>Order question</h3>
              <p>
                Include the name and email used for the order, the order number if available, and a clear description of
                what you need help understanding. For timing, tracking, cancellations, or delivery problems, review the
                order-help guide first.
              </p>
              <Link to="/help/shipping-returns">Review order help <span aria-hidden="true">→</span></Link>
            </div>
          </article>

          <article className="help-contact-path" id="report-an-issue">
            <span aria-hidden="true">03</span>
            <div>
              <h3>Damaged, incorrect, or defective item</h3>
              <HelpCallout variant="important" title={`Report the issue within ${orderPolicyFacts.issueReportingWindowDays} days`}>
                <p>The reporting period begins at confirmed delivery. Cases are reviewed individually.</p>
              </HelpCallout>
              <p>Describe what arrived, what is wrong, and which part of the order is affected. Add clear photos that show the problem.</p>
            </div>
          </article>
        </div>
      </section>

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

      <aside className="help-contact-final" id="contact-email" aria-labelledby="help-contact-final-title">
        <div>
          <p className="help-section__eyebrow">Email support</p>
          <h2 id="help-contact-final-title">Ready to contact support?</h2>
          <p>Support does not publish a guaranteed response time. Clear, complete details make the question easier to review.</p>
        </div>
        <a className="help-contact-final__link" href={supportDetails.mailto}>Email {supportDetails.email} <span aria-hidden="true">→</span></a>
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
