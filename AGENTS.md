# AGENTS.md

This repository is the working prototype for YourPrettySets, a handmade ready-to-wear press-on nail storefront.

The goal is not a public-launch MVP yet. The goal is a coherent, mobile-first ecommerce prototype that helps the founder make product, brand, and UX decisions section by section.

## Operating Principle

Make the smallest reviewable change that satisfies the task.

Do not redesign unrelated areas, reopen settled decisions, or turn a focused request into a broad refactor.

## Source of Truth

Use this order when information conflicts:

1. The founder's current instruction.
2. Live code and tests for existing behavior.
3. The newest relevant section of `docs/brief/session-handoff.md`.
4. `docs/brief/open-decisions.md`.
5. The relevant page, feature, or brand brief.
6. Historical notes in `docs/brief/session-history.md`.

Do not silently choose between conflicting sources. Preserve the current implementation and report the conflict unless the founder has clearly selected a direction.

## Read Before Editing

Always:

- Inspect the files directly involved in the task.
- Check `docs/brief/open-decisions.md`.
- Read the relevant current-state section of `docs/brief/session-handoff.md`.
- Inspect live code instead of relying only on documentation.

Read additional briefs only when relevant:

- Brand, copy, or visual work: `docs/brief/brand.md`
- Home work: `docs/brief/page-home.md`
- Navigation or routing: `docs/brief/site-map.md`
- Product data or selectors: `docs/brief/product-data.md`
- Shared UI patterns: `docs/brief/shared-components.md`
- Exploratory UI passes: `docs/brief/section-pass-template.md`

Do not load every brief for every task.

## Founder Workflow

The founder is making CEO and product decisions, not managing implementation details.

Keep explanations concise and frame them as:

1. Current status
2. Recommended decision
3. Next action

When a request is exploratory, present the direction for approval before implementing it.

When the founder explicitly requests implementation, proceed without asking for the same approval again.

Do not permanently resolve open business, pricing, policy, checkout, branding, or product decisions without founder approval.

## Implementation Rules

- Keep changes scoped to the requested section or behavior.
- Inspect the existing implementation before editing.
- Prefer existing React, CSS, and component patterns over new architecture.
- Do not refactor unrelated code while completing a visual adjustment.
- Do not delete existing sections when a reversible hide, flag, or isolated experiment was requested.
- Preserve approved behavior while changing presentation.
- Use central data rather than duplicating product, policy, or Help content.
- Never stretch, squash, or distort product imagery.
- Keep generated and placeholder assets easy to replace.
- Reuse the same canonical product image across cards, recommendations, and Product Detail unless a deliberate media override exists.
- Do not claim placeholder reviews are verified customer reviews.
- Do not fabricate sizing measurements, policies, fulfillment promises, inventory, or commerce behavior.

## Canonical Data

Use these files as the canonical sources:

- Products and variants: `src/data/products.ts`
- Storefront facts and kit contents: `src/data/storefrontFacts.ts`
- Help routes, FAQs, and article content: `src/data/helpContent.ts`
- Shared media mappings: `src/data/siteMedia.ts`

Do not maintain separate copies of changeable facts inside components.

## Routing

- Define internal routes in `src/App.tsx`.
- Use React Router `Link` or `NavLink` for internal navigation.
- Do not manually switch pages using `window.location.pathname`.
- Use plain anchors only for external URLs, `mailto:`, `tel:`, and valid same-page hash links.
- Preserve route-to-heading focus and fixed-header-safe anchor behavior.

## UI Quality

Mobile UX is the priority.

For visible changes, verify the relevant views at:

- 320px mobile
- 393px mobile
- 1440px desktop
- Landscape mobile when changing menus, dialogs, or sheets

Check:

- No page-level horizontal overflow
- One H1 per page
- No broken rendered images
- No distorted product media
- No new console errors
- Keyboard and focus behavior
- Touch interaction
- Reduced-motion behavior when animation is involved
- Stable component dimensions when switching tabs, drawers, or selectors

Do not polish minor styling details when the underlying UX structure is still unresolved.

## Verification

Run targeted tests while developing.

Before claiming substantive work is complete, run:

```bash
npm test
npm run build
git diff --check
git status --short --branch
```

Run `npm audit --audit-level=moderate` only for dependency, security, or release-related work.

For visible UI work, inspect the result in the browser at:

```text
http://localhost:5173/
```

Start the development server with:

```bash
npm run dev
```

## Completion Report

End substantial work with:

- What changed
- Files changed
- Tests and checks run
- Browser sizes inspected
- Anything not verified
- Remaining founder decisions or risks

Do not claim something was tested or inspected unless it actually was.

## Git Safety

- Never discard unrelated edits or untracked files.
- Do not commit or push unless explicitly requested.
- Never force-push unless explicitly instructed and the consequences are clear.
- Keep experimental work reversible.
- Update `docs/brief/session-handoff.md` after substantial approved implementation, not after read-only analysis or tiny adjustments.
