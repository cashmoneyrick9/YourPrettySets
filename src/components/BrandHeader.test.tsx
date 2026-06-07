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
    for (const label of ["Home", "Shop Collections", "How It Works", "FAQ", "Bag"]) {
      expect(within(desktopNav).getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(within(desktopNav).getByRole("link", { name: "Shop Collections" })).toHaveAttribute("href", "/shop");

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByRole("link", { name: "Shop" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View bag" })).toHaveAttribute("href", "#faq");
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

    for (const label of ["Home", "Shop Collections", "How It Works", "FAQ", "Reviews", "Contact"]) {
      expect(within(mobileNav).getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(within(mobileNav).getByRole("link", { name: "Shop Collections" })).toHaveAttribute("href", "/shop");
    expect(screen.getByLabelText("YourPrettySets home")).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector('[aria-label="View bag"]')).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelector('[aria-label="View bag"]')).toHaveAttribute("tabindex", "-1");
  });

  it("closes the overlay menu from a destination link or Escape", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", { name: "FAQ" }));

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

  it("closes the overlay menu when selecting the Shop Collections route", async () => {
    const user = userEvent.setup();
    renderBrandHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(
      within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", {
        name: "Shop Collections"
      })
    );

    expect(window.location.pathname).toBe("/shop");
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
