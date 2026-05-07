# Weekly Set Home Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved weekly set homepage flow and remove duplicate product sections.

**Architecture:** Keep the work inside existing Home page and product card boundaries. `HomePage.tsx` owns the new weekly feature and shop-more sections; `ProductCard.tsx` renders compact cards without placeholder text; `styles.css` handles the product-art fidelity and mobile layout.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, plain CSS.

---

### Task 1: Lock Flow With Tests

**Files:**
- Modify: `src/pages/HomePage.test.tsx`
- Modify: `src/components/ProductCard.test.tsx`

- [ ] Add tests that assert Collections are followed by `This week's set`, then `Shop more`, then `What's included`.
- [ ] Assert `New Arrivals` and `Featured Sets` no longer render on the Home page.
- [ ] Assert the weekly feature includes `1 of 4`, `Shop this set`, `Browse all new sets`, and a next-product peek.
- [ ] Assert product image areas no longer render placeholder text.
- [ ] Run focused tests and confirm they fail before implementation.

### Task 2: Implement Home Markup

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] Add weekly feature data derived from existing products.
- [ ] Replace the two product carousels with `This week's set` and `Shop more`.
- [ ] Keep `KitContents` after product shopping.
- [ ] Run focused tests and confirm Home page behavior passes.

### Task 3: Remove Placeholder Product Art Text

**Files:**
- Modify: `src/components/ProductCard.tsx`
- Modify: `src/styles.css`

- [ ] Remove visible placeholder copy from product art.
- [ ] Add code-native nail-set visual spans for product cards.
- [ ] Style weekly feature and shop-more cards to look closer to the mockup.
- [ ] Run focused product/home/style tests.

### Task 4: Handoff And Verification

**Files:**
- Modify: `docs/brief/session-handoff.md`

- [ ] Record the weekly-set flow decision.
- [ ] Run `npm test`, `npm run build`, `npm audit --audit-level=moderate`, and `git status --short --branch`.
- [ ] Merge locally to `main` after verification.

---

## Self-Review

- Spec coverage: Removes duplicate sections, adds weekly feature cues, adds shop-more row, moves what's included lower, removes placeholder image text.
- Placeholder scan: No TBD/TODO placeholders remain.
- Type consistency: Uses existing product data and component boundaries.
