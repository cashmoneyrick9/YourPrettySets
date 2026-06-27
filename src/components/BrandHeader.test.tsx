import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { BrandHeader } from "./BrandHeader";

afterEach(() => {
  cleanup();
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

  it("opens a full-screen mobile overlay menu with the approved destinations", async () => {
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

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(mobileNav).toHaveClass("brand-header__mobile-menu");

    expect(within(mobileNav).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(mobileNav).getByRole("button", { name: "Shop" })).toHaveAttribute("aria-expanded", "false");
    expect(within(mobileNav).getByRole("button", { name: "Help" })).toHaveAttribute("aria-expanded", "false");
    expect(within(mobileNav).queryByRole("link", { name: "Ready to Ship" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Made to Order" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Custom Orders" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Help Center" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Sizing Guide" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "How to Apply" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Shipping & Returns" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "FAQ" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Reviews" })).not.toBeInTheDocument();
    expect(within(mobileNav).queryByRole("link", { name: "Contact" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("YourPrettySets home")).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector('[aria-label="Bag coming soon"]')).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector('[aria-label="Bag coming soon"]')).toHaveAttribute("tabindex", "-1");
  });

  it("expands the mobile Shop submenu and closes after choosing a submenu route", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const shopToggle = within(mobileNav).getByRole("button", { name: "Shop" });

    await user.click(shopToggle);

    expect(shopToggle).toHaveAttribute("aria-expanded", "true");
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

    await user.click(within(mobileNav).getByRole("link", { name: "Ready to Ship" }));

    expect(window.location.pathname).toBe("/shop/ready-to-ship");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("mobile-menu-open");

    window.history.pushState({}, "", "/");
  });

  it("expands the mobile Help submenu and closes after choosing a help route", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const helpToggle = within(mobileNav).getByRole("button", { name: "Help" });

    await user.click(helpToggle);

    expect(helpToggle).toHaveAttribute("aria-expanded", "true");
    expect(within(mobileNav).getByRole("link", { name: "Help Center" })).toHaveAttribute(
      "href",
      "/help"
    );
    expect(within(mobileNav).getByRole("link", { name: "Sizing Guide" })).toHaveAttribute(
      "href",
      "/help/sizing"
    );
    expect(within(mobileNav).getByRole("link", { name: "How to Apply" })).toHaveAttribute(
      "href",
      "/help/how-to-apply"
    );
    expect(within(mobileNav).getByRole("link", { name: "Shipping & Returns" })).toHaveAttribute(
      "href",
      "/help/shipping-returns"
    );
    expect(within(mobileNav).getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/help/faq");
    expect(within(mobileNav).getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/help/contact"
    );

    await user.click(within(mobileNav).getByRole("link", { name: "Help Center" }));

    expect(window.location.pathname).toBe("/help");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("mobile-menu-open");

    window.history.pushState({}, "", "/");
  });

  it("closes the overlay menu from a destination link or Escape", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", { name: "Home" }));

    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("banner")).not.toHaveClass("brand-header--menu-open");
    expect(document.body).not.toHaveClass("mobile-menu-open");
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
    expect(document.documentElement.style.overflow).toBe("");

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("closes the overlay menu when selecting the Home route", async () => {
    const user = userEvent.setup();
    renderBrandHeader();
    window.history.pushState({}, "", "/help");

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(
      within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", {
        name: "Home"
      })
    );

    expect(window.location.pathname).toBe("/");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("mobile-menu-open");
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
    expect(document.documentElement.style.overflow).toBe("");

    window.history.pushState({}, "", "/");
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
