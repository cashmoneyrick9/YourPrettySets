# Backlog

Approved section passes that are ready to build, written using the `section-pass-template.md` format. Read this file for queued work before starting a new session if the founder points you here.

Move an item to `session-handoff.md` "What Has Been Built" once it ships, and delete it from this file.

---

## Section Pass: Reviews Polaroid Strip

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
