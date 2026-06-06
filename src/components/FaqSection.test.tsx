import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { FaqSection } from "./FaqSection";

afterEach(() => {
  cleanup();
});

describe("FaqSection", () => {
  it("renders the mobile-first help flow with no topic selected by default", () => {
    render(<FaqSection />);

    const heading = screen.getByRole("heading", { name: "How Can We Help?" });
    expect(screen.queryByRole("region", { name: "Reusable blank carousel" })).not.toBeInTheDocument();

    expect(heading).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "FAQ & Help" })).not.toBeInTheDocument();
    expect(screen.queryByText("Need help?")).not.toBeInTheDocument();
    expect(screen.queryByText("Find quick answers to the most common questions.")).not.toBeInTheDocument();

    for (const topic of ["Sizing", "Application", "Wear & Care", "Shipping", "Returns", "Removal", "Custom Orders"]) {
      expect(screen.getByRole("button", { name: topic })).toBeInTheDocument();
    }

    expect(document.querySelector(".faq-topic-carousel")).toHaveClass("mobile-carousel");
    expect(document.querySelector(".faq-topic-carousel")).not.toHaveAttribute("data-auto-rotate");
    expect(document.querySelector(".faq-topic-carousel")).toHaveAttribute("data-loop", "true");
    expect(document.querySelector(".faq-topic-carousel")).not.toHaveAttribute("data-rotate-speed");
    expect(document.querySelector(".faq-topic-grid")).toHaveClass("mobile-carousel__container");
    expect(screen.queryByRole("button", { name: "Previous help topic" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next help topic" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Go to help topic/i })).not.toBeInTheDocument();
    expect(document.querySelector(".faq-topic-carousel__dots")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Top questions in/i })).not.toBeInTheDocument();
    expect(document.querySelector(".faq-question-list")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "How do I measure my nails?" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /View all/i })).not.toBeInTheDocument();

    expect(screen.queryByRole("heading", { name: "Need more detail?" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Still need help?" })).not.toBeInTheDocument();
    expect(screen.queryByText("Browse our Help Center for full guides and tips.")).not.toBeInTheDocument();
    expect(screen.queryByText("Contact our team — we’re here for you!")).not.toBeInTheDocument();

    const supportFooter = screen.getByRole("region", { name: "FAQ support" });
    expect(within(supportFooter).queryByText("Find answers fast — or message us anytime.")).not.toBeInTheDocument();
    expect(supportFooter.querySelector(".faq-support-footer__divider")).not.toBeInTheDocument();

    const helpCenterLink = within(supportFooter).getByRole("link", { name: "Visit Help Center" });
    expect(helpCenterLink).toHaveAttribute("href", "#help-center");
    expect(helpCenterLink).toHaveClass("faq-support-footer__button");
    expect(helpCenterLink).toHaveAttribute("data-slot", "button");

    const supportLink = within(supportFooter).getByRole("link", { name: "Contact Support" });
    expect(supportLink).toHaveAttribute("href", "mailto:hello@yourprettysets.com");
    expect(supportLink).toHaveClass("faq-support-footer__contact");
    expect(supportLink).not.toHaveAttribute("data-slot", "button");
  });

  it("renders text-only chunky topic tabs", () => {
    render(<FaqSection />);

    const customOrdersCard = screen.getByRole("button", { name: "Custom Orders" });

    expect(customOrdersCard).toHaveClass("faq-topic-card");
    expect(customOrdersCard).not.toHaveClass("faq-topic-card--wide");
    expect(customOrdersCard.querySelector("svg")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".faq-topic-card svg")).toHaveLength(0);
  });

  it("updates the quick questions when a shopper chooses another topic", async () => {
    const user = userEvent.setup();
    render(<FaqSection />);

    await user.click(screen.getByRole("button", { name: "Shipping" }));

    expect(screen.getByRole("button", { name: "Sizing" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Shipping" })).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".faq-topic-carousel")).not.toHaveAttribute("data-auto-rotate");
    expect(screen.getByRole("heading", { name: "Top questions in Shipping" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "When will my order ship?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all shipping questions" })).toHaveAttribute("href", "#help-center");
  });

  it("minimizes the quick questions when the active topic is tapped again", async () => {
    const user = userEvent.setup();
    render(<FaqSection />);

    await user.click(screen.getByRole("button", { name: "Sizing" }));

    expect(document.querySelector(".faq-topic-carousel")).not.toHaveAttribute("data-auto-rotate");
    expect(screen.getByRole("heading", { name: "Top questions in Sizing" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sizing" }));

    expect(screen.getByRole("button", { name: "Sizing" })).toHaveAttribute("aria-pressed", "false");
    expect(document.querySelector(".faq-topic-carousel")).not.toHaveAttribute("data-auto-rotate");
    expect(screen.queryByRole("heading", { name: "Top questions in Sizing" })).not.toBeInTheDocument();
  });

  it("uses shared carousel behavior instead of custom topic drag handling", () => {
    render(<FaqSection />);

    const carousel = document.querySelector(".faq-topic-carousel") as HTMLElement;
    const track = document.querySelector(".faq-topic-grid") as HTMLElement;

    expect(carousel).toHaveClass("mobile-carousel");
    expect(track).toHaveClass("mobile-carousel__container");
    expect(track).not.toHaveClass("faq-topic-grid--dragging");
  });

  it("opens one quick answer at a time when a shopper taps questions", async () => {
    const user = userEvent.setup();
    render(<FaqSection />);

    await user.click(screen.getByRole("button", { name: "Sizing" }));

    const measuringQuestion = screen.getByRole("button", { name: "How do I measure my nails?" });
    const betweenSizesQuestion = screen.getByRole("button", { name: "What if I’m between sizes?" });

    expect(measuringQuestion).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/Measure the widest part of each natural nail/i)).not.toBeInTheDocument();

    await user.click(measuringQuestion);

    expect(measuringQuestion).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Measure the widest part of each natural nail/i)).toBeInTheDocument();

    await user.click(betweenSizesQuestion);

    expect(measuringQuestion).toHaveAttribute("aria-expanded", "false");
    expect(betweenSizesQuestion).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByText(/Measure the widest part of each natural nail/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Choose the slightly larger size/i)).toBeInTheDocument();
  });

  it("closes the open answer when a shopper chooses a different topic", async () => {
    const user = userEvent.setup();
    render(<FaqSection />);

    await user.click(screen.getByRole("button", { name: "Sizing" }));
    await user.click(screen.getByRole("button", { name: "How do I measure my nails?" }));
    expect(screen.getByText(/Measure the widest part of each natural nail/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Application" }));

    expect(screen.queryByText(/Measure the widest part of each natural nail/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "How do I apply press-on nails?" })).toHaveAttribute("aria-expanded", "false");
  });
});
