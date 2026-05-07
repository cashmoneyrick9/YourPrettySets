# Mobile Home Shopping Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the Home page opening flow so mobile users see hero, three-step confidence strip, collections, then New Arrivals.

**Architecture:** Keep the work inside the existing Home page and CSS structure. `HomePage.tsx` owns the section order and copy; existing shared components continue to render collections and product carousels. CSS adds the photo-led hero treatment and slim confidence strip without introducing new routing or data models.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, plain CSS.

---

### Task 1: Lock Homepage Order And Copy With Tests

**Files:**
- Modify: `src/pages/HomePage.test.tsx`

- [ ] **Step 1: Write the failing homepage test**

Replace the existing `renders every approved Home section` test with assertions that check the new copy and section order:

```tsx
it("renders the mobile shopping path before product shopping", () => {
  render(<HomePage />);

  const hero = screen.getByRole("heading", { name: "Ready-to-wear sets for pretty plans" });
  const confidence = screen.getByRole("heading", { name: "Ready in three steps" });
  const collections = screen.getByRole("heading", { name: "Browse by the plan, mood, or moment." });
  const newArrivals = screen.getByRole("heading", { name: "New Arrivals" });

  expect(hero).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Shop sets" })).toHaveAttribute("href", "#shop-collections");
  expect(screen.getByText("Pick your set")).toBeInTheDocument();
  expect(screen.getByText("Choose your wear")).toBeInTheDocument();
  expect(screen.getByText("Press on pretty")).toBeInTheDocument();
  expect(screen.queryByText(/size/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/sizing kit/i)).not.toBeInTheDocument();

  expect(hero.compareDocumentPosition(confidence) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(confidence.compareDocumentPosition(collections) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(collections.compareDocumentPosition(newArrivals) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
```

- [ ] **Step 2: Run the test and verify it fails for the right reason**

Run:

```bash
npm test -- src/pages/HomePage.test.tsx
```

Expected: FAIL because the old hero heading, old CTA, old `How it works` section, and old section order are still present.

- [ ] **Step 3: Commit the failing test only**

```bash
git add src/pages/HomePage.test.tsx
git commit -m "test: cover mobile home shopping path"
```

---

### Task 2: Implement Homepage Structure

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Update the confidence strip data**

Replace the old `howItWorks` array with:

```tsx
const confidenceSteps = [
  "Pick your set",
  "Choose your wear",
  "Press on pretty"
];
```

- [ ] **Step 2: Update the hero copy and visual markup**

Replace the current hero section content with a photo-led layout:

```tsx
<section className="hero-section">
  <div className="hero-copy">
    <p className="eyebrow">Handmade ready-to-wear press-ons</p>
    <h1>Ready-to-wear sets for pretty plans</h1>
    <p>Handmade press-on sets for everyday style, special plans, and salon-looking moments at home.</p>
    <a className="primary-button" href="#shop-collections">
      Shop sets
    </a>
  </div>
  <div className="hero-photo" aria-label="Glossy pink press-on nail set on a soft spring vanity">
    <span className="hero-photo__nail hero-photo__nail--one" />
    <span className="hero-photo__nail hero-photo__nail--two" />
    <span className="hero-photo__nail hero-photo__nail--three" />
    <span className="hero-photo__nail hero-photo__nail--four" />
    <span className="hero-photo__nail hero-photo__nail--five" />
  </div>
</section>
```

- [ ] **Step 3: Move the sections into the approved order**

Immediately after hero, render:

```tsx
<section className="section-block confidence-section" id="how-it-works">
  <div className="section-heading">
    <p className="eyebrow">Ready to wear</p>
    <h2>Ready in three steps</h2>
  </div>
  <ol className="confidence-list">
    {confidenceSteps.map((step) => (
      <li key={step}>{step}</li>
    ))}
  </ol>
</section>

<CollectionFilters />
<ProductCarousel eyebrow="Fresh sets" title="New Arrivals" products={newArrivals} />
```

Then keep the remaining sections in the existing order:

```tsx
<ProductCarousel eyebrow="Customer moodboard" title="Featured Sets" products={featuredProducts} />
<KitContents />
```

- [ ] **Step 4: Run the homepage test and verify it passes**

Run:

```bash
npm test -- src/pages/HomePage.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit the React implementation**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: reorder mobile home shopping path"
```

---

### Task 3: Add Mobile Visual Polish And CSS Coverage

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles-responsive.test.ts`

- [ ] **Step 1: Update the responsive CSS test**

Change the first CSS test to expect the new hero/confidence selectors:

```ts
expect(styles).toContain(".hero-photo");
expect(styles).toContain(".confidence-list");
expect(styles).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
expect(styles).toContain("@media (max-width: 360px)");
expect(styles).toContain(".hero-photo__nail");
expect(styles).toContain("min-height: 42px");
```

- [ ] **Step 2: Run the CSS test and verify it fails for the right reason**

Run:

```bash
npm test -- src/styles-responsive.test.ts
```

Expected: FAIL because `.hero-photo`, `.confidence-list`, and mobile nail styling do not exist yet.

- [ ] **Step 3: Replace old hero visual styles with photo-led CSS**

Remove the old `.hero-product-spread`, `.nail-tile`, and nail color block rules. Add:

```css
.hero-photo {
  align-self: center;
  aspect-ratio: 4 / 5;
  background:
    radial-gradient(circle at 24% 18%, rgba(255, 255, 255, 0.76), transparent 16%),
    linear-gradient(150deg, rgba(255, 216, 226, 0.92), rgba(255, 246, 237, 0.72) 46%, rgba(185, 236, 218, 0.68)),
    #ffffff;
  border: 1px solid rgba(217, 79, 124, 0.14);
  border-radius: 8px;
  box-shadow: 0 30px 80px rgba(93, 48, 67, 0.12);
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  overflow: hidden;
  padding: clamp(22px, 5vw, 46px);
}

.hero-photo__nail {
  align-self: end;
  background: linear-gradient(180deg, #ffd9df, #f19a93);
  border-radius: 999px 999px 48px 48px;
  box-shadow: inset 0 10px 18px rgba(255, 255, 255, 0.42);
  min-height: clamp(120px, 22vw, 220px);
}
```

- [ ] **Step 4: Add slim confidence strip CSS**

Add:

```css
.confidence-section {
  background: #fff6ed;
  padding-block: clamp(24px, 4vw, 42px);
}

.confidence-section .section-heading {
  margin-bottom: 14px;
}

.confidence-list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  list-style: none;
  margin: 0 auto;
  max-width: 920px;
  padding: 0;
}

.confidence-list li {
  background: #ffffff;
  border: 1px solid rgba(217, 79, 124, 0.14);
  border-radius: 8px;
  color: #392a31;
  font-size: 0.95rem;
  font-weight: 900;
  line-height: 1.2;
  min-height: 62px;
  padding: 14px;
}
```

- [ ] **Step 5: Update mobile CSS**

In the existing mobile media rules, replace old nail-tile rules with:

```css
.hero-photo {
  gap: 7px;
  padding: 18px;
}

.hero-photo__nail {
  min-height: 42px;
}

.confidence-list {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.confidence-list li {
  font-size: 0.78rem;
  min-height: 54px;
  padding: 10px 8px;
  text-align: center;
}
```

- [ ] **Step 6: Run CSS test and focused homepage tests**

Run:

```bash
npm test -- src/styles-responsive.test.ts src/pages/HomePage.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit CSS polish**

```bash
git add src/styles.css src/styles-responsive.test.ts
git commit -m "style: polish mobile home shopping path"
```

---

### Task 4: Handoff And Full Verification

**Files:**
- Modify: `docs/brief/session-handoff.md`

- [ ] **Step 1: Update the handoff**

Add a short note that the approved mobile Home page opening order is hero, confidence strip, collections, New Arrivals, and that sizing-kit copy is intentionally excluded.

- [ ] **Step 2: Run full verification**

Run:

```bash
npm test
npm run build
npm audit --audit-level=moderate
git status --short --branch
```

Expected:
- all tests pass
- build passes
- audit reports 0 moderate-or-higher vulnerabilities
- only intentional files are modified or the branch is clean after the final commit

- [ ] **Step 3: Commit docs if changed**

```bash
git add docs/brief/session-handoff.md
git commit -m "docs: update mobile home shopping path handoff"
```

---

## Self-Review

- Spec coverage: The plan covers hero visual direction, slim three-step strip, collections before New Arrivals, exclusion of sizing-kit language, and verification.
- Placeholder scan: No TBD/TODO placeholders remain.
- Type consistency: The plan uses existing React component names and introduces only local constants/classes inside existing files.
