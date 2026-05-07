import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

afterEach(() => {
  cleanup();
});

describe("HomePage", () => {
  it("renders the mobile shopping path before product shopping", () => {
    render(<HomePage />);

    const hero = screen.getByRole("heading", { name: "Ready-to-wear sets for pretty plans" });
    const confidence = screen.getByRole("heading", { name: "Ready in three steps" });
    const collections = screen.getByRole("heading", { name: "Browse by the plan, mood, or moment." });
    const weeklySet = screen.getByRole("heading", { name: "This week's set" });
    const shopMore = screen.getByRole("heading", { name: "Shop more" });
    const included = screen.getByRole("heading", { name: "Everything ready for your set." });

    expect(hero).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop sets" })).toHaveAttribute("href", "#shop-collections");
    expect(screen.getByText("Pick your set")).toBeInTheDocument();
    expect(screen.getByText("Find the look you want")).toBeInTheDocument();
    expect(screen.queryByText("Choose your wear")).not.toBeInTheDocument();
    expect(screen.queryByText("Press on pretty")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".confidence-card__visual")).toHaveLength(1);
    expect(document.querySelectorAll(".confidence-dots__dot")).toHaveLength(3);
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
    expect(screen.getByText("Soft pink, ready for everyday plans.")).toBeInTheDocument();
    expect(screen.getByText("1 of 4")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop this set" })).toHaveAttribute("href", "#product-blush-crush");
    expect(screen.getByRole("link", { name: "Browse all new sets" })).toHaveAttribute("href", "#shop-more");
    expect(document.querySelector(".weekly-set__peek")).toBeInTheDocument();
    expect(screen.getByText("Golden Hour")).toBeInTheDocument();
    expect(screen.getByText("Vacation Crush")).toBeInTheDocument();
    expect(screen.getByText("Soft Serve")).toBeInTheDocument();
    expect(screen.queryByText(/Clean background placeholder/i)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pretty notes from customers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Quick answers" })).toBeInTheDocument();
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
    expect(screen.getByRole("link", { name: "See more reviews" })).toHaveAttribute("href", "#reviews");

    await user.click(screen.getByRole("button", { name: "Next review" }));

    expect(screen.getByText("Pretty enough for photos, practical enough for the week.")).toBeInTheDocument();
    expect(screen.getByText("Beauty shopper")).toBeInTheDocument();
    expect(screen.getAllByText("Golden Hour").length).toBeGreaterThan(0);
  });

  it("switches the step carousel with arrows", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "Next step" }));

    expect(screen.getByText("Choose your wear")).toBeInTheDocument();
    expect(screen.getByText("Glue or tabs")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous step" }));

    expect(screen.getByText("Pick your set")).toBeInTheDocument();
    expect(screen.getByText("Find the look you want")).toBeInTheDocument();
  });

  it("links FAQ teaser questions to the future FAQ page", () => {
    render(<HomePage />);

    expect(screen.getByRole("link", { name: "What comes with each set?" })).toHaveAttribute("href", "/faq");
    expect(screen.getByRole("link", { name: "How long do press-ons last?" })).toHaveAttribute("href", "/faq");
    expect(screen.getByRole("link", { name: "Can I reuse them?" })).toHaveAttribute("href", "/faq");
  });
});
