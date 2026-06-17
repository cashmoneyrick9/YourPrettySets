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
    const productImage = screen.getByRole("img", { name: `${products[0].name} image placeholder` });
    expect(productImage).toHaveClass("product-page__image-placeholder");
    expect(productImage).toBeEmptyDOMElement();
    expect(document.querySelector(".product-page__art")).not.toBeInTheDocument();
    expect(document.querySelector(".product-page__media .product-art__nail")).not.toBeInTheDocument();
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

    const lengthPlaceholders = lengthGroup.querySelectorAll(
      '.product-page__option-placeholder[aria-hidden="true"][role="presentation"]'
    );
    const shapePlaceholders = shapeGroup.querySelectorAll(
      '.product-page__option-placeholder[aria-hidden="true"][role="presentation"]'
    );

    expect(lengthPlaceholders).toHaveLength(products[0].lengthOptions.length);
    expect(shapePlaceholders).toHaveLength(products[0].shapeOptions.length);
    expect(document.querySelector(".product-page__option-icon")).not.toBeInTheDocument();
    expect(document.querySelector(".product-page__nail-icon")).not.toBeInTheDocument();
    expect(within(lengthGroup).getByRole("button", { name: products[0].lengthOptions[0] })).toHaveAttribute("aria-pressed", "true");
    expect(within(shapeGroup).getByRole("button", { name: products[0].shapeOptions[0] })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Selected style")).toBeInTheDocument();
    expect(screen.getByText("Short length · Almond shape")).toBeInTheDocument();
    expect(document.querySelector(".product-page__selected-summary")).toHaveAttribute(
      "aria-label",
      "Selected style: Short length, Almond shape"
    );
    expect(screen.queryByRole("group", { name: /size/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: /adhesive|glue|tabs/i })).not.toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Add to cart" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: `Favorite ${products[0].name}` })).toHaveAttribute("aria-pressed", "false");

    for (const removedDetail of [
      "Made to order",
      "Prep kit included",
      "Choose length + shape",
      "Sizing handled separately",
      "Set details",
      "10 handmade nails",
      "Reusable with tabs",
      "Handmade finish"
    ]) {
      expect(screen.queryByText(removedDetail)).not.toBeInTheDocument();
    }
    expect(document.querySelector(".product-page__reassurance")).not.toBeInTheDocument();
    expect(document.querySelector(".product-page__details")).not.toBeInTheDocument();
  });

  it("places the back control before the product image", () => {
    renderProductPage();

    const backButton = screen.getByRole("button", { name: "Back to shop" });
    const productImage = screen.getByRole("img", { name: `${products[0].name} image placeholder` });

    expect(backButton.compareDocumentPosition(productImage) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("renders kit contents and FAQ below the main buying panel", () => {
    renderProductPage();

    const buyingPanel = document.querySelector(".product-page__buying-panel") as HTMLElement;
    const kitSection = document.querySelector(".kit-section") as HTMLElement;
    const faqSection = document.querySelector(".faq-help-section") as HTMLElement;

    expect(buyingPanel).toBeInTheDocument();
    expect(kitSection).toBeInTheDocument();
    expect(faqSection).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What’s Included" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Questions before you order" })).toBeInTheDocument();
    expect(buyingPanel.compareDocumentPosition(kitSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(kitSection.compareDocumentPosition(faqSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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
    expect(screen.getByText("Medium length · Coffin shape")).toBeInTheDocument();
    expect(document.querySelector(".product-page__selected-summary")).toHaveAttribute(
      "aria-label",
      "Selected style: Medium length, Coffin shape"
    );
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

  it("uses browser history when the product was opened from Home", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[
          "/",
          {
            pathname: `/products/${products[0].slug}`,
            state: { fromHome: true }
          }
        ]}
        initialIndex={1}
      >
        <Routes>
          <Route path="/" element={<LocationProbe />} />
          <Route path="/products/:slug" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Back to shop" }));

    expect(screen.getByText("Current route: /")).toBeInTheDocument();
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
