# How It Works Carousel UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Home page `How it works` carousel visual treatment to match the approved overlap/frosted warm-card direction without changing the UX.

**Architecture:** Keep the carousel state and copy in `src/pages/HomePage.tsx`. Add slide-specific code-native visual markup for the three existing slide types, then style the existing confidence section/card in `src/styles.css`. Use focused tests in `HomePage.test.tsx` and `styles-responsive.test.ts` to lock the UX and responsive CSS hooks.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library.

---

### Task 1: Lock Carousel UX And Visual Hooks

**Files:**
- Modify: `src/pages/HomePage.test.tsx`
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Write the failing test**

Add a test that confirms each existing slide keeps the same copy while exposing the intended slide visual hook:

```tsx
it("renders distinct visual treatments for each step without changing carousel copy", async () => {
  const user = userEvent.setup();
  render(<HomePage />);

  expect(screen.getByText("Pick your set")).toBeInTheDocument();
  expect(document.querySelector(".confidence-card__tray")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Next step" }));
  expect(screen.getByText("Choose your wear")).toBeInTheDocument();
  expect(screen.getByText("Glue or tabs")).toBeInTheDocument();
  expect(document.querySelector(".confidence-card__glue")).toBeInTheDocument();
  expect(document.querySelector(".confidence-card__tabs")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Next step" }));
  expect(screen.getByText("Press on pretty")).toBeInTheDocument();
  expect(screen.getByText("Ready in minutes")).toBeInTheDocument();
  expect(document.querySelector(".confidence-card__hand")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/pages/HomePage.test.tsx`

Expected: FAIL because the new visual hook classes do not exist yet.

- [ ] **Step 3: Add slide-specific visual markup**

Replace the repeated nail-only visual spans with a small renderer that returns the tray, glue/tabs, or hand visual for the active step. Keep the same carousel article, copy, arrows, and dot controls.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/pages/HomePage.test.tsx`

Expected: PASS for the Home page tests.

### Task 2: Implement Approved Frosted Card Styling

**Files:**
- Modify: `src/styles-responsive.test.ts`
- Modify: `src/styles.css`

- [ ] **Step 1: Write the failing CSS regression test**

Add assertions that lock the approved visual direction:

```ts
expect(styles).toContain("margin-top: clamp(-42px, -5vw, -26px)");
expect(styles).toContain("backdrop-filter: blur(18px)");
expect(styles).toContain("border: 1px solid rgba(168, 47, 87, 0.24)");
expect(styles).toContain("transform: translateX(-50%)");
expect(styles).toContain(".confidence-card__tray");
expect(styles).toContain(".confidence-card__glue");
expect(styles).toContain(".confidence-card__hand");
```

Update the prior narrow-screen assertion so it expects the intentional hero overlap instead of banning negative carousel movement.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/styles-responsive.test.ts`

Expected: FAIL because the new overlap, frosted card, and visual classes are not implemented yet.

- [ ] **Step 3: Style the section and visuals**

Update `src/styles.css` so the confidence section overlaps the hero, uses a frosted warm card with subtle outline/shadow, places arrows partly outside the card edges, and renders distinct polished code-native visuals for all three slides. Preserve compact mobile dimensions and desktop readability.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/styles-responsive.test.ts`

Expected: PASS for the CSS regression tests.

### Task 3: Update Handoff And Run Full Verification

**Files:**
- Modify: `docs/brief/session-handoff.md`

- [ ] **Step 1: Update handoff**

Add the 2026-05-09 How It Works carousel UI pass to the Home page build state and latest discussion notes.

- [ ] **Step 2: Run required checks**

Run:

```bash
npm test
npm run build
npm audit --audit-level=moderate
git diff --check
git status --short --branch
```

Expected: tests and build pass, audit has zero moderate vulnerabilities, whitespace check passes, and only intentional files plus the known unrelated `.claude/` state appear.
