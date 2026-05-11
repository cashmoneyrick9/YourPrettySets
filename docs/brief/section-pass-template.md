# Section Pass Template

Use this before planning or handing off a UI section pass. The founder is making CEO/product calls, so keep this checklist plain, short, and focused on what should be judged next.

The chat is the workshop. This file and the current section pass are the source of truth for the next agent or web dev.

## How To Use

1. Read `docs/brief/session-handoff.md` first for current state.
2. Fill out this checklist for the section under review.
3. Use image mockups when taste or visual direction is unclear.
4. Do not move into implementation until the founder picks a direction.
5. Convert the approved direction into a web-dev handoff plan.

## Template

```md
# Section Pass: [Section Name]

## Current Status
- Built:
- Approved:
- Not approved yet:

## CEO Judgment Needed
- Judge next:
- Main question:
- Decision type:

## Keep
- 
- 
- 

## Change / Explore
- 
- 
- 

## Do Not Touch
- 
- 
- 

## Creative Note
Short plain-English note about what this section should feel like.

## Mockups Needed
- Yes/No:
- What to mock up:
- What the mockup should answer:

## Dev Handoff
Plain-English build direction after the founder picks.
```

## Current Example: How It Works Carousel UX Pass

```md
# Section Pass: How It Works Carousel UX Pass

## Current Status
- Built: one-card carousel near the hero.
- Approved: the section belongs under the hero and should explain the simple press-on process.
- Not approved yet: the arrows, dots, and basic card-carousel feeling.

## CEO Judgment Needed
- Judge next: section UX on the live page.
- Main question: does this feel like a calm, compact, image-led transition instead of a basic click-through card?
- Decision type: UX structure and motion.

## Keep
- Same general placement under the hero.
- Compact height.
- Three-step idea.
- Current placeholder visuals for speed.
- Placeholder copy for now.

## Change / Explore
- Remove arrows.
- Remove dots.
- Add clear step numbers.
- Show one main step with a small next-step peek.
- Auto-rotate calmly.
- Stop auto-rotation after shopper interaction.

## Do Not Touch
- Page order.
- Product sections.
- Header or logo.
- Checkout or policy content.
- Final photography or final copy.

## Creative Note
This should make press-ons feel easy, pretty, and beginner-friendly while staying compact. It should bridge the hero into the shopping sections, not become a large feature block.

## Mockups Needed
- Later.
- The current pass should reuse existing placeholder visuals for speed.
- Future mockups should be section-only and compact, not full-page or hero-like.

## Dev Handoff
Use the Baseline Improved UX direction first. Save final UI polish for a later pass.
```
