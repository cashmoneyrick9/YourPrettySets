# Mobile Home Mockup Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the structural mobile home pass with a closer mockup-fidelity version of the hero, confidence strip, and collection tiles.

**Architecture:** Keep the existing page/component boundaries. `HomePage.tsx` owns hero and confidence markup; `CollectionFilters.tsx` owns the collection tile markup; `styles.css` owns the mockup-like visual treatment.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, plain CSS.

---

### Task 1: Tests For Mockup Fidelity Structure

**Files:**
- Modify: `src/components/CollectionFilters.test.tsx`
- Modify: `src/styles-responsive.test.ts`

- [ ] Add a test that Collections now shows the three mobile shopping paths and a `See all` link.
- [ ] Add CSS expectations for overlay hero, attached confidence strip, and visual collection tile classes.
- [ ] Run focused tests and verify they fail before implementation.

### Task 2: Update Markup

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/components/CollectionFilters.tsx`

- [ ] Reorder hero markup so the visual surface renders first and copy overlays it.
- [ ] Add an inner nail-scene grouping to support product-style placeholder visuals.
- [ ] Change Collections to only render `Everyday`, `Date Night`, and `Vacation`, plus a `See all` link.
- [ ] Add visual spans inside each collection tile.
- [ ] Run focused tests and verify markup expectations pass.

### Task 3: CSS Fidelity Pass

**Files:**
- Modify: `src/styles.css`

- [ ] Make mobile hero a single rounded visual panel with text overlaid near the bottom.
- [ ] Make the hero visual resemble a close-up product/lifestyle shot using layered gradients and nail shapes.
- [ ] Pull the confidence strip tighter under the hero and remove the thick standalone-section feel.
- [ ] Style collection tiles as compact image-led cards with product miniatures.
- [ ] Verify at 320px CSS constraints keep text inside components.

### Task 4: Handoff And Verification

**Files:**
- Modify: `docs/brief/session-handoff.md`

- [ ] Record that the structural pass was corrected with a mockup-fidelity pass.
- [ ] Run `npm test`, `npm run build`, `npm audit --audit-level=moderate`, and `git status --short --branch`.
- [ ] Commit final docs and verified changes.

---

## Self-Review

- Spec coverage: Hero panel, attached confidence strip, visual collection tiles, reduced top collection paths, no sizing-kit language, and verification are covered.
- Placeholder scan: No TBD/TODO placeholders remain.
- Type consistency: New class names remain local to the existing React/CSS files.
