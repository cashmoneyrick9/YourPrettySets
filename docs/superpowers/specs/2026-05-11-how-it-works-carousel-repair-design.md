# How It Works Carousel Repair Design

Date: 2026-05-11
Section: Home page, How It Works / confidence section
Audience: founder review, then implementation

## Problem

The current How It Works build fails the basic UX read. The cards do not hold one consistent size, and the motion feels like a sudden content swap instead of a soft carousel.

This makes the section feel unfinished even before final UI styling is judged.

## Goal

Make the section stable, calm, and easy to understand on mobile before spending time on final colors, photography, or polish.

## Non-Negotiables

- All step cards use the exact same card height.
- All step visuals sit inside the exact same image frame.
- The section height does not change when the step changes.
- Motion feels like a soft slide/loop, not a sudden swap.
- The peek card uses the same sizing rules as the main card.
- Styling can remain simple for this repair pass.

## Keep

- Same section location under the hero.
- Existing placeholder visuals.
- Existing placeholder copy.
- Three numbered steps.
- No arrows.
- No dots.
- No CTA.
- Auto-rotation that stops after user interaction.

## Change

Use one horizontal carousel track instead of rendering an active card and a separate peek card.

The track should contain equal-size cards. One card is mostly visible, with a small peek of the next card at the edge. The track slides left on a timer. To make the loop feel continuous, include a cloned first card after the third step, then reset back to the first card after the slide completes.

## Drop From Current Build

- Independent active-card and peek-card rendering.
- Layout rules that let each step decide its own height.
- Sudden state swaps that do not look like a carousel.

## CEO Review Criteria

The next review should judge only:

- Do the cards all feel the same size?
- Does the movement feel calm enough?
- Is the section structure understandable at a glance?

Visual polish, color direction, final imagery, and final copy remain later decisions.
