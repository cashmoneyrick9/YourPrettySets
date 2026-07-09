import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import type { ComponentProps } from "react";
import { products } from "../data/products";
import { ShopPage } from "./ShopPage";

afterEach(() => {
  cleanup();
});

function getCatalogCards() {
  return document.querySelectorAll(".shop-product-card");
}

function renderShopPage(props?: ComponentProps<typeof ShopPage>) {
  return render(
    <BrowserRouter>
      <ShopPage {...props} />
    </BrowserRouter>
  );
}

function renderShopPageAt(route: string, props?: ComponentProps<typeof ShopPage>) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ShopPage {...props} />
    </MemoryRouter>
  );
}

function dispatchPointerEvent(element: Element, type: string, options: { clientX: number; pointerId: number; pointerType: string }) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: options.clientX },
    pointerId: { value: options.pointerId },
    pointerType: { value: options.pointerType }
  });
  fireEvent(element, event);
}

describe("ShopPage", () => {
  it("renders the full Shop All catalog before filtering", () => {
    renderShopPage();

    expect(document.querySelector("#shop")).toHaveClass("shop-page");
    expect(document.querySelector("#shop")).not.toHaveClass("storefront-barebones");
    expect(screen.getByRole("heading", { name: "Shop All" })).toBeInTheDocument();
    expect(products).toHaveLength(33);
    expect(screen.getByText("33 sets")).toBeInTheDocument();
    expect(getCatalogCards()).toHaveLength(33);
    expect(screen.getByPlaceholderText("Search sets")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort Newest" })).toBeInTheDocument();
    expect(screen.queryByRole("radiogroup", { name: "Sort sets" })).not.toBeInTheDocument();
  });

  it("renders only ready-to-ship products on the Ready to Ship category page", () => {
    const readyProducts = products.filter((product) => product.orderType === "ready-to-ship");
    const madeToOrderProducts = products.filter((product) => product.orderType === "made-to-order");

    renderShopPage({ orderType: "ready-to-ship" });

    expect(screen.getByRole("heading", { name: "Ready to Ship" })).toBeInTheDocument();
    expect(screen.getByText(`${readyProducts.length} sets`)).toBeInTheDocument();
    expect(getCatalogCards()).toHaveLength(readyProducts.length);

    for (const product of readyProducts) {
      expect(screen.getByRole("heading", { name: product.name })).toBeInTheDocument();
    }

    for (const product of madeToOrderProducts) {
      expect(screen.queryByRole("heading", { name: product.name })).not.toBeInTheDocument();
    }
  });

  it("renders only made-to-order products on the Made to Order category page", () => {
    const readyProducts = products.filter((product) => product.orderType === "ready-to-ship");
    const madeToOrderProducts = products.filter((product) => product.orderType === "made-to-order");

    renderShopPage({ orderType: "made-to-order" });

    expect(screen.getByRole("heading", { name: "Made to Order" })).toBeInTheDocument();
    expect(screen.getByText(`${madeToOrderProducts.length} sets`)).toBeInTheDocument();
    expect(getCatalogCards()).toHaveLength(madeToOrderProducts.length);

    for (const product of madeToOrderProducts) {
      expect(screen.getByRole("heading", { name: product.name })).toBeInTheDocument();
    }

    for (const product of readyProducts) {
      expect(screen.queryByRole("heading", { name: product.name })).not.toBeInTheDocument();
    }
  });

  it("does not use custom orders as product metadata", () => {
    const orderTypes = products.map((product) => product.orderType) as string[];

    expect(products.some((product) => product.orderType === "ready-to-ship")).toBe(true);
    expect(products.some((product) => product.orderType === "made-to-order")).toBe(true);
    expect(orderTypes).not.toContain("custom-orders");
  });

  it("filters catalog products by search text", async () => {
    const user = userEvent.setup();
    renderShopPage();

    await user.type(screen.getByPlaceholderText("Search sets"), "sea");

    expect(screen.getByText("2 sets")).toBeInTheDocument();
    expect(screen.getByText('2 sets found for "sea"')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sea Glass" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Seashell Pearl" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Blush Crush" })).not.toBeInTheDocument();
  });

  it("lets shoppers clear an active search without changing other controls", async () => {
    const user = userEvent.setup();
    renderShopPage();

    const searchInput = screen.getByPlaceholderText("Search sets");
    await user.type(searchInput, "bridal");

    expect(screen.getByRole("button", { name: 'Clear search for "bridal"' })).toBeInTheDocument();
    expect(screen.getByText('6 sets found for "bridal"')).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: 'Clear search for "bridal"' }));

    expect(searchInput).toHaveValue("");
    expect(screen.getByText("33 sets")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Clear search for/ })).not.toBeInTheDocument();
  });

  it("keeps the empty search state free of fake suggestion chips", () => {
    renderShopPage();

    expect(screen.getByPlaceholderText("Search sets")).toHaveValue("");
    expect(screen.queryByRole("button", { name: /Search pink/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Search bridal/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Suggested searches")).not.toBeInTheDocument();
  });

  it("matches structured collection fields without starter chips", async () => {
    const user = userEvent.setup();
    renderShopPage();

    await user.type(screen.getByPlaceholderText("Search sets"), "bridal");

    expect(screen.getByPlaceholderText("Search sets")).toHaveValue("bridal");
    expect(screen.getByText("6 sets")).toBeInTheDocument();
    expect(screen.getByText('6 sets found for "bridal"')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Something Blue" })).toBeInTheDocument();
  });

  it("shows a useful empty state when search has no matches", async () => {
    const user = userEvent.setup();
    renderShopPage();

    await user.type(screen.getByPlaceholderText("Search sets"), "zebra");

    expect(screen.getByText('No sets found for "zebra"')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
    expect(getCatalogCards()).toHaveLength(0);
  });

  it("does not match placeholder product descriptions", async () => {
    const user = userEvent.setup();
    renderShopPage();

    await user.type(screen.getByPlaceholderText("Search sets"), "glow");

    expect(screen.getByText('No sets found for "glow"')).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Blush Crush" })).not.toBeInTheDocument();
  });

  it("filters catalog products from the collection tab rail", async () => {
    const user = userEvent.setup();
    renderShopPage();

    await user.click(screen.getByRole("button", { name: "Bridal" }));

    expect(screen.getByRole("button", { name: "Bridal" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("6 sets")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Something Blue" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Lace Veil" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Vacation Crush" })).not.toBeInTheDocument();
  });

  it("starts with the matching collection tab active from the collection query param", async () => {
    const user = userEvent.setup();
    const vacationProducts = products.filter((product) => product.collections.includes("Vacation"));
    renderShopPageAt("/shop?collection=Vacation");

    expect(screen.getByRole("button", { name: "Vacation" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText(`${vacationProducts.length} sets`)).toBeInTheDocument();
    expect(getCatalogCards()).toHaveLength(vacationProducts.length);
    expect(screen.getByRole("heading", { name: "Vacation Crush" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Lace Veil" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "All" }));

    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("33 sets")).toBeInTheDocument();
  });

  it("starts with encoded collection names active from the collection query param", () => {
    const workNeutralProducts = products.filter((product) => product.collections.includes("Work/Neutral"));
    renderShopPageAt("/shop?collection=Work%2FNeutral");

    expect(screen.getByRole("button", { name: "Work/Neutral" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText(`${workNeutralProducts.length} sets`)).toBeInTheDocument();
    expect(getCatalogCards()).toHaveLength(workNeutralProducts.length);
  });

  it("defaults to All when the collection query param is invalid", () => {
    renderShopPageAt("/shop?collection=Not%20Real");

    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("33 sets")).toBeInTheDocument();
    expect(getCatalogCards()).toHaveLength(33);
  });

  it("applies valid collection query params on category shop routes", () => {
    const readyVacationProducts = products.filter(
      (product) => product.orderType === "ready-to-ship" && product.collections.includes("Vacation")
    );
    renderShopPageAt("/shop/ready-to-ship?collection=Vacation", { orderType: "ready-to-ship" });

    expect(screen.getByRole("heading", { name: "Ready to Ship" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Vacation" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(`${readyVacationProducts.length} sets`)).toBeInTheDocument();
    expect(getCatalogCards()).toHaveLength(readyVacationProducts.length);
  });

  it("lets shoppers drag the collection tab rail with a mouse during review", () => {
    renderShopPage();

    const rail = document.querySelector(".shop-tab-rail") as HTMLDivElement;
    expect(rail).toBeInTheDocument();

    dispatchPointerEvent(rail, "pointerdown", { clientX: 160, pointerId: 1, pointerType: "mouse" });
    dispatchPointerEvent(rail, "pointermove", { clientX: 88, pointerId: 1, pointerType: "mouse" });

    expect(rail.scrollLeft).toBe(72);

    dispatchPointerEvent(rail, "pointerup", { clientX: 88, pointerId: 1, pointerType: "mouse" });
    dispatchPointerEvent(rail, "pointermove", { clientX: 20, pointerId: 1, pointerType: "mouse" });

    expect(rail.scrollLeft).toBe(72);
  });

  it("keeps tab clicks working when a tap has a tiny pointer drift", () => {
    renderShopPage();

    const rail = document.querySelector(".shop-tab-rail") as HTMLDivElement;
    const bridalTab = screen.getByRole("button", { name: "Bridal" });

    dispatchPointerEvent(rail, "pointerdown", { clientX: 160, pointerId: 1, pointerType: "mouse" });
    dispatchPointerEvent(rail, "pointermove", { clientX: 154, pointerId: 1, pointerType: "mouse" });
    dispatchPointerEvent(rail, "pointerup", { clientX: 154, pointerId: 1, pointerType: "mouse" });
    fireEvent.click(bridalTab);

    expect(bridalTab).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("6 sets")).toBeInTheDocument();
  });

  it("opens and closes the inline filter panel", async () => {
    const user = userEvent.setup();
    renderShopPage();

    expect(screen.queryByRole("region", { name: "Catalog filters" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filter" }));

    const panel = screen.getByRole("region", { name: "Catalog filters" });
    expect(panel).toBeInTheDocument();
    expect(within(panel).queryByRole("group", { name: "Collection" })).not.toBeInTheDocument();
    expect(within(panel).queryByRole("checkbox", { name: "Everyday" })).not.toBeInTheDocument();
    expect(within(panel).getByRole("group", { name: "Price" })).toBeInTheDocument();
    expect(within(panel).getByRole("group", { name: "Detail level" })).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: "Clear" })).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: "Apply" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Hide filters" }));

    expect(screen.queryByRole("region", { name: "Catalog filters" })).not.toBeInTheDocument();
  });

  it("filters by price and detail level from the inline panel", async () => {
    const user = userEvent.setup();
    renderShopPage();

    await user.click(screen.getByRole("button", { name: "Filter" }));
    await user.click(screen.getByRole("checkbox", { name: "Under $20" }));
    await user.click(screen.getByRole("checkbox", { name: "Simple" }));

    expect(screen.getByText("5 sets")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Blush Crush" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pink French" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Golden Hour" })).not.toBeInTheDocument();
  });

  it("sorts products by price and popularity", async () => {
    const user = userEvent.setup();
    renderShopPage();

    await user.click(screen.getByRole("button", { name: "Sort Newest" }));
    const sortPanel = screen.getByRole("radiogroup", { name: "Sort sets" });

    expect(within(sortPanel).getByRole("radio", { name: "Newest" })).toHaveAttribute("aria-checked", "true");

    await user.click(within(sortPanel).getByRole("radio", { name: "Price: Low to High" }));

    expect(screen.getAllByRole("heading", { level: 3 })[0]).toHaveTextContent("Glossy Bare");
    expect(screen.getAllByText("$15")[0]).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort Price: Low to High" })).toBeInTheDocument();
    expect(screen.queryByRole("radiogroup", { name: "Sort sets" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sort Price: Low to High" }));
    await user.click(screen.getByRole("radio", { name: "Most Popular" }));

    expect(screen.getAllByRole("heading", { level: 3 })[0]).toHaveTextContent("Blush Crush");
  });

  it("closes the sort options with Escape and returns focus to the sort button", async () => {
    const user = userEvent.setup();
    renderShopPage();

    const sortButton = screen.getByRole("button", { name: "Sort Newest" });
    await user.click(sortButton);

    expect(screen.getByRole("radiogroup", { name: "Sort sets" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("radiogroup", { name: "Sort sets" })).not.toBeInTheDocument();
    expect(sortButton).toHaveFocus();
  });

  it("keeps catalog cards minimal", () => {
    renderShopPage();

    const firstCard = getCatalogCards()[0] as HTMLElement;

    expect(firstCard).toHaveClass("product-preview-card");
    expect(firstCard).toHaveAttribute("href", "/products/blush-crush");
    expect(within(firstCard).getByRole("img", { name: "Clean background placeholder for Blush Crush" })).toBeInTheDocument();
    expect(within(firstCard).getByRole("img", { name: "Clean background placeholder for Blush Crush" })).toBeEmptyDOMElement();
    expect(within(firstCard).getByRole("heading", { name: "Blush Crush" })).toBeInTheDocument();
    expect(within(firstCard).getByText("$18")).toBeInTheDocument();
    expect(within(firstCard).queryByText("Popular")).not.toBeInTheDocument();
    expect(within(firstCard).queryByText("Everyday")).not.toBeInTheDocument();
    expect(within(firstCard).queryByText("Simple")).not.toBeInTheDocument();
    expect(within(firstCard).queryByRole("button", { name: /add/i })).not.toBeInTheDocument();
    expect(within(firstCard).queryByRole("combobox")).not.toBeInTheDocument();
    expect(within(firstCard).queryByText(products[0].description)).not.toBeInTheDocument();
  });
});
