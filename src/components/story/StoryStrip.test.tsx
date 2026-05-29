import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StoryStrip } from "./StoryStrip";
import type { StoryItem } from "./types";

const stories: StoryItem[] = [
  {
    id: "sarah",
    label: "Sarah",
    title: "Sarah",
    quote: "Sarah said her first set felt easy to apply.",
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
    quote: "A soft bridal set with a clean fit.",
    source: "Verified customer"
  }
];

afterEach(() => {
  cleanup();
});

describe("StoryStrip", () => {
  it("renders the story bubble row with labels outside the buttons", async () => {
    const user = userEvent.setup();
    const handleOpenStory = vi.fn();

    render(<StoryStrip stories={stories} onOpenStory={handleOpenStory} />);

    expect(document.querySelector(".review-story-row")).toHaveAttribute("aria-label", "Review story placeholders");
    expect(document.querySelectorAll(".review-story-item")).toHaveLength(stories.length);
    expect(document.querySelectorAll(".review-story-bubble")).toHaveLength(stories.length);

    stories.forEach((story) => {
      const label = screen.getByText(story.label);
      const item = label.closest(".review-story-item");
      const bubble = screen.getByRole("button", { name: `Open ${story.label} review story` });

      expect(item).toBeInTheDocument();
      expect(item?.tagName).toBe("DIV");
      expect(bubble).toHaveClass("review-story-bubble");
      expect(item).toContainElement(bubble);
      expect(bubble).not.toContainElement(label);
      expect(label.tagName).toBe("SPAN");
    });

    expect(document.querySelector(".review-carousel")).not.toBeInTheDocument();
    expect(document.querySelector(".review-carousel__track")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".review-card")).toHaveLength(0);

    await user.click(screen.getByRole("button", { name: "Open Birthday Set review story" }));

    expect(handleOpenStory).toHaveBeenCalledWith(1);
  });

  it("allows a custom accessible row label", () => {
    render(<StoryStrip ariaLabel="Customer story previews" stories={stories} onOpenStory={vi.fn()} />);

    expect(document.querySelector(".review-story-row")).toHaveAttribute("aria-label", "Customer story previews");
  });
});
