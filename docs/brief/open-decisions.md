# Open Decisions

Last cleaned: 2026-07-26.

These decisions are intentionally unresolved. Agents must not settle them permanently without founder approval.

## Commerce

### Checkout and bag

The storefront does not have a connected cart, checkout provider, payment flow, or inventory system.

Possible future paths may include Shopify, Stripe, a manual process, or another platform. Do not select or implement one without approval.

### Email capture

The custom-order and footer email forms do not have a connected provider or backend.

### Sizing-kit commerce

The standalone sizing kit is currently $10, but online purchasing is intentionally unavailable.

## Product

### Final pricing position

The live prototype catalog uses placeholder prices from $15 to $40 across simple, mid-detail, and detailed tiers.

Those values are implementation placeholders, not a final pricing commitment. Do not globally raise, lower, or restructure pricing without founder approval.

### Final catalog

Still open:

- Final product names
- Final product descriptions
- Final product count
- Final product photography
- Final inventory and availability
- Whether any shape or length combinations require product-specific restrictions

### Sizing measurements

Approved millimeter measurements for sizes `00–14` are still missing. Do not fabricate a chart.

### Glue-removal product

The planned YourPrettySets glue-removal solution still needs final product details, compatible instructions, imagery, pricing, and a Product page.

## Brand and Home

### Final logo

The final logo is unresolved. The current text brand mark is temporary.

### Final palette

The current live system is cool-neutral with a blue-gray accent. It is the working default, but final brand colors are not permanently locked.

Do not restore older warm sorbet or spring-pastel systems without approval.

### Hero media

The live hero structure and CTA exist, but the current hero media is unfinished. The CSS hand is hidden and `.hero-photo` has no background image.

### How It Works

The spinning panorama is currently visible as a reversible experiment. The original three-card carousel remains hidden but preserved.

The founder still needs to decide whether to:

- Keep and refine the spinning banner
- Restore and refine the card carousel
- Choose another tightly scoped treatment

Do not delete either current implementation before that decision.

### Reviews

The Home reviews strip and Product `Worn by` media are prototype content. Final review format, real customer content, permissions, and imagery remain open.

### Mobile menu polish

The current menu interaction is functional. Final visual polish and final brand treatment remain open.

## Policy and Support

Still open:

- Final Privacy language
- Final Terms language
- Whether finalized policy wording also receives dedicated policy pages
- Final legal review of customer-facing policies

Confirmed storefront facts remain centralized in `src/data/storefrontFacts.ts` and should not be replaced with older placeholder rules.
