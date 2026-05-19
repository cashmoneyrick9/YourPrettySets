import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BrandHeader } from "./BrandHeader";

afterEach(() => {
  cleanup();
});

describe("BrandHeader", () => {
  it("renders the brand, desktop navigation, and compact mobile actions", () => {
    render(<BrandHeader />);

    expect(screen.getByLabelText("YourPrettySets home")).toBeInTheDocument();

    const desktopNav = screen.getByRole("navigation", { name: "Primary navigation" });
    for (const label of ["Home", "Shop Collections", "How It Works", "FAQ", "Bag"]) {
      expect(within(desktopNav).getByRole("link", { name: label })).toBeInTheDocument();
    }

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByRole("link", { name: "Shop" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View bag" })).toHaveAttribute("href", "#faq");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("opens a simple mobile navigation menu", async () => {
    const user = userEvent.setup();
    render(<BrandHeader />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    for (const label of ["Home", "Shop Collections", "How It Works", "FAQ"]) {
      expect(within(mobileNav).getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("switches from transparent top state to accent scrolled state", async () => {
    render(<BrandHeader />);

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
    const { unmount } = render(<BrandHeader />);

    expect(document.body).toHaveClass("header-at-top");

    unmount();

    expect(document.body).not.toHaveClass("header-at-top");
    expect(document.body).not.toHaveClass("header-scrolled");
  });
});
