# Home UX Bug Pass Design

Date: 2026-05-08

## Goal

Fix Home page UX bugs and incomplete prototype behavior before starting a broader UI polish pass.

This is not the UI pass. The goal is to make the current mobile-first Home page behave coherently, with working in-page destinations, no obvious mobile overflow artifacts, and clear temporary handling for unfinished areas.

## Scope

Fix:

- Links or CTAs that point to removed, missing, or circular destinations.
- Mobile overflow and visible scrollbar artifacts that make the page feel broken.
- Obvious spacing issues created by the current section build.
- Prototype-only destinations that need a clear current-page target instead of a missing route.

Do not fix in this pass:

- Final logo or brand mark treatment.
- Final photography or product art direction.
- Final color palette.
- Checkout implementation.
- Policy-page content.
- Full visual polish of the mobile menu, cards, footer, or page style.

## Current Issues To Address

### Collection Navigation

The `See all` collection link points to `#featured-sets`, but the current Home page no longer has a Featured Sets section after the weekly-set flow replaced duplicate shopping sections.

Design: retarget `See all` to the current `#shop-more` shopping row so the link lands on a real shopping area.

### Unfinished Links

Several visible links imply destinations that are not built:

- The mobile bag action points to `#bag`, but there is no bag or checkout surface.
- `See more reviews` points back to `#reviews`, which creates a circular action.
- Footer policy links point to `/shipping`, `/returns`, and `/privacy`, but the prototype does not include those pages.

Design:

- Route the bag action to a clearly labeled coming-soon in-page support area rather than a missing checkout.
- Change `See more reviews` to a non-circular support action, preferably the FAQ/contact path, until a reviews page exists.
- Keep footer policy labels visible, but route them to the FAQ/contact support area or otherwise keep them on the current page rather than navigating to missing routes.

### Mobile Overflow

The current mobile page exposes browser scrollbars in horizontal modules:

- The `Shop more` row shows a visible horizontal scrollbar.
- Review trust chips can clip off-screen.
- The review carousel peek can create a cramped scroll/overflow feel.

Design:

- Keep the horizontal browse behavior where useful.
- Hide native scrollbars for polished prototype rows.
- Allow review chips to wrap on small screens instead of clipping.
- Keep carousel peeks inside the viewport without creating page-level horizontal overflow.

### Section Rhythm

The space between the collection tiles and `This week's set` reads like an accidental blank gap on mobile.

Design: tighten the mobile-only vertical spacing between those sections while preserving enough air for scanning.

## Implementation Shape

Use existing files and patterns:

- `src/components/BrandHeader.tsx` for the mobile bag action.
- `src/components/CollectionFilters.tsx` for collection link behavior.
- `src/components/SiteFooter.tsx` for footer route behavior.
- `src/pages/HomePage.tsx` for review CTA behavior.
- `src/styles.css` for overflow, scrollbar, and section-spacing fixes.
- Existing component tests and responsive CSS tests for regression coverage.

Avoid new architecture. Avoid new pages. Avoid adding a checkout or policy system.

## Test Plan

Add focused tests for:

- Collection `See all` targeting the current shopping section.
- Mobile bag and footer links avoiding unbuilt routes.
- Review CTA no longer pointing back to the same reviews section.

Run:

- `npm test`
- `npm run build`
- `npm audit --audit-level=moderate`
- `git diff --check`
- `git status --short --branch`

For visible mobile UX, verify the Home page in the in-app browser at `http://localhost:5173/`.
