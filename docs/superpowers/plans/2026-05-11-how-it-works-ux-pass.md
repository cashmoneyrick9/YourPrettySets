# How It Works UX Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current arrow/dot step carousel with a compact, calm, image-led rotating strip that reuses the existing visuals.

**Architecture:** Keep the step data and rendering in `src/pages/HomePage.tsx`. Replace visible arrows/dots with an active card plus next-card peek, a slow auto-rotation timer, and pause-on-interaction behavior. Update `src/styles.css` and `src/styles-responsive.test.ts` to lock the compact strip, no visible controls, and next-step peek styling.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library.

---

### Task 1: Lock the New Carousel Behavior

**Files:**
- Modify: `src/pages/HomePage.test.tsx`
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Write the failing behavior test**

Add a test that confirms the section has no visible step arrows/dots, shows numbered active copy, shows a next-step peek, auto-rotates calmly, and stops auto-rotating after user interaction.

Run: `npm test -- src/pages/HomePage.test.tsx`

Expected: FAIL because the current section still has visible arrows/dots and no numbered active/peek structure.

- [ ] **Step 2: Implement the minimal behavior**

In `src/pages/HomePage.tsx`, add `useEffect` and `useRef`, add step numbers to `confidenceSteps`, render an active card and next peek card, auto-rotate every 5200ms, and pause rotation when the user interacts with the section.

- [ ] **Step 3: Verify the behavior test passes**

Run: `npm test -- src/pages/HomePage.test.tsx`

Expected: PASS.

### Task 2: Lock the Compact Strip Styling

**Files:**
- Modify: `src/styles-responsive.test.ts`
- Modify: `src/styles.css`

- [ ] **Step 1: Write the failing CSS regression test**

Update the CSS regression assertions so they expect no visible `.confidence-dots`, no `.confidence-carousel__button`, a `.confidence-card--peek`, and compact strip classes for an image-led active card.

Run: `npm test -- src/styles-responsive.test.ts`

Expected: FAIL until the CSS reflects the new compact strip.

- [ ] **Step 2: Implement the compact strip CSS**

In `src/styles.css`, remove arrow/dot styling from the step section, make the carousel edge-to-edge and compact, render the active card plus peek card, make the visual column stronger, keep the heading hidden on small screens, and retain current placeholder visual art.

- [ ] **Step 3: Verify the CSS test passes**

Run: `npm test -- src/styles-responsive.test.ts`

Expected: PASS.

### Task 3: Update Handoff and Run Verification

**Files:**
- Modify: `docs/brief/session-handoff.md`

- [ ] **Step 1: Update handoff**

Record that the How It Works UX pass has been implemented and that UI polish remains later.

- [ ] **Step 2: Run required checks**

Run:

```bash
npm test
npm run build
npm audit --audit-level=moderate
git diff --check
git status --short --branch
```

Expected: tests/build/audit/whitespace pass, and only intentional tracked changes plus known `.claude/` appear.
