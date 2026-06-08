import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { products } from "../data/products";
import { ProductPreviewCard } from "./ProductPreviewCard";

afterEach(() => {
  cleanup();
});

describe("ProductPreviewCard", () => {
  it("renders a minimal catalog card without product descriptions", () => {
    render(
      <BrowserRouter>
        <ProductPreviewCard product={products[0]} />
      </BrowserRouter>
    );

    const card = screen.getByRole("link", { name: `View ${products[0].name}` });

    expect(card).toHaveClass("shop-product-card");
    expect(card).toHaveClass("product-preview-card");
    expect(card).toHaveAttribute("href", `/products/${products[0].slug}`);
    expect(within(card).getByRole("img", { name: products[0].images.clean })).toBeEmptyDOMElement();
    expect(within(card).getByRole("heading", { name: products[0].name })).toBeInTheDocument();
    expect(within(card).getByText(`$${products[0].price}`)).toBeInTheDocument();
    expect(within(card).queryByText(products[0].description)).not.toBeInTheDocument();
  });

  it("passes shop-origin state when opening a shop product detail page", async () => {
    function ProductRouteStateProbe() {
      const location = useLocation();

      return <p>fromShop: {String((location.state as { fromShop?: boolean } | null)?.fromShop)}</p>;
    }

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductPreviewCard product={products[0]} />} />
          <Route path="/products/:slug" element={<ProductRouteStateProbe />} />
        </Routes>
      </BrowserRouter>
    );

    await userEvent.click(screen.getByRole("link", { name: `View ${products[0].name}` }));

    expect(screen.getByText("fromShop: true")).toBeInTheDocument();
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
