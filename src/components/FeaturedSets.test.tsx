import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { featuredProducts } from "../data/products";
import { FeaturedSets } from "./FeaturedSets";

afterEach(() => {
  cleanup();
});

describe("FeaturedSets", () => {
  it("renders real featured product cards with shared product preview behavior", () => {
    render(
      <BrowserRouter>
        <FeaturedSets />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: "Featured sets" })).toBeInTheDocument();
    expect(document.querySelector(".featured-sets-carousel")).toHaveClass("mobile-carousel");
    expect(document.querySelector(".featured-sets-carousel")).toHaveAttribute("data-auto-rotate", "true");
    expect(document.querySelector(".featured-sets-carousel")).toHaveAttribute("data-loop", "true");
    expect(document.querySelector(".featured-sets-carousel")).toHaveAttribute("data-rotate-speed", "24");
    expect(screen.queryByRole("heading", { name: "Browse" })).not.toBeInTheDocument();

    for (const product of featuredProducts) {
      const card = screen.getByRole("link", { name: `View ${product.name}` });
      expect(card).toHaveAttribute("href", `/products/${product.slug}`);
      expect(card).toHaveClass("featured-set-card");
      expect(within(card).getByRole("img", { name: product.images.clean })).toBeInTheDocument();
      expect(within(card).getByRole("heading", { name: product.name })).toBeInTheDocument();
      expect(within(card).getByText(`$${product.price}`)).toBeInTheDocument();
    }

    for (const name of ["Glazed Petal", "Sunset Sprinkle", "Pearl Wink", "Poolside Pop"]) {
      expect(screen.queryByRole("link", { name: `View ${name}` })).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name })).not.toBeInTheDocument();
    }
  });
});
