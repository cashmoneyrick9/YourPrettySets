# Header Hero Summer UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the locked S3 mobile header and hero direction: transparent header at the top, sage/pistachio sticky header after scroll, summer sorbet garden hero image, and a polished mobile-first first viewport.

**Architecture:** Keep the existing React structure. `BrandHeader` owns scroll-state behavior and menu behavior; `HomePage` keeps the hero content structure; `src/styles.css` owns the visual system. The generated S3 hero background becomes a project asset under `public/assets/` so the UI does not depend on Codex's generated-image cache.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, CSS.

---

## Locked Direction

- Use S3 as the approved design direction.
- Preserve the current compact ecommerce header actions: brand text, menu button, `Shop` pill, bag icon.
- At the top of the page, the header is transparent and overlays the hero.
- Once the page scrolls away from the top, the header becomes a sticky sage/pistachio accent surface.
- Use the generated S3 background image as the hero backdrop:
  `/Users/rick/.codex/generated_images/019e062f-a2d8-7512-8b97-7b069187ce2a/ig_0b5ab3cf0d7a5ae20169fd879400f48199a5941128e2ad0cd6.png`
- Keep the hero text and CTA structure direct: `Ready-to-wear sets for pretty plans` and `Shop sets`.
- Do not reopen checkout, product grid structure, logo design, footer, or final product photography.

## File Structure

- Create: `public/assets/hero-s3-summer.png`
  - Project-local copy of the approved S3 hero background image.
- Modify: `src/components/BrandHeader.tsx`
  - Add scroll detection and state classes: `brand-header--at-top` and `brand-header--scrolled`.
  - Keep existing menu open/close behavior.
- Modify: `src/components/BrandHeader.test.tsx`
  - Add tests for default transparent top state and scrolled accent state.
- Modify: `src/styles.css`
  - Add color tokens for S3 direction.
  - Make header fixed/sticky over hero with transparent and scrolled states.
  - Replace the current code-native hero illustration with the S3 background image.
  - Polish mobile hero spacing, overlay, CTA, and responsive rules.
- Modify: `src/styles-responsive.test.ts`
  - Update string checks for the new header/hero CSS requirements.
- Modify: `docs/brief/session-handoff.md`
  - Record the locked S3 direction and verification results after implementation.

---

### Task 1: Add The S3 Hero Asset

**Files:**
- Create: `public/assets/hero-s3-summer.png`

- [ ] **Step 1: Copy the approved generated image into the project**

Run:

```bash
mkdir -p public/assets
cp /Users/rick/.codex/generated_images/019e062f-a2d8-7512-8b97-7b069187ce2a/ig_0b5ab3cf0d7a5ae20169fd879400f48199a5941128e2ad0cd6.png public/assets/hero-s3-summer.png
```

Expected: command exits 0 and creates `public/assets/hero-s3-summer.png`.

- [ ] **Step 2: Verify the asset exists**

Run:

```bash
test -s public/assets/hero-s3-summer.png && file public/assets/hero-s3-summer.png
```

Expected: output includes `PNG image data`.

- [ ] **Step 3: Commit**

```bash
git add public/assets/hero-s3-summer.png
git commit -m "Add S3 summer hero asset"
```

---

### Task 2: Add Header Scroll-State Tests

**Files:**
- Modify: `src/components/BrandHeader.test.tsx`
- Modify later: `src/components/BrandHeader.tsx`

- [ ] **Step 1: Write the failing scroll-state test**

In `src/components/BrandHeader.test.tsx`, update the imports:

```tsx
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BrandHeader } from "./BrandHeader";
```

Add this test inside `describe("BrandHeader", () => { ... })`:

```tsx
  it("switches from transparent top state to accent scrolled state", async () => {
    render(<BrandHeader />);

    const header = screen.getByRole("banner");

    expect(header).toHaveClass("brand-header--at-top");
    expect(header).not.toHaveClass("brand-header--scrolled");

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 48
    });
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(header).toHaveClass("brand-header--scrolled");
    });
    expect(header).not.toHaveClass("brand-header--at-top");

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0
    });
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(header).toHaveClass("brand-header--at-top");
    });
  });
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npm test -- src/components/BrandHeader.test.tsx
```

Expected: FAIL because `brand-header--at-top` and `brand-header--scrolled` do not exist yet.

- [ ] **Step 3: Commit the failing test**

```bash
git add src/components/BrandHeader.test.tsx
git commit -m "Test header scroll state"
```

---

### Task 3: Implement Header Scroll State

**Files:**
- Modify: `src/components/BrandHeader.tsx`
- Test: `src/components/BrandHeader.test.tsx`

- [ ] **Step 1: Update the React imports**

Replace:

```tsx
import { useState } from "react";
```

With:

```tsx
import { useEffect, useState } from "react";
```

- [ ] **Step 2: Add scroll state in `BrandHeader`**

Inside `BrandHeader`, replace the state line:

```tsx
  const [isMenuOpen, setIsMenuOpen] = useState(false);
```

With:

```tsx
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const syncHeaderState = () => {
      setIsScrolled(window.scrollY > 8);
    };

    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncHeaderState);
    };
  }, []);
```

- [ ] **Step 3: Add header state classes**

Replace:

```tsx
    <header className="brand-header">
```

With:

```tsx
    <header className={`brand-header ${isScrolled ? "brand-header--scrolled" : "brand-header--at-top"}`}>
```

- [ ] **Step 4: Run the focused test**

Run:

```bash
npm test -- src/components/BrandHeader.test.tsx
```

Expected: PASS, 3 tests passed in `BrandHeader.test.tsx`.

- [ ] **Step 5: Commit**

```bash
git add src/components/BrandHeader.tsx src/components/BrandHeader.test.tsx
git commit -m "Add transparent header scroll state"
```

---

### Task 4: Add Header And Hero CSS Tests

**Files:**
- Modify: `src/styles-responsive.test.ts`
- Modify later: `src/styles.css`

- [ ] **Step 1: Add CSS expectations for the new visual direction**

In `src/styles-responsive.test.ts`, add this test inside `describe("small mobile responsive CSS", () => { ... })`:

```ts
  it("includes the locked S3 header and hero visual rules", () => {
    expect(styles).toContain("--color-sage-accent");
    expect(styles).toContain("--hero-overlay-bottom");
    expect(styles).toContain(".brand-header--at-top");
    expect(styles).toContain(".brand-header--scrolled");
    expect(styles).toContain("position: fixed;");
    expect(styles).toContain("backdrop-filter: blur(14px);");
    expect(styles).toContain("background-image: url(\"/assets/hero-s3-summer.png\")");
    expect(styles).toContain(".hero-photo__hand {\n  display: none;");
    expect(styles).toContain(".hero-section::after");
    expect(styles).toContain("padding-top: clamp(88px, 18vw, 132px)");
  });
```

- [ ] **Step 2: Update stale 320px expectations**

In the existing `includes dedicated layout tightening for 320px screens` test, remove these expectations because the hero will use a real background asset instead of the code-native hand:

```ts
    expect(styles).toContain(".hero-photo__nail");
    expect(styles).toContain("min-height: 42px");
```

Keep these existing expectations:

```ts
    expect(styles).toContain(".hero-photo");
    expect(styles).toContain("grid-template-areas: \"hero\"");
    expect(styles).toContain(".hero-copy");
    expect(styles).toContain("z-index: 1");
```

- [ ] **Step 3: Run the CSS test to verify it fails**

Run:

```bash
npm test -- src/styles-responsive.test.ts
```

Expected: FAIL because the S3 CSS rules do not exist yet.

- [ ] **Step 4: Commit the failing test**

```bash
git add src/styles-responsive.test.ts
git commit -m "Test S3 header hero styling"
```

---

### Task 5: Implement S3 Header And Hero Styling

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles-responsive.test.ts`

- [ ] **Step 1: Add S3 color tokens**

In `src/styles.css`, replace the current `:root` block with:

```css
:root {
  color: #2a2528;
  background: #fffdf9;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  --color-ink: #2a2528;
  --color-berry: #8f315a;
  --color-sage-accent: #b9d8b6;
  --color-sage-deep: #355f50;
  --color-mint: #d9f0e5;
  --color-lilac: #e7ddf5;
  --color-sorbet: #f5b7c8;
  --color-butter: #f7dc86;
  --color-cream: #fffdf9;
  --hero-overlay-bottom: rgba(49, 38, 45, 0.66);
}
```

- [ ] **Step 2: Update `body` background**

Replace:

```css
  background: #fffaf8;
```

Inside `body` with:

```css
  background: var(--color-cream);
```

- [ ] **Step 3: Replace the header CSS block**

Replace the existing header rules from `.brand-header {` through `.brand-header__desktop-nav a:focus-visible { ... }` with:

```css
.brand-header {
  left: 0;
  padding: 12px clamp(14px, 4vw, 44px);
  position: fixed;
  right: 0;
  top: 0;
  transition:
    background 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease;
  z-index: 20;
}

.brand-header--at-top {
  background: linear-gradient(180deg, rgba(36, 30, 34, 0.34), rgba(36, 30, 34, 0));
  color: #ffffff;
}

.brand-header--scrolled {
  backdrop-filter: blur(14px);
  background: rgba(185, 216, 182, 0.94);
  box-shadow: 0 12px 30px rgba(53, 95, 80, 0.14);
  color: var(--color-sage-deep);
}

.brand-header__bar {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
}

.brand-mark {
  color: inherit;
  flex: 0 0 auto;
  font-size: 1.12rem;
  font-weight: 900;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.18);
  white-space: nowrap;
}

.brand-header--scrolled .brand-mark {
  text-shadow: none;
}

.brand-header__desktop-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: flex-end;
}

.brand-header__desktop-nav a {
  color: inherit;
  font-size: 0.92rem;
  font-weight: 800;
}

.brand-header__mobile-actions {
  align-items: center;
  display: none;
  flex: 0 0 auto;
  gap: 8px;
}

.brand-header__icon-button,
.brand-header__shop-link {
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.52);
  border-radius: 999px;
  color: var(--color-sage-deep);
  display: inline-flex;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 900;
  justify-content: center;
  min-height: 38px;
  box-shadow: 0 8px 22px rgba(42, 37, 40, 0.1);
}

.brand-header--scrolled .brand-header__icon-button,
.brand-header--scrolled .brand-header__shop-link {
  background: rgba(255, 253, 249, 0.92);
  border-color: rgba(53, 95, 80, 0.18);
  box-shadow: none;
}

.brand-header__icon-button {
  cursor: pointer;
  padding: 0;
  width: 38px;
}

.brand-header__shop-link {
  padding: 0 15px;
}

.brand-header__mobile-menu {
  background: rgba(255, 253, 249, 0.96);
  border: 1px solid rgba(53, 95, 80, 0.16);
  border-radius: 8px;
  box-shadow: 0 18px 38px rgba(53, 95, 80, 0.16);
  display: none;
  gap: 4px;
  margin-top: 10px;
  padding: 8px;
}

.brand-header__mobile-menu[hidden] {
  display: none;
}

.brand-header__mobile-menu a {
  border-radius: 6px;
  color: var(--color-sage-deep);
  font-size: 0.94rem;
  font-weight: 850;
  padding: 10px 12px;
}

.brand-header__icon-button:focus-visible,
.brand-header__shop-link:focus-visible,
.brand-header__mobile-menu a:focus-visible,
.brand-mark:focus-visible,
.brand-header__desktop-nav a:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 3px;
}

.brand-header--scrolled .brand-header__icon-button:focus-visible,
.brand-header--scrolled .brand-header__shop-link:focus-visible,
.brand-header--scrolled .brand-header__mobile-menu a:focus-visible,
.brand-header--scrolled .brand-mark:focus-visible,
.brand-header--scrolled .brand-header__desktop-nav a:focus-visible {
  outline-color: var(--color-berry);
}
```

- [ ] **Step 4: Replace the hero layout CSS**

Replace `.hero-section`, `.hero-copy`, `.hero-copy .eyebrow`, `.hero-copy h1`, `.hero-copy p`, `.hero-photo`, `.hero-photo::before`, and the `.hero-photo__hand` through `.hero-photo__nail--four` rules with:

```css
.hero-section {
  display: grid;
  grid-template-areas: "hero";
  grid-template-columns: minmax(0, 1fr);
  min-height: min(760px, 94vh);
  padding: clamp(88px, 18vw, 132px) clamp(14px, 4vw, 56px) clamp(20px, 5vw, 56px);
  position: relative;
}

.hero-section::after {
  background:
    linear-gradient(180deg, rgba(42, 37, 40, 0.06) 0%, rgba(42, 37, 40, 0.18) 46%, var(--hero-overlay-bottom) 100%);
  border-radius: 10px;
  content: "";
  grid-area: hero;
  pointer-events: none;
  z-index: 1;
}

.hero-copy {
  align-self: end;
  color: #ffffff;
  display: grid;
  gap: 10px;
  grid-area: hero;
  max-width: 510px;
  padding: clamp(20px, 5vw, 38px);
  text-shadow: 0 2px 18px rgba(42, 37, 40, 0.24);
  z-index: 2;
}

.hero-copy .eyebrow,
.hero-copy h1 {
  color: inherit;
}

.hero-copy h1 {
  font-size: clamp(2.25rem, 10vw, 5.2rem);
  line-height: 0.98;
  max-width: 620px;
}

.hero-copy p {
  font-size: 0.98rem;
  line-height: 1.45;
  margin: 0;
  max-width: 420px;
}

.hero-copy .primary-button {
  background: var(--color-sage-accent);
  color: var(--color-sage-deep);
  box-shadow: 0 14px 30px rgba(53, 95, 80, 0.2);
}

.hero-photo {
  aspect-ratio: 9 / 14;
  background-color: var(--color-mint);
  background-image: url("/assets/hero-s3-summer.png");
  background-position: center;
  background-size: cover;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  box-shadow: 0 24px 70px rgba(53, 95, 80, 0.18);
  grid-area: hero;
  min-height: min(650px, calc(94vh - 108px));
  overflow: hidden;
  position: relative;
}

.hero-photo__hand {
  display: none;
}
```

- [ ] **Step 5: Update the global primary button color**

Replace:

```css
  background: #a92f4f;
```

In `.primary-button` with:

```css
  background: var(--color-berry);
```

Keep `.hero-copy .primary-button` as the sage exception from Step 4.

- [ ] **Step 6: Update mobile header media rules**

Inside `@media (max-width: 720px)`, replace the `.brand-header`, `.brand-header__bar`, `.brand-header__desktop-nav`, `.brand-header__mobile-actions`, and `.brand-header__mobile-menu` rules with:

```css
  .brand-header {
    padding: 10px 14px;
  }

  .brand-header__bar {
    gap: 10px;
  }

  .brand-mark {
    font-size: 1rem;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .brand-header__desktop-nav {
    display: none;
  }

  .brand-header__mobile-actions {
    display: flex;
  }

  .brand-header__mobile-menu {
    display: grid;
  }
```

- [ ] **Step 7: Update 320px hero rules**

Inside `@media (max-width: 360px)`, replace the `.hero-section`, `.hero-copy`, `.hero-copy .eyebrow`, `.hero-copy p, .hero-shell p`, `.hero-copy .primary-button`, `.hero-photo`, `.hero-photo::before`, `.hero-photo__hand`, `.hero-photo__nail...`, and `.hero-photo__finger` rules with:

```css
  .hero-section {
    grid-template-areas: "hero";
    min-height: 92vh;
    padding: 76px 10px 18px;
  }

  .hero-copy {
    gap: 8px;
    padding: 16px;
  }

  .hero-copy h1 {
    font-size: 2rem;
    line-height: 1;
  }

  .hero-copy .eyebrow {
    font-size: 0.67rem;
  }

  .hero-copy p,
  .hero-shell p {
    font-size: 0.86rem;
  }

  .hero-copy .primary-button {
    min-height: 42px;
    padding: 0 17px;
  }

  .hero-photo {
    aspect-ratio: 9 / 14;
    background-position: center top;
    min-height: calc(92vh - 94px);
  }
```

- [ ] **Step 8: Run the CSS tests**

Run:

```bash
npm test -- src/styles-responsive.test.ts
```

Expected: PASS, all `styles-responsive.test.ts` tests pass.

- [ ] **Step 9: Run the header tests**

Run:

```bash
npm test -- src/components/BrandHeader.test.tsx
```

Expected: PASS, all `BrandHeader.test.tsx` tests pass.

- [ ] **Step 10: Commit**

```bash
git add src/styles.css src/styles-responsive.test.ts
git commit -m "Style S3 header and hero"
```

---

### Task 6: Browser Verify The Mobile Header And Hero

**Files:**
- No file changes expected unless verification exposes a defect.

- [ ] **Step 1: Start or reuse the dev server**

Run:

```bash
npm run dev -- --host 0.0.0.0
```

Expected: Vite serves `http://localhost:5173/`. If the server is already running, reuse the existing server.

- [ ] **Step 2: Verify at top of page**

Open:

```text
http://localhost:5173/
```

Expected:

- Header overlays the hero and does not have a solid background at scroll position 0.
- Brand text, menu button, `Shop`, and bag are readable.
- Hero uses the S3 summer background asset.
- Hero CTA uses sage/pistachio treatment.
- Top viewport feels like the S3 approved direction, not the previous code-native hand illustration.

- [ ] **Step 3: Verify scrolled header state**

Scroll down until the hero starts disengaging from the top.

Expected:

- Header changes to a solid/translucent sage/pistachio accent surface.
- Header remains readable.
- Menu, `Shop`, and bag controls remain tappable.
- Mobile menu still opens and closes.

- [ ] **Step 4: Verify narrow mobile**

Use a narrow viewport around 320px wide.

Expected:

- No horizontal scrollbar.
- Brand text does not collide with menu, `Shop`, or bag.
- Hero headline and CTA remain readable.
- Hero image is not awkwardly cropped around the main product.

- [ ] **Step 5: Fix only verified defects**

If a browser issue appears, keep fixes scoped to `src/styles.css` and rerun:

```bash
npm test -- src/components/BrandHeader.test.tsx src/styles-responsive.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit any browser fixes**

If no browser fixes were needed, skip this commit. If fixes were needed:

```bash
git add src/styles.css src/styles-responsive.test.ts src/components/BrandHeader.test.tsx src/components/BrandHeader.tsx
git commit -m "Polish mobile header hero fit"
```

---

### Task 7: Update Handoff And Run Final Verification

**Files:**
- Modify: `docs/brief/session-handoff.md`

- [ ] **Step 1: Update the handoff**

In `docs/brief/session-handoff.md`, add a new latest discussion section near the current Home shopping path notes:

```markdown
Latest header/hero UI direction:

- The CEO locked the S3 direction for the first-viewport UI pass.
- Header behavior: transparent at the top of the page, then sage/pistachio accent surface after scrolling away from the top.
- Hero direction: summer sorbet garden palette with pistachio/sage anchor, soft strawberry-sorbet and lilac support, and a real generated hero background asset.
- Scope is limited to header and hero UI; product-card visuals, checkout, final logo, final photography, footer, and policy wording remain open.
```

Update the verification section with the actual commands and browser results after running them.

- [ ] **Step 2: Run full tests**

Run:

```bash
npm test
```

Expected: all test files pass.

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected: build exits 0.

- [ ] **Step 4: Run audit**

Run:

```bash
npm audit --audit-level=moderate
```

Expected: `found 0 vulnerabilities`.

- [ ] **Step 5: Check whitespace**

Run:

```bash
git diff --check
```

Expected: no output and exit 0.

- [ ] **Step 6: Check git status**

Run:

```bash
git status --short --branch
```

Expected: changed files are only the planned files plus the known unrelated untracked `.claude/` directory.

- [ ] **Step 7: Commit handoff update**

```bash
git add docs/brief/session-handoff.md
git commit -m "Update handoff for S3 header hero direction"
```

---

## Self-Review

- Spec coverage: The plan covers the locked S3 direction, transparent-to-accent header behavior, generated background asset, hero UI polish, responsive behavior, handoff update, and final verification.
- Placeholder scan: No placeholder markers or unspecified implementation steps remain.
- Type consistency: The plan uses `isScrolled`, `brand-header--at-top`, and `brand-header--scrolled` consistently across tests, component code, and CSS.
