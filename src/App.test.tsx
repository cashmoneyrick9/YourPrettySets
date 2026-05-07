import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("renders the YourPrettySets home experience", () => {
    render(<App />);

    expect(screen.getByText("YourPrettySets")).toBeInTheDocument();
    expect(
      within(screen.getByRole("navigation", { name: "Primary navigation" })).getByRole("link", {
        name: "Shop Collections"
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ready-to-wear sets for pretty plans" })).toBeInTheDocument();
  });

  it("includes footer placeholders for contact, social, and policies", () => {
    render(<App />);

    const footer = within(screen.getByRole("contentinfo"));

    expect(footer.getByRole("link", { name: "Contact placeholder" })).toBeInTheDocument();
    expect(footer.getByRole("link", { name: "Instagram placeholder" })).toBeInTheDocument();
    expect(footer.getByRole("link", { name: "Shipping policy placeholder" })).toBeInTheDocument();
    expect(footer.getByRole("link", { name: "Returns policy placeholder" })).toBeInTheDocument();
    expect(footer.getByRole("link", { name: "Privacy policy placeholder" })).toBeInTheDocument();
  });
});
