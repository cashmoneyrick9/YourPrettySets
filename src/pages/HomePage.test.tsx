import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "./HomePage";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
});

describe("HomePage", () => {
  it("does not scroll the page while centering the initial How It Works card", () => {
    const scrollIntoViewSpy = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoViewSpy
    });
    render(<HomePage />);

    const track = document.querySelector(".confidence-carousel__track") as HTMLElement;
    expect(track).toBeInTheDocument();

    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });

  it("renders the mobile shopping path before product shopping", () => {
    render(<HomePage />);

    const hero = screen.getByRole("heading", { name: "Ready-to-wear sets for pretty plans" });
    const confidence = screen.getByRole("heading", { name: "3 EASY STEPS" });
    const collections = screen.getByRole("heading", { name: "Browse" });
    const included = screen.getByRole("heading", { name: "What’s Included" });

    expect(hero).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop sets" })).toHaveAttribute("href", "#shop-collections");
    expect(screen.getByText("HOW IT WORKS")).toBeInTheDocument();
    expect(screen.queryByText("Pick Your Set")).not.toBeInTheDocument();
    expect(screen.queryByText("Choose your favorite ready-to-wear or custom press-on set.")).not.toBeInTheDocument();
    expect(screen.queryByText("Choose Glue or Tabs")).not.toBeInTheDocument();
    expect(screen.queryByText("Pick nail glue for longer wear or adhesive tabs for easy removal.")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Wear" })).not.toBeInTheDocument();
    expect(screen.queryByText("Apply in minutes and enjoy salon-quality nails at home.")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".confidence-card__visual")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card__copy")).toHaveLength(0);
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
    expect(screen.getByText("5 available")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Blush Crush" })).toHaveAttribute("href", "#product-blush-crush");
    expect(screen.getByRole("link", { name: "View Soft Serve" })).toHaveAttribute("href", "#product-soft-serve");
    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "#");
    expect(screen.queryByRole("heading", { name: "Blush Crush" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Soft Serve" })).not.toBeInTheDocument();
    expect(document.querySelectorAll(".collection-product-row > .collection-product-card")).toHaveLength(4);
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

  it("uses a bare-bones black-and-white presentation without deleting the hero image container", () => {
    render(<HomePage />);

    expect(document.querySelector("#home")).toHaveClass("storefront-barebones");
    expect(document.querySelector(".hero-photo")).toHaveClass("hero-photo--asset-preserved");
    expect(document.querySelector(".hero-photo")).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector(".hero-photo")).not.toHaveAttribute("aria-label");
  });

  it("shows the review carousel foundation", () => {
    render(<HomePage />);

    expect(screen.getByText("CUSTOMER LOVE")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Loved by first-time press-on buyers" })).toBeInTheDocument();
    expect(document.querySelector(".review-carousel__track")).toBeInTheDocument();
    expect(document.querySelector(".review-carousel")).toHaveClass("mobile-carousel");
    expect(document.querySelector(".review-carousel")).toHaveAttribute("data-auto-rotate", "true");
    expect(document.querySelector(".review-carousel")).toHaveAttribute("data-loop", "true");
    expect(document.querySelector(".review-carousel")).toHaveAttribute("data-rotate-speed", "24");
    expect(document.querySelectorAll(".review-card")).toHaveLength(12);
    expect(screen.queryByRole("button", { name: "Previous review" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next review" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Show review/i })).not.toBeInTheDocument();
    expect(document.querySelector(".review-carousel__dots")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".review-card--product")).toHaveLength(12);
    expect(document.querySelectorAll(".review-card__number")).toHaveLength(0);
    expect(document.querySelectorAll(".review-card__stars--product")).toHaveLength(12);
    expect(document.querySelectorAll(".reviewed-set")).toHaveLength(12);
    expect(document.querySelector('[data-review-index="1"]')).toHaveClass("review-card--product");
    expect(screen.getByText("Taylor K.")).toBeInTheDocument();
    expect(screen.getByText("Maya R.")).toBeInTheDocument();
    expect(screen.getAllByText("Verified Buyer")).toHaveLength(12);
    expect(screen.getAllByText("REVIEWED SET")).toHaveLength(12);
    expect(screen.getByText("Blush Crush")).toBeInTheDocument();
    expect(screen.getByText("Sea Glass")).toBeInTheDocument();
    expect(screen.getAllByText("Square Short · $18")).toHaveLength(2);
    expect(screen.getByText("Almond Medium · $32")).toBeInTheDocument();
    expect(screen.getByText(/easy to apply and looked polished all week/i)).toBeInTheDocument();
    expect(screen.getByText(/survived a beach weekend/i)).toBeInTheDocument();
    expect(document.querySelector('[data-review-index="1"] .reviewed-set__link')).toHaveAttribute("tabindex", "-1");
    expect(document.querySelector('[data-review-index="1"] .reviewed-set__link')).toHaveAttribute(
      "href",
      "/shop/golden-hour"
    );
    expect(document.querySelectorAll(".review-card--loop-buffer")).toHaveLength(0);
    expect(screen.queryByRole("link", { name: "READ MORE REVIEWS" })).not.toBeInTheDocument();
  });

  it("does not render hidden review loop-buffer copies", async () => {
    render(<HomePage />);
    const cards = [...document.querySelectorAll(".review-card")];

    expect(cards).toHaveLength(12);
    expect(cards.map((card) => card.getAttribute("data-card-index"))).toEqual([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ]);
    expect(document.querySelectorAll(".review-card--loop-buffer")).toHaveLength(0);
  });

  it("shows a swipe-first How It Works carousel with no visible controls", () => {
    render(<HomePage />);

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
    render(<HomePage />);

    expect(document.querySelector(".confidence-carousel")).not.toHaveClass("confidence-carousel--drifting");
  });

  it("does not expose the How It Works carousel as a custom arrow-key region", () => {
    render(<HomePage />);

    const carousel = document.querySelector(".confidence-carousel") as HTMLElement;
    expect(carousel).not.toHaveAttribute("tabindex");

    act(() => {
      carousel.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    });

    expect(carousel).toHaveAttribute("data-active-step", "1");
    expect(carousel).not.toHaveClass("confidence-carousel--paused");
  });

  it("renders one clean How It Works slide per step without loop-buffer copies", () => {
    render(<HomePage />);

    const cards = [...document.querySelectorAll(".confidence-card")];
    expect(cards).toHaveLength(3);
    expect(cards.map((card) => card.getAttribute("data-step-index"))).toEqual(["0", "1", "2"]);
    expect(document.querySelectorAll(".confidence-card--loop-buffer")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card--repeat")).toHaveLength(0);
    expect(cards.map((card) => card.textContent?.trim())).toEqual(["", "", ""]);
    expect(document.querySelectorAll(".confidence-card--loop-clone")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card__visual")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card__copy")).toHaveLength(0);
    expect(screen.queryByLabelText("Minimal nail tips arranged in a product tray")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Minimal nail glue, adhesive tabs, and cuticle stick")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Minimal hand with finished press-on nails")).not.toBeInTheDocument();
  });

  it("renders the FAQ Help section with topic cards and support CTAs", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "How Can We Help?" })).toBeInTheDocument();
    expect(screen.queryByText("Need help?")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sizing" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByRole("heading", { name: "Top questions in Sizing" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Visit Help Center →" })).toHaveAttribute("href", "#help-center");
    expect(screen.getByRole("link", { name: "Contact Support" })).toHaveAttribute("href", "mailto:hello@yourprettysets.com");

    await user.click(screen.getByRole("button", { name: "Application" }));

    expect(screen.getByRole("button", { name: "Sizing" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Application" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Top questions in Application" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Should I use glue or adhesive tabs?" })).toBeInTheDocument();
  });
});
