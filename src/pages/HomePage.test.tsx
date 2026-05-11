import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "./HomePage";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
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
    expect(screen.getAllByText("01 Pick your set")).toHaveLength(2);
    expect(screen.getAllByText("Find the look you want")).toHaveLength(2);
    expect(screen.getByText("02 Choose your wear")).toBeInTheDocument();
    expect(screen.getByText("03 Press on pretty")).toBeInTheDocument();
    expect(document.querySelectorAll(".confidence-card__visual")).toHaveLength(4);
    expect(document.querySelectorAll(".confidence-card__visual-frame")).toHaveLength(4);
    expect(document.querySelector(".confidence-carousel__track")).toBeInTheDocument();
    expect(document.querySelector(".confidence-card--peek")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".confidence-dots__dot")).toHaveLength(0);
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

  it("auto-rotates the step strip calmly and stops after shopper interaction", () => {
    vi.useFakeTimers();
    render(<HomePage />);

    expect(screen.queryByRole("button", { name: "Next step" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Previous step" })).not.toBeInTheDocument();
    expect(document.querySelectorAll(".confidence-dots__dot")).toHaveLength(0);
    expect(screen.getAllByText("01 Pick your set")).toHaveLength(2);
    expect(screen.getByText("02 Choose your wear")).toBeInTheDocument();
    expect(document.querySelector(".confidence-carousel")).toHaveAttribute("data-active-step", "01");

    act(() => {
      vi.advanceTimersByTime(5200);
    });

    expect(document.querySelector(".confidence-carousel")).toHaveAttribute("data-active-step", "02");

    const carousel = document.querySelector(".confidence-carousel");
    expect(carousel).toBeInTheDocument();
    act(() => {
      carousel?.dispatchEvent(new Event("pointerdown", { bubbles: true }));
      vi.advanceTimersByTime(10400);
    });

    expect(document.querySelector(".confidence-carousel")).toHaveAttribute("data-active-step", "02");
  });

  it("lets keyboard shoppers move the step strip and pauses automatic rotation", () => {
    vi.useFakeTimers();
    render(<HomePage />);

    const carousel = document.querySelector(".confidence-carousel") as HTMLElement;
    carousel.focus();
    act(() => {
      carousel.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    });

    expect(carousel).toHaveAttribute("data-active-step", "02");

    act(() => {
      vi.advanceTimersByTime(10400);
    });

    expect(carousel).toHaveAttribute("data-active-step", "02");
  });

  it("renders equal-size carousel cards with a cloned first card for the soft loop", () => {
    vi.useFakeTimers();
    render(<HomePage />);

    expect(document.querySelectorAll(".confidence-card")).toHaveLength(4);
    expect(document.querySelectorAll(".confidence-card--loop-clone")).toHaveLength(1);
    expect(document.querySelectorAll(".confidence-card__visual-frame")).toHaveLength(4);
    expect(document.querySelector(".confidence-card__tray")).toBeInTheDocument();
    expect(document.querySelector(".confidence-card__glue")).toBeInTheDocument();
    expect(document.querySelector(".confidence-card__tabs")).toBeInTheDocument();
    expect(document.querySelector(".confidence-card__hand")).toBeInTheDocument();
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
