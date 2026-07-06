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
    expect(within(footerNav).getByRole("link", { name: "Ready to Ship" })).toHaveAttribute(
      "href",
      "/shop/ready-to-ship"
    );

    expect(within(footerNav).getByRole("link", { name: "Sizing" })).toHaveAttribute("href", "/help/sizing");
    expect(within(footerNav).getByRole("link", { name: "Application" })).toHaveAttribute("href", "/help/how-to-apply");
    expect(within(footerNav).getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/help/contact");
    expect(within(footerNav).getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/help/faq");
    expect(within(footerNav).getByRole("link", { name: "Shipping" })).toHaveAttribute("href", "/help/shipping-returns");
    expect(within(footerNav).getByRole("link", { name: "Returns" })).toHaveAttribute("href", "/help/shipping-returns");
    expect(within(footerNav).getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(within(footerNav).getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });

  it("renders icon-only social links, exact love note, and current-year copyright without the removed trust strip", () => {
    renderSiteFooter();

    const footer = screen.getByRole("contentinfo");
    const instagramLink = within(footer).getByRole("link", { name: "Instagram" });
    const tiktokLink = within(footer).getByRole("link", { name: "TikTok" });
    const pinterestLink = within(footer).getByRole("link", { name: "Pinterest" });
    const emailLink = within(footer).getByRole("link", { name: "Email" });
    const currentYear = new Date().getFullYear();
    const loveNote = within(footer).getByText("made for you, with love");

    expect(loveNote).toHaveTextContent(/^made for you, with love$/);
    expect(loveNote).not.toHaveTextContent("♡");
    expect(loveNote.textContent?.endsWith(".")).toBe(false);
    expect(within(footer).queryByText("Follow Us")).not.toBeInTheDocument();
    expect(instagramLink).toHaveAttribute("href", "#instagram");
    expect(tiktokLink).toHaveAttribute("href", "#tiktok");
    expect(pinterestLink).toHaveAttribute("href", "#pinterest");
    expect(emailLink).toHaveAttribute("href", "mailto:hello@yourprettysets.com");
    expect(within(footer).queryByText("Instagram ↗")).not.toBeInTheDocument();
    expect(within(footer).queryByText("TikTok ↗")).not.toBeInTheDocument();
    expect(within(footer).queryByText("Pinterest ↗")).not.toBeInTheDocument();
    expect(instagramLink).toContainHTML("svg");
    expect(tiktokLink).toContainHTML("svg");
    expect(pinterestLink).toContainHTML("svg");
    expect(emailLink).toContainHTML("svg");
    expect(within(footer).queryByText("I")).not.toBeInTheDocument();
    expect(within(footer).queryByText("T")).not.toBeInTheDocument();
    expect(within(footer).queryByText("P")).not.toBeInTheDocument();
    expect(within(footer).queryByText("E")).not.toBeInTheDocument();
    expect(within(footer).queryByRole("img")).not.toBeInTheDocument();
    expect(within(footer).queryByRole("separator")).not.toBeInTheDocument();
    expect(within(footer).getByText(`© ${currentYear} YourPrettySets. All rights reserved.`)).toBeInTheDocument();
    expect(within(footer).queryByLabelText("Footer trust notes")).not.toBeInTheDocument();
    expect(within(footer).queryByText("Mobile First")).not.toBeInTheDocument();
    expect(within(footer).queryByText("Designed for thumb comfort.")).not.toBeInTheDocument();
  });
});
