# Site Map

Last aligned with the live prototype: 2026-07-09.

## Navigation

Desktop primary navigation:

- Home: `/`
- Shop: `/shop`
- Help: `/help`

The mobile Shop submenu links to Ready to Ship, Made to Order, and Custom Orders. The mobile Help submenu links to the Press-On Guide, Find Your Fit, Apply Your Set, Remove & Reuse, Shipping, Returns & Order Issues, FAQ, and Contact Support.

The bag control remains a coming-soon affordance. Checkout is not connected.

## Shopping Pages

### Home

The Home page is the visual reference for the storefront and the first shopping path into ready-to-wear sets.

### Shop

- All sets: `/shop`
- Ready to Ship: `/shop/ready-to-ship`
- Made to Order: `/shop/made-to-order`
- Custom-order waitlist status: `/shop/custom-orders`

Shop collections and filters share the main Shop page. Custom orders are waitlist-only; the prototype email signup is not connected to a backend yet.

### Product Detail

Regular set pages use `/products/:slug` and show product information, length and shape selectors, fit guidance, what is included, and the canonical Product FAQ subset.

The standalone sizing kit uses `/products/sizing-kit`. It has a confirmed $10 price and its own Product-page presentation, but deliberately has no Add to Cart or payment behavior until commerce is connected.

## Press-On Guide

The Help Center is organized around customer tasks:

- Press-On Guide hub: `/help`
- Find Your Fit: `/help/sizing`
- Apply Your Set: `/help/application`
- Remove & Reuse: `/help/removal`
- Shipping, Returns & Order Issues: `/help/shipping-returns`
- FAQ: `/help/faq`
- Contact Support: `/help/contact`

The old `/help/how-to-apply` route redirects to `/help/application`. Order-problem links may deep-link to sections within the combined shipping and order-issues article.

## Policy Placeholders

- Privacy: `/privacy`
- Terms: `/terms`

These pages remain placeholders until final language is approved.

## Footer

The lower footer keeps the current three-column Shop, Help, and Policies structure. Help links use the canonical Help routes, Contact Support is available inside the Help column, and the combined order article is not split into competing Shipping and Returns destinations.

The public support email is `yourprettysets@gmail.com`.
