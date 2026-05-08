import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

afterEach(() => {
  cleanup();
});

describe("SiteFooter", () => {
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
