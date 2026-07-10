# Press-On Guide Audit

Date: 2026-07-09
Scope: current Help routes, route wiring, header/mobile/footer navigation, Product-page support modules, and the current Help-related copy. This is an audit and information-architecture recommendation only; it does not authorize a redesign or content implementation.

> Implementation status — 2026-07-09: This audit was used as the verified baseline for the completed Press-On Guide build. The route, content, email, sizing-kit, navigation, and policy gaps documented below describe the pre-build state and are retained as historical evidence. Current implementation guidance now lives in `docs/brief/session-handoff.md`, `src/data/storefrontFacts.ts`, and `src/data/helpContent.ts`.

## 1. Executive Summary

The route skeleton is in place, but the Help system is not yet a usable support system. `/help` is a clear five-card hub and every card has a working route, but all five destination pages are currently a single heading, a single paragraph, and a `Back to Help` link. The page called “FAQ” has no FAQs. The product-page FAQ contains the only substantive question-and-answer content in this area, so it is more useful than its supposed full-FAQ destination.

The biggest launch risks are not visual. They are unsupported or inconsistent operational information:

- The Help contact page says `hello@yourprettysets.com`; the live footer Email link uses `yourprettysets@gmail.com`.
- The live Sizing Guide and product FAQ recommend a sizing kit, while `docs/brief/session-handoff.md` says sizing-kit language is intentionally excluded from the current product flow.
- Shipping, return, issue, wear, reuse, adhesive, and custom-order answers are either placeholder statements or qualified generalities. They cannot become customer promises until the founder confirms them.

Keep the Press-On Guide as one small, task-led system. Split the current combined application/removal page into **Apply Your Set** and **Remove & Reuse**; keep shipping, returns, and order issues together; keep FAQ as a short answer layer that links to the detailed guides rather than repeating them. Do not create separate pages for every care tip or order scenario.

## 2. Evidence and Current State

### Facts verified in the repository

- `src/App.tsx` defines six live Help routes: `/help`, `/help/sizing`, `/help/how-to-apply`, `/help/shipping-returns`, `/help/faq`, and `/help/contact`. It also defines adjacent `/privacy` and `/terms` placeholders.
- `src/pages/HelpPage.tsx` implements the hub plus every Help subpage from one shared record. Each subpage currently renders only its heading, one body paragraph, and `Back to Help`.
- `src/components/FaqSection.tsx` contains seven real FAQ question/answer pairs, but `FaqSection` renders only at the bottom of `src/pages/ProductPage.tsx`; it does not render on Home. Its “View Full FAQ” CTA points to `/help/faq`, which currently contains no question list.
- `src/components/KitContents.tsx`, also rendered on Product pages, links to `/help/how-to-apply` and `/help/faq`.
- Desktop primary navigation exposes only the `/help` hub. The mobile Help panel exposes all six Help destinations. The footer exposes Sizing, Application, Contact, FAQ, plus separate Shipping and Returns labels that both point to the same `/help/shipping-returns` route.
- Browser inspection of `/help` and `/help/sizing` confirmed the routes render and the hub cards are reachable. The live subpage has no table of contents, steps, warnings, related guides, or contact CTA.

### Existing documentation that conflicts with live content

- `docs/brief/session-handoff.md` says not to mention sizing kits in the current product flow. Live `HelpPage.tsx` and `FaqSection.tsx` both do so.
- `docs/brief/open-decisions.md` marks shipping rules as placeholders, cancellation as undecided, return wording as unfinished, and the depth of the how-to page as undecided. The customer-facing Help copy should not treat these as finalized.
- `docs/brief/site-map.md` still lists an older primary navigation (`Home`, `Shop Collections`, `How It Works`, `FAQ`, `Bag`) rather than the current `Home`, `Shop`, `Help` structure. It is not a reliable description of the live Help navigation.

## 3. Current Page Inventory

| Route | Current title | Current purpose and sections | Completion | Major problems | Recommendation |
| --- | --- | --- | --- | --- | --- |
| `/help` | The Press-On Guide | Intro plus cards for Sizing, How to Apply & Remove, Shipping & Returns, FAQ, Contact Support | Partial shell | No task grouping, priority path, quick answers, contact escalation, or article cross-links. It promises “support pages” that do not yet contain support content. | **Stay** as the hub; reorganize cards into before-order, wearing your set, and order-support tasks. |
| `/help/sizing` | Sizing Guide | One paragraph; `Back to Help` | Placeholder | No measuring method, size chart, between-size rule, fit troubleshooting, or clear pre-order action. Promotes a sizing kit that conflicts with the current handoff. | **Stay**; make it a complete fit guide after the founder decides the sizing method and kit status. |
| `/help/how-to-apply` | How to Apply & Remove | One combined paragraph; `Back to Help` | Placeholder | Application, removal, storage, and reuse are collapsed into one vague statement. No ordered steps, adhesive-specific guidance, warnings, or care guidance. Header/footer naming is inconsistent. | **Split** into Application and Removal & Reuse. Keep this route as a backward-compatible redirect during a later build. |
| `/help/shipping-returns` | Shipping & Returns | One paragraph; `Back to Help` | Placeholder | Says it is placeholder structure. No processing/transit explanation, costs, threshold, order issue process, final-sale language, eligibility, cancellation, or contact path. | **Stay combined** as Shipping, Returns & Order Issues; these questions share the same post-purchase context. |
| `/help/faq` | FAQ | One paragraph; `Back to Help` | Placeholder / misleading | No FAQ questions or answers, despite a product-page FAQ and a “View Full FAQ” CTA. It is a dead end for answer-seeking customers. | **Stay**, but make it the canonical FAQ and remove duplicated long answers elsewhere. |
| `/help/contact` | Contact Support | One paragraph; `Back to Help` | Incomplete | No visible email link, response expectation, order-help instructions, or issue routing. It names `hello@yourprettysets.com`, conflicting with the footer’s Gmail address. | **Stay**; resolve the support address and add a minimal, practical support path. |
| `/privacy` | Privacy | One placeholder paragraph | Placeholder | Necessary legal route, but no policy content. Not part of the Press-On Guide. | **Stay separate** as a policy page; do not fold into Help. |
| `/terms` | Terms | One placeholder paragraph | Placeholder | Necessary legal route, but no policy content. Not part of the Press-On Guide. | **Stay separate** as a policy page; do not fold into Help. |
| Product-page FAQ module | Questions before you order | Seven accordion answers, Contact Support and View Full FAQ CTAs | Partial, most substantive current Help content | Its answers are not represented on `/help/faq`; several are conditional or vague, and sizing-kit language conflicts with the handoff. The same module appears on every Product page, which is useful only if it points to a canonical guide. | **Keep as a concise teaser** after its answers and links are aligned to canonical Help content. |
| Product-page kit support links | How to Apply & Care; Have a question? Visit our FAQ | Two CTAs below kit contents | Partial | “Care” has no matching destination or named guide; both CTAs lead to incomplete pages. No direct Sizing link near a choice that affects fit. | **Keep and retarget** to canonical Application/Removal and FAQ pages; add a fit link only when sizing guidance is finalized. |

## 4. Navigation Audit

### What works

- There are no broken Help route definitions in `src/App.tsx`; hub cards and global links resolve to real routes.
- Desktop has a compact Help entry point, which suits the current primary navigation.
- Mobile makes the deeper Help links discoverable after the user opens Help in the split-screen menu.
- Every current subpage supplies a route back to `/help`.

### Discovery and labeling problems

| Surface | Current behavior | Audit finding | Recommended change |
| --- | --- | --- | --- |
| Desktop header | Only `Help` links to `/help` | Good level of top-nav simplicity, but no indication that Help is a press-on guide. | Keep one top-level link; label it `Help` or `Press-On Guide` consistently with the hub title, not both terms without explanation. |
| Mobile Help menu | `Help Center`, `Sizing Guide`, `How to Apply`, `Shipping & Returns`, `FAQ`, `Contact` | Best current discovery surface, but `How to Apply` hides removal; `Help Center` differs from the hub title; the list has no “Remove & Reuse.” | Use the recommended canonical labels and include both Application and Removal & Reuse. |
| Help hub | Five flat cards | No grouping or “start here” signal. A first-time buyer cannot distinguish pre-order fit help from after-order support. | Group cards: **Before you order**, **Apply and care**, **Order help**. Put Sizing first, then Application/Removal, then Shipping/Returns, FAQ, Contact. |
| Help articles | Only `Back to Help` | Each article is a navigation dead end. There are no related guides, no next best action, and no direct contact route. | Add 2–3 contextual related links and a consistent contact CTA at the end. |
| Footer Help column | Sizing, Application, Contact, FAQ | The hub itself is missing; Removal is absent; labels are abbreviated/inconsistent. | Include `Press-On Guide`, `Sizing`, `Apply Your Set`, `Remove & Reuse`, and `FAQ` or Contact based on available footer space. |
| Footer Policies column | Separate Shipping and Returns labels both go to `/help/shipping-returns` | Two labels imply two pages but lead to one page; it duplicates navigation and conceals order issues. | Replace with one `Shipping, Returns & Order Issues` link, or put it in Help and reserve Policies for Privacy/Terms. |
| Product page | Kit CTA to application/care; FAQ teaser to FAQ/contact | The intent is right, but destinations cannot fulfill it. Fit support is absent near the length/shape selection flow. | Point to finalized guides; expose a compact `Need help choosing fit?` link only after the sizing guide is useful. |
| Home | No current `FaqSection` render | The Home-page FAQ brief and old notes are stale. Customers cannot discover Help from a Home FAQ teaser today. | Do not restore a large Home FAQ by default. After canonical Help exists, add one compact Help/FAQ teaser only if it supports the Home shopping path. |

### Naming inconsistencies to resolve

- The hub is **The Press-On Guide**, desktop says **Help**, mobile says **Help Center**, and subpages use the eyebrow **Help**. Choose one system: for example, top-level `Help`; hub title `The Press-On Guide`; footer label `Press-On Guide`.
- One route is titled **How to Apply & Remove**, mobile says **How to Apply**, footer says **Application**, and the Product CTA says **How to Apply & Care**. These are distinct customer tasks and should not be treated as interchangeable labels.
- The footer uses **Shipping** and **Returns** as if they have separate destinations, while the actual route is combined.
- The Contact route says **Contact Support**, mobile/footer say **Contact**, and FAQ CTAs say **Contact Support**. Use `Contact Support` for an escalation page and `Contact` only where space is constrained.

## 5. Content Audit

### Repetition and misplaced content

- The same topics—sizing, glue versus tabs, reuse, processing, custom orders, and fit—appear in the Help hub descriptions, empty Help page promises, and the Product FAQ. Only the Product FAQ gives answers.
- `/help/faq` promises a list of topics but has no list. Its detailed content should come from the Product FAQ, with each answer checked against founder decisions.
- The combined application/removal page also claims storage and reuse. Those subjects are too important to leave as a clause in a one-sentence introduction.
- `Shipping` and `Returns` are duplicated as two footer links to one route. This is navigation repetition, not added access.

### Missing customer questions and instructions

| Area | Missing content that must exist before launch | Do not assume |
| --- | --- | --- |
| Sizing | How to measure; accepted measurement format; the actual size mapping; what to do between sizes; when and how to ask for fit help; any rules for ordered sets that do not fit | That a sizing kit is offered, that all sets contain a certain size range, or that replacements are available |
| Application | What is included; prep sequence; separate glue and tab instructions; order of steps; post-application care; common application fixes | Wear duration, cure time, product compatibility, adhesive ingredients, allergy safety, or a guarantee |
| Removal & reuse | The approved adhesive-specific removal method; cleanup; when a set may be reused; storage; escalation for a problem | That every set is reusable, that removal is damage-free, or any solvent/product instruction without confirmed materials |
| Shipping, returns & order issues | Processing versus transit; shipping price/threshold; where timing is shown; tracking/status process; return/issue distinction; damaged/incorrect/missing order workflow; cancellation status | Final delivery times, a free-shipping threshold, all-sales-final wording, a 7-day deadline, or a cancellation policy until confirmed |
| FAQ | Canonical answers to the top pre-order questions, each with a guide link where more detail is needed | “Salon quality,” durability, fit outcomes, custom-order availability, or other claims that cannot be substantiated |
| Contact | One confirmed contact address; what information an order question needs; response-hours expectation; route for damaged/incorrect/missing orders | Response SLA, social-DM support, or a support form/process that does not exist |

### Customer-facing claims requiring correction or confirmation

These are current repository facts, not approved final claims:

- The Help Sizing Guide and Product FAQ recommend a sizing kit. This conflicts with the current handoff and requires a founder decision before reuse.
- `FaqSection` says sets can often be reused and describes glue as stronger/for longer wear and tabs as shorter/easier removal. These are useful editorial directions, but they need product-specific review before they become the canonical promise.
- The Help contact page names `hello@yourprettysets.com`; the footer’s active mail link is `yourprettysets@gmail.com`. One must become the supported public address, and every route/CTA must match it.
- `open-decisions.md` provides placeholder shipping figures and a possible damaged/incorrect/missing-order direction. They are planning placeholders, not customer-ready policy.

## 6. Recommended Information Architecture

### Recommended structure

| Page | Recommended route | Purpose and contents | Template |
| --- | --- | --- | --- |
| The Press-On Guide | `/help` | Task-led hub: Before you order (Sizing), Apply and care (Application, Removal & Reuse), Order help (Shipping, Returns & Order Issues), quick FAQ, Contact Support. Include only short descriptions and priority guidance. | Hub |
| Find Your Fit | `/help/sizing` | Measurement and matching process, size-chart area, fit edge cases, and help-before-order route. | Guide article |
| Apply Your Set | `/help/application` | Prep, choose adhesive, application steps by adhesive, aftercare, common fixes. | Step-by-step guide |
| Remove & Reuse | `/help/removal` | Removal steps by adhesive, cleanup, storage, and reuse guidance. | Step-by-step guide |
| Shipping, Returns & Order Issues | `/help/shipping-returns` | Processing and transit explanation, shipping charges/threshold when confirmed, final-sale/return policy when confirmed, and a clear damaged/incorrect/missing-order process. | Policy-support article |
| FAQ | `/help/faq` | Short canonical answers for recurring questions; link into detailed guides instead of duplicating long instructions. | FAQ article |
| Contact Support | `/help/contact` | One confirmed contact method, what to include, expected support window once decided, and triage for fit versus order issues. | Contact article |

### Keep, merge, split, and rename decisions

- **Keep:** `/help`, `/help/sizing`, `/help/shipping-returns`, `/help/faq`, and `/help/contact`.
- **Split:** the current `/help/how-to-apply` into Application and Removal & Reuse. Removal should not be buried inside application because it is a separate safety-sensitive task and directly affects reuse expectations.
- **Rename:** use customer-task names rather than uneven internal labels: `Find Your Fit`, `Apply Your Set`, `Remove & Reuse`, and `Shipping, Returns & Order Issues`. The routes may remain concise and stable.
- **Merge:** care and reuse into Removal & Reuse rather than creating a third care-only page. Keep simple application troubleshooting in Application.
- **Do not merge:** Privacy and Terms into the Press-On Guide. They are legal/policy pages with different ownership and review needs.
- **Preserve existing inbound route:** when the split is implemented, redirect `/help/how-to-apply` to `/help/application` rather than leaving an old duplicate article.

### Suggested cross-links

- Sizing → Application (after choosing a fit) and Contact Support (fit question before ordering).
- Application → Removal & Reuse, FAQ adhesive question, and Sizing (if a chosen size feels wrong before application).
- Removal & Reuse → Application and FAQ reuse question.
- Shipping/Returns → Contact Support, FAQ order-timing question, and the relevant policy routes only after legal copy is approved.
- FAQ → detailed guide for each answer; Contact Support only as the final escalation, not as a replacement for guidance.
- Contact → Sizing and Shipping/Returns so customers can self-serve before emailing.

## 7. Page-by-Page Content Outlines

These are structural outlines only. They intentionally do not supply final policy, timing, adhesive, or health/safety copy.

### The Press-On Guide (`/help`)

- **Purpose:** route a shopper to the correct task in one scan.
- **Intro:** short statement that the guide covers fit, application, removal, and order help.
- **Main sections:** Before you order; Apply and care; Order help; Quick answers.
- **Important warnings:** none on the hub; direct task-specific warnings belong in the destination guide.
- **Related links:** all six guide destinations, with the top three visually prioritized.
- **CTA:** `Contact Support` after the self-service paths.

### Find Your Fit (`/help/sizing`)

- **Purpose:** help a customer choose the right size before purchase.
- **Intro:** explain the approved sizing path without promising an unconfirmed kit.
- **Main sections:** What you need; Measure each nail; Match measurements to the approved chart; Between sizes and common fit questions; Get fit help before ordering.
- **Important warnings:** use only founder-approved instructions about measuring, ordering, and fit outcomes.
- **Related links:** Apply Your Set; FAQ; Contact Support.
- **CTA:** continue to Shop or contact support, depending on the final customer flow.

### Apply Your Set (`/help/application`)

- **Purpose:** show the approved preparation and application sequence.
- **Intro:** set expectations without assigning an unverified wear duration.
- **Main sections:** What is included; Before you start; Prep; Choose glue or tabs; Glue steps; Tab steps; After-application care; Common application fixes.
- **Important warnings:** adhesive, skin/nail condition, and product-use warnings must be confirmed against the actual materials and instructions.
- **Related links:** Remove & Reuse; Find Your Fit; FAQ.
- **CTA:** Shop sets or Contact Support for an unresolved product question.

### Remove & Reuse (`/help/removal`)

- **Purpose:** make removal and storage a clear, separate customer task.
- **Intro:** explain that the method depends on the approved adhesive system.
- **Main sections:** Before removal; Remove adhesive tabs; Remove glue; Clean the set; Store the set; Reuse criteria and limits.
- **Important warnings:** never publish removal methods, solvents, or reuse claims until the founder confirms the adhesive/material guidance.
- **Related links:** Apply Your Set; FAQ; Contact Support.
- **CTA:** return to Application or contact support for an issue.

### Shipping, Returns & Order Issues (`/help/shipping-returns`)

- **Purpose:** answer post-order expectation and issue questions without scattering policy across the site.
- **Intro:** distinguish processing from transit and state that final policy details govern when published.
- **Main sections:** Processing; Shipping options and charges; Tracking/order status; Returns policy; Damaged, incorrect, or missing orders; Cancellations.
- **Important warnings:** no final times, dollar amounts, eligibility rules, or deadline language until the founder approves it.
- **Related links:** FAQ; Contact Support; Privacy/Terms only where legally appropriate.
- **CTA:** `Contact Support about an order` with the approved contact method.

### FAQ (`/help/faq`)

- **Purpose:** answer the most common questions quickly and direct customers to detail when needed.
- **Intro:** concise statement of the topics covered.
- **Main sections:** Fit and sizing; Applying and wearing; Removal and reuse; Orders and shipping; Custom orders, if offered.
- **Important warnings:** answers must link to approved details instead of guessing about duration, guarantees, product safety, or policy rules.
- **Related links:** one deep link from each answer to the source guide.
- **CTA:** Contact Support after the FAQ list.

### Contact Support (`/help/contact`)

- **Purpose:** provide one trustworthy escalation path after self-service help.
- **Intro:** state the confirmed support channel and scope.
- **Main sections:** Fit questions; Order questions; Damaged/incorrect/missing-order information to include; availability/response expectation once decided.
- **Important warnings:** avoid promising response times or resolution outcomes before operational ownership is set.
- **Related links:** Sizing and Shipping/Returns, based on the question type.
- **CTA:** visible `mailto:` link to the single approved support address.

## 8. Shared Guide-Page System

Use one reusable article shell for Sizing, Application, Removal, Shipping/Returns, and Contact. The visual language should remain consistent with the existing restrained white, soft-neutral, editorial storefront; this is a content-system improvement, not a new Help Center visual brand.

- **Header:** breadcrumb/back link, clear H1, one-sentence outcome-oriented summary, and optional “last updated” only once operations are real.
- **Table of contents:** include for articles with more than three substantive sections; keep it compact and jump-link based on mobile.
- **Body:** use numbered steps for a task, short sections for policy/support information, and structured data areas for a size chart or shipping details.
- **Callouts:** one consistent `Tip` and one consistent `Important`/`Warning` treatment. Callouts must be content-led; they are not decoration.
- **Related guides:** end every article with two or three contextual links, not a generic all-links list.
- **Contact CTA:** one calm, repeated support block after self-service content. It must use the same confirmed email everywhere.
- **Mobile readability:** short line lengths, generous separation between steps, plain descriptive link labels, no horizontal data tables without a mobile alternative, and tap targets at least as accessible as existing navigation controls.
- **Accessibility:** one H1, semantic ordered lists for procedures, heading hierarchy, visible keyboard focus, descriptive link text, and no instruction that relies only on a visual image or color. Any future process images need meaningful alt text or adjacent written steps.

The hub uses a companion template: page header, grouped task cards, a small “most common questions” area only after canonical answers exist, and a direct support CTA. It should not duplicate the full FAQ or article bodies.

## 9. Founder Decisions Required

The following decisions block final customer-facing Help content. The audit does not resolve them.

1. **Support channel:** Which email address is public and monitored—`hello@yourprettysets.com`, `yourprettysets@gmail.com`, or another address? Is there a response-time expectation?
2. **Sizing model:** Is there a sizing kit? If not, what exact measuring and size-matching method, chart, range, and fit-support policy should be used?
3. **Adhesive and care:** Which adhesives are included, what product-approved application/removal instructions apply, what reuse guidance is accurate, and what material/skin/nail warnings are required?
4. **Shipping:** Are the current placeholder price, free-shipping threshold, processing range, and transit estimate approved? Where will current timing be displayed?
5. **Returns and order issues:** Is the all-sales-final direction approved? What is the final window and proof/contact process for damaged, incorrect, or missing orders? Are replacements, refunds, or other resolutions offered?
6. **Cancellation and custom orders:** What cancellation policy applies, and are custom orders currently open, paused, queue-based, or intentionally unavailable?
7. **Legal review:** When are Privacy and Terms expected to receive actual approved content, and should Shipping/Returns live partly in a separate formal policy page?

## 10. Prioritized Implementation Order

### Critical before launch

1. Resolve the public support email mismatch and publish one visible, functional Contact Support path.
2. Confirm the sizing model and remove the contradictory sizing-kit claim until it is true.
3. Approve and publish accurate Application and Removal instructions, including product-specific warnings.
4. Confirm shipping, returns, issue handling, and cancellation policy; make the Shipping/Returns article operational rather than placeholder copy.
5. Make `/help/faq` a real FAQ or remove every CTA that calls it the “Full FAQ.”

These items directly affect safe product use, purchase confidence, order expectations, and the ability to get help. They cannot be deferred behind visual polish.

### Important before launch

1. Split Application from Removal & Reuse, then standardize labels and routes across header, mobile, footer, Product pages, and hub.
2. Introduce the shared guide template with article table of contents, related links, warnings, and contact CTA.
3. Reconcile Product-page FAQ answers with the canonical FAQ and detailed guides; retain the Product version only as a concise pre-purchase teaser.
4. Reorganize the hub and footer so users can find fit, removal, and order-issue help without guessing.

These changes reduce support volume and prevent routes from contradicting one another.

### Can wait until after launch

1. Illustrations, photos, or video for measurement/application/removal once the instructions are approved.
2. FAQ search, article analytics, and more elaborate Help filtering.
3. An interactive sizing helper, only after the underlying measurement system is proven.
4. A Home-page Help teaser, if post-launch behavior shows it improves the shopping path.

These improve discoverability and confidence, but they cannot compensate for missing policy and process fundamentals.

### Requires founder decision

All seven decisions in the preceding section require founder ownership. No implementation should invent a shipping promise, return remedy, adhesive duration, health/allergy claim, kit availability, or customer-service commitment to fill the gaps.

## 11. Suggested First Page to Build

Build **Find Your Fit (`/help/sizing`) first, after the founder decides whether a sizing kit exists and approves the exact size-matching process**.

It addresses the highest-confidence pre-purchase question, is needed near Product length/shape selection, and establishes the reusable guide-page template without forcing shipping-policy or adhesive-safety assumptions. If the sizing decision cannot be made first, build the shared article shell and route/label normalization next, but leave customer-facing claims as pending rather than publishing placeholders.

## Repository References

- Routes: `src/App.tsx`
- Help hub and placeholder articles: `src/pages/HelpPage.tsx`
- Desktop/mobile Help navigation: `src/components/BrandHeader.tsx`
- Footer Help and policy links: `src/components/SiteFooter.tsx`
- Product-page support links: `src/components/KitContents.tsx`
- Product-page FAQ teaser and current answers: `src/components/FaqSection.tsx`
- Product page composition: `src/pages/ProductPage.tsx`
- Current Help styles: `src/styles.css`
- Open business decisions: `docs/brief/open-decisions.md`
- Current build handoff and sizing-kit conflict: `docs/brief/session-handoff.md`
