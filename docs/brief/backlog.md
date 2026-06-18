# Backlog

Approved section passes that are ready to build, written using the `section-pass-template.md` format. Read this file for queued work before starting a new session if the founder points you here.

Move an item to `session-handoff.md` "What Has Been Built" once it ships, and delete it from this file.

---

## Bug Fix: Reviews Polaroid Card Renders Oversized

## Current Status
- Built: `ReviewsPolaroidStrip` (`src/components/ReviewsPolaroidStrip.tsx`) shipped on `main` in commit `e7453e4` ("Add shop order-type routes and custom orders page"), bundled in alongside unrelated shop/custom-orders work.
- Broken: at a 390px mobile viewport, each polaroid card renders at roughly 529px wide by 580px tall (measured via headless browser) instead of the intended ~210px-wide card. The card overflows past the viewport width, the whole `#reviews` section balloons to ~750px tall, and only one giant card is visible at a time with no neighboring peeks.

## Root Cause
CSS specificity/order collision in `src/styles.css`. Every slide rendered by the shared `MobileCarousel` component gets both the generic `mobile-carousel__slide` class and the carousel-specific `slideClassName` (here, `reviews-polaroid-carousel__slide`). Both selectors are single-class (equal specificity), so the one declared later in the file wins ties:

```css
.reviews-polaroid-carousel__slide {        /* ~line 1384, declared first */
  flex: 0 0 var(--review-polaroid-width);  /* intended: clamp(168px, 54vw, 230px) */
}
...
.mobile-carousel__slide {                  /* ~line 1804, declared later, wins the tie */
  flex: 0 0 82%;
}
```

`flex: 0 0 82%` wins and the card's `aspect-ratio: 1 / 1` photo box scales up proportionally with the wider flex-basis, producing the oversized card and section height.

## Fix
Increase the specificity of the polaroid slide width rule so it reliably wins regardless of source order, e.g. scope it to the carousel root (`.reviews-polaroid-carousel .mobile-carousel__slide` or `.reviews-polaroid-carousel__slide.mobile-carousel__slide`) instead of relying on a same-specificity, declaration-order tiebreak. Do not change `.mobile-carousel__slide`'s base 82% rule, since other carousels (Collections, How It Works) rely on it.

## Verify
After the fix, re-check at a 390px mobile viewport that:
- Card width is close to the intended `clamp(168px, 54vw, 230px)` (roughly 200-230px), not 500px+.
- Multiple cards and side peeks are visible at once, matching How It Works/Collections carousel scale.
- `#reviews` section height is back in line with the other compact Home sections, not ~750px.

Run the standard checks from `AGENTS.md` (`npm test`, `npm run build`, `npm audit --audit-level=moderate`, `git diff --check`) plus a browser check at `http://localhost:5173/` before calling this done. Update `docs/brief/session-handoff.md` and remove this item from `docs/brief/backlog.md` once fixed and verified.

---

## Section Pass: Reviews Polaroid Strip

## Note: This section already shipped on `main` (commit `e7453e4`) with the oversized-card bug described above. Treat the bug fix item above as the active work; this section pass is kept below for the original spec/intent reference only.

## Current Status
- Built: nothing yet. The old story-bubble viewer (`src/components/story/`) and the older star-rating review-card carousel are both superseded directions; do not revive either.
- Approved: a new decorative polaroid-style photo strip, placed directly below How It Works.
- Not approved yet: real photo assets, exact card count beyond 7, exact rotation/shadow values, copy tone beyond "name + occasion."

## CEO Judgment Needed
- Judge next: does the polaroid look/feel land as handmade-boutique rather than generic or childish.
- Main question: does this read as a believable trust/social-proof section without needing real UGC photos yet.
- Decision type: visual styling judgment once built.

## Keep
- Page order: Hero -> Collections -> How It Works -> Reviews.
- Existing `MobileCarousel` (Embla) foundation and shared loop/auto-rotate/pause-on-interaction behavior already used by Collections and How It Works.
- Purely decorative section: no tap-to-expand, no tap-to-shop, no link behavior on the cards.

## Change / Explore
- New visual skin only: white polaroid photo frame, thicker bottom caption strip, slight randomized rotation per card (~-3deg to +4deg) so the row feels scattered/handmade rather than a rigid grid.
- Caption format: `[First name]'s [occasion] set` (e.g. "Sarah's birthday set"), tying back into the existing Collections occasion labels (Everyday, Date Night, Vacation, Bridal, Birthday, Work/Neutral, Statement).
- 7 cards total, looped, same continuous auto-rotate / pause-on-interaction / reduced-motion behavior as How It Works and Collections.
- Photo area: soft color-block placeholder (no real customer photos exist yet) but keep the polaroid frame + caption structure clearly visible/judgeable.

## Do Not Touch
- Header, footer, hero, Collections, How It Works structure/behavior.
- Checkout, policy content, final photography, final copy.
- Do not reintroduce the old `StoryStrip`/`StoryViewer` components or the old star-rating review card carousel.

## Creative Note
Should feel like a handful of real customer keepsake photos scattered on a table — warm, personal, a little imperfect — not a corporate testimonials grid and not literally a repeat of the old Instagram-story format.

## Mockups Needed
- No. Direction is specific enough to build directly with placeholder photo blocks; founder will judge the live build.

## Dev Handoff
Build a new Home section component (new file, e.g. `src/components/ReviewsPolaroidStrip.tsx`) rendered in `src/pages/HomePage.tsx` directly below the How It Works section. Use the shared `MobileCarousel` component the same way How It Works/Collections do (loop, auto-rotate, pause-on-interaction, respects reduced-motion) for the underlying carousel mechanics. Render 7 cards styled as polaroids per the "Change / Explore" notes above: white frame, bottom caption strip, randomized per-card rotation, placeholder color-block photo area, caption text `[Name]'s [Occasion] set` using occasion labels already defined for Collections. No tap/expand/shop interaction on the cards. Follow existing code patterns (central data arrays like `confidenceSteps` in `HomePage.tsx`, existing CSS token usage in `src/styles.css`) rather than introducing new architecture. Update `docs/brief/session-handoff.md` and remove this item from `docs/brief/backlog.md` once shipped and verified per the `AGENTS.md` Verification section.

---

## Section Pass: Trust Strip

## Current Status
- Built: nothing yet.
- Approved: a compact 4-point trust/logistics strip, placed directly below the Reviews Polaroid Strip section (or below How It Works if the Reviews Polaroid Strip has not shipped yet — Trust Strip is always the last section before the footer/email capture).
- Not approved yet: final icon set/style, final copy wording (current wording is placeholder, pulled from `docs/brief/open-decisions.md` shipping/return placeholders).

## CEO Judgment Needed
- Judge next: does the strip read as quick reassurance without feeling like a wall of legal/policy text.
- Main question: does icon + short label scan fast on mobile at this section's compact scale.
- Decision type: visual styling judgment once built.

## Keep
- Page order: Hero -> Collections -> How It Works -> Reviews -> Trust Strip -> footer/email capture.
- Compact scale similar to the existing How It Works confidence strip — this is not a full feature section.
- Exactly 4 points, in this order:
  1. Free shipping over $50 ($5.99 otherwise)
  2. Ships in 3-7 days, arrives 3-5 days after
  3. Damaged or wrong order? Fixed within 7 days
  4. Handmade in small batches

## Change / Explore
- Small icon above or beside each short bolded label (not text-only).
- Horizontal row layout; on mobile this can be a simple wrapping/scrollable row rather than a full carousel — no auto-rotate/loop behavior needed since there's nothing to cycle through (only 4 static points).
- Icons can be simple inline SVG/code-native glyphs for now (truck, clock, shield, hand), consistent with the rest of the site's placeholder-friendly visual approach. Do not source final icon imagery.

## Do Not Touch
- Header, footer, hero, Collections, How It Works, Reviews structure/behavior.
- Checkout, final shipping/return policy wording (these 4 copy lines are explicitly placeholders per `docs/brief/open-decisions.md` and may change later), final photography/copy elsewhere.

## Creative Note
Should feel like a quick, confident reassurance row — calm and minimal, not a legal disclaimer block. Think "quick facts," not "terms and conditions."

## Mockups Needed
- No. Direction and copy are specific enough to build directly; founder will judge the live build.

## Dev Handoff
Add a new compact section component (new file, e.g. `src/components/TrustStrip.tsx`) rendered in `src/pages/HomePage.tsx` directly below the Reviews Polaroid Strip section (or below How It Works if Reviews has not shipped yet in this codebase — check current `HomePage.tsx` section order first). Render exactly 4 static points using a central data array (same pattern as `confidenceSteps` in `HomePage.tsx`): each with a small icon (simple inline SVG, consistent with existing code-native placeholder visuals) and a short bolded label, using the 4 copy lines listed in "Keep" above verbatim. Lay out as a simple horizontal row (wrap or scroll on narrow mobile is fine) — do not use `MobileCarousel`/Embla here since there is nothing to loop or auto-rotate. Follow existing CSS token usage in `src/styles.css` rather than introducing new design tokens. Update `docs/brief/session-handoff.md` and remove this item from `docs/brief/backlog.md` once shipped and verified per the `AGENTS.md` Verification section.
