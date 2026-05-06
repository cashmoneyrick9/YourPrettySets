# Compact Mobile Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the awkward wrapping mobile header with a compact mobile ecommerce header that keeps brand, menu, shop, and bag actions visible at 320px.

**Architecture:** Keep `BrandHeader` as the only React component involved. Split desktop and mobile header surfaces with CSS classes: desktop keeps the current full nav, while mobile shows a menu button, direct shop link, and bag icon link. Use local component state only for opening and closing the mobile menu.

**Tech Stack:** Vite, React, TypeScript, CSS, Vitest, React Testing Library, lucide-react.

**Implementation Status:** Completed on branch `codex/compact-mobile-header`.

---

## Source Docs

Follow:

- `docs/brief/README.md`
- `docs/brief/brand.md`
- `docs/brief/open-decisions.md`
- `docs/brief/session-handoff.md`
- `docs/superpowers/specs/2026-05-06-compact-mobile-header-design.md`

## File Structure

- Modify: `src/components/BrandHeader.tsx`
  - Owns the header markup, desktop nav, mobile actions, and mobile menu state.
- Modify: `src/components/BrandHeader.test.tsx`
  - Verifies visible actions, links, and menu open behavior.
- Modify: `src/styles.css`
  - Owns desktop/mobile header layout and 320px tightening.
- Modify: `src/styles-responsive.test.ts`
  - Guards the existence of dedicated compact mobile CSS.
- Modify: `docs/brief/session-handoff.md`
  - Records the completed header decision after implementation.

## Task 1: Add Compact Header Behavior Tests

**Files:**

- Modify: `src/components/BrandHeader.test.tsx`

- [x] **Step 1: Replace the current header test with tests for desktop nav, mobile actions, and menu expansion**

Replace the full file with:

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BrandHeader } from "./BrandHeader";

describe("BrandHeader", () => {
  it("renders the brand, desktop navigation, and compact mobile actions", () => {
    render(<BrandHeader />);

    expect(screen.getByLabelText("YourPrettySets home")).toBeInTheDocument();

    const desktopNav = screen.getByRole("navigation", { name: "Primary navigation" });
    for (const label of ["Home", "Shop Collections", "How It Works", "FAQ", "Bag"]) {
      expect(within(desktopNav).getByRole("link", { name: label })).toBeInTheDocument();
    }

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute(
      "href",
      "#shop-collections"
    );
    expect(screen.getByRole("link", { name: "View bag" })).toHaveAttribute("href", "#bag");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("opens a simple mobile navigation menu", async () => {
    const user = userEvent.setup();
    render(<BrandHeader />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    for (const label of ["Home", "Shop Collections", "How It Works", "FAQ"]) {
      expect(within(mobileNav).getByRole("link", { name: label })).toBeInTheDocument();
    }
  });
});
```

- [x] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
npm test -- src/components/BrandHeader.test.tsx
```

Expected: FAIL because `Open menu`, `Shop`, `View bag`, and `Mobile navigation` do not exist yet.

- [x] **Step 3: Commit the failing test**

```bash
git add src/components/BrandHeader.test.tsx
git commit -m "test: cover compact mobile header behavior"
```

## Task 2: Implement Compact Header Markup And State

**Files:**

- Modify: `src/components/BrandHeader.tsx`

- [x] **Step 1: Replace `BrandHeader.tsx` with desktop nav plus mobile actions**

Replace the full file with:

```tsx
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

const desktopNavItems = ["Home", "Shop Collections", "How It Works", "FAQ", "Bag"];
const mobileMenuItems = ["Home", "Shop Collections", "How It Works", "FAQ"];

function hrefFor(item: string) {
  return `#${item.toLowerCase().replace(/\s+/g, "-")}`;
}

export function BrandHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="brand-header">
      <div className="brand-header__bar">
        <a className="brand-mark" href="#home" aria-label="YourPrettySets home">
          YourPrettySets
        </a>

        <nav className="brand-header__desktop-nav" aria-label="Primary navigation">
          {desktopNavItems.map((item) => (
            <a key={item} href={hrefFor(item)}>
              {item}
            </a>
          ))}
        </nav>

        <div className="brand-header__mobile-actions" aria-label="Mobile header actions">
          <button
            className="brand-header__icon-button"
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
          </button>
          <a className="brand-header__shop-link" href="#shop-collections">
            Shop
          </a>
          <a className="brand-header__icon-button" href="#bag" aria-label="View bag">
            <ShoppingBag aria-hidden="true" size={18} />
          </a>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className="brand-header__mobile-menu"
        aria-label="Mobile navigation"
        hidden={!isMenuOpen}
      >
        {mobileMenuItems.map((item) => (
          <a key={item} href={hrefFor(item)} onClick={() => setIsMenuOpen(false)}>
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
```

- [x] **Step 2: Run the focused test**

Run:

```bash
npm test -- src/components/BrandHeader.test.tsx
```

Expected: PASS.

- [x] **Step 3: Commit the passing component behavior**

```bash
git add src/components/BrandHeader.tsx src/components/BrandHeader.test.tsx
git commit -m "feat: add compact mobile header actions"
```

## Task 3: Add Responsive Header CSS

**Files:**

- Modify: `src/styles.css`
- Modify: `src/styles-responsive.test.ts`

- [x] **Step 1: Update the responsive CSS test**

Replace `src/styles-responsive.test.ts` with:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf-8");

describe("small mobile responsive CSS", () => {
  it("includes dedicated layout tightening for 320px screens", () => {
    expect(styles).toContain("@media (max-width: 360px)");
    expect(styles).toContain(".product-carousel");
    expect(styles).toContain("grid-auto-columns: minmax(206px, 252px)");
    expect(styles).toContain(".nail-tile");
    expect(styles).toContain("min-height: 104px");
  });

  it("includes compact mobile header rules that hide the desktop nav", () => {
    expect(styles).toContain(".brand-header__mobile-actions");
    expect(styles).toContain(".brand-header__desktop-nav");
    expect(styles).toContain(".brand-header__mobile-menu");
    expect(styles).toContain("@media (max-width: 720px)");
    expect(styles).toContain(".brand-header__desktop-nav {\n    display: none;");
    expect(styles).toContain(".brand-header__mobile-actions {\n    display: flex;");
  });
});
```

- [x] **Step 2: Run the responsive CSS test and confirm it fails**

Run:

```bash
npm test -- src/styles-responsive.test.ts
```

Expected: FAIL because the new compact header class rules do not exist yet.

- [x] **Step 3: Replace the base header CSS block near the top of `src/styles.css`**

Replace the current `.brand-header`, `.brand-mark`, `.brand-header nav`, and `.brand-header nav a` rules with:

```css
.brand-header {
  padding: 18px clamp(18px, 4vw, 56px);
}

.brand-header__bar {
  align-items: center;
  display: flex;
  gap: 24px;
  justify-content: space-between;
}

.brand-mark {
  color: #a82f57;
  flex: 0 0 auto;
  font-size: 1.35rem;
  font-weight: 800;
  white-space: nowrap;
}

.brand-header__desktop-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: flex-end;
}

.brand-header__desktop-nav a {
  color: #55424a;
  font-size: 0.92rem;
  font-weight: 700;
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
  background: #ffffff;
  border: 1px solid rgba(168, 47, 87, 0.22);
  border-radius: 999px;
  color: #a82f57;
  display: inline-flex;
  font: inherit;
  font-size: 0.86rem;
  font-weight: 800;
  justify-content: center;
  min-height: 38px;
}

.brand-header__icon-button {
  cursor: pointer;
  padding: 0;
  width: 38px;
}

.brand-header__shop-link {
  padding: 0 14px;
}

.brand-header__mobile-menu {
  background: #ffffff;
  border: 1px solid rgba(168, 47, 87, 0.14);
  border-radius: 8px;
  box-shadow: 0 18px 38px rgba(93, 48, 67, 0.1);
  display: grid;
  gap: 4px;
  margin-top: 12px;
  padding: 8px;
}

.brand-header__mobile-menu[hidden] {
  display: none;
}

.brand-header__mobile-menu a {
  border-radius: 6px;
  color: #55424a;
  font-size: 0.94rem;
  font-weight: 800;
  padding: 10px 12px;
}

.brand-header__icon-button:focus-visible,
.brand-header__shop-link:focus-visible,
.brand-header__mobile-menu a:focus-visible,
.brand-mark:focus-visible,
.brand-header__desktop-nav a:focus-visible {
  outline: 3px solid #0a6866;
  outline-offset: 3px;
}
```

- [x] **Step 4: Replace the current `@media (max-width: 720px)` header rules**

Replace the old block:

```css
@media (max-width: 720px) {
  .brand-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .brand-header nav {
    justify-content: flex-start;
  }
}
```

with:

```css
@media (max-width: 720px) {
  .brand-header {
    padding: 14px clamp(14px, 4vw, 22px);
  }

  .brand-header__bar {
    gap: 12px;
  }

  .brand-mark {
    flex: 1 1 auto;
    font-size: 1.12rem;
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
}
```

- [x] **Step 5: Replace only the header-specific rules inside `@media (max-width: 360px)`**

Inside the existing `@media (max-width: 360px)` block, replace the current header selectors:

```css
  .brand-header {
    gap: 14px;
    padding: 14px;
  }

  .brand-mark {
    font-size: 1.2rem;
  }

  .brand-header nav {
    gap: 9px 11px;
  }

  .brand-header nav a {
    font-size: 0.84rem;
  }
```

with:

```css
  .brand-header {
    padding: 12px 14px;
  }

  .brand-header__bar {
    gap: 8px;
  }

  .brand-mark {
    font-size: 1rem;
  }

  .brand-header__mobile-actions {
    gap: 6px;
  }

  .brand-header__icon-button,
  .brand-header__shop-link {
    min-height: 34px;
  }

  .brand-header__icon-button {
    width: 34px;
  }

  .brand-header__shop-link {
    font-size: 0.8rem;
    padding: 0 10px;
  }
```

- [x] **Step 6: Run focused tests**

Run:

```bash
npm test -- src/components/BrandHeader.test.tsx src/styles-responsive.test.ts
```

Expected: PASS.

- [x] **Step 7: Commit responsive styling**

```bash
git add src/styles.css src/styles-responsive.test.ts
git commit -m "style: tighten mobile header layout"
```

## Task 4: Update Handoff And Run Full Verification

**Files:**

- Modify: `docs/brief/session-handoff.md`

- [x] **Step 1: Update the handoff with the compact header decision**

In `docs/brief/session-handoff.md`, update `Last updated` to `2026-05-06` and revise the header discussion section to say:

```markdown
## Latest Discussion: Header

The CEO selected the mobile header layout as the next improvement area.

Confirmed direction:

- Use a compact mobile ecommerce header.
- Keep `YourPrettySets` visible as a text brand mark for now.
- Show compact mobile actions for menu, `Shop`, and bag.
- Put secondary links inside a simple menu panel.
- Do not redesign the logo yet.
- Do not use overly decorative boutique details.

The design spec is saved at:

- `docs/superpowers/specs/2026-05-06-compact-mobile-header-design.md`
```

Also update `Suggested Next Agent Flow` so the next step says to verify the implemented compact mobile header instead of continuing header brainstorming.

- [x] **Step 2: Run full verification**

Run:

```bash
npm test
npm run build
npm audit --audit-level=moderate
git status --short
```

Expected:

- `npm test`: all tests pass.
- `npm run build`: build succeeds.
- `npm audit --audit-level=moderate`: reports 0 vulnerabilities.
- `git status --short`: shows only the intended handoff file changed before the final commit.

- [x] **Step 3: Commit handoff update**

```bash
git add docs/brief/session-handoff.md
git commit -m "docs: update compact header handoff"
```

## Final Verification

After all tasks are complete, run:

```bash
npm test
npm run build
npm audit --audit-level=moderate
git status --short
```

Expected:

- All tests pass.
- Build succeeds.
- Audit reports 0 moderate-or-higher vulnerabilities.
- Working tree is clean.
