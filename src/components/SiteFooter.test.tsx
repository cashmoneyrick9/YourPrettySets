import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { SiteFooter } from "./SiteFooter";

afterEach(() => {
  cleanup();
});

describe("SiteFooter", () => {
  function renderSiteFooter() {
    return render(
      <BrowserRouter>
        <SiteFooter />
      </BrowserRouter>
    );
  }

  it("renders the approved mobile footer navigation and utility sections", () => {
    renderSiteFooter();

    const footer = screen.getByRole("contentinfo");
    const footerNav = within(footer).getByRole("navigation", { name: "Footer navigation" });

    expect(within(footer).queryByRole("link", { name: "YourPrettySets home" })).not.toBeInTheDocument();
    expect(within(footer).queryByRole("region", { name: "Get 15% off your first order" })).not.toBeInTheDocument();
    expect(within(footer).getByText("YourPrettySets")).toBeInTheDocument();
    expect(within(footerNav).getByText("Shop")).toBeInTheDocument();
    expect(within(footerNav).getByText("Help")).toBeInTheDocument();
    expect(within(footerNav).getByText("Policies")).toBeInTheDocument();
    expect(within(footerNav).getByRole("link", { name: "Shop All" })).toHaveAttribute("href", "/shop");
    expect(within(footerNav).getByRole("link", { name: "New Arrivals" })).toHaveAttribute("href", "/shop");
    expect(within(footerNav).getByRole("link", { name: "Best Sellers" })).toHaveAttribute("href", "/shop");

    expect(within(footerNav).getByRole("link", { name: "Sizing" })).toHaveAttribute("href", "/help/sizing");
    expect(within(footerNav).getByRole("link", { name: "Application" })).toHaveAttribute("href", "/help/how-to-apply");
    expect(within(footerNav).getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/help/contact");
    expect(within(footerNav).getByRole("link", { name: "Shipping" })).toHaveAttribute("href", "/help/shipping-returns");
    expect(within(footerNav).getByRole("link", { name: "Returns" })).toHaveAttribute("href", "/help/shipping-returns");
    expect(within(footerNav).getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(within(footerNav).getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });

  it("renders text socials, exact love note, and current-year copyright without the removed trust strip", () => {
    renderSiteFooter();

    const footer = screen.getByRole("contentinfo");
    const currentYear = new Date().getFullYear();
    const loveNote = within(footer).getByText("made for you, with love");

    expect(loveNote).toHaveTextContent(/^made for you, with love$/);
    expect(loveNote).not.toHaveTextContent("♡");
    expect(loveNote.textContent?.endsWith(".")).toBe(false);
    expect(within(footer).queryByText("Follow Us")).not.toBeInTheDocument();
    expect(within(footer).getByRole("link", { name: "Instagram ↗" })).toHaveAttribute("href", "#instagram");
    expect(within(footer).getByRole("link", { name: "TikTok ↗" })).toHaveAttribute("href", "#tiktok");
    expect(within(footer).getByRole("link", { name: "Pinterest ↗" })).toHaveAttribute("href", "#pinterest");
    expect(within(footer).getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:hello@yourprettysets.com"
    );
    expect(within(footer).queryByRole("img")).not.toBeInTheDocument();
    expect(within(footer).queryByRole("separator")).not.toBeInTheDocument();
    expect(within(footer).getByText(`© ${currentYear} YourPrettySets. All rights reserved.`)).toBeInTheDocument();
    expect(within(footer).queryByLabelText("Footer trust notes")).not.toBeInTheDocument();
    expect(within(footer).queryByText("Mobile First")).not.toBeInTheDocument();
    expect(within(footer).queryByText("Designed for thumb comfort.")).not.toBeInTheDocument();
  });
});
