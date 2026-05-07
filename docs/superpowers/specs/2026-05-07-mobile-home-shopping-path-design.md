# Mobile Home Shopping Path Design

Date: 2026-05-07

## Goal

Update the mobile Home page direction so the first screen feels more like a real shop and less like a placeholder landing page. The page should move customers quickly from brand feel to shopping paths without teaching a sizing-kit flow that the store is not offering yet.

## Approved Direction

The mobile Home page should use this order:

1. Hero with a real-looking product or lifestyle nail image, short copy, and one primary shopping CTA.
2. A slim three-step confidence strip using the current plain-language flow:
   - Pick your set
   - Choose your wear
   - Press on pretty
3. Collection bits for quick shopping paths, such as Everyday, Date Night, and Vacation.
4. New Arrivals product shopping.

The confidence strip replaces the earlier "How it works" idea. It must not mention sizing kits or imply a custom sizing process.

## UX Requirements

- Keep the hero visually led by product imagery rather than placeholder nail tiles.
- Keep the hero copy short enough for a narrow mobile viewport.
- Keep one clear CTA in the hero: `Shop sets`.
- The confidence strip must be short and lightweight. It should reassure, not interrupt shopping.
- Collections should appear before New Arrivals so customers can choose a mood or occasion before seeing individual products.
- New Arrivals should remain prominent and shoppable immediately after the section path.
- Desktop may inherit the same content order, but the layout should prioritize mobile polish first.

## Out Of Scope

- Final logo design.
- Final product photography.
- Sizing kits or sizing-kit copy.
- Checkout implementation.
- Full mobile menu visual redesign.
- Final brand copy pass.

## Implementation Notes

- Update `src/pages/HomePage.tsx` to reorder the sections and replace the current `howItWorks` copy.
- Consider renaming the visual section away from `How it works` in the UI if a softer label fits better, such as `Ready in three steps`.
- Use existing component patterns where possible.
- If product images are not available, use improved temporary visual treatments that can later be replaced by real assets.
- Add or update focused tests for section order and the absence of sizing-kit language.

## Success Criteria

- On mobile, the first scroll reads as: hero, three-step confidence strip, collections, New Arrivals.
- The page no longer suggests a sizing-kit process.
- The flow feels more shoppable without needing final brand copy.
- Existing tests and build still pass after implementation.
