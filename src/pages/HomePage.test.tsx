import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { HomePage } from "./HomePage";

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

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  restoreDefaultMatchMedia();
  Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
});

describe("HomePage", () => {
  function renderHomePage() {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  }

  it("does not scroll the page while centering the initial How It Works card", () => {
    const scrollIntoViewSpy = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoViewSpy
    });
    renderHomePage();

    const track = document.querySelector(".confidence-carousel__track") as HTMLElement;
    expect(track).toBeInTheDocument();

    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });

  it("renders the mobile shopping path before product shopping", () => {
    renderHomePage();

    const hero = screen.getByRole("heading", { name: "Ready-to-wear sets for pretty plans" });
    const confidence = screen.getByRole("heading", { name: "3 EASY STEPS" });
    const collections = screen.getByRole("heading", { name: "Browse" });
    const included = screen.getByRole("heading", { name: "What’s Included" });

    expect(hero).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop sets" })).toHaveAttribute("href", "/shop");
    expect(screen.getByText("HOW IT WORKS")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pick your set" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Choose glue or tabs" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Apply and wear" })).toBeInTheDocument();
    expect(screen.getByText("Browse the ready-to-wear drops and choose the set that matches your plans.")).toBeInTheDocument();
    expect(screen.getByText("Use nail glue for longer wear or adhesive tabs when you want easier removal.")).toBeInTheDocument();
    expect(screen.getByText("Prep, press, and keep the included tools nearby for touch-ups or reuse.")).toBeInTheDocument();
    expect(document.querySelectorAll(".confidence-card__number")).toHaveLength(3);
    expect(document.querySelectorAll(".confidence-card__copy")).toHaveLength(3);
    expect(document.querySelector(".confidence-carousel__track")).toBeInTheDocument();
    expect(document.querySelector(".confidence-progress")).not.toBeInTheDocument();
    expect(document.querySelector(".confidence-carousel__hint")).not.toBeInTheDocument();
    expect(document.querySelector(".collection-carousel__hint")).toHaveTextContent("Swipe to explore");
    expect(document.querySelector("#shop-more")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Shop more" })).not.toBeInTheDocument();

    expect(hero.compareDocumentPosition(collections) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(collections.compareDocumentPosition(confidence) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(confidence.compareDocumentPosition(included) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "New Arrivals" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Featured Sets" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "This week's set" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Everyday sets" })).toBeInTheDocument();
    expect(screen.getByText("10 available")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Blush Crush" })).toHaveAttribute("href", "/products/blush-crush");
    expect(screen.getByRole("link", { name: "View Soft Serve" })).toHaveAttribute("href", "/products/soft-serve");
    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "/shop");
    expect(screen.getByRole("heading", { name: "Blush Crush" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Soft Serve" })).toBeInTheDocument();
    expect(screen.getAllByText("$18").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$20").length).toBeGreaterThan(0);
    expect(document.querySelectorAll(".collection-product-row > .collection-product-card")).toHaveLength(4);
    expect(document.querySelector(".collection-product-teaser")).toBeInTheDocument();
    expect(document.querySelectorAll(".collection-product-teaser .collection-product-card")).toHaveLength(2);
    expect(document.querySelectorAll(".collection-product-card .product-card")).toHaveLength(0);
    expect(screen.queryByText("1 of 4")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Shop this set" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Browse all new sets" })).not.toBeInTheDocument();
    expect(document.querySelector(".weekly-set__peek")).not.toBeInTheDocument();
    expect(screen.queryByText("Up next")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".weekly-set-dots__dot")).toHaveLength(0);
    expect(screen.queryByText(/Clean background placeholder/i)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Loved by first-time press-on buyers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How Can We Help?" })).toBeInTheDocument();
  });

  it("uses the polished storefront presentation without deleting the hero image container", () => {
    renderHomePage();

    expect(document.querySelector("#home")).not.toHaveClass("storefront-barebones");
    expect(document.querySelector(".hero-photo")).toHaveClass("hero-photo--asset-preserved");
    expect(document.querySelector(".hero-photo")).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector(".hero-photo")).not.toHaveAttribute("aria-label");
  });

  it("shows a polished static Instagram-story-style review placeholder row", () => {
    renderHomePage();

    const storyLabels = [
      "Sarah",
      "Birthday Set",
      "Bridal Nails",
      "Etsy Review",
      "Custom Set",
      "Sizing Kit",
      "Vacation Nails",
      "Chrome Set",
      "Press-On Win",
      "Five Stars"
    ];

    expect(screen.getByText("CUSTOMER LOVE")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Loved by first-time press-on buyers" })).toBeInTheDocument();
    expect(document.querySelector(".review-story-row")).toBeInTheDocument();
    expect(document.querySelector(".review-story-row")).toHaveAttribute("aria-label", "Review story placeholders");
    expect(document.querySelectorAll(".review-story-item")).toHaveLength(storyLabels.length);
    expect(document.querySelectorAll(".review-story-bubble")).toHaveLength(storyLabels.length);
    storyLabels.forEach((label) => {
      const item = screen.getByText(label).closest(".review-story-item");
      const bubble = screen.getByRole("button", { name: `Open ${label} review story` });

      expect(item).toBeInTheDocument();
      expect(item?.tagName).toBe("DIV");
      expect(bubble).toHaveClass("review-story-bubble");
      expect(item).toContainElement(bubble);
      expect(bubble).not.toContainElement(screen.getByText(label));
      expect(screen.getByText(label).tagName).toBe("SPAN");
    });
    expect(document.querySelector(".review-carousel__track")).not.toBeInTheDocument();
    expect(document.querySelector(".review-carousel")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".review-card")).toHaveLength(0);
    expect(screen.queryByRole("button", { name: "Previous review" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next review" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Show review/i })).not.toBeInTheDocument();
    expect(document.querySelectorAll(".review-card--product")).toHaveLength(0);
    expect(document.querySelectorAll(".review-card__stars--product")).toHaveLength(0);
    expect(document.querySelectorAll(".reviewed-set")).toHaveLength(0);
    expect(screen.queryByText("Taylor K.")).not.toBeInTheDocument();
    expect(screen.queryByText("Verified Buyer")).not.toBeInTheDocument();
    expect(screen.queryByText("REVIEWED SET")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".review-card--loop-buffer")).toHaveLength(0);
    expect(screen.queryByRole("link", { name: "READ MORE REVIEWS" })).not.toBeInTheDocument();
  });

  it("opens and closes a static review story viewer from the circular bubble", async () => {
    const user = userEvent.setup();
    renderHomePage();

    expect(screen.queryByRole("dialog", { name: "Birthday Set review story" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open Birthday Set review story" }));

    const viewer = screen.getByRole("dialog", { name: "Birthday Set review story" });

    expect(viewer).toBeInTheDocument();
    expect(viewer).not.toHaveClass("story-debug-hitboxes");
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("heading", { name: "Birthday Set" })).toBeInTheDocument();
    expect(screen.getByText("Temporary review story placeholder")).toBeInTheDocument();
    expect(screen.getByText("★★★★★")).toBeInTheDocument();
    expect(screen.getByText(/Birthday Set made my plans feel/i)).toBeInTheDocument();
    expect(screen.getByText("Verified customer")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close review story" }));

    expect(screen.queryByRole("dialog", { name: "Birthday Set review story" })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the review story viewer when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderHomePage();

    await user.click(screen.getByRole("button", { name: "Open Etsy Review review story" }));

    expect(screen.getByRole("dialog", { name: "Etsy Review review story" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Etsy Review review story" })).not.toBeInTheDocument();
  });

  it("navigates review stories with arrow keys and bounded edges", async () => {
    const user = userEvent.setup();
    renderHomePage();

    await user.click(screen.getByRole("button", { name: "Open Sarah review story" }));

    expect(screen.getByRole("dialog", { name: "Sarah review story" })).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("dialog", { name: "Sarah review story" })).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();
    expect(screen.getByText(/Birthday Set made my plans feel/i)).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("dialog", { name: "Sarah review story" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close review story" }));
    await user.click(screen.getByRole("button", { name: "Open Five Stars review story" }));

    expect(screen.getByRole("dialog", { name: "Five Stars review story" })).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("dialog", { name: "Five Stars review story" })).toBeInTheDocument();
  });

  it("navigates review stories with left and right tap zones", async () => {
    const user = userEvent.setup();
    renderHomePage();

    await user.click(screen.getByRole("button", { name: "Open Birthday Set review story" }));

    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next review story" }));

    expect(screen.getByRole("dialog", { name: "Bridal Nails review story" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous review story" }));

    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close review story" }));

    expect(screen.queryByRole("dialog", { name: "Birthday Set review story" })).not.toBeInTheDocument();
  });

  it("shows segmented review story progress for the active story", async () => {
    const user = userEvent.setup();
    renderHomePage();

    await user.click(screen.getByRole("button", { name: "Open Bridal Nails review story" }));

    const progressSegments = document.querySelectorAll(".review-story-viewer__progress-segment");

    expect(progressSegments).toHaveLength(10);
    expect(progressSegments[0]).toHaveAttribute("data-state", "complete");
    expect(progressSegments[1]).toHaveAttribute("data-state", "complete");
    expect(progressSegments[2]).toHaveAttribute("data-state", "active");
    expect(progressSegments[3]).toHaveAttribute("data-state", "upcoming");
  });

  it("auto-advances review stories after the story timer finishes", async () => {
    vi.useFakeTimers();
    renderHomePage();

    fireEvent.click(screen.getByRole("button", { name: "Open Birthday Set review story" }));

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

  it("auto-closes the viewer when the final story timer finishes", async () => {
    vi.useFakeTimers();
    renderHomePage();

    fireEvent.click(screen.getByRole("button", { name: "Open Five Stars review story" }));

    expect(screen.getByRole("dialog", { name: "Five Stars review story" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.queryByRole("dialog", { name: "Five Stars review story" })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("restarts the story timer after manual next and previous navigation", async () => {
    vi.useFakeTimers();
    renderHomePage();

    fireEvent.click(screen.getByRole("button", { name: "Open Sarah review story" }));

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

    fireEvent.click(screen.getByRole("button", { name: "Previous review story" }));

    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByRole("dialog", { name: "Bridal Nails review story" })).toBeInTheDocument();
  });

  it("pauses the review story timer while holding a tap zone without navigating", async () => {
    vi.useFakeTimers();
    renderHomePage();

    fireEvent.click(screen.getByRole("button", { name: "Open Birthday Set review story" }));

    const nextTapZone = screen.getByRole("button", { name: "Next review story" });

    fireEvent.pointerDown(nextTapZone, { pointerId: 1, pointerType: "mouse" });

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
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

  it("holds the previous tap zone without navigating backward", async () => {
    vi.useFakeTimers();
    renderHomePage();

    fireEvent.click(screen.getByRole("button", { name: "Open Birthday Set review story" }));

    const previousTapZone = screen.getByRole("button", { name: "Previous review story" });

    fireEvent.pointerDown(previousTapZone, { pointerId: 1, pointerType: "mouse" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    fireEvent.pointerUp(previousTapZone, { pointerId: 1, pointerType: "mouse" });

    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByRole("dialog", { name: "Bridal Nails review story" })).toBeInTheDocument();
  });

  it("resumes the review story timer after pointer cancel while holding", async () => {
    vi.useFakeTimers();
    renderHomePage();

    fireEvent.click(screen.getByRole("button", { name: "Open Birthday Set review story" }));

    const previousTapZone = screen.getByRole("button", { name: "Previous review story" });

    fireEvent.pointerDown(previousTapZone, { pointerId: 1, pointerType: "touch" });

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByRole("dialog", { name: "Birthday Set review story" })).toBeInTheDocument();

    fireEvent.pointerCancel(previousTapZone, { pointerId: 1, pointerType: "touch" });

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByRole("dialog", { name: "Bridal Nails review story" })).toBeInTheDocument();
  });

  it("pauses and resumes the review story timer while holding the story card", async () => {
    vi.useFakeTimers();
    renderHomePage();

    fireEvent.click(screen.getByRole("button", { name: "Open Birthday Set review story" }));

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
  });

  it("clears story timers after close and Escape", async () => {
    vi.useFakeTimers();
    renderHomePage();

    fireEvent.click(screen.getByRole("button", { name: "Open Sarah review story" }));
    fireEvent.click(screen.getByRole("button", { name: "Close review story" }));

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open Sarah review story" }));
    fireEvent.keyDown(document, { key: "Escape" });

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not auto-advance review stories for reduced-motion shoppers", async () => {
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
    renderHomePage();

    fireEvent.click(screen.getByRole("button", { name: "Open Sarah review story" }));

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByRole("dialog", { name: "Sarah review story" })).toBeInTheDocument();
  });

  it("does not render hidden review loop-buffer copies", () => {
    renderHomePage();

    expect(document.querySelectorAll(".review-card")).toHaveLength(0);
    expect(document.querySelectorAll(".review-card--loop-buffer")).toHaveLength(0);
  });

  it("shows a swipe-first How It Works carousel with no visible controls", () => {
    renderHomePage();

    expect(screen.queryByRole("button", { name: "Previous step" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next step" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Go to step/i })).not.toBeInTheDocument();
    expect(document.querySelector(".confidence-carousel")).toHaveClass("mobile-carousel");
    expect(document.querySelector(".confidence-carousel")).toHaveAttribute("data-auto-rotate", "true");
    expect(document.querySelector(".confidence-carousel")).toHaveAttribute("data-loop", "true");
    expect(document.querySelector(".confidence-carousel")).toHaveAttribute("data-rotate-speed", "24");
    expect(document.querySelector(".confidence-carousel")).not.toHaveClass("confidence-carousel--drifting");
    expect(document.querySelectorAll(".confidence-dots__dot")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-progress__pill")).toHaveLength(0);
    expect(document.querySelector(".confidence-carousel")).toHaveAttribute("data-active-step", "1");
  });

  it("keeps the swipe-first carousel calm for reduced-motion shoppers", () => {
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
    renderHomePage();

    expect(document.querySelector(".confidence-carousel")).not.toHaveClass("confidence-carousel--drifting");
  });

  it("does not expose the How It Works carousel as a custom arrow-key region", () => {
    renderHomePage();

    const carousel = document.querySelector(".confidence-carousel") as HTMLElement;
    expect(carousel).not.toHaveAttribute("tabindex");

    act(() => {
      carousel.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    });

    expect(carousel).toHaveAttribute("data-active-step", "1");
    expect(carousel).not.toHaveClass("confidence-carousel--paused");
  });

  it("renders one clean How It Works slide per step without loop-buffer copies", () => {
    renderHomePage();

    const cards = [...document.querySelectorAll(".confidence-card")];
    expect(cards).toHaveLength(3);
    expect(cards.map((card) => card.getAttribute("data-step-index"))).toEqual(["0", "1", "2"]);
    expect(document.querySelectorAll(".confidence-card--loop-buffer")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card--repeat")).toHaveLength(0);
    expect(cards.map((card) => card.querySelector("h3")?.textContent)).toEqual([
      "Pick your set",
      "Choose glue or tabs",
      "Apply and wear"
    ]);
    expect(document.querySelectorAll(".confidence-card--loop-clone")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card__visual")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card__copy")).toHaveLength(3);
    expect(document.querySelectorAll(".confidence-card__number")).toHaveLength(3);
    expect(screen.queryByLabelText("Minimal nail tips arranged in a product tray")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Minimal nail glue, adhesive tabs, and cuticle stick")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Minimal hand with finished press-on nails")).not.toBeInTheDocument();
  });

  it("renders the FAQ Help section with topic cards and support CTAs", async () => {
    const user = userEvent.setup();
    renderHomePage();

    expect(screen.getByRole("heading", { name: "How Can We Help?" })).toBeInTheDocument();
    expect(screen.queryByText("Need help?")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sizing" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByRole("heading", { name: "Top questions in Sizing" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Visit Help Center" })).toHaveAttribute("href", "#help-center");
    expect(screen.getByRole("link", { name: "Contact Support" })).toHaveAttribute("href", "mailto:hello@yourprettysets.com");

    await user.click(screen.getByRole("button", { name: "Application" }));

    expect(screen.getByRole("button", { name: "Sizing" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Application" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Top questions in Application" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Should I use glue or adhesive tabs?" })).toBeInTheDocument();
  });
});
