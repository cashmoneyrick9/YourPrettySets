import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { products } from "../data/products";
import { ProductPreviewCard } from "./ProductPreviewCard";

describe("ProductPreviewCard", () => {
  it("renders a minimal catalog card without product descriptions", () => {
    render(<ProductPreviewCard product={products[0]} />);

    const card = document.querySelector(".shop-product-card") as HTMLElement;

    expect(card).toHaveClass("product-preview-card");
    expect(within(card).getByRole("img", { name: products[0].images.clean })).toBeEmptyDOMElement();
    expect(within(card).getByRole("heading", { name: products[0].name })).toBeInTheDocument();
    expect(within(card).getByText(`$${products[0].price}`)).toBeInTheDocument();
    expect(within(card).queryByText(products[0].description)).not.toBeInTheDocument();
  });

  it("renders a compact linked homepage preview card", () => {
    render(<ProductPreviewCard href={`#product-${products[0].slug}`} product={products[0]} variant="home" />);

    const card = screen.getByRole("link", { name: `View ${products[0].name}` });

    expect(card).toHaveClass("collection-product-card");
    expect(card).toHaveClass("product-preview-card--home");
    expect(card).toHaveAttribute("href", `#product-${products[0].slug}`);
    expect(within(card).getByRole("img", { name: products[0].images.clean })).toBeEmptyDOMElement();
    expect(within(card).getByRole("heading", { name: products[0].name })).toBeInTheDocument();
    expect(within(card).getByText(`$${products[0].price}`)).toBeInTheDocument();
    expect(within(card).queryByText(products[0].description)).not.toBeInTheDocument();
  });
});
