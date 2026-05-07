# Home Inspo UX Fidelity Design

Date: 2026-05-07

## Goal

Move the mobile Home page closer to the provided inspiration screens in UX, density, and visual hierarchy. The current page has the same section order, but it still misses the inspiration because the visual assets are too abstract, the hero text is too large, the step row is text-only, and the Collections module is too editorial.

## Direction

Use a compact shop-module layout:

1. Hero stays image-led, but the text becomes smaller and softer so the visual carries the screen.
2. The hero visual should feel more like a real product/lifestyle photo, even while temporary assets are code-native.
3. The step row should become a mini visual carousel: each item has a small nail/tool visual and a short label.
4. The step row should include carousel cues, such as dots and a small arrow, so it feels like a UX component rather than three buttons.
5. Collections should become a compact shopping module with a small heading, `See all`, and three image-led tiles.
6. New Arrivals remains immediately after Collections.

## Requirements

- Preserve the section order: hero, step carousel, collections, New Arrivals.
- Keep the current copy for now: `Pick your set`, `Choose your wear`, `Press on pretty`.
- Do not mention sizing kits.
- Reduce the mobile hero headline size and body dominance.
- Reduce vertical whitespace between hero, steps, collections, and New Arrivals.
- Use more product-like temporary visuals for the hero, step cards, and collection cards.
- Keep the fix code-native for now so it is fast and replaceable when real product photography exists.

## Out Of Scope

- Final product photography.
- Final product names.
- Checkout/cart.
- Desktop redesign beyond making the new mobile-first styling not break desktop.
- Logo or mobile menu polish.

## Success Criteria

- Mobile top-of-page feels closer to the inspo screenshots in UX structure.
- Step row is visual and compact instead of plain text buttons.
- Collections heading and tiles are compact and shop-like.
- Existing tests pass, with new tests covering step visual carousel and compact collection UX hooks.
