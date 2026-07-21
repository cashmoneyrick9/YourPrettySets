import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { ProductKitDrawers } from "./ProductKitDrawers";

afterEach(cleanup);

describe("ProductKitDrawers", () => {
  it("keeps one accessible image-led kit panel active at a time", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProductKitDrawers readyToWear />
      </MemoryRouter>
    );

    const nails = screen.getByRole("tab", { name: /Nails/i });
    const adhesives = screen.getByRole("tab", { name: /Glue \/ tabs/i });

    expect(nails).toHaveAttribute("aria-selected", "true");
    expect(adhesives).toHaveAttribute("aria-selected", "false");
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(document.querySelectorAll(".product-kit-showcase__tab-media img")).toHaveLength(4);
    expect(Array.from(document.querySelectorAll(".product-kit-showcase__tab-media img")).every((image) => image.getAttribute("alt") === "")).toBe(true);
    expect(screen.getByText(/Ready-to-wear sets include 24 press-on nails/i)).toBeInTheDocument();
    const nailsImage = screen.getByRole("img", { name: /Twenty-four blush press-on nails/i });
    expect(nailsImage).toHaveAttribute(
      "src",
      "/assets/kit/kit-nails.jpg"
    );
    expect(nailsImage.parentElement).toHaveClass("product-kit-showcase__media", "product-kit-showcase__media--nails");

    await user.click(adhesives);

    expect(nails).toHaveAttribute("aria-selected", "false");
    expect(adhesives).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/Nail Glue and adhesive tabs are included/i)).toBeInTheDocument();
    const adhesiveImage = screen.getByRole("img", { name: /Nail glue and clear adhesive tabs/i });
    expect(adhesiveImage).toHaveAttribute(
      "src",
      "/assets/kit/kit-adhesives.jpg"
    );
    expect(adhesiveImage.parentElement).toHaveClass("product-kit-showcase__media--adhesives");
  });

  it("supports arrow-key navigation between kit tabs", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ProductKitDrawers readyToWear />
      </MemoryRouter>
    );

    const nails = screen.getByRole("tab", { name: /Nails/i });
    nails.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: /Glue \/ tabs/i })).toHaveFocus();
    expect(screen.getByRole("tab", { name: /Glue \/ tabs/i })).toHaveAttribute("aria-selected", "true");
  });
});
