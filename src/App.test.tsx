import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the YourPrettySets home experience", () => {
    render(<App />);

    expect(screen.getByText("YourPrettySets")).toBeInTheDocument();
    expect(
      within(screen.getByRole("navigation", { name: "Primary navigation" })).getByRole("link", {
        name: "Shop Collections"
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Art on Miniature Canvases" })).toBeInTheDocument();
  });
});
