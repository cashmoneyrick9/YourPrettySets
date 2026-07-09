import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { featuredProducts } from "../data/products";
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

    expect(hero).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop sets" })).toHaveAttribute("href", "/shop");
    expect(screen.getByText("HOW IT WORKS")).toBeInTheDocument();
    expect(document.querySelectorAll(".confidence-card__number")).toHaveLength(3);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Pick your set" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Choose glue or tabs" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Apply and wear" })).not.toBeInTheDocument();
    expect(screen.queryByText("Browse the ready-to-wear drops and choose the set that matches your plans.")).not.toBeInTheDocument();
    expect(screen.queryByText("Use nail glue for longer wear or adhesive tabs when you want easier removal.")).not.toBeInTheDocument();
    expect(screen.queryByText("Prep, press, and keep the included tools nearby for touch-ups or reuse.")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".confidence-card__copy")).toHaveLength(0);
    expect(document.querySelector(".confidence-carousel__track")).toBeInTheDocument();
    expect(document.querySelector(".confidence-progress")).not.toBeInTheDocument();
    expect(document.querySelector(".confidence-carousel__hint")).not.toBeInTheDocument();
    expect(document.querySelector(".collection-carousel__hint")).toHaveTextContent("Swipe to explore");
    expect(document.querySelector("#shop-more")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Shop more" })).not.toBeInTheDocument();

    expect(hero.compareDocumentPosition(collections) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(collections.compareDocumentPosition(confidence) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("button", { name: "New Arrivals" })).toBeInTheDocument();
    for (const option of ["Ready to Ship", "Made to Order", "Custom Orders", "Best Sellers"]) {
      expect(screen.getByRole("button", { name: option })).toBeInTheDocument();
    }
    for (const oldCollection of ["Everyday", "Date Night", "Vacation", "Bridal", "Birthday", "Work/Neutral", "Statement"]) {
      expect(screen.queryByRole("button", { name: oldCollection })).not.toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Featured sets" })).toBeInTheDocument();
    const featuredSetsSection = document.querySelector(".featured-sets-section") as HTMLElement;
    for (const product of featuredProducts) {
      expect(within(featuredSetsSection).getByRole("link", { name: `View ${product.name}` })).toHaveAttribute(
        "href",
        `/products/${product.slug}`
      );
    }
    for (const name of ["Glazed Petal", "Sunset Sprinkle", "Pearl Wink", "Poolside Pop"]) {
      expect(screen.queryByRole("link", { name: `View ${name}` })).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name })).not.toBeInTheDocument();
    }
    expect(screen.queryByRole("heading", { name: "This week's set" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ready to Ship" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Ready to Ship sets" })).toBeInTheDocument();
    expect(document.querySelector(".collection-products")).toBeInTheDocument();
    expect(screen.getByText("16 available")).toBeInTheDocument();
    const collectionProductRow = document.querySelector(".collection-product-row") as HTMLElement;
    expect(collectionProductRow).toBeInTheDocument();
    expect(within(collectionProductRow).getByRole("link", { name: "View Blush Crush" })).toHaveAttribute("href", "/products/blush-crush");
    expect(within(collectionProductRow).getByRole("link", { name: "View Golden Hour" })).toHaveAttribute("href", "/products/golden-hour");
    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "/shop/ready-to-ship");
    expect(within(collectionProductRow).getByRole("heading", { name: "Blush Crush" })).toBeInTheDocument();
    expect(within(collectionProductRow).getByRole("heading", { name: "Golden Hour" })).toBeInTheDocument();
    expect(screen.getAllByText("$18").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$28").length).toBeGreaterThan(0);
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
    expect(screen.queryByRole("heading", { name: "What’s Included" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Loved by first-time press-on buyers" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Questions before you order" })).not.toBeInTheDocument();
  });

  it("links active Browse shopping paths to their destinations", async () => {
    const user = userEvent.setup();
    renderHomePage();

    await user.click(screen.getByRole("button", { name: "Made to Order" }));

    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "/shop/made-to-order");

    await user.click(screen.getByRole("button", { name: "Custom Orders" }));

    expect(screen.getByRole("heading", { name: "Custom Orders" })).toBeInTheDocument();
    expect(screen.getByText("Design request preview")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "/shop/custom-orders");

    await user.click(screen.getByRole("button", { name: "New Arrivals" }));

    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute(
      "href",
      "/shop?collection=New%20Arrivals"
    );
  });

  it("uses the polished storefront presentation without a hero background image", () => {
    renderHomePage();

    expect(document.querySelector("#home")).not.toHaveClass("storefront-barebones");
    expect(document.querySelector(".hero-photo")).not.toHaveClass("hero-photo--asset-preserved");
    expect(document.querySelector(".hero-photo")).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector(".hero-photo")).not.toHaveAttribute("aria-label");
  });

  it("renders the decorative Reviews keepsake carousel after How It Works", () => {
    renderHomePage();

    const confidence = screen.getByRole("heading", { name: "3 EASY STEPS" });
    const reviews = screen.getByRole("heading", { name: "Customer keepsakes" });
    const carousel = screen.getByRole("region", { name: "Customer review keepsake carousel" });

    expect(confidence.compareDocumentPosition(reviews) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText("CUSTOMER LOVE")).toBeInTheDocument();
    expect(carousel).toHaveClass("mobile-carousel", "reviews-polaroid-carousel");
    expect(carousel).toHaveAttribute("data-auto-rotate", "true");
    expect(carousel).toHaveAttribute("data-loop", "true");
    expect(carousel).toHaveAttribute("data-rotate-speed", "24");
    expect(document.querySelectorAll(".review-polaroid-card")).toHaveLength(7);
    expect(document.querySelectorAll(".review-polaroid-card__photo")).toHaveLength(7);
    expect(document.querySelectorAll(".review-polaroid-card__body")).toHaveLength(7);
    expect(document.querySelectorAll(".review-polaroid-card__caption")).toHaveLength(7);
    expect(Array.from(document.querySelectorAll(".review-polaroid-card__photo")).every((photo) => photo.childElementCount === 0)).toBe(true);
    expect(Array.from(document.querySelectorAll(".review-polaroid-card")).every((card) => card.getAttribute("style")?.includes("--review-polaroid-rotation"))).toBe(true);
    expect(document.querySelector(".review-polaroid-card--peach")).not.toBeInTheDocument();
    expect(document.querySelector(".review-polaroid-card--rose")).not.toBeInTheDocument();
    expect(screen.getByText("Sarah's birthday set")).toBeInTheDocument();
    expect(screen.getByText("Mia's vacation set")).toBeInTheDocument();
    expect(screen.getByText("Jade's work/neutral set")).toBeInTheDocument();
    expect(document.querySelector(".review-polaroid-card")).not.toHaveAttribute("role", "button");
    expect(document.querySelectorAll(".reviews-polaroid-strip button")).toHaveLength(0);
    expect(document.querySelector(".review-story-row")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".review-story-item")).toHaveLength(0);
    expect(document.querySelectorAll(".review-story-bubble")).toHaveLength(0);
    expect(screen.queryByRole("dialog", { name: /review story/i })).not.toBeInTheDocument();
    expect(document.querySelectorAll(".review-card")).toHaveLength(0);
    expect(document.querySelectorAll(".review-card--loop-buffer")).toHaveLength(0);
  });

  it("hides kit contents, old customer love stories, and FAQ from the Home route", () => {
    renderHomePage();

    expect(screen.queryByText("THE COMPLETE SET")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "What’s Included" })).not.toBeInTheDocument();
    expect(document.querySelector(".kit-section")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Loved by first-time press-on buyers" })).not.toBeInTheDocument();
    expect(document.querySelector(".review-story-row")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".review-story-item")).toHaveLength(0);
    expect(document.querySelectorAll(".review-story-bubble")).toHaveLength(0);
    expect(screen.queryByRole("dialog", { name: /review story/i })).not.toBeInTheDocument();
    expect(document.querySelectorAll(".review-card")).toHaveLength(0);
    expect(document.querySelectorAll(".review-card--loop-buffer")).toHaveLength(0);
    expect(screen.queryByRole("heading", { name: "Questions before you order" })).not.toBeInTheDocument();
    expect(document.querySelector(".faq-help-section")).not.toBeInTheDocument();
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
    expect(cards.map((card) => card.textContent?.trim())).toEqual(["1", "2", "3"]);
    expect(document.querySelectorAll(".confidence-card--loop-clone")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card__visual")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card__copy")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card__number")).toHaveLength(3);
    expect(screen.queryByLabelText("Minimal nail tips arranged in a product tray")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Minimal nail glue, adhesive tabs, and cuticle stick")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Minimal hand with finished press-on nails")).not.toBeInTheDocument();
  });

  it("does not render the FAQ on the Home route", () => {
    renderHomePage();

    expect(screen.queryByRole("heading", { name: "Questions before you order" })).not.toBeInTheDocument();
    expect(screen.queryByText("Answers on sizing, wear time, application, and custom orders.")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-topic-carousel")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-image-header")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-help")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-card__header--image")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Contact Support" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "View Full FAQ" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "How do I know my size?" })).not.toBeInTheDocument();
  });
});
