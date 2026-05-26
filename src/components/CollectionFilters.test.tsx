import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CollectionFilters } from "./CollectionFilters";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function setCollectionCardMetrics(track: HTMLElement) {
  track.style.columnGap = "20px";
  Object.defineProperty(track, "clientWidth", { configurable: true, value: 280 });
  document.querySelectorAll<HTMLElement>(".collection-card").forEach((card, index) => {
    Object.defineProperty(card, "offsetWidth", { configurable: true, value: 280 });
    Object.defineProperty(card, "offsetLeft", { configurable: true, value: index * 300 });
  });
}

describe("CollectionFilters", () => {
  it("renders slim collection filters followed by products from the active collection", async () => {
    const user = userEvent.setup();
    render(<CollectionFilters />);

    expect(screen.getByRole("heading", { name: "Browse" })).toBeInTheDocument();

    for (const collection of ["Everyday", "Date Night", "Vacation", "Bridal", "Birthday", "Work/Neutral", "Statement"]) {
      expect(screen.getByRole("button", { name: collection })).toBeInTheDocument();
    }

    expect(screen.getByRole("link", { name: "See all" })).toHaveAttribute("href", "#collection-products");
    expect(screen.queryByRole("link", { name: "New Arrivals" })).not.toBeInTheDocument();
    expect(screen.queryByText("Soft sets for daily wear")).not.toBeInTheDocument();
    expect(screen.queryByText("Shop Everyday")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".collection-card__visual")).toHaveLength(0);
    expect(document.querySelectorAll(".collection-card__mood")).toHaveLength(0);
    expect(document.querySelectorAll(".collection-card__nail-preview")).toHaveLength(0);
    expect(document.querySelectorAll(".collection-pagination__dot")).toHaveLength(7);
    expect(document.querySelector(".collection-carousel__hint")).toHaveTextContent("Swipe to explore");
    expect(screen.queryByText(/\d+ sets/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Everyday" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Everyday sets" })).toBeInTheDocument();
    expect(document.querySelectorAll(".collection-product-row > .collection-product-card")).toHaveLength(4);
    expect(document.querySelectorAll(".collection-product-row > .collection-product-card--placeholder")).toHaveLength(0);
    expect(document.querySelectorAll(".collection-product-teaser")).toHaveLength(1);
    expect(document.querySelectorAll(".collection-product-teaser .collection-product-card")).toHaveLength(2);
    expect(document.querySelector(".collection-product-teaser")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link", { name: "View Soft Serve" })).toHaveAttribute("href", "#product-soft-serve");
    expect(screen.queryByRole("heading", { name: "Soft Serve" })).not.toBeInTheDocument();
    expect(screen.queryByText("$20")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".collection-product-card .product-card")).toHaveLength(0);
    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "#");

    await user.click(screen.getByRole("button", { name: "Bridal" }));

    expect(screen.getByRole("button", { name: "Bridal" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Bridal sets" })).toBeInTheDocument();
    expect(screen.getByText("2 available")).toBeInTheDocument();
    expect(document.querySelectorAll(".collection-product-row > .collection-product-card")).toHaveLength(4);
    expect(document.querySelectorAll(".collection-product-row > .collection-product-card--placeholder")).toHaveLength(2);
    expect(document.querySelectorAll(".collection-product-teaser .collection-product-card")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "View Something Blue" })).toHaveAttribute("href", "#product-something-blue");
    expect(screen.queryByRole("heading", { name: "Something Blue" })).not.toBeInTheDocument();
    expect(screen.queryByText("$36")).not.toBeInTheDocument();
  });

  it("lets shoppers grab the collection track with a mouse and drag it horizontally", () => {
    render(<CollectionFilters />);

    const carousel = document.querySelector(".collection-carousel") as HTMLElement;
    const track = document.querySelector(".collection-track") as HTMLElement;
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.defineProperty(track, "setPointerCapture", { configurable: true, value: setPointerCapture });
    Object.defineProperty(track, "releasePointerCapture", { configurable: true, value: releasePointerCapture });
    track.scrollLeft = 100;

    const dispatchPointer = (type: string, clientX: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, "clientX", { value: clientX });
      Object.defineProperty(event, "pointerId", { value: 1 });
      Object.defineProperty(event, "pointerType", { value: "mouse" });
      const preventDefault = vi.spyOn(event, "preventDefault");
      track.dispatchEvent(event);
      return preventDefault;
    };

    act(() => {
      dispatchPointer("pointerdown", 200);
    });

    expect(carousel).toHaveClass("collection-carousel--interacting");
    expect(setPointerCapture).toHaveBeenCalledWith(1);

    let preventDefault: ReturnType<typeof vi.spyOn>;
    act(() => {
      preventDefault = dispatchPointer("pointermove", 40);
    });

    expect(preventDefault!).toHaveBeenCalled();
    expect(track.scrollLeft).toBe(260);

    act(() => {
      dispatchPointer("pointerup", 40);
    });

    expect(carousel).not.toHaveClass("collection-carousel--interacting");
    expect(releasePointerCapture).toHaveBeenCalledWith(1);

    const firstCard = screen.getByRole("button", { name: "Everyday" });
    expect(firstCard.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }))).toBe(false);
    expect(firstCard.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }))).toBe(true);
  });

  it("settles a mouse drag smoothly to the nearest card and updates the active progress dot", () => {
    render(<CollectionFilters />);

    const track = document.querySelector(".collection-track") as HTMLElement;
    setCollectionCardMetrics(track);
    const scrollTo = vi.fn(({ left }: ScrollToOptions) => {
      track.scrollLeft = Number(left);
      track.dispatchEvent(new Event("scroll", { bubbles: true }));
    });
    Object.defineProperty(track, "scrollTo", { configurable: true, value: scrollTo });
    track.scrollLeft = 100;

    const dispatchPointer = (type: string, clientX: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, "clientX", { value: clientX });
      Object.defineProperty(event, "pointerId", { value: 1 });
      Object.defineProperty(event, "pointerType", { value: "mouse" });
      track.dispatchEvent(event);
    };

    act(() => {
      dispatchPointer("pointerdown", 200);
      dispatchPointer("pointermove", 40);
      dispatchPointer("pointerup", 40);
    });

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth", left: 300 }));
    expect(document.querySelectorAll(".collection-pagination__dot")[1]).toHaveClass(
      "collection-pagination__dot--active"
    );
  });

  it("updates the progress dot as native scrolling moves between collection cards", () => {
    render(<CollectionFilters />);

    const track = document.querySelector(".collection-track") as HTMLElement;
    setCollectionCardMetrics(track);

    act(() => {
      track.scrollLeft = 600;
      track.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    const dots = document.querySelectorAll(".collection-pagination__dot");
    expect(dots[0]).not.toHaveClass("collection-pagination__dot--active");
    expect(dots[2]).toHaveClass("collection-pagination__dot--active");
  });

  it("glides native scroll to the nearest card after scrolling settles", () => {
    vi.useFakeTimers();
    render(<CollectionFilters />);

    const track = document.querySelector(".collection-track") as HTMLElement;
    setCollectionCardMetrics(track);
    const scrollTo = vi.fn(({ left }: ScrollToOptions) => {
      track.scrollLeft = Number(left);
    });
    Object.defineProperty(track, "scrollTo", { configurable: true, value: scrollTo });

    act(() => {
      track.scrollLeft = 470;
      track.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    expect(scrollTo).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(119);
    });

    expect(scrollTo).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth", left: 600 }));
    expect(document.querySelectorAll(".collection-pagination__dot")[2]).toHaveClass(
      "collection-pagination__dot--active"
    );
  });

  it("keeps touch swipes native instead of forcing mouse-style dragging", () => {
    render(<CollectionFilters />);

    const carousel = document.querySelector(".collection-carousel") as HTMLElement;
    const track = document.querySelector(".collection-track") as HTMLElement;
    const setPointerCapture = vi.fn();
    Object.defineProperty(track, "setPointerCapture", { configurable: true, value: setPointerCapture });
    track.scrollLeft = 100;

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

    expect(carousel).not.toHaveClass("collection-carousel--interacting");
    expect(setPointerCapture).not.toHaveBeenCalled();

    let preventDefault: ReturnType<typeof vi.spyOn>;
    act(() => {
      preventDefault = dispatchPointer("pointermove", 40);
    });

    expect(preventDefault!).not.toHaveBeenCalled();
    expect(track.scrollLeft).toBe(100);
  });
});
