import { act, cleanup, render, screen, within } from "@testing-library/react";
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
    const confidence = screen.getByRole("heading", { name: "3 easy steps" });
    const collections = screen.getByRole("heading", { name: "Browse by the plan, mood, or moment." });
    const weeklySet = screen.getByRole("heading", { name: "This week's set" });
    const shopMore = screen.getByRole("heading", { name: "Shop more" });
    const included = screen.getByRole("heading", { name: "Everything ready for your set." });

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
    expect(screen.getByText("Swipe to explore")).toBeInTheDocument();
    expect(screen.queryByText(/size/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sizing kit/i)).not.toBeInTheDocument();

    expect(hero.compareDocumentPosition(confidence) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(confidence.compareDocumentPosition(collections) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(collections.compareDocumentPosition(weeklySet) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(weeklySet.compareDocumentPosition(shopMore) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(shopMore.compareDocumentPosition(included) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "New Arrivals" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Featured Sets" })).not.toBeInTheDocument();
    expect(screen.getByText("Blush Crush")).toBeInTheDocument();
    expect(screen.getByText("A soft pink ready-to-wear set with an easy everyday glow.")).toBeInTheDocument();
    expect(screen.getByText("1 of 4")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop this set" })).toHaveAttribute("href", "#product-blush-crush");
    expect(screen.getByRole("link", { name: "Browse all new sets" })).toHaveAttribute("href", "#shop-more");
    expect(document.querySelector(".weekly-set__peek")).not.toBeInTheDocument();
    expect(screen.queryByText("Up next")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".weekly-set-dots__dot")).toHaveLength(4);
    expect(screen.getAllByText("Golden Hour").length).toBeGreaterThan(0);
    expect(screen.queryByText(/Clean background placeholder/i)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pretty notes from customers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Quick answers" })).toBeInTheDocument();
  });

  it("moves through real weekly set carousel slides", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const weeklySet = document.querySelector(".weekly-set-card");
    expect(weeklySet).toBeInTheDocument();
    expect(screen.getByText("1 of 4")).toBeInTheDocument();
    expect(within(weeklySet as HTMLElement).getByRole("heading", { name: "Blush Crush" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next weekly set" }));

    const updatedWeeklySet = document.querySelector(".weekly-set-card");
    expect(screen.getByText("2 of 4")).toBeInTheDocument();
    expect(within(updatedWeeklySet as HTMLElement).getByRole("heading", { name: "Golden Hour" })).toBeInTheDocument();
    expect(within(updatedWeeklySet as HTMLElement).getByRole("link", { name: "Shop this set" })).toHaveAttribute("href", "#product-golden-hour");
  });

  it("lets shoppers browse Shop more as a two-card product carousel", async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    const shopMoreSection = document.querySelector("#shop-more");

    expect(screen.getByText("1 of 3")).toBeInTheDocument();
    expect(within(shopMoreSection as HTMLElement).getByText("Golden Hour")).toBeInTheDocument();
    expect(within(shopMoreSection as HTMLElement).getByText("Vacation Crush")).toBeInTheDocument();
    expect(within(shopMoreSection as HTMLElement).queryByText("Soft Serve")).not.toBeInTheDocument();
    expect((shopMoreSection as HTMLElement).querySelectorAll(".shop-more-carousel__card .product-card")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Next shop more product" }));

    expect(screen.getByText("2 of 3")).toBeInTheDocument();
    expect(within(shopMoreSection as HTMLElement).getByText("Vacation Crush")).toBeInTheDocument();
    expect(within(shopMoreSection as HTMLElement).getByText("Soft Serve")).toBeInTheDocument();
    expect(within(shopMoreSection as HTMLElement).queryByText("Golden Hour")).not.toBeInTheDocument();
  });

  it("shows the review carousel foundation", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(screen.getByText("Customer notes")).toBeInTheDocument();
    expect(screen.getByText("Easy fit")).toBeInTheDocument();
    expect(screen.getByText("Photo-ready")).toBeInTheDocument();
    expect(screen.getByText("Beginner friendly")).toBeInTheDocument();
    expect(screen.getByText("The set looked dressed up without feeling hard to wear.")).toBeInTheDocument();
    expect(screen.getByText("Everyday customer")).toBeInTheDocument();
    expect(screen.getAllByText("Date Night").length).toBeGreaterThan(0);
    expect(screen.getByText("Oval · Short")).toBeInTheDocument();
    expect(document.querySelectorAll(".review-dots__dot")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "See more reviews" })).toHaveAttribute("href", "#contact");

    await user.click(screen.getByRole("button", { name: "Next review" }));

    expect(screen.getByText("Pretty enough for photos, practical enough for the week.")).toBeInTheDocument();
    expect(screen.getByText("Beauty shopper")).toBeInTheDocument();
    expect(screen.getAllByText("Golden Hour").length).toBeGreaterThan(0);
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
