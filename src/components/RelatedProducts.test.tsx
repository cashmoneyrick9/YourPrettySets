import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { products } from "../data/products";
import { getRelatedProducts, RelatedProducts } from "./RelatedProducts";

describe("RelatedProducts", () => {
  it("deterministically excludes the current product", () => {
    const firstPass = getRelatedProducts(products[0]);
    const secondPass = getRelatedProducts(products[0]);

    expect(firstPass).toHaveLength(4);
    expect(firstPass).toEqual(secondPass);
    expect(firstPass).not.toContain(products[0]);
  });

  it("renders product links and an independent favorite control", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RelatedProducts product={products[0]} />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("link", { name: /^View / })).toHaveLength(4);
    expect(screen.queryByRole("link", { name: `View ${products[0].name}` })).not.toBeInTheDocument();
    for (const relatedProduct of getRelatedProducts(products[0])) {
      expect(screen.getByRole("img", { name: relatedProduct.images.clean })).toHaveAttribute(
        "src",
        relatedProduct.media?.clean
      );
    }

    const favorite = screen.getAllByRole("button", { name: /^Favorite / })[0];
    await user.click(favorite);

    expect(favorite).toHaveAttribute("aria-pressed", "true");
  });
});
