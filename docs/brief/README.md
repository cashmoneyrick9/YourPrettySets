# YourPrettySets Developer Brief

This folder is the working source of truth for building the YourPrettySets site. It is written for the CEO and for agents who will build the site page by page, section by section.

The current goal is not a public launch MVP. The current goal is a structured brand and ecommerce prototype that gives future agents enough information to build consistently.

## Build Strategy

- Build one page at a time.
- Start with the Home page.
- Treat the Home page as the visual reference for the rest of the site.
- Use central placeholder product data from the beginning.
- Keep data and structure coherent first, while making the interface polished enough to judge the brand.
- Use realistic placeholders, not generic filler.
- Keep checkout intentionally unfinished until the business chooses a checkout path.

## Current Docs

- [brand.md](brand.md) - brand direction, tone, color direction, do/don't rules.
- [site-map.md](site-map.md) - pages, navigation, and page responsibilities.
- [product-data.md](product-data.md) - placeholder product model, collections, options, pricing, and image rules.
- [shared-components.md](shared-components.md) - components agents should keep consistent.
- [page-home.md](page-home.md) - Home page section-by-section build brief.
- [open-decisions.md](open-decisions.md) - unresolved decisions that should not block the first prototype.
- [section-pass-template.md](section-pass-template.md) - repeatable CEO checklist for UI section passes and mockup planning.
- [session-handoff.md](session-handoff.md) - latest build state, CEO feedback, and next recommended work.

## Agent Rules

- Read this README plus the doc for the section/page you own.
- For any UI pass, read `section-pass-template.md` and use its CEO checklist before writing a dev handoff.
- Do not invent new brand directions, collections, pricing systems, or checkout behavior.
- Pull products from the central product data source once the app exists.
- Use React Router as the standard page-routing layer. Add new internal pages as routes in `src/App.tsx`; do not reintroduce manual `window.location.pathname` page switching.
- Use React Router `Link`/`NavLink` for internal page links. Plain `<a>` tags are for external URLs, `mailto:`, `tel:`, and same-page/homepage hash links like `#faq` or `/#reviews`.
- Keep placeholders easy to replace with real products, photos, and copy later.
- If a choice is listed in `open-decisions.md`, do not solve it permanently without CEO approval.

## Current Build State

The storefront exists as a Vite React TypeScript app with central product data, shared Home and Product components, responsive CSS including 320px rules, and React Router page navigation.

The complete Press-On Guide system is now implemented at `/help`, with task-based sizing, application, removal, shipping/order-issue, FAQ, and Contact routes; centralized storefront facts; reusable article components; mobile/desktop article navigation; and a separate $10 sizing-kit Product page with commerce clearly marked as not connected.

Preserve the approved behavior documented in `session-handoff.md` and improve visual treatment section by section. Do not treat the logo, final product photography, final copy, checkout, the missing sizing measurements, the planned glue-removal product, or Privacy/Terms wording as final.
