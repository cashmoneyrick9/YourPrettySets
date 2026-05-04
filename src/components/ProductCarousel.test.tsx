import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { newArrivals } from "../data/products";
import { ProductCarousel } from "./ProductCarousel";

describe("ProductCarousel", () => {
  it("renders a titled carousel with product cards", () => {
    render(<ProductCarousel title="New Arrivals" products={newArrivals} />);

    expect(screen.getByRole("heading", { name: "New Arrivals" })).toBeInTheDocument();
    expect(screen.getAllByRole("article").length).toBe(newArrivals.length);
  });
});
