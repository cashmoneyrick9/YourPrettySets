import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { featuredProducts, newArrivals, products } from "../data/products";
import { HomeCollections } from "./HomeCollections";

afterEach(() => {
  cleanup();
});

describe("HomeCollections", () => {
  function renderHomeCollections() {
    return render(
      <BrowserRouter>
        <HomeCollections />
      </BrowserRouter>
    );
  }

  it("starts Browse unselected, then shows shopping-path products after selection", async () => {
    const user = userEvent.setup();
    renderHomeCollections();

    expect(screen.getByRole("heading", { name: "Browse" })).toBeInTheDocument();
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Featured sets" })).not.toBeInTheDocument();

    for (const option of ["Ready to Ship", "Made to Order", "Custom Orders", "New Arrivals", "Best Sellers"]) {
      expect(screen.getByRole("button", { name: option })).toBeInTheDocument();
    }
    for (const oldCollection of ["Everyday", "Date Night", "Vacation", "Bridal", "Birthday", "Work/Neutral", "Statement"]) {
      expect(screen.queryByRole("button", { name: oldCollection })).not.toBeInTheDocument();
    }

    const seeAllLink = screen.getByRole("link", { name: "See all" });
    expect(seeAllLink).toHaveAttribute("href", "/shop");
    expect(seeAllLink).toHaveClass("collection-heading__link");
    expect(seeAllLink).toHaveAttribute("data-slot", "button");
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
    expect(screen.queryByRole("button", { name: "Previous shopping option" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next shopping option" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Go to shopping option/i })).not.toBeInTheDocument();
    expect(document.querySelector(".collection-carousel__hint")).toHaveTextContent("Swipe to explore");
    expect(screen.queryByText(/\d+ sets/)).not.toBeInTheDocument();
    for (const option of ["Ready to Ship", "Made to Order", "Custom Orders", "New Arrivals", "Best Sellers"]) {
      expect(screen.getByRole("button", { name: option })).toHaveAttribute("aria-pressed", "false");
    }
    expect(screen.queryByRole("heading", { name: "Ready to Ship sets" })).not.toBeInTheDocument();
    expect(document.querySelector(".collection-products")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".collection-product-card__blank")).toHaveLength(0);

    await user.click(screen.getByRole("button", { name: "Ready to Ship" }));

    const readyToShipProducts = products.filter((product) => product.orderType === "ready-to-ship").slice(0, 4);
    const collectionProductRow = document.querySelector(".collection-product-row") as HTMLElement;
    const previewCards = Array.from(document.querySelectorAll(".collection-product-row > .collection-product-card"));
    expect(document.querySelector(".collection-carousel")).not.toHaveAttribute("data-auto-rotate");
    expect(screen.getByRole("button", { name: "Made to Order" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Ready to Ship" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Ready to Ship sets" })).toBeInTheDocument();
    expect(screen.getByText(`${products.filter((product) => product.orderType === "ready-to-ship").length} available`)).toBeInTheDocument();
    expect(collectionProductRow).toBeInTheDocument();
    expect(previewCards).toHaveLength(4);
    expect(previewCards.map((card) => within(card as HTMLElement).getByRole("heading", { level: 3 }).textContent)).toEqual(
      readyToShipProducts.map((product) => product.name)
    );
    expect(document.querySelectorAll(".collection-product-row > .collection-product-card--placeholder")).toHaveLength(0);
    const readyTeaser = document.querySelector(".collection-product-teaser") as HTMLElement;
    const readyTeaserProducts = products.filter((product) => product.orderType === "ready-to-ship").slice(4, 6);
    expect(readyTeaser).toBeInTheDocument();
    expect(readyTeaser).toHaveAttribute("aria-hidden", "true");
    expect(readyTeaser.querySelectorAll(".collection-product-card")).toHaveLength(2);
    expect(readyTeaser.textContent?.replace(/\s+/g, " ").trim()).toBe(
      readyTeaserProducts.map((product) => `${product.name}$${product.price}`).join("")
    );
    for (const product of readyToShipProducts) {
      const card = within(collectionProductRow).getByRole("link", { name: `View ${product.name}` });
      expect(card).toHaveAttribute("href", `/products/${product.slug}`);
      expect(within(card).getByRole("img", { name: product.images.clean })).toBeInTheDocument();
      expect(within(card).getByRole("heading", { name: product.name })).toBeInTheDocument();
      expect(within(card).getByText(`$${product.price}`)).toBeInTheDocument();
      expect(within(card).queryByText(product.description)).not.toBeInTheDocument();
    }
  });

  it("previews made-to-order, new arrival, and best-seller products from existing product data", async () => {
    const user = userEvent.setup();
    renderHomeCollections();

    await user.click(screen.getByRole("button", { name: "Made to Order" }));
    expect(screen.getByRole("heading", { name: "Made to Order sets" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "/shop/made-to-order");
    expect(
      Array.from(document.querySelectorAll(".collection-product-row > .collection-product-card h3")).map((heading) => heading.textContent)
    ).toEqual(products.filter((product) => product.orderType === "made-to-order").slice(0, 4).map((product) => product.name));

    await user.click(screen.getByRole("button", { name: "New Arrivals" }));
    expect(screen.getByRole("heading", { name: "New Arrivals sets" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "/shop?collection=New%20Arrivals");
    expect(
      Array.from(document.querySelectorAll(".collection-product-row > .collection-product-card h3")).map((heading) => heading.textContent)
    ).toEqual(newArrivals.slice(0, 4).map((product) => product.name));

    await user.click(screen.getByRole("button", { name: "Best Sellers" }));
    expect(screen.getByRole("heading", { name: "Best Sellers sets" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "/shop");
    expect(
      Array.from(document.querySelectorAll(".collection-product-row > .collection-product-card h3")).map((heading) => heading.textContent)
    ).toEqual(featuredProducts.slice(0, 4).map((product) => product.name));
  });

  it("shows a custom-order preview without fake product cards", async () => {
    const user = userEvent.setup();
    renderHomeCollections();

    await user.click(screen.getByRole("button", { name: "Custom Orders" }));

    expect(screen.getByRole("button", { name: "Custom Orders" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Custom Orders" })).toBeInTheDocument();
    expect(screen.getByText("Design request preview")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "/shop/custom-orders");
    expect(document.querySelector(".collection-product-row")).not.toBeInTheDocument();
    expect(document.querySelector(".collection-product-teaser")).not.toBeInTheDocument();
  });

  it("clears the selected collection when the selected tile is tapped again", async () => {
    const user = userEvent.setup();
    renderHomeCollections();

    await user.click(screen.getByRole("button", { name: "Ready to Ship" }));

    expect(screen.getByRole("button", { name: "Ready to Ship" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Ready to Ship sets" })).toBeInTheDocument();
    expect(document.querySelector(".collection-carousel")).not.toHaveAttribute("data-auto-rotate");

    await user.click(screen.getByRole("button", { name: "Ready to Ship" }));

    expect(screen.getByRole("button", { name: "Ready to Ship" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByRole("heading", { name: "Ready to Ship sets" })).not.toBeInTheDocument();
    expect(document.querySelector(".collection-products")).not.toBeInTheDocument();
    expect(document.querySelector(".collection-carousel")).toHaveAttribute("data-auto-rotate", "true");
    expect(screen.queryByRole("heading", { name: "Featured sets" })).not.toBeInTheDocument();
  });

  it("links shopping-path options to their destinations", async () => {
    const user = userEvent.setup();
    renderHomeCollections();

    await user.click(screen.getByRole("button", { name: "Ready to Ship" }));

    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "/shop/ready-to-ship");

    await user.click(screen.getByRole("button", { name: "Made to Order" }));

    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "/shop/made-to-order");
  });

  it("uses shared carousel behavior instead of custom pointer-drag handling", () => {
    renderHomeCollections();

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
          <Route path="/" element={<HomeCollections />} />
          <Route path="/products/:slug" element={<ProductRouteStateProbe />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: "Ready to Ship" }));
    await userEvent.click(within(document.querySelector(".collection-product-row") as HTMLElement).getByRole("link", { name: "View Blush Crush" }));

    expect(screen.getByText("fromHome: true")).toBeInTheDocument();
  });
});
