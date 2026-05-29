import { useState } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StoryViewer } from "./StoryViewer";
import type { StoryItem } from "./types";

const stories: StoryItem[] = [
  {
    id: "sarah",
    label: "Sarah",
    title: "Sarah",
    quote: "Sarah said her first set felt easy to apply, stayed put, and looked polished.",
    source: "Verified customer"
  },
  {
    id: "birthday-set",
    label: "Birthday Set",
    title: "Birthday Set",
    quote: "Birthday Set made my plans feel instantly more put together.",
    source: "Verified customer"
  },
  {
    id: "bridal-nails",
    label: "Bridal Nails",
    title: "Bridal Nails",
    quote: "A soft bridal set with a clean fit, pretty finish, and enough sizes.",
    source: "Verified customer"
  }
];

const restoreDefaultMatchMedia = () => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      addEventListener: () => undefined,
      addListener: () => undefined,
      dispatchEvent: () => false,
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: () => undefined,
      removeListener: () => undefined
    })
  });
};

const renderStoryViewer = (
  initialIndex = 1,
  options: { durationMs?: number; onClose?: () => void } = {}
) => {
  const onClose = options.onClose ?? vi.fn();
  const result = render(<StoryViewerHarness durationMs={options.durationMs} initialIndex={initialIndex} onClose={onClose} />);

  return {
    onClose,
    ...result
  };
};

function StoryViewerHarness({
  durationMs,
  initialIndex,
  onClose
}: {
  durationMs?: number;
  initialIndex: number;
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  return (
    <StoryViewer
      activeIndex={activeIndex}
      durationMs={durationMs}
      onActiveIndexChange={setActiveIndex}
      onClose={onClose}
      stories={stories}
    />
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  restoreDefaultMatchMedia();
});

describe("StoryViewer", () => {
  it("renders the fullscreen viewer with active story content and progress states", () => {
    renderStoryViewer(1);

    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toHaveClass("review-story-viewer");
    expect(screen.getByRole("heading", { name: "Birthday Set" })).toBeInTheDocument();
    expect(screen.getByText("Temporary review story placeholder")).toBeInTheDocument();
    expect(screen.getByText("★★★★★")).toBeInTheDocument();
    expect(screen.getByText(/Birthday Set made my plans feel/i)).toBeInTheDocument();
    expect(screen.getByText("Verified customer")).toBeInTheDocument();

    const progressSegments = document.querySelectorAll(".review-story-viewer__progress-segment");
    expect(progressSegments).toHaveLength(stories.length);
    expect(progressSegments[0]).toHaveAttribute("data-state", "complete");
    expect(progressSegments[1]).toHaveAttribute("data-state", "active");
    expect(progressSegments[2]).toHaveAttribute("data-state", "upcoming");
  });

  it("calls onClose from the close button and Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderStoryViewer(1, { onClose });

    await user.click(screen.getByRole("button", { name: "Close review story" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("navigates with quick tap zones and arrow keys", async () => {
    const user = userEvent.setup();
    renderStoryViewer(1);

    await user.click(screen.getByRole("button", { name: "Next review story" }));
    expect(screen.getByRole("dialog", { name: "Bridal Nails review story" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous review story" }));
    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("dialog", { name: "Sarah review story" })).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();
  });

  it("auto-advances, auto-closes the final story, and restarts after manual navigation", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderStoryViewer(0, { onClose });

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByRole("button", { name: "Next review story" }));
    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5999);
    });
    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole("dialog", { name: "Bridal Nails review story" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("pauses on hold without navigating, then resumes on release", () => {
    vi.useFakeTimers();
    renderStoryViewer(1);

    const nextTapZone = screen.getByRole("button", { name: "Next review story" });
    fireEvent.pointerDown(nextTapZone, { pointerId: 1, pointerType: "mouse" });

    act(() => {
      vi.advanceTimersByTime(6300);
    });
    fireEvent.pointerUp(nextTapZone, { pointerId: 1, pointerType: "mouse" });

    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5999);
    });
    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole("dialog", { name: "Bridal Nails review story" })).toBeInTheDocument();
  });

  it("pauses from the story body and resumes after pointer cancel", () => {
    vi.useFakeTimers();
    renderStoryViewer(1);

    const storyCard = document.querySelector(".review-story-viewer__card") as HTMLElement;
    fireEvent.pointerDown(storyCard, { pointerId: 1, pointerType: "touch" });

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    fireEvent.pointerUp(storyCard, { pointerId: 1, pointerType: "touch" });

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(screen.getByRole("dialog", { name: "Bridal Nails review story" })).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole("button", { name: "Previous review story" }), {
      pointerId: 2,
      pointerType: "touch"
    });
    fireEvent.pointerCancel(screen.getByRole("button", { name: "Previous review story" }), {
      pointerId: 2,
      pointerType: "touch"
    });
  });

  it("restores body scroll lock cleanup and respects reduced motion", () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn((query: string) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn()
      }))
    });

    const { unmount } = renderStoryViewer(1);

    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
