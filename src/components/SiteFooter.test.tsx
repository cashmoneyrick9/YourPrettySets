import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

afterEach(() => {
  cleanup();
});

describe("SiteFooter", () => {
  it("uses the shared accordion foundation while keeping one footer group open at a time", async () => {
    const user = userEvent.setup();
    render(<SiteFooter />);

    const footerNav = screen.getByRole("navigation", { name: "Footer navigation" });
    const accordion = footerNav.querySelector('[data-slot="accordion"]');
    const shopGroup = screen.getByRole("button", { name: "Shop" });
    const helpGroup = screen.getByRole("button", { name: "Help" });

    expect(accordion).toBeInTheDocument();
    expect(shopGroup).toHaveAttribute("aria-expanded", "true");
    expect(helpGroup).toHaveAttribute("aria-expanded", "false");
    expect(within(footerNav).getByRole("link", { name: "Collections" })).toHaveAttribute("href", "#shop-collections");

    await user.click(helpGroup);

    expect(shopGroup).toHaveAttribute("aria-expanded", "false");
    expect(helpGroup).toHaveAttribute("aria-expanded", "true");
    expect(within(footerNav).queryByRole("link", { name: "Collections" })).not.toBeInTheDocument();
    expect(within(footerNav).getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "#contact");
  });

  it("keeps unfinished policy links inside the current prototype support path", async () => {
    const user = userEvent.setup();
    render(<SiteFooter />);

    await user.click(screen.getByRole("button", { name: "Policies" }));

    const footerNav = screen.getByRole("navigation", { name: "Footer navigation" });
    for (const label of ["Shipping", "Returns", "Privacy"]) {
      expect(within(footerNav).getByRole("link", { name: label })).toHaveAttribute("href", "#faq");
    }
  });
});
