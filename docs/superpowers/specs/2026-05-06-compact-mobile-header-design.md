# Compact Mobile Header Design

## Status

Approved for specification by the CEO on 2026-05-06.

Implementation has not started.

## Purpose

Improve the YourPrettySets mobile header layout without trying to finalize the logo or brand mark.

The current mobile header exposes the full navigation row, which can wrap awkwardly and make `Bag` drop to its own line. The CEO identified layout as the main problem. The brand text itself is not final, so this design keeps `YourPrettySets` as a simple replaceable text mark.

## Selected Direction

Use a compact mobile ecommerce header.

Mobile header layout:

- Left: `YourPrettySets` text brand mark.
- Right: compact actions for menu, shop, and bag.
- The full navigation list is hidden on mobile.
- `Bag` remains directly accessible through an icon-style link.
- `Shop` remains directly visible as the primary shopping entry.

Desktop and larger tablet layout can keep the existing fuller navigation for now.

## Mobile Behavior

At mobile widths, the header should be a single row that fits cleanly at 320px.

Expected visible actions:

- Menu button: opens and closes a simple navigation panel.
- `Shop`: links to `#shop-collections`.
- Bag icon/link: links to `#bag`.

Menu panel links:

- Home
- Shop Collections
- How It Works
- FAQ

The menu panel should be simple and restrained. It should not use decorative boutique details such as scallops, hearts, dots, or fake handwritten-logo treatments.

## Visual Constraints

The header should feel clean, polished, and boutique, but not overly decorative.

Use the existing spring/summer palette direction in a restrained way:

- Fresh white or near-white base.
- Raspberry/coral accent for the brand and shopping action.
- Mint, seafoam, sky blue, or butter yellow only as subtle supporting accents if needed.

Do not make the header beige, cold, luxury-spa styled, childish, or generic beauty-template styled.

Do not redesign the logo. The text brand mark is a placeholder until the CEO chooses a final logo direction.

## Accessibility

The menu button needs an accessible label and a clear expanded/collapsed state.

Keyboard users should be able to:

- Tab to the brand link.
- Tab to the menu button.
- Open the menu.
- Reach each menu link.
- Reach the shop and bag links.

Focus styles should stay visible.

## Component Scope

Primary files expected to change during implementation:

- `src/components/BrandHeader.tsx`
- `src/components/BrandHeader.test.tsx`
- `src/styles.css`
- `src/styles-responsive.test.ts`

No new routing, checkout behavior, product data, or final branding work is part of this change.

## Testing

Implementation should include focused tests that verify:

- The mobile header exposes menu, shop, and bag actions.
- The menu can open and show the expected navigation links.
- The CSS keeps a dedicated 320px/mobile header treatment.

Run these verification commands before completion:

```bash
npm test
npm run build
npm audit --audit-level=moderate
git status --short
```

## Acceptance Criteria

- The mobile header no longer shows the full five-link navigation row as the primary layout.
- `Bag` does not wrap awkwardly onto its own line at 320px.
- `Shop` remains easy to find on mobile.
- The brand stays visible but is not treated as a final logo.
- Desktop navigation is not unnecessarily redesigned.
- The implementation remains consistent with the existing Home page prototype.
