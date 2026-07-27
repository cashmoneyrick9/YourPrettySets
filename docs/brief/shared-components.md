# Shared Components Brief

Last aligned with the live prototype: 2026-07-26.

These patterns should remain behaviorally and visually consistent across pages.

## Product Preview Card

Used on Home, Shop, featured carousels, and related-product areas.

Show:

- Canonical product image
- Product name
- Price

Keep options and full product details on Product Detail.

A card and the Product Detail page it opens should resolve to the same canonical product media unless a deliberate override exists.

## Product Browsing

### Home

Home may use horizontal, touch-friendly carousels and buying-path previews.

### Shop

Shop should remain the practical catalog surface for browsing, filtering, searching, and sorting.

Do not make Home-only copies of product data.

## Length and Shape Selector

The active Product Detail selector treats Shape and Length as one purchase decision.

Lengths:

- Extra Short
- Short
- Medium
- Long
- Extra Long

Shapes:

- Almond
- Coffin
- Square
- Round
- Stiletto
- Oval

Preserve:

- Accessible button names and `aria-pressed`
- Native touch scrolling
- Guarded mouse dragging
- Scroll progress
- Stable selected styling
- Four-card visible framing where applicable
- Shape-first, Length-second order

Do not restore a separate divider or expand the vertical gap without reopening the direction.

## Product Buying Flow

Current order:

1. Media gallery
2. Product summary and arrival estimate
3. Unified Shape and Length selector
4. Find Your Fit link
5. Add to cart and Favorite
6. Benefits
7. Product What's Included treatment
8. Related products

Add to cart and Favorite remain prototype controls. They do not create a real cart, reserve inventory, or complete payment.

## Product Benefits

The current benefits treatment is a quiet reassurance block below the purchase CTA.

It communicates:

- Painted by hand
- Made to rewear
- Application kit included
- Six shapes / five lengths

Do not move it back above the primary purchase action unless requested.

## Product What's Included

`ProductKitDrawers` is the active Product Detail treatment despite its historical component name.

It behaves as one connected, image-led four-option module:

- Nails
- Glue / tabs
- Prep tools
- Case + care

Preserve:

- Equal control geometry
- One active panel
- Keyboard navigation
- Stable panel height
- Natural image proportions
- `object-fit: contain` for full active images

The older `KitContents` and Product FAQ sections remain preserved behind `showLegacyProductSections = false`. Do not restore them by default.

## Related Products

Recommendations must:

- Exclude the current product
- Route only to real catalog products
- Use canonical product media
- Keep deterministic selection logic

## Shared Header and Navigation

Use React Router for internal links.

Preserve:

- Route-to-top and route-to-heading focus behavior
- Fixed-header-safe anchor offsets
- Mobile menu body-scroll handling
- Current Home / Shop / Help navigation structure

The final logo and final menu polish remain open.

## Help Article System

The reusable Help system lives in `src/components/help/`.

Keep it:

- Editorial and task-focused
- Based on centralized facts and content
- Accessible with one H1 per page
- Clear before decorative
- Consistent across mobile and desktop

Route changeable policy and product facts through `src/data/storefrontFacts.ts` and `src/data/helpContent.ts`.

## Media Rules

- Never stretch or squash product images.
- Prefer reviewed project assets over generic placeholders.
- Keep generated media easy to replace.
- Do not treat prototype customer or review imagery as verified.
