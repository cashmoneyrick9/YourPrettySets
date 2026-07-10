import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { productPageFaqItems } from "../data/helpContent";
import { FaqSection } from "./FaqSection";

afterEach(() => {
  cleanup();
});

describe("FaqSection", () => {
  function renderFaqSection() {
    return render(
      <BrowserRouter>
        <FaqSection />
      </BrowserRouter>
    );
  }

  it("renders the approved Product-page FAQ subset immediately", () => {
    renderFaqSection();

    expect(screen.getByRole("heading", { name: "Questions before you order" })).toBeInTheDocument();
    expect(screen.getByText("Answers on sizing, wear estimates, application, and ordering.")).toBeInTheDocument();

    for (const item of productPageFaqItems) {
      expect(screen.getByRole("button", { name: item.question })).toBeInTheDocument();
    }

    expect(screen.queryByRole("heading", { name: "How Can We Help?" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Top questions in/i })).not.toBeInTheDocument();
  });

  it("removes the topic carousel and category selection behavior", () => {
    renderFaqSection();

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

  it("renders the CTAs inside a full-bleed image header above the FAQ list", () => {
    renderFaqSection();

    const faqHelp = document.querySelector(".faq-help");
    const imageHeader = document.querySelector(".faq-image-header") as HTMLElement;
    const faqCard = document.querySelector(".faq-card");
    const actions = imageHeader.querySelector(".faq-card__actions") as HTMLElement;
    const contactLink = within(actions).getByRole("link", { name: "Contact Support" });
    const fullFaqLink = within(actions).getByRole("link", { name: "View Full FAQ" });

    expect(imageHeader.parentElement).not.toBe(faqHelp);
    expect(imageHeader.nextElementSibling).toBe(faqHelp);
    expect(faqHelp?.firstElementChild).toBe(faqCard);
    expect(faqCard).toBeInTheDocument();
    expect(imageHeader).toBeInTheDocument();
    expect(imageHeader.querySelector(".faq-card__copy")).toBeInTheDocument();
    expect(faqCard?.querySelector(".faq-card__copy")).not.toBeInTheDocument();
    expect(faqCard?.querySelector(".faq-card__actions")).not.toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/help/contact");
    expect(fullFaqLink).toHaveAttribute("href", "/help/faq");
    expect(contactLink).toHaveClass("faq-card__primary-link");
    expect(fullFaqLink).toHaveClass("faq-card__secondary-link");
    expect(screen.getAllByRole("link", { name: "Contact Support" })).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: "View Full FAQ" })).toHaveLength(1);
    expect(screen.queryByRole("region", { name: "FAQ intro" })).not.toBeInTheDocument();
    expect(document.querySelector(".faq-card__header--image")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-help__visual")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-help__visual-oval")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-question-card")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-trust-strip")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-trust-row")).not.toBeInTheDocument();
  });

  it("does not render trust badges in the compact Product-page FAQ", () => {
    renderFaqSection();

    expect(screen.queryByRole("list", { name: "FAQ trust notes" })).not.toBeInTheDocument();
    expect(screen.queryByText("Salon Quality")).not.toBeInTheDocument();
    expect(screen.queryByText("Fast Shipping")).not.toBeInTheDocument();
    expect(screen.queryByText("Loved by Customers")).not.toBeInTheDocument();
    expect(document.querySelector("[data-faq-trust-icon]")).not.toBeInTheDocument();
  });

  it("keeps the FAQ accordion keyboard-accessible with one open answer at a time", async () => {
    const user = userEvent.setup();
    renderFaqSection();

    const [sizingItem, wearItem] = productPageFaqItems;
    const sizingQuestion = screen.getByRole("button", { name: sizingItem.question });
    const wearQuestion = screen.getByRole("button", { name: wearItem.question });

    expect(sizingQuestion).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(sizingItem.answer)).not.toBeInTheDocument();

    sizingQuestion.focus();
    await user.keyboard("{Enter}");

    expect(sizingQuestion).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(sizingItem.answer)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: sizingItem.relatedLink.label })).toHaveAttribute(
      "href",
      sizingItem.relatedLink.href
    );

    await user.click(wearQuestion);

    expect(sizingQuestion).toHaveAttribute("aria-expanded", "false");
    expect(wearQuestion).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByText(sizingItem.answer)).not.toBeInTheDocument();
    expect(screen.getByText(wearItem.answer)).toBeInTheDocument();
  });

  it("renders the canonical related guide link for every product FAQ answer", async () => {
    const user = userEvent.setup();
    renderFaqSection();

    for (const item of productPageFaqItems) {
      await user.click(screen.getByRole("button", { name: item.question }));

      expect(screen.getByText(item.answer)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: item.relatedLink.label })).toHaveAttribute(
        "href",
        item.relatedLink.href
      );
    }
  });
});
