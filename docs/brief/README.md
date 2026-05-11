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
- Keep placeholders easy to replace with real products, photos, and copy later.
- If a choice is listed in `open-decisions.md`, do not solve it permanently without CEO approval.

## Current Build State

The Home page foundation exists as a Vite React TypeScript app. It has central placeholder product data, shared Home components, a long-scroll mobile-first Home page, responsive CSS including 320px rules, and passing test/build/audit checks.

The latest Home page UX bug pass is complete and focused on mobile behavior rather than final UI polish. Current sections include a compact mobile header, image-led hero, overlapping How It Works step carousel, collection tiles, real weekly set carousel, two-card shop-more carousel, kit contents accordion, review carousel, FAQ accordion, and accordion footer.

Next likely work is the broader UI pass. Preserve the approved behavior documented in `session-handoff.md`, then improve visual treatment section by section. The immediate open thread is the UI of the How It Works carousel cards: the CEO skipped further work on the hero-to-card gradient and wants fresh card-only mockups before implementation. Do not treat the logo, final visuals, product photography, product copy, checkout, policies, or broader UI styling as final.
