import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KitContents } from "./KitContents";

describe("KitContents", () => {
  it("renders the full included kit list", () => {
    render(<KitContents />);

    for (const item of [
      "24 nails",
      "Adhesive tabs",
      "Nail glue",
      "Nail file",
      "Cuticle pusher",
      "Alcohol wipe",
      "Application card",
      "Storage box or bag"
    ]) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });
});
