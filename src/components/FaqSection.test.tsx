import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { FaqSection } from "./FaqSection";

afterEach(() => {
  cleanup();
});

describe("FaqSection", () => {
  it("renders default homepage FAQ questions immediately", () => {
    render(<FaqSection />);

    expect(screen.getByRole("heading", { name: "Questions before you order" })).toBeInTheDocument();
    expect(screen.getByText("Quick answers on sizing, wear time, application, and custom orders.")).toBeInTheDocument();

    for (const question of [
      "How do I know my size?",
      "How long do press-ons last?",
      "Can I reuse them?",
      "Should I use glue or tabs?",
      "How long does my order take?",
      "Do you take custom orders?",
      "What if my set does not fit?"
    ]) {
      expect(screen.getByRole("button", { name: question })).toBeInTheDocument();
    }

    expect(screen.queryByRole("heading", { name: "How Can We Help?" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Top questions in/i })).not.toBeInTheDocument();
  });

  it("removes the topic carousel and category selection behavior", () => {
    render(<FaqSection />);

    expect(document.querySelector(".faq-topic-carousel")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-topic-card")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-topic-grid")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-topic-slide")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Choose a help topic" })).not.toBeInTheDocument();

    for (const oldTopic of ["Sizing", "Application", "Wear & Care", "Shipping", "Returns", "Removal"]) {
      expect(screen.queryByRole("button", { name: oldTopic })).not.toBeInTheDocument();
    }

    expect(screen.queryByRole("link", { name: /View all .* questions/i })).not.toBeInTheDocument();
  });

  it("renders the CTAs inside one cohesive light FAQ card", () => {
    render(<FaqSection />);

    const faqCard = document.querySelector(".faq-card");
    const header = faqCard?.querySelector(".faq-card__header");
    const actions = faqCard?.querySelector(".faq-card__actions") as HTMLElement;
    const contactLink = within(actions).getByRole("link", { name: "Contact Support" });
    const fullFaqLink = within(actions).getByRole("link", { name: "View Full FAQ" });

    expect(faqCard).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(faqCard?.querySelector(".faq-card__copy")).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "mailto:hello@yourprettysets.com");
    expect(fullFaqLink).toHaveAttribute("href", "#faq");
    expect(contactLink).toHaveClass("faq-card__primary-link");
    expect(fullFaqLink).toHaveClass("faq-card__secondary-link");
    expect(screen.getAllByRole("link", { name: "Contact Support" })).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: "View Full FAQ" })).toHaveLength(1);
    expect(screen.queryByRole("region", { name: "FAQ intro" })).not.toBeInTheDocument();
    expect(document.querySelector(".faq-help__visual")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-help__visual-oval")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-question-card")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-trust-strip")).not.toBeInTheDocument();
  });

  it("renders a light trust row with understated inline icons", () => {
    render(<FaqSection />);

    const trustRow = screen.getByRole("list", { name: "FAQ trust notes" });

    expect(trustRow).toHaveClass("faq-trust-row");

    for (const item of [
      ["Salon Quality", "Long-lasting wear", "shield"],
      ["Fast Shipping", "Quick & reliable", "truck"],
      ["Loved by Customers", "Easy to wear", "heart"]
    ]) {
      const trustItem = within(trustRow).getByText(item[0]).closest("li");
      expect(trustItem).toBeInTheDocument();
      expect(within(trustItem as HTMLElement).getByText(item[1])).toBeInTheDocument();
      expect((trustItem as HTMLElement).querySelector(`[data-faq-trust-icon="${item[2]}"]`)).toBeInTheDocument();
    }
  });

  it("keeps the FAQ accordion keyboard-accessible with one open answer at a time", async () => {
    const user = userEvent.setup();
    render(<FaqSection />);

    const sizingQuestion = screen.getByRole("button", { name: "How do I know my size?" });
    const wearQuestion = screen.getByRole("button", { name: "How long do press-ons last?" });

    expect(sizingQuestion).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/Use a sizing kit for the safest fit/i)).not.toBeInTheDocument();

    sizingQuestion.focus();
    await user.keyboard("{Enter}");

    expect(sizingQuestion).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Use a sizing kit for the safest fit/i)).toBeInTheDocument();

    await user.click(wearQuestion);

    expect(sizingQuestion).toHaveAttribute("aria-expanded", "false");
    expect(wearQuestion).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByText(/Use a sizing kit for the safest fit/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Wear time depends on prep and adhesive/i)).toBeInTheDocument();
  });
});
