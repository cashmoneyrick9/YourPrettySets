# How It Works Carousel UI Design

## Goal

Refine the existing Home page `How it works` carousel UI so it feels cohesive with the approved mobile header and hero, without changing the carousel UX, copy, or section order.

## Approved Direction

The carousel should slightly overlap the bottom of the hero. The overlap should create a soft frosted transition so the step card feels attached to the image-led opening instead of sitting as a separate block below it.

Use the clean warm-white card style from the approved mockup direction:

- compact rounded card
- thin blush or berry outline
- soft shadow
- arrows slightly breaking outside the card edges
- warm white surface, not a heavy pink block
- berry title text and readable helper text
- active dot in berry, inactive dots in soft blush

The card content layout remains one visual on the left and title/helper copy on the right.

## Slide Visuals

The current visuals are too placeholder-like. Replace them with more intentional code-native visuals:

- `Pick your set`: a fuller mini nail-set tray.
- `Choose your wear`: glue plus adhesive tabs.
- `Press on pretty`: a finished press-on hand or fingertip moment.

These visuals are temporary and must stay easy to replace with real image assets later. They should feel polished enough for CEO review but should not imply final product photography.

## Non-Goals

- Do not change the header, hero, carousel behavior, or copy.
- Do not show or redesign Collections as part of this pass.
- Do not make the carousel a taller standalone section.
- Do not add sizing-kit language.
- Do not settle final product photography or logo decisions.

## Implementation Notes

This should be a section-scoped change in `src/pages/HomePage.tsx`, `src/styles.css`, and existing tests. Preserve the current one-card carousel, arrows, dots, and slide labels.
