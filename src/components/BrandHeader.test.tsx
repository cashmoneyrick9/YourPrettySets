import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandHeader } from "./BrandHeader";

describe("BrandHeader", () => {
  it("renders the brand and all primary navigation links", () => {
    render(<BrandHeader />);

    expect(screen.getByLabelText("YourPrettySets home")).toBeInTheDocument();
    for (const label of ["Home", "Shop Collections", "How It Works", "FAQ", "Bag"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });
});
