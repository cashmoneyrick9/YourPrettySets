import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { products } from "./data/products";

afterEach(() => {
  cleanup();
});

function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

describe("App", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.history.pushState({}, "", "/");
  });

  it("renders the YourPrettySets home experience", () => {
    renderApp();

    expect(document.querySelector(".site-shell")).not.toHaveClass("site-shell--barebones");
    expect(
      within(screen.getByRole("banner")).getByRole("link", { name: "YourPrettySets home" })
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("navigation", { name: "Primary navigation" })).getByRole("link", {
        name: "Shop"
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ready-to-wear sets for pretty plans" })).toBeInTheDocument();
  });

  it("renders the Shop All page at /shop", () => {
    window.history.pushState({}, "", "/shop");

    renderApp();

    expect(screen.getByRole("heading", { name: "Shop All" })).toBeInTheDocument();
    expect(screen.getByText("33 sets")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Ready-to-wear sets for pretty plans" })).not.toBeInTheDocument();
  });

  it.each([
    ["/shop/ready-to-ship", "Ready to Ship", "ready-to-ship"],
    ["/shop/made-to-order", "Made to Order", "made-to-order"]
  ] as const)("renders the %s filtered shop category page", (path, heading, orderType) => {
    window.history.pushState({}, "", path);
    const matchingProducts = products.filter((product) => product.orderType === orderType);
    const excludedProducts = products.filter((product) => product.orderType !== orderType);

    renderApp();

    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    expect(screen.getByText(`${matchingProducts.length} sets`)).toBeInTheDocument();
    expect(document.querySelectorAll(".shop-product-card")).toHaveLength(matchingProducts.length);
    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort Newest" })).toBeInTheDocument();

    for (const product of matchingProducts) {
      expect(screen.getByRole("heading", { name: product.name })).toBeInTheDocument();
    }

    for (const product of excludedProducts) {
      expect(screen.queryByRole("heading", { name: product.name })).not.toBeInTheDocument();
    }
  });

  it("renders Custom Orders as a fullscreen coming-soon page without normal site chrome", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/shop/custom-orders");

    renderApp();

    expect(document.querySelector(".site-shell")).not.toBeInTheDocument();
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Get 15% off your first order" })).not.toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveClass("custom-orders-page");
    expect(screen.getByRole("heading", { name: "Custom Orders Coming Soon" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Close custom orders and return to shop" })).toHaveAttribute(
      "href",
      "/shop"
    );

    await user.type(screen.getByLabelText("Email address"), "custom@example.com");
    await user.click(screen.getByRole("button", { name: "Notify me" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "This address was not saved because signup is not connected yet."
    );

    await user.click(screen.getByRole("link", { name: "Close custom orders and return to shop" }));

    expect(screen.getByRole("heading", { name: "Shop All" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/shop");
  });

  it("moves focus through the mobile custom-order route and back to Shop", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("button", { name: "Shop" }));
    await user.click(screen.getByRole("link", { name: "Custom Orders" }));

    const customHeading = screen.getByRole("heading", { name: "Custom Orders Coming Soon" });
    expect(customHeading).toHaveFocus();

    await user.click(screen.getByRole("link", { name: "Close custom orders and return to shop" }));

    expect(screen.getByRole("heading", { name: "Shop All" })).toHaveFocus();
  });

  it("renders a product detail page at /products/:slug", () => {
    window.history.pushState({}, "", "/products/blush-crush");

    renderApp();

    expect(screen.getByRole("heading", { name: "Blush Crush" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Length" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Shape" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeInTheDocument();
  });

  it("renders the standalone sizing-kit product without fake commerce controls", () => {
    window.history.pushState({}, "", "/products/sizing-kit");

    renderApp();

    expect(screen.getByRole("heading", { name: "Sizing Kit" })).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText(/Online purchasing is not connected yet/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add to cart" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read Find Your Fit" })).toHaveAttribute("href", "/help/sizing");
  });

  it("renders a clean product not-found state for unknown slugs", () => {
    window.history.pushState({}, "", "/products/unknown-set");

    renderApp();

    expect(screen.getByRole("heading", { name: "Set not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to shop" })).toHaveAttribute("href", "/shop");
  });

  it("navigates from Home to Shop All without reloading the document", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(
      within(screen.getByRole("navigation", { name: "Primary navigation" })).getByRole("link", {
        name: "Shop"
      })
    );

    expect(screen.getByRole("heading", { name: "Shop All" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Ready-to-wear sets for pretty plans" })).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/shop");
  });

  it("navigates from the hero Shop sets CTA to Shop All", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("link", { name: "Shop sets" }));

    expect(screen.getByRole("heading", { name: "Shop All" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/shop");
  });

  it("resets scroll when navigating from Home shopping previews to Ready to Ship", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.mocked(window.scrollTo);
    renderApp();
    scrollTo.mockClear();

    await user.click(screen.getByRole("button", { name: "Ready to Ship" }));
    await user.click(screen.getByRole("link", { name: "See more" }));

    expect(screen.getByRole("heading", { name: "Ready to Ship" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/shop/ready-to-ship");
    expect(window.location.search).toBe("");
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });

  it("opens Home shopping preview products at top and uses history back without forcing scroll reset", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.mocked(window.scrollTo);
    renderApp();
    scrollTo.mockClear();

    await user.click(screen.getByRole("button", { name: "Ready to Ship" }));
    await user.click(within(document.querySelector(".collection-product-row") as HTMLElement).getByRole("link", { name: "View Blush Crush" }));

    expect(screen.getByRole("heading", { name: "Blush Crush" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/products/blush-crush");
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
    scrollTo.mockClear();

    await user.click(screen.getByRole("button", { name: "Back to shop" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Ready-to-wear sets for pretty plans" })).toBeInTheDocument();
    });
    expect(window.location.pathname).toBe("/");
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("does not force scroll reset on browser back from Product to Shop", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.mocked(window.scrollTo);
    window.history.pushState({}, "", "/shop");
    renderApp();
    scrollTo.mockClear();

    await user.click(screen.getByRole("link", { name: "View Blush Crush" }));

    expect(screen.getByRole("heading", { name: "Blush Crush" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/products/blush-crush");
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
    scrollTo.mockClear();

    window.history.back();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Shop All" })).toBeInTheDocument();
    });
    expect(window.location.pathname).toBe("/shop");
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("renders the Help hub at /help", () => {
    window.history.pushState({}, "", "/help");

    renderApp();

    const main = screen.getByRole("main");

    expect(within(main).getByRole("heading", { name: "The Press-On Guide" })).toBeInTheDocument();

    for (const [name, href] of [
      ["Find Your Fit", "/help/sizing"],
      ["Sizing Kit", "/products/sizing-kit"],
      ["Apply Your Set", "/help/application"],
      ["Remove & Reuse", "/help/removal"],
      ["Shipping and timing", "/help/shipping-returns#processing-transit"],
      ["Damaged or incorrect order", "/help/shipping-returns#order-problems"],
      ["Lost package", "/help/shipping-returns#lost-packages"],
      ["Cancellations", "/help/shipping-returns#cancellations"],
      ["Browse every question", "/help/faq"],
      ["Contact Support", "/help/contact"]
    ] as const) {
      expect(within(main).getAllByRole("link", { name }).some((link) => link.getAttribute("href") === href)).toBe(true);
    }
  });

  it.each([
    ["/help/sizing", "Find Your Fit"],
    ["/help/application", "Apply Your Set"],
    ["/help/removal", "Remove & Reuse"],
    ["/help/shipping-returns", "Shipping, Returns & Order Issues"],
    ["/help/faq", "FAQ"],
    ["/help/contact", "Contact Support"],
    ["/privacy", "Privacy"],
    ["/terms", "Terms"]
  ])("renders %s", (path, heading) => {
    window.history.pushState({}, "", path);

    renderApp();

    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("redirects the legacy application route to the canonical guide", async () => {
    window.history.pushState({}, "", "/help/how-to-apply");

    renderApp();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Apply Your Set" })).toBeInTheDocument();
    });
    expect(window.location.pathname).toBe("/help/application");
  });

  it("navigates from the primary Help link to the Help hub", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.mocked(window.scrollTo);
    renderApp();
    scrollTo.mockClear();

    await user.click(
      within(screen.getByRole("navigation", { name: "Primary navigation" })).getByRole("link", {
        name: "Help"
      })
    );

    const pageHeading = screen.getByRole("heading", { name: "The Press-On Guide" });
    expect(pageHeading).toBeInTheDocument();
    expect(pageHeading).toHaveFocus();
    expect(window.location.pathname).toBe("/help");
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });

  it("moves directly from the Help hub to a focused order-issue section", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/help");
    renderApp();

    await user.click(screen.getByRole("link", { name: "Damaged or incorrect order" }));

    const sectionHeading = screen.getByRole("heading", { name: "Damaged, incorrect, or defective items" });
    expect(window.location.pathname).toBe("/help/shipping-returns");
    expect(window.location.hash).toBe("#order-problems");
    expect(sectionHeading).toHaveFocus();
  });

  it("renders the approved footer system at the bottom", () => {
    renderApp();

    const emailCapture = screen.getByRole("region", { name: "Get 15% off your first order" });
    const footer = screen.getByRole("contentinfo");

    expect(emailCapture.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(footer).getByRole("navigation", { name: "Footer navigation" })).toBeInTheDocument();
    expect(within(footer).queryByRole("region", { name: "Get 15% off your first order" })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Cohesive footer preview" })).not.toBeInTheDocument();
  });
});
