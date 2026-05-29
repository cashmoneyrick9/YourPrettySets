import type { MouseEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { StoryItem } from "./types";

const DEFAULT_STORY_DURATION_MS = 6000;
const STORY_HOLD_NAVIGATION_THRESHOLD_MS = 250;

type StoryViewerProps = {
  activeIndex: number;
  durationMs?: number;
  onActiveIndexChange: (storyIndex: number) => void;
  onClose: () => void;
  stories: StoryItem[];
};

export function StoryViewer({
  activeIndex,
  durationMs = DEFAULT_STORY_DURATION_MS,
  onActiveIndexChange,
  onClose,
  stories
}: StoryViewerProps) {
  const [isStoryTimerPaused, setIsStoryTimerPaused] = useState(false);
  const [storyTimerRemainingMs, setStoryTimerRemainingMs] = useState(durationMs);
  const storyHoldTimeoutRef = useRef<number | null>(null);
  const storyPointerHeldRef = useRef(false);
  const storyTimerStartedAtRef = useRef<number | null>(null);
  const activeStory = stories[activeIndex];

  const clearStoryHoldTimeout = () => {
    if (storyHoldTimeoutRef.current !== null) {
      window.clearTimeout(storyHoldTimeoutRef.current);
      storyHoldTimeoutRef.current = null;
    }
  };

  const pauseStoryTimer = () => {
    setStoryTimerRemainingMs((currentRemainingMs) => {
      if (storyTimerStartedAtRef.current === null) {
        return currentRemainingMs;
      }

      const elapsedMs = Date.now() - storyTimerStartedAtRef.current;
      return Math.max(0, currentRemainingMs - elapsedMs);
    });
    setIsStoryTimerPaused(true);
  };

  const resumeStoryTimer = () => {
    setIsStoryTimerPaused(false);
  };

  const goToPreviousStory = () => {
    onActiveIndexChange(Math.max(0, activeIndex - 1));
  };

  const goToNextStory = () => {
    onActiveIndexChange(Math.min(stories.length - 1, activeIndex + 1));
  };

  const handleStoryTapZonePointerDown = () => {
    storyPointerHeldRef.current = false;
    pauseStoryTimer();
    clearStoryHoldTimeout();
    storyHoldTimeoutRef.current = window.setTimeout(() => {
      storyPointerHeldRef.current = true;
    }, STORY_HOLD_NAVIGATION_THRESHOLD_MS);
  };

  const handleStoryTapZonePointerEnd = (navigate: () => void) => {
    const shouldNavigate = !storyPointerHeldRef.current;

    clearStoryHoldTimeout();
    storyPointerHeldRef.current = false;
    resumeStoryTimer();

    if (shouldNavigate) {
      navigate();
    }
  };

  const handleStoryTapZonePointerCancel = () => {
    clearStoryHoldTimeout();
    storyPointerHeldRef.current = false;
    resumeStoryTimer();
  };

  const handleStoryTapZoneClick = (event: MouseEvent<HTMLButtonElement>, navigate: () => void) => {
    if (event.detail === 0) {
      navigate();
    }
  };

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        goToPreviousStory();
        return;
      }

      if (event.key === "ArrowRight") {
        goToNextStory();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, onClose]);

  useEffect(() => {
    clearStoryHoldTimeout();
    storyPointerHeldRef.current = false;
    setIsStoryTimerPaused(false);
    setStoryTimerRemainingMs(durationMs);
    storyTimerStartedAtRef.current = null;
  }, [activeIndex, durationMs]);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    if (reduceMotion) {
      return undefined;
    }

    if (isStoryTimerPaused) {
      storyTimerStartedAtRef.current = null;
      return undefined;
    }

    storyTimerStartedAtRef.current = Date.now();
    const timerId = window.setTimeout(() => {
      if (activeIndex >= stories.length - 1) {
        onClose();
        return;
      }

      onActiveIndexChange(activeIndex + 1);
    }, storyTimerRemainingMs);

    return () => {
      window.clearTimeout(timerId);
      storyTimerStartedAtRef.current = null;
    };
  }, [activeIndex, durationMs, isStoryTimerPaused, onActiveIndexChange, onClose, stories.length, storyTimerRemainingMs]);

  if (!activeStory) {
    return null;
  }

  return (
    <div aria-label={`${activeStory.label} review story`} aria-modal="true" className="review-story-viewer" role="dialog">
      <div className="review-story-viewer__frame">
        <div className="review-story-viewer__progress" aria-hidden="true">
          {stories.map((story, storyIndex) => (
            <span
              className="review-story-viewer__progress-segment"
              data-state={storyIndex < activeIndex ? "complete" : storyIndex === activeIndex ? "active" : "upcoming"}
              key={story.id}
            >
              {storyIndex === activeIndex ? (
                <span
                  className="review-story-viewer__progress-fill"
                  key={story.id}
                  style={{ animationPlayState: isStoryTimerPaused ? "paused" : undefined }}
                />
              ) : null}
            </span>
          ))}
        </div>
        <div className="review-story-viewer__topbar">
          <p>{activeStory.label}</p>
          <button aria-label="Close review story" className="review-story-viewer__close" onClick={onClose} type="button">
            ×
          </button>
        </div>
        <div className="review-story-viewer__stage">
          <button
            aria-label="Previous review story"
            className="review-story-viewer__tap-zone review-story-viewer__tap-zone--previous"
            onClick={(event) => handleStoryTapZoneClick(event, goToPreviousStory)}
            onPointerCancel={handleStoryTapZonePointerCancel}
            onPointerDown={handleStoryTapZonePointerDown}
            onPointerLeave={(event: PointerEvent<HTMLButtonElement>) => {
              if (event.buttons > 0) {
                handleStoryTapZonePointerCancel();
              }
            }}
            onPointerUp={() => handleStoryTapZonePointerEnd(goToPreviousStory)}
            type="button"
          />
          <article
            className="review-story-viewer__card"
            onPointerCancel={resumeStoryTimer}
            onPointerDown={pauseStoryTimer}
            onPointerLeave={(event: PointerEvent<HTMLElement>) => {
              if (event.buttons > 0) {
                resumeStoryTimer();
              }
            }}
            onPointerUp={resumeStoryTimer}
          >
            <p className="review-story-viewer__kicker">Temporary review story placeholder</p>
            <h2 id="review-story-viewer-title">{activeStory.title}</h2>
            <p className="review-story-viewer__stars" aria-label="Five star review">
              ★★★★★
            </p>
            <blockquote>{activeStory.quote}</blockquote>
            <p className="review-story-viewer__source">{activeStory.source}</p>
          </article>
          <button
            aria-label="Next review story"
            className="review-story-viewer__tap-zone review-story-viewer__tap-zone--next"
            onClick={(event) => handleStoryTapZoneClick(event, goToNextStory)}
            onPointerCancel={handleStoryTapZonePointerCancel}
            onPointerDown={handleStoryTapZonePointerDown}
            onPointerLeave={(event: PointerEvent<HTMLButtonElement>) => {
              if (event.buttons > 0) {
                handleStoryTapZonePointerCancel();
              }
            }}
            onPointerUp={() => handleStoryTapZonePointerEnd(goToNextStory)}
            type="button"
          />
        </div>
      </div>
    </div>
  );
}
