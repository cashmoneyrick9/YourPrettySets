# Session Handoff

Last updated: 2026-07-26.

This file is the concise current-state snapshot. Historical milestones and superseded directions live in `session-history.md`.

## Current Goal

YourPrettySets is a mobile-first ecommerce prototype for handmade ready-to-wear press-on nails.

The immediate purpose is to support founder decisions about product, brand, and UX. It is not yet a public-launch MVP.

## Current Technical Foundation

- Vite, React, and TypeScript
- React Router routes in `src/App.tsx`
- Central product data in `src/data/products.ts`
- Central storefront facts in `src/data/storefrontFacts.ts`
- Central Help content in `src/data/helpContent.ts`
- Shared media mappings in `src/data/siteMedia.ts`
- Responsive CSS in `src/styles.css`
- Vitest and Testing Library coverage

## Current Working Brand

The live prototype uses:

- White surfaces
- Soft cool-neutral backgrounds
- Charcoal primary text
- Blue-gray accent `#5d6f7a`
- Fraunces display typography
- Manrope body and interface typography

Older spring-pastel, sorbet, coral, lilac, mint, and sage systems are historical—not active defaults.

Final logo, final palette, final photography, and final copy remain open.

## Home

Current route: `/`

Current live flow:

1. Shared fixed header
2. Hero copy and `Shop sets` CTA
3. Browse rail and product preview area
4. Featured Sets carousel
5. Selected three-image Journey + Type How It Works banner
6. Reviews Polaroid Strip
7. Shared email capture and footer from the app shell

Important details:

- The current hero media is unfinished. The CSS hand is hidden and `.hero-photo` has no background image.
- `HomeCollections` uses Ready to Ship, Made to Order, Custom Orders, New Arrivals, and Best Sellers.
- Featured Sets, the selected How It Works banner, and Customer Keepsakes now share a continuous `24px/s` movement rate. Featured Sets loops through the shared `MobileCarousel`; the How It Works banner recalculates its loop duration from its rendered width so the physical speed stays consistent across viewports.
- The original three-card How It Works carousel remains in the code and is hidden reversibly.
- `HowItWorksSpinningBannerTest` now renders the founder-selected three-image Journey + Type banner directly beneath the `HOW IT WORKS` eyebrow and `3 EASY STEPS` heading.
- The selected banner uses three high-fidelity, slightly portrait white scenes for choosing a set, choosing glue or tabs, and wearing the finished manicure. Oversized typography is generated inside each image; the scenes retain narrow blend-safe gutters and a small breathing band between copy and photography.
- The older studio panorama and the `IMAGE TEST / Compare the directions` review UI are no longer rendered on Home. The comparison component remains isolated in the code for reversibility.
- Home review content is prototype content, not verified testimonials. The Reviews Polaroid Strip now uses realistic modeled mock-review imagery tied to seven live catalog sets; each card remains explicitly marked as `mockup` in its data and accessible image description.
- Home does not currently render kit contents or FAQ sections.

Next useful Home judgments:

- Complete the hero media without reopening the whole brand.
- Continue final polish of the selected How It Works banner without restoring the removed comparison UI.
- Evaluate whether the realistic catalog-based mock-review pass makes the current reviews strip viable enough to refine or whether it should be replaced.

## Shop and Product

Current Shop routes:

- `/shop`
- `/shop/ready-to-ship`
- `/shop/made-to-order`
- `/shop/custom-orders`

Current Product route:

- `/products/:slug`
- `/products/sizing-kit`

The prototype currently has 33 nail-set products plus a separate $10 sizing kit.

Every nail set currently supports:

- Five lengths: Extra Short, Short, Medium, Long, Extra Long
- Six shapes: Almond, Coffin, Square, Round, Stiletto, Oval
- Generated Shape × Length SKU variants
- Canonical clean product media shared across cards and detail pages

Current Product Detail flow:

- Media gallery
- Summary and arrival estimate
- Unified Shape and Length selector
- Find Your Fit link
- Add to cart and Favorite prototype controls
- Benefits below the CTA
- Image-led four-option What's Included module
- Related products

Cart, checkout, inventory, video, final customer review media, and real commerce remain unconnected.

The live catalog uses placeholder prices from $15 to $40. Final pricing is still a founder decision.

## Help

Current Help routes:

- `/help`
- `/help/sizing`
- `/help/application`
- `/help/removal`
- `/help/shipping-returns`
- `/help/faq`
- `/help/contact`

The Help system is task-focused and uses centralized facts. The older `/help/how-to-apply` route redirects to `/help/application`.

Confirmed customer facts must continue to come from `src/data/storefrontFacts.ts`.

Still missing:

- Approved millimeter mappings for sizes `00–14`
- Final Privacy and Terms language
- Final glue-removal product details
- Connected custom-order and footer email backends

## Working Rules

- Trust the founder's current instruction, then live code, then this file.
- Keep changes scoped and reversible.
- Do not restore older directions merely because they remain in history.
- Do not invent commerce, policy, inventory, sizing, or review claims.
- Preserve natural image proportions.
- Update this file after substantial approved implementation.

## Standard Verification

For substantive implementation:

```bash
npm test
npm run build
git diff --check
git status --short --branch
```

For visible UI work, inspect relevant views at 320px, 393px, and desktop. Include landscape mobile when changing menus, sheets, or dialogs.

Run `npm audit --audit-level=moderate` only for dependency, security, or release-related work.
