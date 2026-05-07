import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { products } from "../data/products";
import { ProductCard } from "./ProductCard";

describe("ProductCard", () => {
  it("shows product art without visible placeholder copy", () => {
    render(<ProductCard product={products[0]} />);

    expect(screen.getByText(products[0].name)).toBeInTheDocument();
    expect(screen.getByText("$18")).toBeInTheDocument();
    expect(screen.getByLabelText(products[0].images.clean)).toBeInTheDocument();
    expect(screen.queryByText(products[0].images.clean)).not.toBeInTheDocument();
    expect(document.querySelectorAll(".product-art__nail")).toHaveLength(5);
    expect(screen.queryByText(products[0].description)).not.toBeInTheDocument();
    for (const collection of products[0].collections) {
      expect(screen.queryByText(collection)).not.toBeInTheDocument();
    }
  });
});
