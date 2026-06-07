# AGENTS.md

This repo is the working prototype for YourPrettySets, a handmade ready-to-wear press-on nail storefront.

The goal right now is not a public launch MVP. The goal is a coherent mobile-first ecommerce prototype that helps the founder make product, brand, and UX decisions section by section.

## Start Here

Before changing code, read:

- `docs/brief/README.md`
- `docs/brief/session-handoff.md`
- `docs/brief/brand.md`
- `docs/brief/page-home.md`
- `docs/brief/open-decisions.md`
- `docs/brief/section-pass-template.md`

The handoff file is the fastest source of current state. If it conflicts with live code, verify the code and update the handoff before ending your work.
For UI section passes, use `docs/brief/section-pass-template.md` as the repeatable CEO checklist before writing a web-dev handoff.

## Founder / Co-Founder Context

- The founder is making CEO/product calls, not trying to manage implementation details.
- Keep explanations concise and framed around what should be judged next.
- Mobile UX is the priority right now.
- Branding, logo, final photography, final copy, checkout, and policy wording are not final.
- Do not get stuck polishing UI details if the UX structure is still the real question.
- Placeholder product visuals are acceptable as long as the structure is easy to replace later.

## Current Product Direction

The Home page is a mobile-first shopping path:

- Compact ecommerce header
- Image-led hero with `Shop sets`
- Step carousel
- Collection tiles
- `This week's set`
- `Shop more`
- Kit contents accordion
- Review carousel
- FAQ accordion
- Accordion footer

The latest footer decision: no standalone footer `Contact us` button. Contact lives inside the `Help` footer accordion, while the FAQ still has its own `Still unsure? Contact us` CTA.

## Code Map

- App shell: `src/App.tsx`
- Home page: `src/pages/HomePage.tsx`
- Header: `src/components/BrandHeader.tsx`
- Footer: `src/components/SiteFooter.tsx`
- Kit section: `src/components/KitContents.tsx`
- Product data: `src/data/products.ts`
- Main styling: `src/styles.css`
- Tests: `src/**/*.test.tsx` and `src/styles-responsive.test.ts`

## Working Rules

- Keep changes section-scoped.
- Prefer existing React/CSS patterns over introducing new architecture.
- Use central product data instead of hardcoding products in new sections.
- Add new internal pages through React Router routes in `src/App.tsx`; do not manually switch pages by reading `window.location.pathname`.
- Use React Router `Link`/`NavLink` for internal page navigation such as `/shop` or future `/products/...` routes. Keep plain anchors only for external URLs, `mailto:`, `tel:`, and same-page/homepage hash links such as `#faq` or `/#reviews`.
- Do not permanently resolve open business decisions without founder approval.
- Do not revert unrelated changes or untracked files. `.claude/` has been present as unrelated untracked state.
- Update `docs/brief/session-handoff.md` before ending substantial work.

## Verification

Use these checks before claiming work is done:

```bash
npm test
npm run build
npm audit --audit-level=moderate
git diff --check
git status --short --branch
```

For visible mobile UX work, also verify in the browser at:

```text
http://localhost:5173/
```

If the dev server is not running:

```bash
npm run dev -- --host 0.0.0.0
```

## Git

The default finish path for this repo is local commits on `main` unless the founder asks for a different workflow.
