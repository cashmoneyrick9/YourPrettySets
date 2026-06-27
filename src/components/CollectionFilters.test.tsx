import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { products } from "../data/products";
import { CollectionFilters } from "./CollectionFilters";

afterEach(() => {
  cleanup();
});

describe("CollectionFilters", () => {
  function renderCollectionFilters() {
    return render(
      <BrowserRouter>
        <CollectionFilters />
      </BrowserRouter>
    );
  }

  it("starts Browse unselected, then shows collection products after selection", async () => {
    const user = userEvent.setup();
    renderCollectionFilters();

    expect(screen.getByRole("heading", { name: "Browse" })).toBeInTheDocument();

    for (const collection of ["Everyday", "Date Night", "Vacation", "Bridal", "Birthday", "Work/Neutral", "Statement"]) {
      expect(screen.getByRole("button", { name: collection })).toBeInTheDocument();
    }

    const seeAllLink = screen.getByRole("link", { name: "See all" });
    expect(seeAllLink).toHaveAttribute("href", "/shop");
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
    expect(document.querySelector(".collection-carousel")).toHaveAttribute("data-auto-rotate", "true");
    expect(document.querySelector(".collection-carousel")).toHaveAttribute("data-loop", "true");
    expect(document.querySelector(".collection-carousel")).toHaveAttribute("data-rotate-speed", "24");
    expect(document.querySelector(".collection-track")).toHaveClass("mobile-carousel__container");
    expect(screen.queryByRole("button", { name: "Previous collection" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next collection" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Go to collection/i })).not.toBeInTheDocument();
    expect(document.querySelector(".collection-carousel__hint")).toHaveTextContent("Swipe to explore");
    expect(screen.queryByText(/\d+ sets/)).not.toBeInTheDocument();
    for (const collection of ["Everyday", "Date Night", "Vacation", "Bridal", "Birthday", "Work/Neutral", "Statement"]) {
      expect(screen.getByRole("button", { name: collection })).toHaveAttribute("aria-pressed", "false");
    }
    expect(screen.queryByRole("heading", { name: "Everyday sets" })).not.toBeInTheDocument();
    expect(document.querySelector(".collection-products")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".collection-product-card__blank")).toHaveLength(0);

    await user.click(screen.getByRole("button", { name: "Bridal" }));

    const bridalProducts = products.filter((product) => product.collections.includes("Bridal")).slice(0, 4);
    const bridalCards = Array.from(document.querySelectorAll(".collection-product-row > .collection-product-card"));
    expect(document.querySelector(".collection-carousel")).not.toHaveAttribute("data-auto-rotate");
    expect(screen.getByRole("button", { name: "Everyday" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Bridal" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Bridal sets" })).toBeInTheDocument();
    expect(screen.getByText("6 available")).toBeInTheDocument();
    expect(bridalCards).toHaveLength(4);
    expect(bridalCards.map((card) => within(card as HTMLElement).getByRole("heading", { level: 3 }).textContent)).toEqual(
      bridalProducts.map((product) => product.name)
    );
    expect(document.querySelectorAll(".collection-product-row > .collection-product-card--placeholder")).toHaveLength(0);
    const bridalTeaser = document.querySelector(".collection-product-teaser") as HTMLElement;
    const bridalTeaserProducts = products.filter((product) => product.collections.includes("Bridal")).slice(4, 6);
    expect(bridalTeaser).toBeInTheDocument();
    expect(bridalTeaser).toHaveAttribute("aria-hidden", "true");
    expect(bridalTeaser.querySelectorAll(".collection-product-card")).toHaveLength(2);
    expect(bridalTeaser.textContent?.replace(/\s+/g, " ").trim()).toBe(
      bridalTeaserProducts.map((product) => `${product.name}$${product.price}`).join("")
    );
    for (const product of bridalProducts) {
      const card = screen.getByRole("link", { name: `View ${product.name}` });
      expect(card).toHaveAttribute("href", `/products/${product.slug}`);
      expect(within(card).getByRole("img", { name: product.images.clean })).toBeInTheDocument();
      expect(within(card).getByRole("heading", { name: product.name })).toBeInTheDocument();
      expect(within(card).getByText(`$${product.price}`)).toBeInTheDocument();
      expect(within(card).queryByText(product.description)).not.toBeInTheDocument();
    }
  });

  it("renders featured placeholder set cards below Browse before any collection is selected", () => {
    renderCollectionFilters();

    const browseHeading = screen.getByRole("heading", { name: "Browse" });
    const featuredHeading = screen.getByRole("heading", { name: "Featured sets" });
    expect(browseHeading.compareDocumentPosition(featuredHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(document.querySelector(".featured-sets-carousel")).toHaveClass("mobile-carousel");

    for (const name of ["Glazed Petal", "Sunset Sprinkle", "Pearl Wink", "Poolside Pop"]) {
      const card = screen.getByRole("link", { name: `View ${name}` });
      expect(card).toHaveAttribute("href", "/shop");
      expect(card).toHaveClass("featured-set-card");
      expect(within(card).getByRole("img", { name: `${name} placeholder image` })).toBeInTheDocument();
      expect(within(card).getByRole("heading", { name })).toBeInTheDocument();
    }
  });

  it("clears the selected collection when the selected tile is tapped again", async () => {
    const user = userEvent.setup();
    renderCollectionFilters();

    await user.click(screen.getByRole("button", { name: "Bridal" }));

    expect(screen.getByRole("button", { name: "Bridal" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Bridal sets" })).toBeInTheDocument();
    expect(document.querySelector(".collection-carousel")).not.toHaveAttribute("data-auto-rotate");

    await user.click(screen.getByRole("button", { name: "Bridal" }));

    expect(screen.getByRole("button", { name: "Bridal" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByRole("heading", { name: "Bridal sets" })).not.toBeInTheDocument();
    expect(document.querySelector(".collection-products")).not.toBeInTheDocument();
    expect(document.querySelector(".collection-carousel")).toHaveAttribute("data-auto-rotate", "true");
    expect(screen.getByRole("heading", { name: "Featured sets" })).toBeInTheDocument();
  });

  it("uses shared carousel behavior instead of custom pointer-drag handling", () => {
    renderCollectionFilters();

    const carousel = document.querySelector(".collection-carousel") as HTMLElement;
    const track = document.querySelector(".collection-track") as HTMLElement;

    expect(carousel).toHaveClass("mobile-carousel");
    expect(track).toHaveClass("mobile-carousel__container");
    expect(carousel).not.toHaveClass("collection-carousel--interacting");
  });

  it("passes home-origin state when a visible product card opens product detail", async () => {
    function ProductRouteStateProbe() {
      const location = useLocation();

      return <p>fromHome: {String((location.state as { fromHome?: boolean } | null)?.fromHome)}</p>;
    }

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<CollectionFilters />} />
          <Route path="/products/:slug" element={<ProductRouteStateProbe />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: "Everyday" }));
    await userEvent.click(screen.getByRole("link", { name: "View Blush Crush" }));

    expect(screen.getByText("fromHome: true")).toBeInTheDocument();
  });
});
