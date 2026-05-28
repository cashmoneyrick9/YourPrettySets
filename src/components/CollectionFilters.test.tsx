import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { CollectionFilters } from "./CollectionFilters";

afterEach(() => {
  cleanup();
});

describe("CollectionFilters", () => {
  it("renders slim collection filters followed by products from the active collection", async () => {
    const user = userEvent.setup();
    render(<CollectionFilters />);

    expect(screen.getByRole("heading", { name: "Browse" })).toBeInTheDocument();

    for (const collection of ["Everyday", "Date Night", "Vacation", "Bridal", "Birthday", "Work/Neutral", "Statement"]) {
      expect(screen.getByRole("button", { name: collection })).toBeInTheDocument();
    }

    const seeAllLink = screen.getByRole("link", { name: "See all" });
    expect(seeAllLink).toHaveAttribute("href", "#collection-products");
    expect(seeAllLink).toHaveClass("collection-heading__link");
    expect(seeAllLink).toHaveAttribute("data-slot", "button");
    expect(screen.queryByRole("link", { name: "New Arrivals" })).not.toBeInTheDocument();
    expect(screen.queryByText("Soft sets for daily wear")).not.toBeInTheDocument();
    expect(screen.queryByText("Shop Everyday")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".collection-card__visual")).toHaveLength(0);
    expect(document.querySelectorAll(".collection-card__mood")).toHaveLength(0);
    expect(document.querySelectorAll(".collection-card__nail-preview")).toHaveLength(0);
    expect(document.querySelectorAll(".collection-pagination__dot")).toHaveLength(0);
    expect(document.querySelector(".collection-pagination")).not.toBeInTheDocument();
    expect(document.querySelector(".collection-carousel")).toHaveClass("mobile-carousel");
    expect(document.querySelector(".collection-track")).toHaveClass("mobile-carousel__container");
    expect(screen.queryByRole("button", { name: "Previous collection" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next collection" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Go to collection/i })).not.toBeInTheDocument();
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

  it("uses shared carousel behavior instead of custom pointer-drag handling", () => {
    render(<CollectionFilters />);

    const carousel = document.querySelector(".collection-carousel") as HTMLElement;
    const track = document.querySelector(".collection-track") as HTMLElement;

    expect(carousel).toHaveClass("mobile-carousel");
    expect(track).toHaveClass("mobile-carousel__container");
    expect(carousel).not.toHaveClass("collection-carousel--interacting");
  });
});
