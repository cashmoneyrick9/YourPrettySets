import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BrandHeader } from "./BrandHeader";

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
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute(
      "href",
      "#shop-collections"
    );
    expect(screen.getByRole("link", { name: "View bag" })).toHaveAttribute("href", "#bag");
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
});
