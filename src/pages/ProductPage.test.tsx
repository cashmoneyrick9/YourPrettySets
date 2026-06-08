import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { products } from "../data/products";
import { ProductPage } from "./ProductPage";

afterEach(() => {
  cleanup();
  window.history.pushState({}, "", "/");
});

function renderProductPage(path = `/products/${products[0].slug}`) {
  window.history.pushState({}, "", path);

  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/products/:slug" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function LocationProbe() {
  const location = useLocation();

  return <p>Current route: {location.pathname}</p>;
}

describe("ProductPage", () => {
  it("renders a base buying flow for the product slug", () => {
    renderProductPage();

    expect(screen.getByRole("main")).toHaveClass("product-page");
    expect(screen.getByRole("img", { name: products[0].images.clean })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: products[0].name })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to shop" })).toBeInTheDocument();
    expect(screen.getByText(`$${products[0].price}`)).toBeInTheDocument();
    expect(screen.getByText(products[0].description)).toBeInTheDocument();

    const lengthGroup = screen.getByRole("group", { name: "Length" });
    const shapeGroup = screen.getByRole("group", { name: "Shape" });

    for (const option of products[0].lengthOptions) {
      expect(within(lengthGroup).getByRole("button", { name: option })).toBeInTheDocument();
    }

    for (const option of products[0].shapeOptions) {
      expect(within(shapeGroup).getByRole("button", { name: option })).toBeInTheDocument();
    }

    expect(within(lengthGroup).getByRole("button", { name: products[0].lengthOptions[0] })).toHaveAttribute("aria-pressed", "true");
    expect(within(shapeGroup).getByRole("button", { name: products[0].shapeOptions[0] })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("group", { name: /size/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: /adhesive|glue|tabs/i })).not.toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Add to cart" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: `Favorite ${products[0].name}` })).toHaveAttribute("aria-pressed", "false");

    for (const detail of [
      "Made to order",
      "Choose length + shape",
      "Sizing handled separately",
      "10 handmade nails",
      "Reusable with tabs",
      "Handmade finish"
    ]) {
      expect(screen.getByText(detail)).toBeInTheDocument();
    }
    expect(screen.getAllByText("Prep kit included")).toHaveLength(2);
  });

  it("updates selected length, selected shape, and favorite state", async () => {
    const user = userEvent.setup();
    renderProductPage();

    const lengthGroup = screen.getByRole("group", { name: "Length" });
    const shapeGroup = screen.getByRole("group", { name: "Shape" });

    await user.click(within(lengthGroup).getByRole("button", { name: "Medium" }));
    await user.click(within(shapeGroup).getByRole("button", { name: "Coffin" }));
    await user.click(screen.getByRole("button", { name: `Favorite ${products[0].name}` }));

    expect(within(lengthGroup).getByRole("button", { name: "Short" })).toHaveAttribute("aria-pressed", "false");
    expect(within(lengthGroup).getByRole("button", { name: "Medium" })).toHaveAttribute("aria-pressed", "true");
    expect(within(shapeGroup).getByRole("button", { name: "Almond" })).toHaveAttribute("aria-pressed", "false");
    expect(within(shapeGroup).getByRole("button", { name: "Coffin" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: `Favorite ${products[0].name}` })).toHaveAttribute("aria-pressed", "true");
  });

  it("uses browser history when the product was opened from Shop", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[
          "/shop",
          {
            pathname: `/products/${products[0].slug}`,
            state: { fromShop: true }
          }
        ]}
        initialIndex={1}
      >
        <Routes>
          <Route path="/shop" element={<LocationProbe />} />
          <Route path="/products/:slug" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Back to shop" }));

    expect(screen.getByText("Current route: /shop")).toBeInTheDocument();
  });

  it("falls back to Shop when opened directly without shop-origin state", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={[`/products/${products[0].slug}`]}>
        <Routes>
          <Route path="/shop" element={<LocationProbe />} />
          <Route path="/products/:slug" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Back to shop" }));

    expect(screen.getByText("Current route: /shop")).toBeInTheDocument();
  });

  it("shows a not-found state for unknown product slugs", () => {
    renderProductPage("/products/not-a-real-set");

    expect(screen.getByRole("heading", { name: "Set not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to shop" })).toHaveAttribute("href", "/shop");
  });
});
