import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FaqSection } from "./FaqSection";

afterEach(() => {
  cleanup();
});

describe("FaqSection", () => {
  it("renders the mobile-first help flow with Sizing selected by default", () => {
    render(<FaqSection />);

    const spareCarousel = screen.getByRole("region", { name: "Reusable blank carousel" });
    const heading = screen.getByRole("heading", { name: "How Can We Help?" });
    expect(spareCarousel.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    expect(screen.getByRole("heading", { name: "How Can We Help?" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "FAQ & Help" })).not.toBeInTheDocument();
    expect(screen.queryByText("Need help?")).not.toBeInTheDocument();
    expect(screen.queryByText("Find quick answers to the most common questions.")).not.toBeInTheDocument();

    for (const topic of ["Sizing", "Application", "Wear & Care", "Shipping", "Returns", "Removal", "Custom Orders"]) {
      expect(screen.getByRole("button", { name: topic })).toBeInTheDocument();
    }

    expect(screen.getByRole("button", { name: "Sizing" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Top questions in Sizing" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "How do I measure my nails?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Can I resize after I place my order?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all sizing questions" })).toHaveAttribute("href", "#help-center");

    const helpCenterCard = screen.getByRole("region", { name: "Help Center" });
    expect(within(helpCenterCard).getByRole("heading", { name: "Need more detail?" })).toBeInTheDocument();
    const helpCenterLink = within(helpCenterCard).getByRole("link", { name: "Visit Help Center" });
    expect(helpCenterLink).toHaveAttribute("href", "#help-center");
    expect(helpCenterLink).toHaveClass("faq-cta-card__button", "faq-cta-card__button--outline");
    expect(helpCenterLink).toHaveAttribute("data-slot", "button");

    const supportCard = screen.getByRole("region", { name: "Contact Support" });
    expect(within(supportCard).getByRole("heading", { name: "Still need help?" })).toBeInTheDocument();
    const supportLink = within(supportCard).getByRole("link", { name: "Contact Support" });
    expect(supportLink).toHaveAttribute("href", "#contact");
    expect(supportLink).toHaveClass("faq-cta-card__button", "faq-cta-card__button--filled");
    expect(supportLink).toHaveAttribute("data-slot", "button");
  });

  it("keeps Custom Orders as a standard topic card", () => {
    render(<FaqSection />);

    const customOrdersCard = screen.getByRole("button", { name: "Custom Orders" });

    expect(customOrdersCard).toHaveClass("faq-topic-card");
    expect(customOrdersCard).not.toHaveClass("faq-topic-card--wide");
  });

  it("updates the quick questions when a shopper chooses another topic", async () => {
    const user = userEvent.setup();
    render(<FaqSection />);

    await user.click(screen.getByRole("button", { name: "Shipping" }));

    expect(screen.getByRole("button", { name: "Sizing" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Shipping" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Top questions in Shipping" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "When will my order ship?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all shipping questions" })).toHaveAttribute("href", "#help-center");
  });

  it("lets shoppers drag the topic carousel with a mouse without selecting a card", () => {
    render(<FaqSection />);

    const track = document.querySelector(".faq-topic-grid") as HTMLElement;
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

    expect(track).toHaveClass("faq-topic-grid--dragging");
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

    expect(track).not.toHaveClass("faq-topic-grid--dragging");
    expect(releasePointerCapture).toHaveBeenCalledWith(1);

    const applicationCard = screen.getByRole("button", { name: "Application" });
    expect(applicationCard.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }))).toBe(false);
    expect(screen.getByRole("heading", { name: "Top questions in Sizing" })).toBeInTheDocument();
  });

  it("keeps touch swipes native in the topic carousel", () => {
    render(<FaqSection />);

    const track = document.querySelector(".faq-topic-grid") as HTMLElement;
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

    expect(track).not.toHaveClass("faq-topic-grid--dragging");
    expect(setPointerCapture).not.toHaveBeenCalled();

    let preventDefault: ReturnType<typeof vi.spyOn>;
    act(() => {
      preventDefault = dispatchPointer("pointermove", 40);
    });

    expect(preventDefault!).not.toHaveBeenCalled();
    expect(track.scrollLeft).toBe(100);
  });

  it("opens a quick answer when a shopper taps a question", async () => {
    const user = userEvent.setup();
    render(<FaqSection />);

    const measuringQuestion = screen.getByRole("button", { name: "How do I measure my nails?" });

    expect(measuringQuestion).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/Measure the widest part of each natural nail/i)).not.toBeInTheDocument();

    await user.click(measuringQuestion);

    expect(measuringQuestion).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Measure the widest part of each natural nail/i)).toBeInTheDocument();
  });

  it("closes the open answer when a shopper chooses a different topic", async () => {
    const user = userEvent.setup();
    render(<FaqSection />);

    await user.click(screen.getByRole("button", { name: "How do I measure my nails?" }));
    expect(screen.getByText(/Measure the widest part of each natural nail/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Application" }));

    expect(screen.queryByText(/Measure the widest part of each natural nail/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "How do I apply press-on nails?" })).toHaveAttribute("aria-expanded", "false");
  });
});
