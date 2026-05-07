# Mobile Home Mockup Fidelity Design

Date: 2026-05-07

## Goal

Bring the implemented mobile Home page much closer to the approved mockup direction. The previous implementation fixed the section order, but the UX still looked like the old page because the hero remained split, the visual was abstract, the confidence strip read like a normal section, and collections stayed text-only.

## Approved Correction

The first mobile scroll should feel like the mockup:

1. A single image-led hero panel with the visual as the surface, not a separate side block.
2. Hero text placed over the lower part of the panel with one `Shop sets` CTA.
3. A compact three-step strip directly attached below the hero.
4. A compact Collections section showing three visual collection tiles: `Everyday`, `Date Night`, and `Vacation`.
5. New Arrivals immediately after those sections.

## Requirements

- Preserve the already-approved section order: hero, confidence strip, collections, New Arrivals.
- Make the mobile hero visually unified, with product-style imagery behind the copy.
- Keep copy short and readable on 320px screens.
- The confidence strip should feel like a compact attached row, not a thick standalone content block.
- Collections should use small product-style visuals inside tiles, not plain text-only boxes.
- For now, use code-native visual placeholders that look closer to product imagery. Real product photos can replace them later.
- Do not add sizing-kit language.
- Do not redesign the logo or mobile menu.

## Out Of Scope

- Final product photography.
- Final brand copy pass.
- Checkout, cart, or product-detail behavior.
- Full desktop redesign.
- Full mobile menu visual polish.

## Success Criteria

- On mobile, the hero reads as a single mockup-like panel instead of a split layout.
- The confidence strip appears visually tied to the hero and stays compact.
- The first three collection paths use image-led tiles.
- Tests cover the key copy, section order, and reduced collection set.
- Build and test verification pass after implementation.
