# Browse Selector And Featured Sets Design

## Context

The current Home `Browse` section works as a slim collection selector followed by products from the active collection. It is functional, but the selector feels generic because the cards are mostly text blocks. The founder wants the collection selector to feel more like a visual, lifestyle-led shopping prompt.

This is a planning spec only. It does not choose final photography, final image crops, exact tile height, or the final motion timing.

## Section Pass: Browse Collection Selector

### Current Status

- Built: `Browse` section with a horizontal collection selector, active collection state, `Swipe to explore` hint, and products shown from the active collection.
- Approved: the section belongs near the top of the Home shopping path and should help shoppers browse by occasion or mood.
- Not approved yet: the current plain card selector visual treatment.

### CEO Judgment Needed

- Judge next: slimmer lifestyle-image selector tiles and the relationship between Browse and Featured products.
- Main question: does the selector feel like an occasion-led shopping prompt instead of a generic filter rail?
- Decision type: UX structure, visual direction, and carousel behavior.

### Keep

- Keep the `Collections` eyebrow, `Browse` heading, and `See all` shop link.
- Keep the approved collection labels from central product data.
- Keep the section mobile-first and swipeable.
- Keep product previews sourced from central product data.
- Keep Browse early in the Home shopping path.

### Change / Explore

- Replace plain text cards with slimmer lifestyle mood image tiles.
- Use the Option 2 visual direction: image fills the tile, a subtle dark wash covers the whole image, and the collection name is centered in white over the image.
- Do not use an outline or border as the selected-state treatment.
- Default state should have no selected collection.
- In the default state, the collection rail should spin/auto-rotate calmly.
- After the shopper selects a collection, the selected tile should settle centered in the component.
- After a collection is selected, the spinning should stop and should not resume during that visit.
- When no collection is selected, Browse should not show collection-specific products.
- When a collection is selected, Browse should show products for that collection.

### Do Not Touch

- Do not change the final collection taxonomy without founder approval.
- Do not invent final photography or treat placeholder lifestyle imagery as locked.
- Do not change checkout or add purchase behavior.
- Do not alter unrelated Home sections during this pass.
- Do not reintroduce heavy selector controls, visible arrows, dots, or loud active-card styling unless the founder reopens that direction.

### Creative Note

Browse should feel like a compact visual invitation to shop by occasion. The tiles should be pretty and mood-led, but still ecommerce-first: quick to scan, easy to tap, and not so tall that they become a second hero.

## Featured Sets Section

### Current Status

- Built: the current Browse section shows collection products immediately because a collection is selected by default.
- Approved: shoppers should still see appealing products even before they interact with Browse.
- Not approved yet: exact Featured product selection logic, carousel card count, and final section title.

### Design Direction

Add a separate Featured product carousel below Browse. This section should always be present. It gives the Home page an immediate product draw while Browse can start with no selected collection.

Browse and Featured are related but separate:

- Browse is for choosing a mood or occasion.
- Featured is for showing appealing sets before any collection choice.
- Selecting a Browse collection does not remove Featured. It only makes Browse show the selected collection's products above the Featured section.

### Default State

- Browse selector is visible and auto-rotating.
- No tile looks active.
- No collection-specific product row appears inside Browse.
- Featured Sets appears below Browse as its own section.

### Selected State

- Shopper taps a collection tile.
- The selected tile moves or settles to the center of the selector component.
- Auto-rotation stops for the visit.
- No outline is added to the selected tile.
- Browse displays products from the selected collection.
- Featured Sets remains below Browse as its own section.

## Data And Components

- Continue using central product data.
- Collection labels should continue to come from `collectionLabels`, excluding `New Arrivals` where appropriate.
- Featured Sets can start from existing product metadata such as popular, new, seasonal, or a small curated list, but the exact logic is not final in this spec.
- The final implementation should reuse existing carousel/product-card patterns where they still fit.

## Open Details For Later

- Exact tile height and width.
- Whether lifestyle images are generated placeholders, curated temporary assets, or real founder-provided photography.
- Exact selected-tile centering motion.
- Exact Featured Sets title and product-selection logic.
- Whether collection products appear with a short transition or instantly after selection.

## Testing And Verification Notes

- Verify mobile behavior in the browser, not only with component tests.
- Confirm the default Browse state has no active collection.
- Confirm selecting a collection stops auto-rotation for the visit.
- Confirm selected collection products appear after selection.
- Confirm Featured Sets remains visible below Browse.
- Confirm no page-level horizontal overflow on mobile.
- Preserve keyboard/button semantics for collection selection.
