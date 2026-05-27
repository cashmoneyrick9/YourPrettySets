import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
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
  const mockAnimationFrame = () => {
    let nextFrameId = 1;
    const frameCallbacks: FrameRequestCallback[] = [];
    const requestAnimationFrameSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frameCallbacks.push(callback);
      return nextFrameId++;
    });
    const cancelAnimationFrameSpy = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    return {
      cancelAnimationFrameSpy,
      requestAnimationFrameSpy,
      runNextFrame(timestamp: number) {
        const callback = frameCallbacks.shift();
        if (!callback) {
          throw new Error("Expected a queued animation frame");
        }
        callback(timestamp);
      }
    };
  };

  const setCardMetrics = (track: HTMLElement, cardWidth = 300) => {
    const firstCard = track.querySelector(".confidence-card") as HTMLElement;
    expect(firstCard).toBeInTheDocument();
    let scrollLeft = cardWidth * 3;
    Object.defineProperty(firstCard, "offsetWidth", { configurable: true, value: cardWidth });
    Object.defineProperty(track, "scrollLeft", {
      configurable: true,
      get: () => scrollLeft,
      set: (value: number) => {
        scrollLeft = Math.trunc(value);
      }
    });
  };

  const setReviewCardMetrics = (track: HTMLElement, cardWidth = 294, gap = 14) => {
    let scrollLeft = 0;
    Object.defineProperty(track, "clientWidth", { configurable: true, value: 339 });
    Object.defineProperty(track, "scrollLeft", {
      configurable: true,
      get: () => scrollLeft,
      set: (value: number) => {
        scrollLeft = Math.trunc(value);
      }
    });
    const cards = document.querySelectorAll<HTMLElement>(".review-card");
    Object.defineProperty(track, "scrollWidth", { configurable: true, value: 78 + cards.length * (cardWidth + gap) });
    cards.forEach((card, index) => {
      Object.defineProperty(card, "offsetWidth", { configurable: true, value: cardWidth });
      Object.defineProperty(card, "clientWidth", { configurable: true, value: cardWidth });
      Object.defineProperty(card, "offsetLeft", { configurable: true, value: 39 + index * (cardWidth + gap) });
    });
  };

  it("does not scroll the page while centering the initial How It Works card", () => {
    const animationFrame = mockAnimationFrame();
    const scrollIntoViewSpy = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoViewSpy
    });
    render(<HomePage />);

    const track = document.querySelector(".confidence-carousel__track") as HTMLElement;
    expect(track).toBeInTheDocument();

    act(() => {
      animationFrame.runNextFrame(0);
    });

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
    expect(document.querySelector(".confidence-progress")).toBeInTheDocument();
    expect(document.querySelector(".confidence-carousel__hint")).not.toBeInTheDocument();
    expect(document.querySelector(".collection-carousel__hint")).toHaveTextContent("Swipe to explore");
    expect(document.querySelector("#shop-more")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Shop more" })).not.toBeInTheDocument();
    expect(screen.queryByText(/sizing kit/i)).not.toBeInTheDocument();

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
    expect(screen.getByRole("heading", { name: "Quick answers" })).toBeInTheDocument();
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
    expect(document.querySelectorAll(".review-card")).toHaveLength(12);
    expect(document.querySelector(".review-dots")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".review-dots__dot")).toHaveLength(0);
    expect(document.querySelectorAll(".review-card__number")).toHaveLength(11);
    expect([...document.querySelectorAll(".review-card__number")].map((number) => number.textContent)).toEqual([
      "01",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12"
    ]);
    expect(document.querySelector('[data-review-index="1"]')).toHaveClass("review-card--product");
    expect(document.querySelector('[data-review-index="1"] .review-card__number')).not.toBeInTheDocument();
    expect(screen.getByText("Taylor K.")).toBeInTheDocument();
    expect(screen.getByText("Verified Buyer")).toBeInTheDocument();
    expect(screen.getByText("REVIEWED SET")).toBeInTheDocument();
    expect(screen.getByText("Soft Pink")).toBeInTheDocument();
    expect(screen.getByText("Square Short · From $35")).toBeInTheDocument();
    expect(document.querySelectorAll(".review-card--product")).toHaveLength(1);
    expect(document.querySelector('[data-review-index="1"] .reviewed-set__link')).toHaveAttribute("tabindex", "-1");
    expect(document.querySelector('[data-review-index="1"] .reviewed-set__link')).toHaveAttribute("href", "/shop");
    expect(document.querySelectorAll(".review-card--loop-buffer")).toHaveLength(0);
    expect(screen.queryByRole("button", { name: "Previous review" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next review" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Show review/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "READ MORE REVIEWS" })).not.toBeInTheDocument();
  });

  it("uses native review scroll position as the active card source of truth", async () => {
    render(<HomePage />);

    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    });

    const track = document.querySelector(".review-carousel__track") as HTMLElement;
    setReviewCardMetrics(track);
    track.scrollLeft = 1249;

    fireEvent.scroll(track);

    expect(document.querySelector(".review-card--active")).toHaveAttribute("data-review-index", "4");
    expect(document.querySelector(".review-card--active .review-card__number")).toHaveTextContent("05");
    expect(document.querySelector(".review-dots")).not.toBeInTheDocument();
  });

  it("continuously drifts the review cards at the same slow pace as How It Works", () => {
    const animationFrame = mockAnimationFrame();
    render(<HomePage />);

    const track = document.querySelector(".review-carousel__track") as HTMLElement;
    setReviewCardMetrics(track);
    act(() => {
      for (let frame = 0; frame <= 70; frame += 1) {
        animationFrame.runNextFrame(frame * 16);
      }
    });

    expect(track.scrollLeft).toBeGreaterThan(30);
    expect(document.querySelector(".review-card--active")).toHaveAttribute("data-review-index", "0");
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

  it("shows three How It Works progress pills instead of dot controls", () => {
    render(<HomePage />);

    expect(screen.queryByRole("button", { name: "Next step" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Previous step" })).not.toBeInTheDocument();
    expect(document.querySelectorAll(".confidence-dots__dot")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-progress__pill")).toHaveLength(3);
    expect([...document.querySelectorAll<HTMLElement>(".confidence-progress__fill")].map((pill) => pill.style.width)).toEqual([
      "0%",
      "0%",
      "0%"
    ]);
    expect(document.querySelector(".confidence-carousel")).toHaveAttribute("data-active-step", "1");
  });

  it("continuously drifts the How It Works cards at a visible slow pace without using snap", () => {
    const animationFrame = mockAnimationFrame();
    render(<HomePage />);

    const carousel = document.querySelector(".confidence-carousel") as HTMLElement;
    const track = document.querySelector(".confidence-carousel__track") as HTMLElement;
    expect(carousel).toHaveClass("confidence-carousel--drifting");
    setCardMetrics(track);

    act(() => {
      for (let frame = 0; frame <= 63; frame += 1) {
        animationFrame.runNextFrame(frame * 16);
      }
    });

    expect(track.scrollLeft).toBeGreaterThan(934);
    expect(document.querySelector(".confidence-progress__fill")).not.toHaveStyle({ width: "0%" });
    expect(carousel).toHaveAttribute("data-active-step", "1");
  });

  it("loops the How It Works drift at a matching visual position instead of racing back to the start", () => {
    const animationFrame = mockAnimationFrame();
    render(<HomePage />);

    const track = document.querySelector(".confidence-carousel__track") as HTMLElement;
    setCardMetrics(track);
    track.scrollLeft = 1799;

    act(() => {
      animationFrame.runNextFrame(0);
      animationFrame.runNextFrame(80);
    });

    expect(track.scrollLeft).toBeGreaterThan(899);
    expect(track.scrollLeft).toBeLessThan(910);
  });

  it("lets manual scrolling pass from slide 3 into the next slide 1 while progress resets", () => {
    render(<HomePage />);

    const carousel = document.querySelector(".confidence-carousel") as HTMLElement;
    const track = document.querySelector(".confidence-carousel__track") as HTMLElement;
    setCardMetrics(track);
    track.scrollLeft = 1805;

    act(() => {
      track.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    expect(track.scrollLeft).toBe(1805);
    expect(carousel).toHaveAttribute("data-active-step", "1");
    expect([...document.querySelectorAll<HTMLElement>(".confidence-progress__fill")].map((pill) => pill.style.width)).toEqual([
      "1.6666666666666667%",
      "0%",
      "0%"
    ]);
  });

  it("re-centers native scrolling from the outer buffer before the carousel reaches a hard end", () => {
    render(<HomePage />);

    const carousel = document.querySelector(".confidence-carousel") as HTMLElement;
    const track = document.querySelector(".confidence-carousel__track") as HTMLElement;
    setCardMetrics(track);
    track.scrollLeft = 2405;

    act(() => {
      track.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    expect(track.scrollLeft).toBe(1505);
    expect(carousel).toHaveAttribute("data-active-step", "3");

    track.scrollLeft = 295;

    act(() => {
      track.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    expect(track.scrollLeft).toBe(1195);
    expect(carousel).toHaveAttribute("data-active-step", "2");
  });

  it("keeps the card lane free while shoppers drag, then settles after release", () => {
    vi.useFakeTimers();
    mockAnimationFrame();
    render(<HomePage />);

    const carousel = document.querySelector(".confidence-carousel") as HTMLElement;
    const track = document.querySelector(".confidence-carousel__track") as HTMLElement;
    setCardMetrics(track);
    const scrollTo = vi.fn(({ left }: ScrollToOptions) => {
      track.scrollLeft = Number(left);
      track.dispatchEvent(new Event("scroll", { bubbles: true }));
    });
    Object.defineProperty(track, "scrollTo", { configurable: true, value: scrollTo });
    const dispatchPointer = (type: string, clientX: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, "clientX", { value: clientX });
      Object.defineProperty(event, "pointerId", { value: 1 });
      track.dispatchEvent(event);
    };

    act(() => {
      dispatchPointer("pointerdown", 200);
    });

    expect(carousel).toHaveClass("confidence-carousel--interacting");
    expect(carousel).toHaveClass("confidence-carousel--auto-paused");

    act(() => {
      dispatchPointer("pointermove", 40);
    });
    expect(track.scrollLeft).toBeGreaterThan(300);

    act(() => {
      dispatchPointer("pointerup", 40);
    });
    expect(carousel).not.toHaveClass("confidence-carousel--interacting");
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth", left: 1200 }));
    expect(carousel).toHaveAttribute("data-active-step", "2");

    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(carousel).toHaveClass("confidence-carousel--auto-paused");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(carousel).not.toHaveClass("confidence-carousel--auto-paused");
  });

  it("lets touch swipes use native horizontal scrolling instead of mouse-style dragging", () => {
    vi.useFakeTimers();
    mockAnimationFrame();
    render(<HomePage />);

    const carousel = document.querySelector(".confidence-carousel") as HTMLElement;
    const track = document.querySelector(".confidence-carousel__track") as HTMLElement;
    setCardMetrics(track);
    const scrollTo = vi.fn();
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.defineProperty(track, "scrollTo", { configurable: true, value: scrollTo });
    Object.defineProperty(track, "setPointerCapture", { configurable: true, value: setPointerCapture });
    Object.defineProperty(track, "releasePointerCapture", { configurable: true, value: releasePointerCapture });
    const dispatchPointer = (type: string, clientX: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, "clientX", { value: clientX });
      Object.defineProperty(event, "pointerId", { value: 1 });
      Object.defineProperty(event, "pointerType", { value: "touch" });
      const preventDefault = vi.spyOn(event, "preventDefault");
      track.dispatchEvent(event);
      return preventDefault;
    };

    act(() => {
      dispatchPointer("pointerdown", 200);
    });

    expect(carousel).toHaveClass("confidence-carousel--auto-paused");
    expect(carousel).not.toHaveClass("confidence-carousel--interacting");
    expect(setPointerCapture).not.toHaveBeenCalled();

    let preventDefault: ReturnType<typeof vi.spyOn>;
    act(() => {
      preventDefault = dispatchPointer("pointermove", 40);
    });

    expect(preventDefault!).not.toHaveBeenCalled();
    expect(track.scrollLeft).toBe(900);

    act(() => {
      track.scrollLeft = 1200;
      track.dispatchEvent(new Event("scroll", { bubbles: true }));
      dispatchPointer("pointerup", 40);
    });

    expect(scrollTo).not.toHaveBeenCalled();
    expect(releasePointerCapture).not.toHaveBeenCalled();
    expect(carousel).not.toHaveClass("confidence-carousel--interacting");
    expect(carousel).toHaveAttribute("data-active-step", "2");
  });

  it("settles a drag past slide 3 onto the next physical slide 1 instead of snapping back", () => {
    vi.useFakeTimers();
    mockAnimationFrame();
    render(<HomePage />);

    const carousel = document.querySelector(".confidence-carousel") as HTMLElement;
    const track = document.querySelector(".confidence-carousel__track") as HTMLElement;
    setCardMetrics(track);
    track.scrollLeft = 1500;
    const scrollTo = vi.fn(({ left }: ScrollToOptions) => {
      track.scrollLeft = Number(left);
      track.dispatchEvent(new Event("scroll", { bubbles: true }));
    });
    Object.defineProperty(track, "scrollTo", { configurable: true, value: scrollTo });
    const dispatchPointer = (type: string, clientX: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, "clientX", { value: clientX });
      Object.defineProperty(event, "pointerId", { value: 1 });
      track.dispatchEvent(event);
    };

    act(() => {
      dispatchPointer("pointerdown", 200);
      dispatchPointer("pointermove", -120);
    });

    expect(track.scrollLeft).toBe(1820);

    act(() => {
      dispatchPointer("pointerup", -120);
    });

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth", left: 1800 }));
    expect(carousel).toHaveAttribute("data-active-step", "1");
  });

  it("disables continuous drift for reduced-motion shoppers", () => {
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

  it("does not expose the How It Works carousel as an arrow-key region", () => {
    render(<HomePage />);

    const carousel = document.querySelector(".confidence-carousel") as HTMLElement;
    expect(carousel).not.toHaveAttribute("tabindex");

    act(() => {
      carousel.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    });

    expect(carousel).toHaveAttribute("data-active-step", "1");
    expect(carousel).not.toHaveClass("confidence-carousel--paused");
  });

  it("updates the active How It Works card from horizontal scroll position", () => {
    render(<HomePage />);

    const carousel = document.querySelector(".confidence-carousel") as HTMLElement;
    const track = document.querySelector(".confidence-carousel__track") as HTMLElement;
    const firstCard = document.querySelector(".confidence-card") as HTMLElement;
    expect(carousel).toBeInTheDocument();
    expect(track).toBeInTheDocument();
    expect(firstCard).toBeInTheDocument();
    setCardMetrics(track);
    track.scrollLeft = 1200;

    act(() => {
      track.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    expect(carousel).toHaveAttribute("data-active-step", "2");
    expect([...document.querySelectorAll<HTMLElement>(".confidence-progress__fill")].map((pill) => pill.style.width)).toEqual([
      "100%",
      "0%",
      "0%"
    ]);
  });

  it("renders repeated loop cards so the active How It Works card has both side previews", () => {
    render(<HomePage />);

    const cards = [...document.querySelectorAll(".confidence-card")];
    expect(cards).toHaveLength(9);
    expect(cards.map((card) => card.getAttribute("data-step-index"))).toEqual(["0", "1", "2", "0", "1", "2", "0", "1", "2"]);
    expect(document.querySelectorAll(".confidence-card--loop-buffer")).toHaveLength(6);
    expect(document.querySelectorAll(".confidence-card--repeat")).toHaveLength(0);
    expect(cards.map((card) => card.textContent?.trim())).toEqual(["", "", "", "", "", "", "", "", ""]);
    expect(document.querySelectorAll(".confidence-card--loop-clone")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card__visual")).toHaveLength(0);
    expect(document.querySelectorAll(".confidence-card__copy")).toHaveLength(0);
    expect(screen.queryByLabelText("Minimal nail tips arranged in a product tray")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Minimal nail glue, adhesive tabs, and cuticle stick")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Minimal hand with finished press-on nails")).not.toBeInTheDocument();
  });

  it("renders the FAQ help strip, accordion, and contact CTA", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(screen.getByRole("link", { name: "New to press-ons? Start here." })).toHaveAttribute("href", "#how-it-works");
    expect(screen.getByRole("link", { name: "Care tips" })).toHaveAttribute("href", "#faq");
    expect(screen.getByRole("button", { name: /What comes with each set?/i })).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText("Each set includes 24 nails, adhesive tabs, nail glue, a nail file, cuticle pusher, alcohol wipe, application card, and storage.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /How long do press-ons last?/i })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "#contact");

    await user.click(screen.getByRole("button", { name: /Can I reuse them?/i }));

    expect(screen.getByRole("button", { name: /What comes with each set?/i })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: /Can I reuse them?/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Yes, with careful removal and storage between wears.")).toBeInTheDocument();
  });
});
