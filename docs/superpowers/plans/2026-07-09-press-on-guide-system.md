# Press-On Guide System Implementation Plan

## Shared Customer Architecture

- `/help` — The Press-On Guide task hub.
- `/help/sizing` — Find Your Fit.
- `/products/sizing-kit` — Standalone $10 sizing-kit product presentation; commerce remains explicitly unconnected.
- `/help/application` — Apply Your Set.
- `/help/removal` — Remove & Reuse.
- `/help/shipping-returns` — Shipping, Returns & Order Issues.
- `/help/faq` — Canonical concise FAQ.
- `/help/contact` — Contact Support.
- `/help/how-to-apply` — compatibility redirect to `/help/application`.

The hub groups unique destinations under Before you order, Apply and care, Order help, and More help. Articles end with contextual related guides so no route is a dead end.

## Shared Naming

- Global entry: `Help`.
- Hub title/footer entry: `The Press-On Guide` / `Press-On Guide`.
- Article names: `Find Your Fit`, `Apply Your Set`, `Remove & Reuse`, `Shipping, Returns & Order Issues`, `FAQ`, and `Contact Support`.
- Use `Sizing Kit` for the standalone product and `custom-order waitlist` for the unavailable custom-order flow.

## Shared Visual And Component Direction

- Extend the current white, charcoal, cool-neutral storefront tokens; do not create a separate help-center theme.
- Use an editorial page header, readable 65–72ch article measure, small radii, light rules, and restrained shadows.
- Use a desktop article grid with a compact sticky contents rail; use an accessible native contents disclosure on mobile.
- Use semantic ordered lists for procedures, definition-style fact rows for timelines, and only purposeful tip/important/status callouts.
- Use grouped link rows instead of a dashboard of generic icon cards.
- Add one reusable article shell, contents navigation, step list, callout, image panel, related-guide list, support CTA, and issue checklist.
- Existing brand photography supports the sizing explanation. Generate only accurate application/removal instructional images; all adjacent written steps remain complete without the image.

## Approved Facts Source

Use `src/data/storefrontFacts.ts` for the public support email, sizing range and kit pricing, included items, wear estimates, shipping timing/rates/threshold, issue window, cancellation rule, and the shared last-updated label. Do not duplicate these values in page modules.

## Implementation Sequence

1. Add centralized Help route metadata and canonical FAQ data.
2. Build shared Help article primitives before page-specific article bodies.
3. Replace the Help placeholder module with the hub and all six complete destinations.
4. Add generated application/removal assets and image-ready fallbacks.
5. Add the sizing-kit product record and Product-page branch without checkout behavior.
6. Reconcile Product FAQ, kit links, fit support, header/mobile navigation, footer, and custom waitlist links.
7. Add route/content/component tests, including the legacy redirect and centralized-fact checks.
8. Run focused tests, full tests, build, audit, diff checks, and route/link scans.
9. Inspect every required route on mobile and desktop; refine hierarchy, overflow, keyboard focus, article rhythm, and dead ends.
10. Update the session handoff and document the remaining measurement-chart, removal-product, and checkout work.

## Safety And Scope Guardrails

- Do not publish millimeter mappings until approved data exists.
- Do not add chemical removal instructions or present the planned removal solution as available.
- Treat wear and transit timing as estimates, not guarantees.
- Do not promise automatic refunds, replacements, reuse counts, arrival dates, response times, medical safety, allergy safety, or damage-free removal.
- Do not add analytics, dependencies, checkout, or a payment substitute.
