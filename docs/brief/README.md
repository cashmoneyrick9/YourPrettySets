# YourPrettySets Developer Brief

This folder is the working documentation for the YourPrettySets storefront prototype. It is written for the founder and for agents working page by page or section by section.

The current goal is not a public-launch MVP. The goal is a coherent, mobile-first ecommerce prototype that supports product, brand, and UX decisions without pretending checkout, final content, or final business rules are complete.

## Source of Truth

When documents disagree, use this order:

1. The founder's current instruction
2. Live code and tests
3. `session-handoff.md`
4. `open-decisions.md`
5. The relevant feature brief
6. `session-history.md`

Historical notes explain how the prototype arrived here; they are not current implementation instructions.

## Build Strategy

- Work one focused section or behavior at a time.
- Inspect the live implementation before proposing or making changes.
- Use central product and storefront data.
- Preserve accepted behavior while exploring presentation.
- Keep generated assets and placeholders easy to replace.
- Leave checkout and final policy language unfinished until approved.
- Use realistic prototype content rather than generic filler.

## Current Documents

- [brand.md](brand.md) — current working brand, typography, palette, media, and do/don't rules.
- [site-map.md](site-map.md) — routes, navigation, and page responsibilities.
- [product-data.md](product-data.md) — live catalog structure, variants, prototype pricing, and media rules.
- [shared-components.md](shared-components.md) — reusable storefront and Help patterns.
- [page-home.md](page-home.md) — the Home page as it exists now and the decisions still open.
- [open-decisions.md](open-decisions.md) — unresolved decisions agents must not settle independently.
- [section-pass-template.md](section-pass-template.md) — optional CEO checklist for exploratory UI passes.
- [session-handoff.md](session-handoff.md) — concise current-state snapshot and next useful judgments.
- [session-history.md](session-history.md) — archived milestones and superseded directions.

## Current Build State

The storefront is a Vite React TypeScript application using React Router, central product data, responsive CSS, reusable product components, and a task-focused Press-On Guide.

The current repository includes:

- Home, Shop, Product, custom-order waitlist, Help, Privacy placeholder, and Terms placeholder routes
- 33 prototype nail-set products plus a separate $10 sizing-kit entry
- Five length options and six shape options
- Central storefront and Help facts
- Generated prototype product and instructional media
- An intentionally unconnected cart, checkout, inventory, and email-capture backend

Read `session-handoff.md` for the current implementation details before starting substantive work.
