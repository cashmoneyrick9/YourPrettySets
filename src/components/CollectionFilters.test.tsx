import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CollectionFilters } from "./CollectionFilters";

describe("CollectionFilters", () => {
  it("renders the approved top shopping paths as visual collection tiles", () => {
    render(<CollectionFilters />);

    for (const collection of ["Everyday", "Date Night", "Vacation"]) {
      expect(screen.getByRole("link", { name: collection })).toBeInTheDocument();
    }

    expect(screen.getByRole("link", { name: "See all" })).toHaveAttribute("href", "#shop-more");
    expect(screen.queryByRole("link", { name: "New Arrivals" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Bridal" })).not.toBeInTheDocument();
    expect(document.querySelectorAll(".collection-card__visual")).toHaveLength(3);
    expect(document.querySelectorAll(".collection-card__nail")).toHaveLength(15);
  });
});
