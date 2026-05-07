# Home Inspo UX Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the mobile Home page top sections feel closer to the provided inspiration screens.

**Architecture:** Keep the existing React page and component boundaries. `HomePage.tsx` owns hero and step carousel markup, `CollectionFilters.tsx` owns collection tiles, and `styles.css` owns the visual fidelity/density pass.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, plain CSS.

---

### Task 1: Add UX Fidelity Tests

**Files:**
- Modify: `src/pages/HomePage.test.tsx`
- Modify: `src/components/CollectionFilters.test.tsx`
- Modify: `src/styles-responsive.test.ts`

- [ ] Add assertions for visual step card classes, carousel dots, and arrow affordance.
- [ ] Add assertions for compact collection heading and collection visual density classes.
- [ ] Add CSS assertions for smaller mobile hero headline and tighter section spacing.
- [ ] Run focused tests and confirm the new expectations fail.

### Task 2: Update Top-Section Markup

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/components/CollectionFilters.tsx`

- [ ] Change step list items to include visual spans and label spans.
- [ ] Add carousel dots under the step row.
- [ ] Add a small arrow affordance to the final step item.
- [ ] Add richer visual placeholders inside collection cards.
- [ ] Run focused tests and confirm markup expectations pass.

### Task 3: CSS Fidelity Pass

**Files:**
- Modify: `src/styles.css`

- [ ] Reduce mobile hero typography and tighten hero height.
- [ ] Make hero hand/nails more photo-like with softer scale and less abstract backdrop dominance.
- [ ] Style steps as compact visual cards like a carousel.
- [ ] Tighten spacing between top sections.
- [ ] Make collection heading and tiles visually closer to compact shop modules.
- [ ] Run focused CSS and page tests.

### Task 4: Verify, Handoff, Merge

**Files:**
- Modify: `docs/brief/session-handoff.md`

- [ ] Record the inspiration fidelity pass.
- [ ] Run `npm test`, `npm run build`, `npm audit --audit-level=moderate`, and `git status --short --branch`.
- [ ] Merge to `main` locally after verification.

---

## Self-Review

- Spec coverage: Covers hero density, visual step carousel, compact collections, no sizing-kit language, and verification.
- Placeholder scan: No placeholders remain.
- Type consistency: All class names are local CSS/markup hooks in existing files.
