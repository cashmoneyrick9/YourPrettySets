import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

afterEach(() => {
  cleanup();
});

describe("SiteFooter", () => {
  it("renders the approved email capture card", async () => {
    const user = userEvent.setup();
    render(<SiteFooter />);

    const emailCard = screen.getByRole("region", { name: "Get 15% off your first set" });

    expect(within(emailCard).getByText("YOURPRETTYSETS")).toBeInTheDocument();
    expect(within(emailCard).getByRole("heading", { name: "Get 15% off your first set" })).toBeInTheDocument();
    expect(within(emailCard).getByText("Join the list for new drops, restocks, and exclusive offers.")).toBeInTheDocument();
    expect(within(emailCard).getByPlaceholderText("Email address")).toHaveAttribute("type", "email");
    expect(within(emailCard).getByRole("button", { name: "Get 15% off" })).toHaveAttribute("type", "submit");
    expect(within(emailCard).getByText("No spam. Just pretty updates.")).toBeInTheDocument();

    await user.type(within(emailCard).getByPlaceholderText("Email address"), "shopper@example.com");
    await user.click(within(emailCard).getByRole("button", { name: "Get 15% off" }));

    expect(within(emailCard).getByText("You're on the list. Your code is coming soon.")).toBeInTheDocument();
  });

  it("does not render the removed footer navigation, socials, legal, or payment area", () => {
    render(<SiteFooter />);

    expect(screen.queryByRole("navigation", { name: "Footer navigation" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Instagram" })).not.toBeInTheDocument();
    expect(screen.queryByText("© 2026 YourPrettySets. All rights reserved.")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("img", {
        name: "Accepted payment methods: Apple Pay, Shop Pay, Visa, Mastercard, and PayPal"
      })
    ).not.toBeInTheDocument();
  });
});
