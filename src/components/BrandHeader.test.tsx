import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { BrandHeader } from "./BrandHeader";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.style.overflow = "";
});

describe("BrandHeader", () => {
  function renderBrandHeader() {
    return render(
      <BrowserRouter>
        <BrandHeader />
      </BrowserRouter>
    );
  }

  function renderBrandHeaderWithPageContent() {
    return render(
      <BrowserRouter>
        <BrandHeader />
        <main>
          <a href="/outside">Outside page link</a>
          <button type="button">Outside page button</button>
        </main>
      </BrowserRouter>
    );
  }

  it("renders the brand, desktop navigation, and compact mobile actions", () => {
    renderBrandHeader();

    expect(screen.getByLabelText("YourPrettySets home")).toBeInTheDocument();

    const desktopNav = screen.getByRole("navigation", { name: "Primary navigation" });
    for (const label of ["Home", "Shop", "Help"]) {
      expect(within(desktopNav).getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(within(desktopNav).getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/shop");
    expect(within(desktopNav).getByRole("link", { name: "Help" })).toHaveAttribute("href", "/help");
    expect(within(desktopNav).queryByRole("link", { name: "FAQ" })).not.toBeInTheDocument();
    expect(within(desktopNav).queryByRole("link", { name: "Reviews" })).not.toBeInTheDocument();
    expect(within(desktopNav).queryByRole("link", { name: "Bag" })).not.toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.getByRole("button", { name: "Bag coming soon" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.queryByRole("link", { name: "View bag" })).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("opens the mobile menu in a centered default state without an active submenu", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const header = screen.getByRole("banner");
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(header).toHaveClass("brand-header--menu-open");
    expect(document.body).toHaveClass("mobile-menu-open");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.position).toBe("fixed");
    expect(document.documentElement.style.overflow).toBe("hidden");

    const dialog = screen.getByRole("dialog", { name: "Mobile menu" });
    expect(dialog).toHaveClass("brand-header__mobile-menu-dialog");

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(mobileNav).toHaveClass("brand-header__mobile-menu");
    expect(mobileNav).toHaveClass("brand-header__mobile-menu--default");
    expect(mobileNav).not.toHaveClass("brand-header__mobile-menu--expanded");
    expect(mobileNav).not.toHaveClass("brand-header__mobile-menu--active-shop");
    expect(mobileNav).not.toHaveClass("brand-header__mobile-menu--active-help");

    const selector = within(mobileNav).getByLabelText("Menu sections");
    expect(selector).toHaveClass("brand-header__mobile-menu-selector--default");
    expect(within(selector).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(selector).getByRole("link", { name: "Home" })).toHaveClass(
      "brand-header__mobile-selector-item--offset--1"
    );
    expect(within(selector).getByRole("button", { name: "Shop" })).toHaveAttribute("aria-expanded", "false");
    expect(within(selector).getByRole("button", { name: "Shop" })).toHaveClass(
      "brand-header__mobile-selector-item--offset-0"
    );
    expect(within(selector).getByRole("button", { name: "Help" })).toHaveAttribute("aria-expanded", "false");
    expect(within(selector).getByRole("button", { name: "Help" })).toHaveClass(
      "brand-header__mobile-selector-item--offset-1"
    );
    expect(within(selector).getByRole("button", { name: "Shop" })).toHaveAttribute(
      "aria-controls",
      "brand-header-mobile-menu-content"
    );
    expect(within(selector).getByRole("button", { name: "Shop" })).not.toHaveClass(
      "brand-header__mobile-selector-item--active"
    );
    const content = mobileNav.querySelector(".brand-header__mobile-menu-content");
    expect(content).not.toBeNull();
    expect(content).toHaveClass("brand-header__mobile-menu-content--default");
    expect(content).toHaveAttribute("aria-hidden", "true");
    expect(within(mobileNav).queryByRole("link", { name: "Ready to Ship" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Made to Order" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Custom Orders" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Press-On Guide" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Find Your Fit" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Apply Your Set" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Remove & Reuse" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Shipping, Returns & Order Issues" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "FAQ" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Reviews" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Contact Support" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("YourPrettySets home")).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector('[aria-label="Bag coming soon"]')).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector('[aria-label="Bag coming soon"]')).toHaveAttribute("tabindex", "-1");
  });

  it("keeps keyboard focus inside the open mobile menu and hides page content from tab order", async () => {
    const user = userEvent.setup();
    renderBrandHeaderWithPageContent();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const closeButton = screen.getByRole("button", { name: "Close menu" });
    const homeLink = within(mobileNav).getByRole("link", { name: "Home" });
    const shopButton = within(mobileNav).getByRole("button", { name: "Shop" });
    const helpButton = within(mobileNav).getByRole("button", { name: "Help" });
    const pageContent = document.querySelector("main");

    expect(pageContent).not.toBeNull();
    expect(pageContent).toHaveAttribute("inert", "");
    expect(pageContent).toHaveAttribute("aria-hidden", "true");
    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(homeLink).toHaveFocus();

    await user.tab();
    expect(shopButton).toHaveFocus();

    await user.tab();
    expect(helpButton).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(helpButton).toHaveFocus();
  });

  it("keeps expanded mobile submenu links inside the focus loop", async () => {
    const user = userEvent.setup();
    renderBrandHeaderWithPageContent();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("button", { name: "Shop" }));

    const closeButton = screen.getByRole("button", { name: "Close menu" });
    const readyToShipLink = screen.getByRole("link", { name: "Ready to Ship" });
    const customOrdersLink = screen.getByRole("link", { name: "Custom Orders" });

    customOrdersLink.focus();
    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(customOrdersLink).toHaveFocus();

    readyToShipLink.focus();
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Help" })).toHaveFocus();
  });

  it("ignores wheel and touch selector gestures while the mobile menu is in default mode", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const selector = within(mobileNav).getByLabelText("Menu sections");

    fireEvent.wheel(selector, { deltaY: 42 });
    fireEvent.touchStart(selector, { touches: [{ clientY: 220 }] });
    fireEvent.touchEnd(selector, { changedTouches: [{ clientY: 132 }] });

    expect(mobileNav).toHaveClass("brand-header__mobile-menu--default");
    expect(mobileNav).not.toHaveClass("brand-header__mobile-menu--expanded");
    expect(within(selector).getByRole("button", { name: "Shop" })).toHaveAttribute("aria-expanded", "false");
    expect(within(selector).getByRole("button", { name: "Help" })).toHaveAttribute("aria-expanded", "false");
    const content = mobileNav.querySelector(".brand-header__mobile-menu-content");
    expect(content).not.toBeNull();
    expect(content).toHaveClass("brand-header__mobile-menu-content--default");
    expect(content).toHaveAttribute("aria-hidden", "true");
  });

  it("expands from the default menu into the Shop split-screen submenu", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const selector = within(mobileNav).getByLabelText("Menu sections");

    await user.click(within(selector).getByRole("button", { name: "Shop" }));

    expect(mobileNav).toHaveClass("brand-header__mobile-menu--expanded");
    expect(mobileNav).toHaveClass("brand-header__mobile-menu--active-shop");
    expect(mobileNav).not.toHaveClass("brand-header__mobile-menu--default");
    expect(within(selector).getByRole("button", { name: "Shop" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(within(selector).getByRole("button", { name: "Shop" })).toHaveTextContent("Shop");
    expect(within(selector).getByRole("button", { name: "Help" })).toHaveAttribute("aria-expanded", "false");

    const content = mobileNav.querySelector(".brand-header__mobile-menu-content");
    expect(content).not.toBeNull();
    expect(content).toHaveClass("brand-header__mobile-menu-content--expanded");
    expect(content).not.toHaveAttribute("aria-hidden");
    expect(within(content as HTMLElement).getByText("SHOP")).toHaveClass(
      "brand-header__mobile-submenu-eyebrow"
    );
    expect(within(mobileNav).getByRole("link", { name: "Ready to Ship" })).toHaveAttribute(
      "href",
      "/shop/ready-to-ship"
    );
    expect(within(mobileNav).getByRole("link", { name: "Made to Order" })).toHaveAttribute(
      "href",
      "/shop/made-to-order"
    );
    expect(within(mobileNav).getByRole("link", { name: "Custom Orders" })).toHaveAttribute(
      "href",
      "/shop/custom-orders"
    );
    expect(within(mobileNav).queryByRole("link", { name: "Press-On Guide" })).not.toBeInTheDocument();
  });

  it("collapses the Shop submenu when tapping the active Shop selector again", async () => {
    renderBrandHeader();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const selector = within(mobileNav).getByLabelText("Menu sections");
    const shopToggle = within(selector).getByRole("button", { name: "Shop" });

    fireEvent.click(shopToggle);
    fireEvent.click(shopToggle);

    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(mobileNav).toHaveClass("brand-header__mobile-menu--closing-panel");
    expect(mobileNav).not.toHaveClass("brand-header__mobile-menu--expanded");
    expect(mobileNav).toHaveClass("brand-header__mobile-menu--active-shop");
    expect(shopToggle).toHaveAttribute("aria-expanded", "false");
    expect(shopToggle).toHaveClass("brand-header__mobile-selector-item--active");
    expect(within(selector).getByRole("button", { name: "Help" })).toHaveAttribute("aria-expanded", "false");

    const content = mobileNav.querySelector(".brand-header__mobile-menu-content");
    expect(content).not.toBeNull();
    expect(content).toHaveClass("brand-header__mobile-menu-content--closing-panel");
    expect(content).toHaveAttribute("aria-hidden", "true");
    expect(mobileNav.querySelector(".brand-header__mobile-menu-content")).toHaveTextContent(
      "Ready to Ship"
    );
    expect(document.body).toHaveClass("mobile-menu-open");

    fireEvent.transitionEnd(content as HTMLElement, { propertyName: "transform" });

    expect(mobileNav.querySelector(".brand-header__mobile-menu-content")).toHaveTextContent(
      "Ready to Ship"
    );
    expect(mobileNav).toHaveClass("brand-header__mobile-menu--returning-selector");
    expect(selector).toHaveClass("brand-header__mobile-menu-selector--returning-selector");
    expect(content).toHaveClass("brand-header__mobile-menu-content--returning-selector");
    expect(shopToggle).not.toHaveClass("brand-header__mobile-selector-item--active");

    fireEvent.transitionEnd(selector, { propertyName: "width" });

    expect(mobileNav).toHaveClass("brand-header__mobile-menu--default");
    expect(selector).toHaveClass("brand-header__mobile-menu-selector--skip-enter");
    expect(mobileNav).not.toHaveClass("brand-header__mobile-menu--active-shop");
    expect(within(mobileNav).queryByRole("link", { name: "Ready to Ship" })).not.toBeInTheDocument();
  });

  it("closes after choosing a Shop submenu route", async () => {
    vi.useFakeTimers();
    renderBrandHeader();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    fireEvent.click(within(mobileNav).getByRole("button", { name: "Shop" }));

    expect(within(mobileNav).getByRole("link", { name: "Ready to Ship" })).toHaveAttribute(
      "href",
      "/shop/ready-to-ship"
    );
    expect(within(mobileNav).getByRole("link", { name: "Made to Order" })).toHaveAttribute(
      "href",
      "/shop/made-to-order"
    );
    expect(within(mobileNav).getByRole("link", { name: "Custom Orders" })).toHaveAttribute(
      "href",
      "/shop/custom-orders"
    );

    const startingPath = window.location.pathname;
    fireEvent.click(within(mobileNav).getByRole("link", { name: "Ready to Ship" }));

    expect(window.location.pathname).toBe(startingPath);
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("mobile-menu-open");
    expect(document.body.style.position).toBe("");

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(window.location.pathname).toBe("/shop/ready-to-ship");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("mobile-menu-open");

    window.history.pushState({}, "", "/");
  });

  it("expands from the default menu into the Help split-screen submenu without showing Shop links", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const selector = within(mobileNav).getByLabelText("Menu sections");
    const helpToggle = within(selector).getByRole("button", { name: "Help" });

    await user.click(helpToggle);

    const shopToggle = within(selector).getByRole("button", { name: "Shop" });
    expect(mobileNav).toHaveClass("brand-header__mobile-menu--expanded");
    expect(mobileNav).toHaveClass("brand-header__mobile-menu--active-help");
    expect(helpToggle).toHaveAttribute("aria-expanded", "true");
    expect(helpToggle).toHaveTextContent("Help");
    expect(shopToggle).toHaveAttribute("aria-expanded", "false");
    const content = mobileNav.querySelector(".brand-header__mobile-menu-content");
    expect(content).not.toBeNull();
    expect(content).toHaveClass("brand-header__mobile-menu-content--expanded");
    expect(content).not.toHaveAttribute("aria-hidden");
    const submenuScrollEvent = new Event("touchmove", { bubbles: true, cancelable: true });
    content?.dispatchEvent(submenuScrollEvent);
    expect(submenuScrollEvent.defaultPrevented).toBe(false);
    const backgroundScrollEvent = new Event("touchmove", { bubbles: true, cancelable: true });
    selector.dispatchEvent(backgroundScrollEvent);
    expect(backgroundScrollEvent.defaultPrevented).toBe(true);
    expect(within(content as HTMLElement).getByText("HELP")).toHaveClass(
      "brand-header__mobile-submenu-eyebrow"
    );
    expect(within(mobileNav).queryByRole("link", { name: "Ready to Ship" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Made to Order" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Custom Orders" })).not.toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: "Press-On Guide" })).toHaveAttribute(
      "href",
      "/help"
    );
    expect(within(mobileNav).getByRole("link", { name: "Find Your Fit" })).toHaveAttribute(
      "href",
      "/help/sizing"
    );
    expect(within(mobileNav).getByRole("link", { name: "Apply Your Set" })).toHaveAttribute(
      "href",
      "/help/application"
    );
    expect(within(mobileNav).getByRole("link", { name: "Remove & Reuse" })).toHaveAttribute(
      "href",
      "/help/removal"
    );
    expect(within(mobileNav).getByRole("link", { name: "Shipping, Returns & Order Issues" })).toHaveAttribute(
      "href",
      "/help/shipping-returns"
    );
    expect(within(mobileNav).getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/help/faq");
    expect(within(mobileNav).getByRole("link", { name: "Contact Support" })).toHaveAttribute(
      "href",
      "/help/contact"
    );

    vi.useFakeTimers();
    const startingPath = window.location.pathname;
    fireEvent.click(within(mobileNav).getByRole("link", { name: "Press-On Guide" }));

    expect(window.location.pathname).toBe(startingPath);
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("mobile-menu-open");

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(window.location.pathname).toBe("/help");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("mobile-menu-open");

    window.history.pushState({}, "", "/");
  });

  it("collapses the Help submenu when tapping the active Help selector again", async () => {
    renderBrandHeader();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const selector = within(mobileNav).getByLabelText("Menu sections");
    const helpToggle = within(selector).getByRole("button", { name: "Help" });

    fireEvent.click(helpToggle);
    fireEvent.click(helpToggle);

    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
    expect(mobileNav).toHaveClass("brand-header__mobile-menu--closing-panel");
    expect(mobileNav).not.toHaveClass("brand-header__mobile-menu--expanded");
    expect(mobileNav).toHaveClass("brand-header__mobile-menu--active-help");
    expect(helpToggle).toHaveAttribute("aria-expanded", "false");
    expect(helpToggle).toHaveClass("brand-header__mobile-selector-item--active");
    expect(within(selector).getByRole("button", { name: "Shop" })).toHaveAttribute("aria-expanded", "false");

    const content = mobileNav.querySelector(".brand-header__mobile-menu-content");
    expect(content).not.toBeNull();
    expect(content).toHaveClass("brand-header__mobile-menu-content--closing-panel");
    expect(content).toHaveAttribute("aria-hidden", "true");
    expect(content).toHaveTextContent("Press-On Guide");
    expect(document.body).toHaveClass("mobile-menu-open");

    fireEvent.transitionEnd(content as HTMLElement, { propertyName: "transform" });

    expect(mobileNav).toHaveClass("brand-header__mobile-menu--returning-selector");
    expect(content).toHaveClass("brand-header__mobile-menu-content--returning-selector");
    expect(helpToggle).not.toHaveClass("brand-header__mobile-selector-item--active");

    fireEvent.transitionEnd(selector, { propertyName: "width" });

    expect(mobileNav).toHaveClass("brand-header__mobile-menu--default");
    expect(selector).toHaveClass("brand-header__mobile-menu-selector--skip-enter");
    expect(mobileNav).not.toHaveClass("brand-header__mobile-menu--active-help");
    expect(within(mobileNav).queryByRole("link", { name: "Press-On Guide" })).not.toBeInTheDocument();
  });

  it("switches to an inactive parent submenu while the split-screen menu is expanded", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const selector = within(mobileNav).getByLabelText("Menu sections");
    const shopToggle = within(selector).getByRole("button", { name: "Shop" });
    const helpToggle = within(selector).getByRole("button", { name: "Help" });

    await user.click(shopToggle);
    await user.click(helpToggle);

    expect(mobileNav).toHaveClass("brand-header__mobile-menu--expanded");
    expect(mobileNav).toHaveClass("brand-header__mobile-menu--active-help");
    expect(helpToggle).toHaveAttribute("aria-expanded", "true");
    expect(shopToggle).toHaveAttribute("aria-expanded", "false");
    expect(within(mobileNav).getByRole("link", { name: "Press-On Guide" })).toHaveAttribute(
      "href",
      "/help"
    );
    expect(within(mobileNav).queryByRole("link", { name: "Ready to Ship" })).not.toBeInTheDocument();
  });

  it("rotates the mobile selector once with a wheel gesture on the left panel", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const selector = within(mobileNav).getByLabelText("Menu sections");
    await user.click(within(selector).getByRole("button", { name: "Shop" }));

    fireEvent.wheel(selector, { deltaY: 42 });

    expect(mobileNav).toHaveClass("brand-header__mobile-menu--active-help");
    expect(within(selector).getByRole("button", { name: "Help" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("debounces trackpad-style wheel bursts on the left selector", async () => {
    vi.useFakeTimers();
    renderBrandHeader();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const selector = within(mobileNav).getByLabelText("Menu sections");
    fireEvent.click(within(selector).getByRole("button", { name: "Shop" }));

    fireEvent.wheel(selector, { deltaY: 42 });
    fireEvent.wheel(selector, { deltaY: 42 });

    expect(mobileNav).toHaveClass("brand-header__mobile-menu--active-help");
    expect(within(selector).getByRole("button", { name: "Help" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(within(selector).getByRole("button", { name: "Shop" })).toHaveAttribute("aria-expanded", "false");

    vi.advanceTimersByTime(400);
    fireEvent.wheel(selector, { deltaY: -42 });

    expect(mobileNav).toHaveClass("brand-header__mobile-menu--active-shop");
    expect(within(selector).getByRole("button", { name: "Shop" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("keeps touch selector rotation available after the menu is expanded", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const selector = within(mobileNav).getByLabelText("Menu sections");
    await user.click(within(selector).getByRole("button", { name: "Shop" }));

    fireEvent.touchStart(selector, { touches: [{ clientY: 220 }] });
    fireEvent.touchEnd(selector, { changedTouches: [{ clientY: 132 }] });

    expect(mobileNav).toHaveClass("brand-header__mobile-menu--active-help");
    expect(within(selector).getByRole("button", { name: "Help" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it.each([
    { closeWith: "X button", section: "Shop" },
    { closeWith: "Escape", section: "Shop" },
    { closeWith: "Home", section: "Shop" },
    { closeWith: "submenu link", section: "Shop" },
    { closeWith: "submenu link", section: "Help" }
  ])(
    "closes and unlocks immediately for $closeWith from $section",
    ({ closeWith, section }) => {
      vi.useFakeTimers();
      window.history.pushState({}, "", "/");
      renderBrandHeader();

      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
      const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
      fireEvent.click(within(mobileNav).getByRole("button", { name: section }));

      if (closeWith === "X button") {
        fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
      } else if (closeWith === "Escape") {
        fireEvent.keyDown(window, { key: "Escape" });
      } else if (closeWith === "Home") {
        fireEvent.click(within(mobileNav).getByRole("link", { name: "Home" }));
      } else {
        fireEvent.click(
          within(mobileNav).getByRole("link", {
            name: section === "Shop" ? "Ready to Ship" : "Press-On Guide"
          })
        );
      }

      const activeClass = `brand-header__mobile-menu--active-${section.toLowerCase()}`;
      expect(screen.queryByRole("dialog", { name: "Mobile menu" })).not.toBeInTheDocument();
      expect(document.body).not.toHaveClass("mobile-menu-open");
      expect(document.body.style.overflow).toBe("");
      expect(document.body.style.position).toBe("");
      expect(document.documentElement.style.overflow).toBe("");

      act(() => {
        vi.runOnlyPendingTimers();
      });

      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
      const reopenedNav = screen.getByRole("navigation", { name: "Mobile navigation" });
      expect(reopenedNav).toHaveClass("brand-header__mobile-menu--default");
      expect(reopenedNav).not.toHaveClass(activeClass);
      expect(reopenedNav.querySelector(".brand-header__mobile-submenu-panel")).not.toBeInTheDocument();
    }
  );

  it("closes the overlay menu from a destination link or Escape", async () => {
    vi.useFakeTimers();
    renderBrandHeader();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", { name: "Home" }));

    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    expect(document.body).not.toHaveClass("mobile-menu-open");

    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(screen.getByRole("banner")).not.toHaveClass("brand-header--menu-open");
    expect(document.body).not.toHaveClass("mobile-menu-open");
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
    expect(document.documentElement.style.overflow).toBe("");

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("closes the overlay menu when selecting the Home route", async () => {
    vi.useFakeTimers();
    window.history.pushState({}, "", "/help");
    renderBrandHeader();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(
      within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("button", {
        name: "Shop"
      })
    );
    fireEvent.click(
      within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", {
        name: "Home"
      })
    );

    expect(window.location.pathname).toBe("/help");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("mobile-menu-open");

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(window.location.pathname).toBe("/");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("mobile-menu-open");
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
    expect(document.documentElement.style.overflow).toBe("");

    window.history.pushState({}, "", "/");
  });

  it("closes the full menu immediately from the close button", () => {
    renderBrandHeader();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));

    expect(screen.queryByRole("dialog", { name: "Mobile menu" })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("mobile-menu-open");
  });

  it("returns an active submenu immediately for reduced-motion users", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }))
    );
    renderBrandHeader();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const shopToggle = within(mobileNav).getByRole("button", { name: "Shop" });
    fireEvent.click(shopToggle);
    fireEvent.click(shopToggle);

    expect(mobileNav).toHaveClass("brand-header__mobile-menu--default");
    expect(mobileNav).not.toHaveClass("brand-header__mobile-menu--active-shop");
    expect(within(mobileNav).queryByRole("link", { name: "Ready to Ship" })).not.toBeInTheDocument();
    expect(document.body).toHaveClass("mobile-menu-open");
  });

  it("switches from transparent top state to accent scrolled state", async () => {
    renderBrandHeader();

    const header = screen.getByRole("banner");

    expect(header).toHaveClass("brand-header--at-top");
    expect(header).not.toHaveClass("brand-header--scrolled");
    expect(document.body).toHaveClass("header-at-top");
    expect(document.body).not.toHaveClass("header-scrolled");

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 48
    });
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(header).toHaveClass("brand-header--scrolled");
    });
    expect(header).not.toHaveClass("brand-header--at-top");
    expect(document.body).toHaveClass("header-scrolled");
    expect(document.body).not.toHaveClass("header-at-top");

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0
    });
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(header).toHaveClass("brand-header--at-top");
    });
    expect(document.body).toHaveClass("header-at-top");
    expect(document.body).not.toHaveClass("header-scrolled");
  });

  it("cleans up document-level header state classes on unmount", () => {
    const { unmount } = renderBrandHeader();

    expect(document.body).toHaveClass("header-at-top");

    unmount();

    expect(document.body).not.toHaveClass("header-at-top");
    expect(document.body).not.toHaveClass("header-scrolled");
    expect(document.body).not.toHaveClass("mobile-menu-open");
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
  });
});
