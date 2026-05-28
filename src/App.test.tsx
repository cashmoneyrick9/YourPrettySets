import { cleanup, render, screen, within } from "@testing-library/react";
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

  it("renders the email capture system at the bottom without the removed footer", () => {
    render(<App />);

    expect(screen.getByRole("region", { name: "Get 15% off your first set" })).toBeInTheDocument();
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Cohesive footer preview" })).not.toBeInTheDocument();
  });
});
