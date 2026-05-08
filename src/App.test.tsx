import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("renders the YourPrettySets home experience", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: "YourPrettySets home" })).toBeInTheDocument();
    expect(
      within(screen.getByRole("navigation", { name: "Primary navigation" })).getByRole("link", {
        name: "Shop Collections"
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ready-to-wear sets for pretty plans" })).toBeInTheDocument();
  });

  it("groups footer links into a mobile-friendly accordion", async () => {
    const user = userEvent.setup();
    render(<App />);

    const footer = within(screen.getByRole("contentinfo"));
    const shopGroup = footer.getByRole("button", { name: /Shop/i });
    const helpGroup = footer.getByRole("button", { name: /Help/i });

    expect(footer.getByText("Ready-to-wear press-ons, packed with care.")).toBeInTheDocument();
    expect(footer.queryByRole("link", { name: "Contact us" })).not.toBeInTheDocument();
    expect(shopGroup).toHaveAttribute("aria-expanded", "true");
    expect(footer.getByRole("link", { name: "Collections" })).toHaveAttribute("href", "#shop-collections");
    expect(footer.queryByRole("link", { name: "Care tips" })).not.toBeInTheDocument();

    await user.click(helpGroup);

    expect(shopGroup).toHaveAttribute("aria-expanded", "false");
    expect(helpGroup).toHaveAttribute("aria-expanded", "true");
    expect(footer.getByRole("link", { name: "Care tips" })).toHaveAttribute("href", "#faq");
    expect(footer.getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "#contact");
    expect(footer.queryByRole("link", { name: "Collections" })).not.toBeInTheDocument();
  });
});
