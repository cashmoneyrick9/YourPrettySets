# Product Data Brief

Last aligned with the live prototype: 2026-07-26.

## Current Catalog

`src/data/products.ts` is the canonical product source.

The live prototype currently contains:

- 33 press-on nail-set products
- A separate $10 sizing-kit product at `/products/sizing-kit`
- Ready-to-ship and made-to-order order types
- Custom orders represented separately as a waitlist

Do not create separate product lists for Home, Shop, recommendations, or Product Detail.

## Product Options

Every current nail-set product supports five lengths:

- Extra Short
- Short
- Medium
- Long
- Extra Long

Every current nail-set product supports six shapes:

- Almond
- Coffin
- Square
- Round
- Stiletto
- Oval

The live variant system generates stable Shape × Length SKUs and supports future availability, inventory, price, and media overrides.

Do not remove Extra Short or return the documentation to four lengths.

## Sizing

Ready-to-wear sets use the confirmed preset size range and included nail count from `src/data/storefrontFacts.ts`.

Customers do not select custom individual sizing in the current ready-to-wear flow.

Approved millimeter mappings for sizes `00–14` are not available. Do not fabricate them.

## Included Items

The canonical included-items list lives in `src/data/storefrontFacts.ts`.

Current customer-facing surfaces should read from that source instead of maintaining independent lists.

## Collections

Current collection labels are:

- New Arrivals
- Everyday
- Date Night
- Vacation
- Bridal
- Birthday
- Work/Neutral
- Statement

Products may belong to multiple collections.

## Prototype Pricing

The current implementation uses three prototype detail tiers:

- Simple: approximately $15–$20
- Mid-detail: approximately $22–$30
- Detailed: approximately $32–$40

The live catalog currently ranges from $15 to $40.

These are prototype values, not final business pricing. Use the values in `src/data/products.ts` when displaying the current site. Do not change the pricing model or treat a future target range as approved without founder direction.

## Product Media

Each nail set has a canonical clean image path:

```text
/assets/products/<product-id>.jpg
```

That same canonical media should be used by:

- Home product previews
- Shop cards
- Product Detail galleries
- Related-product recommendations

Use a deliberate `mediaOverride` only when a specific variant truly needs different presentation.

Keep final editorial media, video, customer imagery, and final photography marked as incomplete.

## Current Product Shape

A nail-set product includes:

- Identity: `id`, `name`, `slug`
- Commerce presentation: `price`, `detailTier`, `orderType`
- Discovery: `collections`, `isNew`, `isPopular`
- Content: `description`
- Media: `images`, `media`
- Options: `lengthOptions`, `shapeOptions`
- Generated variants and stable SKU data

The sizing kit is a separate product kind with commerce status marked pending.

## Data Rules

- Pull products from central data.
- Do not hardcode product facts inside Home or recommendation components.
- Preserve consistent card-to-detail imagery.
- Do not invent inventory counts.
- Do not claim checkout is connected.
- Keep generated assets replaceable.
- Do not alter final pricing, product names, or catalog scope without approval.
