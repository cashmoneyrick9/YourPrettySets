import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { products, sizingKitProduct } from "../data/products";
import { shippingFacts } from "../data/storefrontFacts";
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

function dispatchPointerEvent(
  element: Element,
  type: string,
  options: { clientX: number; pointerId: number; pointerType: string }
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: options.clientX },
    pointerId: { value: options.pointerId },
    pointerType: { value: options.pointerType }
  });
  fireEvent(element, event);
}

function LocationProbe() {
  const location = useLocation();

  return <p>Current route: {location.pathname}</p>;
}

describe("ProductPage", () => {
  it("renders a base buying flow for the product slug", () => {
    renderProductPage();

    expect(screen.getByRole("main")).toHaveClass("product-page", "product-page--nail-set");
    const productImage = screen.getByRole("img", { name: `${products[0].name} image placeholder` });
    expect(productImage).toHaveClass("product-page__image-placeholder");
    expect(productImage).toBeEmptyDOMElement();
    expect(document.querySelector(".product-page__art")).not.toBeInTheDocument();
    expect(document.querySelector(".product-page__media .product-art__nail")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: products[0].name })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to shop" })).toBeInTheDocument();
    expect(screen.getByText("Ready to ship")).toBeInTheDocument();
    expect(screen.getByText(`$${products[0].price}`)).toBeInTheDocument();
    expect(screen.getByText(products[0].description)).toBeInTheDocument();
    expect(screen.getByText(`Ships in ${shippingFacts.readyToShipProcessing}`)).toBeInTheDocument();
    expect(document.querySelector(".product-page__visual-summary")).not.toBeInTheDocument();
    expect(document.querySelector(".product-page__swatch")).not.toBeInTheDocument();
    expect(document.querySelector(".product-page__availability-mark")).not.toBeInTheDocument();
    expect(document.querySelector(".product-page__summary-divider")).not.toBeInTheDocument();

    const lengthGroup = screen.getByRole("group", { name: "Length" });
    const shapeGroup = screen.getByRole("group", { name: "Shape" });

    for (const option of products[0].lengthOptions) {
      expect(within(lengthGroup).getByRole("button", { name: option })).toBeInTheDocument();
    }

    for (const option of products[0].shapeOptions) {
      expect(within(shapeGroup).getByRole("button", { name: option })).toBeInTheDocument();
    }

    const lengthSamples = lengthGroup.querySelectorAll(
      '.product-page__nail-sample[aria-hidden="true"][role="presentation"]'
    );
    const shapeSamples = shapeGroup.querySelectorAll(
      '.product-page__nail-sample[aria-hidden="true"][role="presentation"]'
    );

    expect(lengthSamples).toHaveLength(products[0].lengthOptions.length);
    expect(shapeSamples).toHaveLength(products[0].shapeOptions.length);
    expect(Array.from(lengthSamples).every((sample) => sample.tagName === "IMG")).toBe(true);
    expect(Array.from(shapeSamples).every((sample) => sample.tagName === "IMG")).toBe(true);
    expect(lengthSamples[0]).toHaveAttribute("src", "/assets/product-options/length-extra-short.png");
    expect(shapeSamples[0]).toHaveAttribute("src", "/assets/product-options/shape-almond.png");
    expect(document.querySelector(".product-page__option-placeholder")).not.toBeInTheDocument();
    expect(document.querySelector(".product-page__option-icon")).not.toBeInTheDocument();
    expect(document.querySelector(".product-page__nail-icon")).not.toBeInTheDocument();
    expect(within(lengthGroup).getByRole("button", { name: products[0].lengthOptions[0] })).toHaveAttribute("aria-pressed", "true");
    expect(within(shapeGroup).getByRole("button", { name: products[0].shapeOptions[0] })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Choose your style", level: 2 })).toBeInTheDocument();
    expect(within(lengthGroup).getAllByRole("button").map((button) => button.getAttribute("aria-label"))).toEqual([
      "Extra Short",
      "Short",
      "Medium",
      "Long",
      "Extra Long"
    ]);
    expect(screen.getByText("Almond · Extra Short")).toBeInTheDocument();
    expect(document.querySelector(".product-page__style-selection")).toHaveAttribute(
      "aria-label",
      "Selected style: Almond shape, Extra Short length"
    );
    expect(document.querySelector(".product-page__selected-summary")).not.toBeInTheDocument();
    const sizingLink = screen.getByRole("link", { name: "Not sure? Find your size" });
    expect(sizingLink).toHaveAttribute("href", "/help/sizing");
    expect(screen.queryByRole("link", { name: "View guide" })).not.toBeInTheDocument();
    expect(shapeGroup.compareDocumentPosition(lengthGroup) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(lengthGroup.compareDocumentPosition(sizingLink) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(document.querySelectorAll(".product-page__option-check")).toHaveLength(2);
    expect(shapeGroup.querySelector(".product-page__option-progress")).not.toHaveAttribute("hidden");
    expect(lengthGroup.querySelector(".product-page__option-progress")).not.toHaveAttribute("hidden");
    expect(lengthGroup.querySelector(".product-page__option-list")).toHaveClass(
      "product-page__option-list--scrollable"
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

  it.each(["Shape", "Length"])("updates the %s progress indicator as its option rail scrolls", (groupName) => {
    renderProductPage();

    const optionGroup = screen.getByRole("group", { name: groupName });
    const optionRail = optionGroup.querySelector(".product-page__option-list") as HTMLDivElement;
    const progressThumb = optionGroup.querySelector(".product-page__option-progress-thumb") as HTMLElement;

    Object.defineProperties(optionRail, {
      clientWidth: { configurable: true, value: 320 },
      scrollLeft: { configurable: true, value: 80, writable: true },
      scrollWidth: { configurable: true, value: 480 }
    });

    fireEvent.scroll(optionRail);

    expect(Number.parseFloat(progressThumb.style.width)).toBeCloseTo(66.67, 1);
    expect(Number.parseFloat(progressThumb.style.left)).toBeCloseTo(16.67, 1);
  });

  it("lets mouse users drag the shape rail without turning a drag into an option click", () => {
    renderProductPage();

    const shapeGroup = screen.getByRole("group", { name: "Shape" });
    const shapeRail = shapeGroup.querySelector(".product-page__option-list") as HTMLDivElement;
    const coffinButton = within(shapeGroup).getByRole("button", { name: "Coffin" });

    dispatchPointerEvent(shapeRail, "pointerdown", { clientX: 160, pointerId: 1, pointerType: "mouse" });
    dispatchPointerEvent(shapeRail, "pointermove", { clientX: 88, pointerId: 1, pointerType: "mouse" });

    expect(shapeRail.scrollLeft).toBe(72);
    expect(shapeRail).toHaveClass("product-page__option-list--dragging");

    dispatchPointerEvent(shapeRail, "pointerup", { clientX: 88, pointerId: 1, pointerType: "mouse" });
    fireEvent.click(coffinButton);

    expect(shapeRail).not.toHaveClass("product-page__option-list--dragging");
    expect(coffinButton).toHaveAttribute("aria-pressed", "false");
  });

  it("lets mouse users drag the overflowing length rail without changing the selection", () => {
    renderProductPage();

    const lengthGroup = screen.getByRole("group", { name: "Length" });
    const lengthRail = lengthGroup.querySelector(".product-page__option-list") as HTMLDivElement;
    const shortButton = within(lengthGroup).getByRole("button", { name: "Short" });

    dispatchPointerEvent(lengthRail, "pointerdown", { clientX: 160, pointerId: 2, pointerType: "mouse" });
    dispatchPointerEvent(lengthRail, "pointermove", { clientX: 88, pointerId: 2, pointerType: "mouse" });

    expect(lengthRail.scrollLeft).toBe(72);
    expect(lengthRail).toHaveClass("product-page__option-list--dragging");

    dispatchPointerEvent(lengthRail, "pointerup", { clientX: 88, pointerId: 2, pointerType: "mouse" });
    fireEvent.click(shortButton);

    expect(lengthRail).not.toHaveClass("product-page__option-list--dragging");
    expect(shortButton).toHaveAttribute("aria-pressed", "false");
    expect(within(lengthGroup).getByRole("button", { name: "Extra Short" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("places the back control before the product image", () => {
    renderProductPage();

    const backButton = screen.getByRole("button", { name: "Back to shop" });
    const productImage = screen.getByRole("img", { name: `${products[0].name} image placeholder` });

    expect(backButton.compareDocumentPosition(productImage) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("renders image thumbnails followed by a video and switches the active media", async () => {
    const user = userEvent.setup();
    renderProductPage();

    const gallery = screen.getByRole("region", { name: `${products[0].name} media gallery` });
    const mediaButtons = within(gallery).getAllByRole("button", { name: /^Show / });

    expect(mediaButtons).toHaveLength(3);
    expect(mediaButtons[0]).toHaveAccessibleName("Show clean product image");
    expect(mediaButtons[1]).toHaveAccessibleName("Show editorial product image");
    expect(mediaButtons[2]).toHaveAccessibleName("Show product video");
    expect(within(mediaButtons[2]).getByTestId("product-video-play-icon")).toBeInTheDocument();

    await user.click(mediaButtons[2]);

    const video = screen.getByLabelText(`${products[0].name} product video`);
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(video).not.toHaveAttribute("autoplay");
    expect(screen.queryByRole("button", { name: /^Zoom / })).not.toBeInTheDocument();
  });

  it("opens and closes the fullscreen image zoom view", async () => {
    const user = userEvent.setup();
    renderProductPage();

    await user.click(screen.getByRole("button", { name: `Zoom ${products[0].name} image` }));

    const zoomDialog = screen.getByRole("dialog", { name: `${products[0].name} image zoom` });
    expect(zoomDialog).toBeInTheDocument();
    expect(within(zoomDialog).getByRole("button", { name: "Zoom in" })).toBeInTheDocument();
    expect(within(zoomDialog).getByRole("button", { name: "Zoom out" })).toBeInTheDocument();
    expect(within(zoomDialog).getByRole("button", { name: "Reset zoom" })).toBeInTheDocument();

    await user.click(within(zoomDialog).getByRole("button", { name: "Zoom in" }));

    expect(within(zoomDialog).getByText("150%")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: `${products[0].name} image zoom` })).not.toBeInTheDocument();
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
    expect(screen.getByRole("heading", { name: "Quick answers" })).toBeInTheDocument();
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

    expect(within(lengthGroup).getByRole("button", { name: "Extra Short" })).toHaveAttribute("aria-pressed", "false");
    expect(within(lengthGroup).getByRole("button", { name: "Short" })).toHaveAttribute("aria-pressed", "false");
    expect(within(lengthGroup).getByRole("button", { name: "Medium" })).toHaveAttribute("aria-pressed", "true");
    expect(within(shapeGroup).getByRole("button", { name: "Almond" })).toHaveAttribute("aria-pressed", "false");
    expect(within(shapeGroup).getByRole("button", { name: "Coffin" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Coffin · Medium")).toBeInTheDocument();
    expect(document.querySelector(".product-page__style-selection")).toHaveAttribute(
      "aria-label",
      "Selected style: Coffin shape, Medium length"
    );
    expect(screen.getByRole("button", { name: `Favorite ${products[0].name}` })).toHaveAttribute("aria-pressed", "true");
  });

  it("labels made-to-order sets accurately without applying the ready-to-wear nail count", () => {
    const madeToOrderProduct = products.find((product) => product.orderType === "made-to-order");

    expect(madeToOrderProduct).toBeDefined();
    renderProductPage(`/products/${madeToOrderProduct?.slug}`);

    expect(screen.getByText("Made to order")).toBeInTheDocument();
    expect(screen.getByText(`Made in ${shippingFacts.madeToOrderProcessing}`)).toBeInTheDocument();
    expect(screen.getByRole("tabpanel", { name: "Nails" })).toHaveTextContent(
      "Press-on nails are included with every set."
    );
    expect(screen.queryByText(/Ready-to-wear sets include 24 press-on nails/i)).not.toBeInTheDocument();
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

  it("renders the standalone sizing-kit presentation without fake commerce controls", () => {
    renderProductPage(`/products/${sizingKitProduct.slug}`);

    expect(screen.getByRole("main")).toHaveClass("product-page--sizing-kit");
    expect(screen.getByRole("heading", { name: "Sizing Kit", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(`$${sizingKitProduct.price}`)).toBeInTheDocument();
    expect(screen.getByText(sizingKitProduct.description)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Sizing Kit image placeholder" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Sizing Kit purchase status" })).toHaveTextContent(
      "Online checkout coming soon"
    );
    expect(screen.getByText(/online purchasing is not connected yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Sizing kits connected to custom-set orders are free/i)).toBeInTheDocument();
    expect(screen.getByText(/Custom orders are waitlist-only/i)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Back to Find Your Fit" })).toHaveAttribute("href", "/help/sizing");
    expect(screen.getByRole("link", { name: "Read Find Your Fit" })).toHaveAttribute("href", "/help/sizing");
    expect(screen.getByRole("link", { name: "Join the custom-order waitlist" })).toHaveAttribute(
      "href",
      "/shop/custom-orders"
    );
    expect(screen.getByRole("link", { name: "Contact Support" })).toHaveAttribute("href", "/help/contact");

    expect(screen.queryByRole("button", { name: "Add to cart" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Favorite/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Length" })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Shape" })).not.toBeInTheDocument();
    expect(document.querySelector(".kit-section")).not.toBeInTheDocument();
    expect(document.querySelector(".faq-help-section")).not.toBeInTheDocument();
  });
});
