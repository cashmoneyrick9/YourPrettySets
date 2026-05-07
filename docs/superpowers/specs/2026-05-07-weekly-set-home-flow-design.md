# Weekly Set Home Flow Design

Date: 2026-05-07

## Goal

Replace the repetitive `New Arrivals` plus `Featured Sets` product sections with the approved full-page direction from the UX mockup: one curated weekly product feature, a visible `Shop more` row, and `What's included` after the shopping moment.

## Approved Direction

The Home page order should become:

1. Hero.
2. Step explainer carousel.
3. Collections.
4. `This week's set` featured product carousel.
5. `Shop more` compact product row.
6. `What's included`.
7. Reviews and FAQ.

## Requirements

- Remove the separate `New Arrivals` and `Featured Sets` sections from the Home page.
- Add `This week's set` as the main product-shopping section.
- The featured product section must clearly communicate that more products exist:
  - show `1 of 4`
  - show a next-card peek
  - show an arrow affordance
  - include `Browse all new sets`
- Add a compact `Shop more` row with Golden Hour, Vacation Crush, and Soft Serve.
- Product cards and feature art must not show placeholder text inside image areas.
- Product visuals can remain code-native temporary art for now, but they should look closer to product/nail-set imagery than gradient placeholders.
- Keep `What's included` below product shopping, not above it.

## Out Of Scope

- Final product photography.
- Checkout/cart behavior.
- Real product-detail pages.
- Final brand copy.
- Desktop redesign beyond preserving a usable responsive layout.

## Success Criteria

- The page no longer has two similar product carousel sections.
- The weekly set section has explicit carousel cues and a clear product CTA.
- The `Shop more` row makes the store feel deeper without creating another large duplicate carousel.
- Existing tests/build pass, with tests covering the new section order and absence of placeholder image text.
