import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

afterEach(() => {
  cleanup();
});

describe("SiteFooter", () => {
  it("renders the approved mobile footer navigation and utility sections", () => {
    render(<SiteFooter />);

    const footer = screen.getByRole("contentinfo");
    const shopNav = within(footer).getByRole("navigation", { name: "Footer shop navigation" });
    const policyNav = within(footer).getByRole("navigation", { name: "Footer policy navigation" });

    expect(within(footer).queryByRole("link", { name: "YourPrettySets home" })).not.toBeInTheDocument();
    expect(within(footer).getByRole("region", { name: "Get 15% off your first set" })).toBeInTheDocument();
    expect(within(shopNav).getByRole("link", { name: "Shop All" })).toHaveAttribute("href", "/shop");
    expect(within(shopNav).getByRole("link", { name: "New Arrivals" })).toBeInTheDocument();
    expect(within(shopNav).getByRole("link", { name: "Best Sellers" })).toBeInTheDocument();
    expect(within(shopNav).getByRole("link", { name: "Accessories" })).toBeInTheDocument();

    expect(within(policyNav).getByRole("link", { name: "Shipping" })).toBeInTheDocument();
    expect(within(policyNav).getByRole("link", { name: "Returns" })).toBeInTheDocument();
    expect(within(policyNav).getByRole("link", { name: "Privacy" })).toBeInTheDocument();
    expect(within(policyNav).getByRole("link", { name: "Terms" })).toBeInTheDocument();
  });

  it("restores the old footer email capture and submit feedback", async () => {
    const user = userEvent.setup();
    render(<SiteFooter />);

    const footer = screen.getByRole("contentinfo");
    const emailCapture = within(footer).getByRole("region", { name: "Get 15% off your first set" });

    expect(within(emailCapture).getByText("YOURPRETTYSETS")).toBeInTheDocument();
    expect(within(emailCapture).getByText("Join the list for new drops, restocks, and exclusive offers.")).toBeInTheDocument();
    expect(within(emailCapture).getByPlaceholderText("Email address")).toHaveAttribute("type", "email");
    expect(within(emailCapture).getByRole("button", { name: "Get 15% off" })).toHaveAttribute("type", "submit");
    expect(within(emailCapture).queryByText("Early access + exclusive drops")).not.toBeInTheDocument();

    await user.type(within(emailCapture).getByPlaceholderText("Email address"), "shopper@example.com");
    await user.click(within(emailCapture).getByRole("button", { name: "Get 15% off" }));

    expect(within(emailCapture).getByText("You're on the list. Your code is coming soon.")).toBeInTheDocument();
  });

  it("renders centered socials, brand note, and copyright without the removed trust strip", () => {
    render(<SiteFooter />);

    const footer = screen.getByRole("contentinfo");

    expect(within(footer).getByText("Follow Us")).toBeInTheDocument();
    expect(within(footer).getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "#instagram");
    expect(within(footer).getByRole("link", { name: "TikTok" })).toHaveAttribute("href", "#tiktok");
    expect(within(footer).getByRole("link", { name: "Pinterest" })).toHaveAttribute("href", "#pinterest");
    expect(within(footer).getByRole("link", { name: "YouTube" })).toHaveAttribute("href", "#youtube");
    expect(within(footer).getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:hello@yourprettysets.com"
    );
    expect(within(footer).getByText("made for you, with love. ♡")).toBeInTheDocument();
    expect(within(footer).getByText("© 2024 YourPrettySets. All rights reserved.")).toBeInTheDocument();
    expect(within(footer).queryByLabelText("Footer trust notes")).not.toBeInTheDocument();
    expect(within(footer).queryByText("Mobile First")).not.toBeInTheDocument();
    expect(within(footer).queryByText("Designed for thumb comfort.")).not.toBeInTheDocument();
  });
});
