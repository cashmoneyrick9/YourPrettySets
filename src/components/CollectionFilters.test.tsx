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

  it("renders slim collection filters followed by products from the active collection", async () => {
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
    expect(screen.getByRole("button", { name: "Everyday" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Everyday sets" })).toBeInTheDocument();
    const everydayProducts = products.filter((product) => product.collections.includes("Everyday")).slice(0, 4);
    const everydayCards = Array.from(document.querySelectorAll(".collection-product-row > .collection-product-card"));
    expect(everydayCards).toHaveLength(4);
    expect(everydayCards.map((card) => within(card as HTMLElement).getByRole("heading", { level: 3 }).textContent)).toEqual(
      everydayProducts.map((product) => product.name)
    );
    for (const product of everydayProducts) {
      const card = screen.getByRole("link", { name: `View ${product.name}` });
      expect(card).toHaveAttribute("href", `/products/${product.slug}`);
      expect(card).toHaveClass("product-preview-card");
      expect(within(card).getByRole("img", { name: product.images.clean })).toBeInTheDocument();
      expect(within(card).getByRole("heading", { name: product.name })).toBeInTheDocument();
      expect(within(card).getByText(`$${product.price}`)).toBeInTheDocument();
      expect(within(card).queryByText(product.description)).not.toBeInTheDocument();
    }
    expect(document.querySelectorAll(".collection-product-row > .collection-product-card--placeholder")).toHaveLength(0);
    const everydayTeaser = document.querySelector(".collection-product-teaser") as HTMLElement;
    const seeMoreLink = screen.getByRole("link", { name: "See more" });
    const everydayTeaserProducts = products.filter((product) => product.collections.includes("Everyday")).slice(4, 6);
    expect(everydayTeaser).toBeInTheDocument();
    expect(everydayTeaser).toHaveAttribute("aria-hidden", "true");
    expect(everydayTeaser.compareDocumentPosition(seeMoreLink) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(everydayTeaser.querySelectorAll(".collection-product-card")).toHaveLength(2);
    expect(everydayTeaser.textContent?.replace(/\s+/g, " ").trim()).toBe(
      everydayTeaserProducts.map((product) => `${product.name}$${product.price}`).join("")
    );
    for (const product of everydayTeaserProducts) {
      expect(everydayTeaser).toHaveTextContent(product.name);
      expect(everydayTeaser).toHaveTextContent(`$${product.price}`);
    }
    expect(document.querySelectorAll(".collection-product-card__blank")).toHaveLength(0);
    expect(seeMoreLink).toHaveAttribute("href", "/shop");

    await user.click(screen.getByRole("button", { name: "Bridal" }));

    const bridalProducts = products.filter((product) => product.collections.includes("Bridal")).slice(0, 4);
    const bridalCards = Array.from(document.querySelectorAll(".collection-product-row > .collection-product-card"));
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

    await userEvent.click(screen.getByRole("link", { name: "View Blush Crush" }));

    expect(screen.getByText("fromHome: true")).toBeInTheDocument();
  });
});
