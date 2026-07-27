# Home Page Brief

Last aligned with the live prototype: 2026-07-26.

The Home page is the primary mobile shopping path and a working visual reference for the rest of the storefront. It is not finished brand work.

## Current Goals

- Explain that YourPrettySets sells handmade ready-to-wear press-ons.
- Move shoppers into the catalog quickly.
- Let shoppers browse by buying path and product interest.
- Show enough product variety to judge the storefront.
- Keep the page compact, visual, and mobile-first.
- Preserve experiments long enough for direct side-by-side judgment.

## Current Live Order

### 1. Header

The shared fixed `BrandHeader` is rendered by `src/App.tsx`.

Desktop navigation links to Home, Shop, and Help. Mobile navigation uses the current Home / Shop / Help interaction and submenu system.

The final logo and final mobile-menu polish remain open.

### 2. Hero

`src/pages/HomePage.tsx` renders:

- Handmade ready-to-wear positioning
- The headline `Ready-to-wear sets for pretty plans`
- A direct `Shop sets` CTA to `/shop`

The decorative CSS hand is hidden and the current `.hero-photo` has no background image. The hero media treatment is therefore unfinished and should not be described as approved photography.

Do not change the hero structure or invent final media unless the task is specifically about the first viewport.

### 3. Browse

`HomeCollections` provides five buying paths:

- Ready to Ship
- Made to Order
- Custom Orders
- New Arrivals
- Best Sellers

The horizontal image rail controls a preview area below it. Product-backed paths show four live product cards plus a partial teaser row. Custom Orders shows a prototype request preview.

Products come from `src/data/products.ts`; do not create a second Home-only catalog.

### 4. Featured Sets

`FeaturedSets` renders a horizontal carousel from `featuredProducts`.

Cards route to the same canonical Product Detail pages and use the same product media as the rest of the storefront.

### 5. How It Works

Two implementations currently remain in the codebase:

- The original three-card `MobileCarousel` remains in `HomePage.tsx`.
- `.confidence-section` hides that original treatment reversibly.
- `HowItWorksSpinningBannerTest` is the visible founder-selected Journey + Type banner.

The visible spinning banner keeps the `HOW IT WORKS` eyebrow and `3 EASY STEPS` heading above three high-fidelity, slightly portrait white scenes:

- Choose a set
- Choose glue or adhesive tabs
- Wear the finished manicure

Each scene contains oversized generated editorial typography, a short subheading, larger product photography, narrow blend-safe white gutters, and a small breathing band between copy and photography.

It pauses on focus or pointer interaction and includes reduced-motion behavior.

The older studio panorama and the `IMAGE TEST / Compare the directions` review UI are no longer rendered. `HowItWorksBannerOptionsTest` remains isolated in the code for reversibility.

Do not restore the removed comparison UI or delete the hidden original carousel without founder direction.

### 6. Reviews

`ReviewsPolaroidStrip` is the current Home review treatment.

Its content is prototype presentation, not verified customer reviews. Do not present placeholders as real testimonials.

### 7. Email Capture and Footer

`FooterEmailCapture` and `SiteFooter` are rendered by the shared app shell after the Home route.

The email capture is not connected to a backend. Privacy and Terms remain placeholder pages.

## Not Currently Rendered on Home

The active Home page does not currently render:

- A Home kit-contents section
- A Home FAQ section
- The older story viewer
- A final customer-review system

Do not restore these merely because older briefs mention them.

## Current Judgment Points

- What media should complete the hero without restarting the entire brand direction?
- Does the selected How It Works banner need any final timing or spacing polish?
- Does the current reviews strip deserve refinement or replacement?
- Which parts of the Home page should become the visual reference for the remaining pages?

## Mobile Standard

At minimum, visible Home changes should be checked at 320px and 393px, plus a desktop width.

Confirm:

- No page-level horizontal overflow
- Product cards route correctly
- Carousels remain touch-friendly
- Motion pauses or reduces appropriately
- Images retain natural proportions
- The first viewport keeps a clear shopping CTA
