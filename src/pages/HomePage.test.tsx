import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("renders every approved Home section", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Art on Miniature Canvases" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "New Arrivals" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Browse by the plan, mood, or moment." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Featured Sets" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Everything needed to apply and care for your set." })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How it works" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pretty notes from future customers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Quick answers" })).toBeInTheDocument();
  });
});
