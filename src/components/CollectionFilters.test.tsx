import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { collectionLabels } from "../data/products";
import { CollectionFilters } from "./CollectionFilters";

describe("CollectionFilters", () => {
  it("renders every visible collection except New Arrivals as a link", () => {
    render(<CollectionFilters />);

    for (const collection of collectionLabels.filter((label) => label !== "New Arrivals")) {
      expect(screen.getByRole("link", { name: collection })).toBeInTheDocument();
    }
    expect(screen.queryByRole("link", { name: "New Arrivals" })).not.toBeInTheDocument();
  });
});
