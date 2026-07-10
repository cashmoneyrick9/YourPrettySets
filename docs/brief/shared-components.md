# Shared Components Brief

These components should stay visually and behaviorally consistent across pages.

## Product Card

Used on Home, Shop Collections, and recommendation/carousel areas.

Should show:

- Product image
- Product name
- Price

Should not show too much detail on the card. Length, shape, and full details belong on the product detail page.

## Product Carousel

Used on Home for sections like New Arrivals and Featured Sets.

Purpose:

- Maximize visual browsing.
- Feel natural on mobile.
- Show several sets without making the Home page feel endless.

Homepage can use carousels. Shop Collections should use a more practical product grid with filters/search/sort.

## Collection Filters

Used on Shop Collections and possibly Home.

Collections:

- New Arrivals
- Everyday
- Date Night
- Vacation
- Bridal
- Birthday
- Work/Neutral
- Statement

Filters should be easy to scan and should not feel heavy.

## Length And Shape Selectors

Used on product detail pages.

Every product supports all launch options.

Length:

- Short
- Medium
- Long
- Extra Long

Shape:

- Almond
- Coffin
- Square
- Round
- Stiletto
- Oval

## Add To Bag

The regular Product-page Add to Cart control is still a prototype affordance; the storefront does not yet have a complete cart or checkout system. The sizing-kit page deliberately omits the control until commerce is connected.

When the bag is implemented, it should store:

- Product
- Selected length
- Selected shape
- Price
- Quantity

## Bag

Bag should allow:

- View item details
- Change quantity
- Remove item

Do not require the first version to edit length or shape directly in the bag.

## Checkout Area

Checkout should be visibly present but intentionally inactive.

Use a coming-soon state. Do not implement Shopify, Stripe, manual orders, or another checkout path until the business decides.

## What's Included

This should exist as a reusable content pattern.

It may appear as:

- A compact icon row near product options.
- An expandable/detail section.
- A more visual flat-lay style section lower on Home or product pages.

The exact presentation can evolve, but the contents are already decided.

The approved seven-item list lives in `src/data/storefrontFacts.ts`. Product and Help surfaces should read from that source instead of maintaining separate lists.

## Help Article System

The reusable Help system lives in `src/components/help/` and is shared by the hub and all long-form guides. It includes the article shell, desktop/mobile contents navigation, numbered steps, callouts, instructional media, fact and policy blocks, issue checklists, FAQ accordions, related guides, and support CTAs.

Keep the system editorial and task-focused. Use sections and dividers before adding more cards, preserve one H1 per page, and route all changeable policy and product facts through `src/data/storefrontFacts.ts` and `src/data/helpContent.ts`.
