# How It Works Carousel Repair Plan

Date: 2026-05-11
Spec: `docs/superpowers/specs/2026-05-11-how-it-works-carousel-repair-design.md`

## Goal

Repair the How It Works section so the mobile carousel has equal-height cards, a fixed visual frame, and soft continuous slide motion.

## Implementation Steps

1. Update the behavior tests for the repaired carousel structure.
   - Keep coverage for automatic rotation.
   - Keep coverage for stopping auto-rotation after interaction.
   - Assert the carousel exposes the active step as state instead of relying on text appearing/disappearing, because all cards will remain in the track.

2. Update the responsive style tests for the repaired layout.
   - Assert the carousel uses a track.
   - Assert the card height is fixed by a shared CSS variable.
   - Assert the visual frame has fixed sizing.
   - Assert the track uses a soft animated slide and a no-transition reset class for the loop.

3. Refactor `src/pages/HomePage.tsx`.
   - Render all three step cards in one carousel track.
   - Add a cloned first card after the third card so the auto-loop can slide forward continuously.
   - Use one active index for track position and derive the visible step number from it.
   - Pause auto-rotation on pointer/keyboard interaction.
   - Reset from the cloned first card back to the real first card after the slide completes.

4. Refactor `src/styles.css`.
   - Replace separate active/peek card layout with a clipped viewport and horizontal track.
   - Give every card the same height.
   - Give every visual the same fixed frame.
   - Keep the next-card peek.
   - Use a slower, softer transition.

5. Update `docs/brief/session-handoff.md`.
   - Record that the first build failed founder review.
   - Record the repaired direction: equal-size cards and true carousel track.
   - Keep open UI polish decisions separate from the UX repair.

6. Verify.
   - `npm test`
   - `npm run build`
   - `npm audit --audit-level=moderate`
   - `git diff --check`
   - `git status --short --branch`
   - Browser check at `http://localhost:5173/` on the mobile view.
