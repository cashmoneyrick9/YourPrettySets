# Home UX Bug Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the current Home page UX behave coherently before the later UI polish pass.

**Architecture:** Keep the existing React component structure and fix only link destinations, temporary prototype actions, mobile overflow, and section rhythm. Use focused RTL tests for behavior and responsive CSS tests for the mobile styling contract.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, CSS.

---

## File Map

- Modify `src/components/CollectionFilters.tsx`: retarget `See all` to the current `#shop-more` shopping row.
- Modify `src/components/BrandHeader.tsx`: route the bag action to the current support/FAQ path instead of missing `#bag`.
- Modify `src/components/SiteFooter.tsx`: keep policy labels visible but route them to the current FAQ/contact support path instead of missing pages.
- Modify `src/pages/HomePage.tsx`: change `See more reviews` from a circular `#reviews` link to the current support/contact path.
- Modify `src/styles.css`: hide native horizontal scrollbars, allow review chips to wrap, prevent carousel/page overflow artifacts, and tighten mobile spacing before `This week's set`.
- Modify `vite.config.ts`: exclude unrelated `.claude/**` worktree files from Vitest discovery so verification only covers the real repo source.
- Modify existing tests in `src/components/*.test.tsx`, `src/pages/HomePage.test.tsx`, and `src/styles-responsive.test.ts`.
- Modify `docs/brief/session-handoff.md` after implementation.

---

### Task 1: Link Destination Regression Tests

**Files:**
- Modify: `src/components/CollectionFilters.test.tsx`
- Modify: `src/components/BrandHeader.test.tsx`
- Modify: `src/pages/HomePage.test.tsx`
- Create: `src/components/SiteFooter.test.tsx`

- [ ] **Step 1: Write failing tests for link destinations**

Update `src/components/CollectionFilters.test.tsx` so `See all` expects the current shopping row:

```tsx
expect(screen.getByRole("link", { name: "See all" })).toHaveAttribute("href", "#shop-more");
```

Update `src/components/BrandHeader.test.tsx` so the mobile bag action expects the temporary support path:

```tsx
expect(screen.getByRole("link", { name: "View bag" })).toHaveAttribute("href", "#faq");
```

Update `src/pages/HomePage.test.tsx` in `shows the review carousel foundation`:

```tsx
expect(screen.getByRole("link", { name: "See more reviews" })).toHaveAttribute("href", "#contact");
```

Create `src/components/SiteFooter.test.tsx`:

```tsx
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

afterEach(() => {
  cleanup();
});

describe("SiteFooter", () => {
  it("keeps unfinished policy links inside the current prototype support path", async () => {
    const user = userEvent.setup();
    render(<SiteFooter />);

    await user.click(screen.getByRole("button", { name: "Policies" }));

    const footerNav = screen.getByRole("navigation", { name: "Footer navigation" });
    for (const label of ["Shipping", "Returns", "Privacy"]) {
      expect(within(footerNav).getByRole("link", { name: label })).toHaveAttribute("href", "#faq");
    }
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

Run:

```bash
npm test -- src/components/CollectionFilters.test.tsx src/components/BrandHeader.test.tsx src/pages/HomePage.test.tsx src/components/SiteFooter.test.tsx
```

Expected: FAIL because current code still uses `#featured-sets`, `#bag`, `#reviews`, and `/shipping`/`/returns`/`/privacy`.

---

### Task 2: Minimal Link Fixes

**Files:**
- Modify: `src/components/CollectionFilters.tsx`
- Modify: `src/components/BrandHeader.tsx`
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Implement minimal component changes**

In `src/components/CollectionFilters.tsx`, change:

```tsx
<a className="collection-heading__link" href="#featured-sets">
```

to:

```tsx
<a className="collection-heading__link" href="#shop-more">
```

In `src/components/BrandHeader.tsx`, change:

```tsx
<a className="brand-header__icon-button" href="#bag" aria-label="View bag">
```

to:

```tsx
<a className="brand-header__icon-button" href="#faq" aria-label="View bag">
```

In `src/components/SiteFooter.tsx`, change policy links:

```tsx
{ href: "/shipping", label: "Shipping" },
{ href: "/returns", label: "Returns" },
{ href: "/privacy", label: "Privacy" }
```

to:

```tsx
{ href: "#faq", label: "Shipping" },
{ href: "#faq", label: "Returns" },
{ href: "#faq", label: "Privacy" }
```

In `src/pages/HomePage.tsx`, change:

```tsx
<a className="review-more-link" href="#reviews">
```

to:

```tsx
<a className="review-more-link" href="#contact">
```

- [ ] **Step 2: Run focused tests**

Run:

```bash
npm test -- src/components/CollectionFilters.test.tsx src/components/BrandHeader.test.tsx src/pages/HomePage.test.tsx src/components/SiteFooter.test.tsx
```

Expected: PASS.

---

### Task 3: Mobile Overflow And Rhythm Fixes

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles-responsive.test.ts`
- Modify: `vite.config.ts`

- [ ] **Step 1: Write responsive CSS regression expectations**

Add expectations to `src/styles-responsive.test.ts`:

```ts
expect(styles).toContain("scrollbar-width: none");
expect(styles).toContain(".shop-more-grid::-webkit-scrollbar");
expect(styles).toContain(".review-proof-row {\n    flex-wrap: wrap;");
expect(styles).toContain(".collection-section {\n    padding-bottom: 24px;");
expect(styles).toContain(".weekly-set-section {\n    padding-top: 24px;");
```

- [ ] **Step 2: Run responsive test to verify failure**

Run:

```bash
npm test -- src/styles-responsive.test.ts
```

Expected: FAIL until CSS is updated.

- [ ] **Step 3: Implement CSS changes**

Add this near the horizontal row styles in `src/styles.css`:

```css
.shop-more-grid,
.review-proof-row {
  scrollbar-width: none;
}

.shop-more-grid::-webkit-scrollbar,
.review-proof-row::-webkit-scrollbar {
  display: none;
}
```

Inside `@media (max-width: 360px)`, add or update:

```css
.collection-section {
  padding-bottom: 24px;
  padding-top: 28px;
}

.weekly-set-section {
  padding-top: 24px;
}

.review-proof-row {
  flex-wrap: wrap;
  overflow-x: visible;
  padding-bottom: 10px;
}
```

In `vite.config.ts`, keep Vitest from discovering stale tests under unrelated local worktrees:

```ts
exclude: ["**/node_modules/**", "**/dist/**", "**/.claude/**"],
```

- [ ] **Step 4: Run responsive test**

Run:

```bash
npm test -- src/styles-responsive.test.ts
```

Expected: PASS.

---

### Task 4: Handoff And Verification

**Files:**
- Modify: `docs/brief/session-handoff.md`

- [ ] **Step 1: Update handoff**

In `docs/brief/session-handoff.md`, update `Last updated` to `2026-05-08` and add a short note under implemented mobile Home page shopping path:

```md
  - Home UX bug pass fixed broken or incomplete prototype destinations, including collection `See all`, bag, review, and footer policy links
  - mobile overflow polish hides native row scrollbars, lets review trust chips wrap, and tightens the collection-to-weekly-set spacing on very small screens
```

Add a new important commit placeholder only after the commit exists:

```md
- <commit> - Fix home UX bug pass
```

- [ ] **Step 2: Run full verification**

Run:

```bash
npm test
npm run build
npm audit --audit-level=moderate
git diff --check
git status --short --branch
```

Expected:

- `npm test`: all tests pass.
- `npm run build`: passes.
- `npm audit --audit-level=moderate`: 0 vulnerabilities.
- `git diff --check`: no output.
- `git status --short --branch`: only intended modified files plus known unrelated `.claude/`.

- [ ] **Step 3: Browser verify mobile Home page**

Open or reload:

```text
http://localhost:5173/
```

Verify:

- `See all` scrolls to `Shop more`.
- Bag icon no longer targets missing `#bag`.
- Review chips no longer clip off-screen on 320px mobile.
- Product/review rows no longer show native horizontal scrollbar tracks.
- Collection-to-weekly spacing is tighter.

- [ ] **Step 4: Commit implementation**

Run:

```bash
git add src/components/CollectionFilters.tsx src/components/CollectionFilters.test.tsx src/components/BrandHeader.tsx src/components/BrandHeader.test.tsx src/components/SiteFooter.tsx src/components/SiteFooter.test.tsx src/pages/HomePage.tsx src/pages/HomePage.test.tsx src/styles.css src/styles-responsive.test.ts docs/brief/session-handoff.md
git commit -m "Fix home UX bug pass"
```
