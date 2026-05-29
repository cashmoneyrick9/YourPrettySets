import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("renders the YourPrettySets home experience", () => {
    render(<App />);

    expect(
      within(screen.getByRole("banner")).getByRole("link", { name: "YourPrettySets home" })
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("navigation", { name: "Primary navigation" })).getByRole("link", {
        name: "Shop Collections"
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ready-to-wear sets for pretty plans" })).toBeInTheDocument();
  });

  it("renders the approved footer system at the bottom", () => {
    render(<App />);

    const footer = screen.getByRole("contentinfo");

    expect(within(footer).getByRole("navigation", { name: "Footer shop navigation" })).toBeInTheDocument();
    expect(within(footer).getByRole("region", { name: "Get 15% off your first set" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Cohesive footer preview" })).not.toBeInTheDocument();
  });
});
