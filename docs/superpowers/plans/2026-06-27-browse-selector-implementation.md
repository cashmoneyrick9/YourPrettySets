# Browse Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved Browse selector update with blank placeholder image tiles, no default selected collection, collection products only after selection, and a separate Featured Sets carousel below Browse.

**Architecture:** Keep the work scoped to the existing Home Browse components. `CollectionFilters` owns Browse selection state and renders selected collection products only after interaction. A new `FeaturedSets` component renders a stable placeholder product carousel from central product data below Browse. `MobileCarousel` gets a narrow control hook for stopping auto-rotation permanently after a Browse selection.

**Tech Stack:** React, TypeScript, React Router, Embla-backed `MobileCarousel`, Vitest/Testing Library, existing CSS in `src/styles.css`.

---

### Task 1: Red Tests For Browse Default And Selected States

**Files:**
- Modify: `src/components/CollectionFilters.test.tsx`

- [ ] **Step 1: Write the failing test**

Replace the old "renders slim collection filters followed by products from the active collection" expectations with assertions that default Browse has no pressed collection, no collection products, and an auto-rotating carousel. Add selected-state assertions after clicking `Bridal`:

```tsx
expect(screen.getByRole("button", { name: "Everyday" })).toHaveAttribute("aria-pressed", "false");
expect(screen.queryByRole("heading", { name: "Everyday sets" })).not.toBeInTheDocument();
expect(document.querySelector(".collection-products")).not.toBeInTheDocument();
expect(document.querySelector(".collection-carousel")).toHaveAttribute("data-auto-rotate", "true");

await user.click(screen.getByRole("button", { name: "Bridal" }));

expect(screen.getByRole("button", { name: "Bridal" })).toHaveAttribute("aria-pressed", "true");
expect(screen.getByRole("heading", { name: "Bridal sets" })).toBeInTheDocument();
expect(document.querySelector(".collection-carousel")).not.toHaveAttribute("data-auto-rotate");
```

- [ ] **Step 2: Run red test**

Run: `npm run test -- src/components/CollectionFilters.test.tsx --run`

Expected: FAIL because the current component selects `Everyday` immediately and always shows collection products.

### Task 2: Red Tests For Featured Sets

**Files:**
- Modify: `src/components/CollectionFilters.test.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions that Featured Sets renders independently below Browse and uses new placeholder-card names:

```tsx
expect(screen.getByRole("heading", { name: "Featured sets" })).toBeInTheDocument();
expect(screen.getByRole("link", { name: "View Glazed Petal" })).toHaveAttribute("href", "/shop");
expect(screen.getByRole("link", { name: "View Sunset Sprinkle" })).toHaveAttribute("href", "/shop");
```

- [ ] **Step 2: Run red test**

Run: `npm run test -- src/components/CollectionFilters.test.tsx --run`

Expected: FAIL because no Featured Sets section exists.

### Task 3: Implement Browse Selection State

**Files:**
- Modify: `src/components/CollectionFilters.tsx`
- Modify: `src/components/MobileCarousel.tsx`

- [ ] **Step 1: Add permanent auto-rotation stop support**

Add an optional `autoRotateStopped?: boolean` prop to `MobileCarousel`. When true, prevent `startAutoRotate` and `resumeAutoRotate` from starting the animation, clear any active frame/timer, and omit the `data-auto-rotate` attribute.

- [ ] **Step 2: Update Browse state**

Change `CollectionFilters` to track `selectedCollectionIndex: number | null` with a default of `null`. Render collection products only when the value is not null. Pass `autoRotateStopped={selectedCollectionIndex !== null}` and `scrollToIndex={selectedCollectionIndex}` to `MobileCarousel`.

- [ ] **Step 3: Run green test**

Run: `npm run test -- src/components/CollectionFilters.test.tsx --run`

Expected: PASS for default and selected Browse behavior after Task 2 is implemented.

### Task 4: Implement Featured Sets Placeholder Carousel

**Files:**
- Modify: `src/components/CollectionFilters.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add placeholder featured data**

Create four local featured placeholder cards in `CollectionFilters.tsx` with new names such as `Glazed Petal`, `Sunset Sprinkle`, `Pearl Wink`, and `Poolside Pop`.

- [ ] **Step 2: Render Featured Sets below Browse**

Add a `FeaturedSets` section after the Browse section content. Use `MobileCarousel` with no visible arrows/dots, placeholder image wells, and links to `/shop` until real product assignment is chosen.

- [ ] **Step 3: Add scoped CSS**

Style `.featured-sets-section`, `.featured-sets-carousel`, `.featured-set-card`, and `.featured-set-card__image` as compact product-image cards, aligned with the existing Home product card rhythm.

- [ ] **Step 4: Run green test**

Run: `npm run test -- src/components/CollectionFilters.test.tsx --run`

Expected: PASS.

### Task 5: Responsive CSS And Verification

**Files:**
- Modify: `src/styles-responsive.test.ts`
- Modify: `src/styles.css`
- Modify: `docs/brief/session-handoff.md`

- [ ] **Step 1: Add CSS expectations**

Add targeted responsive-style assertions for image tile classes, no old outline-heavy selected styling, and Featured Sets classes.

- [ ] **Step 2: Run focused tests**

Run: `npm run test -- src/components/CollectionFilters.test.tsx src/styles-responsive.test.ts --run`

Expected: PASS.

- [ ] **Step 3: Run build/checks**

Run: `npm run build` and `git diff --check`.

Expected: both pass.

- [ ] **Step 4: Update handoff**

Add a short implementation note to `docs/brief/session-handoff.md` only after the tests/build pass.
