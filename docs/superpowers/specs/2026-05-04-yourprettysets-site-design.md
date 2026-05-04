# YourPrettySets Site Design

## Status

Approved for documentation and brief creation.

Implementation has not started.

## Purpose

Build a developer-ready plan for a from-scratch YourPrettySets website. The first goal is a structured brand and ecommerce prototype, not a public launch MVP.

The site should help the CEO and multiple agents build one page at a time with consistent brand rules, central placeholder product data, and clear open decisions.

## Brand

YourPrettySets sells handmade ready-to-wear press-on nails.

Brand direction:

- Pretty
- Feminine
- Boutique
- Friendly
- Playful
- Clean
- Elevated
- Spring/summer colorful

Tagline direction:

- Art on Miniature Canvases

Logo direction:

- Playful handwriting, to be designed later with CEO input.

## Site Scope

Pages:

- Home
- Shop Collections
- Product Detail
- Bag
- How It Works
- FAQ

Navigation:

- Home
- Shop Collections
- How It Works
- FAQ
- Bag

The Home page will be built first and will define the visual language for future pages.

## Product Scope

First version focuses on ready-to-wear sets only.

Customers choose:

- Length
- Shape

Every set includes:

- 24 nails
- Adhesive tabs
- Nail glue
- Nail file
- Cuticle pusher
- Alcohol wipe
- Application card
- Storage box or bag

Every product supports all launch length and shape options.

Length options:

- Short
- Medium
- Long
- Extra Long

Shape options:

- Almond
- Coffin
- Square
- Round
- Stiletto
- Oval

## Product Data

Use one central placeholder product data source.

The system should support 12-30 placeholder products first and scale beyond 30 later.

Products can have multiple collection tags.

Collections:

- New Arrivals
- Everyday
- Date Night
- Vacation
- Bridal
- Birthday
- Work/Neutral
- Statement

Pricing uses three tiers:

- Simple sets: about $15-$20
- Mid-detail sets: about $22-$30
- Detailed sets: about $32-$40

Each product should eventually have two generated image assets:

- Clean background image
- Stylized/editorial image

## Home Page Design

The Home page should be a polished long-scroll page.

Section order:

1. Hero
2. New Arrivals carousel
3. Shop by Collection
4. Featured Sets carousel
5. What's Included
6. How It Works preview
7. Reviews
8. FAQ teaser
9. Footer

The Home page should prioritize visual browsing and establish the design reference for the rest of the site.

## Shop Collections Design

Collections and shop are the same page. Collections act as filters.

Expected behavior:

- Show all products by default.
- Filter by collection.
- Include simple search.
- Include sorting by Newest, Price, and Most Popular.
- Use a practical product grid.

## Product Detail Design

Product pages should be complete but conversion-focused.

Include:

- Product images
- Product name
- Price
- Length selector
- Shape selector
- Add-to-bag
- What's included
- Application/care/removal support content
- Shipping and FAQ snippets

## Bag And Checkout Design

Add-to-bag should work.

Bag should show:

- Product
- Selected length
- Selected shape
- Price
- Quantity
- Subtotal

Bag should support:

- Remove item
- Change quantity

Checkout should be present only as a coming-soon state. Do not implement a checkout provider yet.

## Policies And Shipping

Use placeholder shipping rules:

- Standard shipping: $5.99
- Free shipping over $50
- Processing: 3-7 business days
- Delivery estimate: 3-5 business days after processing

Return/issues direction:

- All sales final for hygiene reasons.
- For damaged, incorrect, or missing orders, customers should contact support within 7 days of delivery.

Cancellation policy remains undecided.

## Build Approach

Build one page at a time.

Start with Home.

Agents should own smaller sections/components rather than entire broad systems.

Keep data/structure coherent first, while maintaining enough polish that the brand can be judged visually.

## Documentation Structure

Developer-facing docs live in:

```text
docs/brief/
  README.md
  brand.md
  site-map.md
  product-data.md
  shared-components.md
  page-home.md
  open-decisions.md
```

More page docs can be added as those pages become active build targets.

## Open Decisions

- Final logo
- Exact color palette
- Exact placeholder product count
- Real product names and photos
- Checkout provider/path
- How It Works page depth
- Cancellation policy
- Final shipping and policy wording

## Acceptance Criteria For This Design Phase

- Docs give agents enough shared context to begin Home page planning.
- Docs separate decided items from open decisions.
- Docs do not commit to checkout behavior.
- Docs keep product data centralized.
- Docs support section-by-section agent work.
