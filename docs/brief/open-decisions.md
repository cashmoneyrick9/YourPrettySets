# Open Decisions

These decisions are intentionally not final yet. Agents should not permanently solve them without CEO approval.

## Checkout

Checkout path is unknown.

Possibilities:

- Shopify checkout
- Stripe checkout
- Manual order flow
- Another platform or process

For now, checkout should be a coming-soon state.

## Final Logo

Direction: playful handwriting.

Final logo design will be shaped later with CEO input.

## Mobile Header Direction

The current header is functional but not final. The CEO selected the current header area as the next thing to improve.

Known feedback:

- The current mobile header feels like a basic development nav.
- The brand name does not yet feel designed.
- The nav wraps awkwardly, especially with `Bag` dropping to its own line.
- Generated visual mockups for "brand-pretty" and "clean beauty brand" directions were rejected.
- Avoid overly cute, template-like, decorative, or fake handwritten beauty-brand treatments.

Next recommended discussion:

- Start from the real current header, not from more generated fantasy mockups.
- Clarify whether the main problem is layout, logo/brand text, or overall vibe.
- Improve the header directly and conservatively once the CEO chooses a direction.

## Exact Color Palette

Direction is spring/summer colorful with pinks, corals, peaches, greens, blues, yellows, white, and small shimmer/gold touches.

Exact hex values are not locked yet.

## How It Works Card UI

The carousel UX is approved enough to preserve for now: one step card at a time, same short copy, arrows, dots, and near-hero placement.

The visual styling of the actual cards is still open. Recent generated mockups for frosted, editorial, tag, packaging, stationery, tray, and acrylic-inspired card styles did not land. The next useful step is not another broad fantasy mockup by default; start closer to the live card and explore practical refinements to surface, border, image treatment, typography, arrow treatment, and spacing.

## Exact Product Count

First placeholder data set should support 12-30 products.

Exact starting count will be decided later.

## Real Product Names And Photos

The first build uses generated placeholder images and realistic sample products.

Real nail designs, photos, product names, and final prices will come later.

## Help And Order Work Still Open

The Press-On Guide depth, cancellation rule, shipping figures, issue-reporting window, and current returns approach were confirmed on 2026-07-09 and are centralized in `src/data/storefrontFacts.ts`. Do not restore the older placeholder rules.

Still open:

- Approved millimeter measurements for the `00–14` sizing chart.
- Checkout/cart integration for the $10 standalone sizing kit and the wider storefront.
- Final product details, compatible instructions, and product page for the planned YourPrettySets glue-removal solution.
- Backend/provider connection and longer-term routing for custom-order and footer email signup forms.
- Final Privacy and Terms language.
- Whether finalized policy wording later moves into dedicated policy pages in addition to the customer-facing Help article.
