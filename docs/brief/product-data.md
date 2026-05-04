# Product Data Brief

## Product Strategy

The first build uses realistic placeholder products.

The placeholder catalog should feel like a realistic launch collection, not random filler. Products should be designed around the collection categories YourPrettySets plans to offer.

Exact count is open, but the system should support 12-30 placeholder products at first and scale past 30 later.

## Product Type

Ready-to-wear press-on nail sets only.

Customers choose:

- Length
- Shape

Customers do not choose custom sizing for this first version.

## Included In Each Set

Every ready-to-wear set includes:

- 24 nails
- Adhesive tabs
- Nail glue
- Nail file
- Cuticle pusher
- Alcohol wipe
- Application card
- Storage box or bag

Use this language direction:

> Includes 24 nails so you can find your best fit.

## Length Options

Every placeholder product supports all launch length options:

- Short
- Medium
- Long
- Extra Long

## Shape Options

Every placeholder product supports all launch shape options:

- Almond
- Coffin
- Square
- Round
- Stiletto
- Oval

## Collections And Tags

Products can belong to multiple collections/tags.

Example:

- New Arrivals
- Vacation
- Statement

Launch collection tags:

- New Arrivals
- Everyday
- Date Night
- Vacation
- Bridal
- Birthday
- Work/Neutral
- Statement

## Pricing

Use three price tiers based on design detail level.

- Simple sets: about $15-$20
- Mid-detail sets: about $22-$30
- Detailed sets: about $32-$40

The exact prices can be placeholder values, but they should feel realistic and consistent.

## Product Names

Use a mix of clear/cute and playful names.

Examples of acceptable direction:

- Blush Crush
- Vacation Crush
- Pink French
- Golden Hour

Names can be playful, but the product card and detail page must make the style obvious through imagery, price, and supporting details.

## Product Images

Each placeholder product should eventually have two generated image assets:

- Clean background image for the main product card.
- Stylized/editorial image for the product detail page, carousel, or supporting visual.

Images should be organized by collection style. Everyday, Statement, Vacation, Bridal, and other collections can feel distinct while staying inside the same brand system.

Do not use generic gray blocks as the long-term placeholder image strategy.

## Suggested Product Fields

When implementation begins, central product data should include fields like:

- `id`
- `name`
- `slug`
- `price`
- `detailTier`
- `collections`
- `isNew`
- `isPopular`
- `description`
- `included`
- `images.clean`
- `images.editorial`
- `lengthOptions`
- `shapeOptions`
