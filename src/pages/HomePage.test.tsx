import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

afterEach(() => {
  cleanup();
});

describe("HomePage", () => {
  it("renders the mobile shopping path before product shopping", () => {
    render(<HomePage />);

    const hero = screen.getByRole("heading", { name: "Ready-to-wear sets for pretty plans" });
    const confidence = screen.getByRole("heading", { name: "Ready in three steps" });
    const collections = screen.getByRole("heading", { name: "Browse by the plan, mood, or moment." });
    const newArrivals = screen.getByRole("heading", { name: "New Arrivals" });

    expect(hero).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop sets" })).toHaveAttribute("href", "#shop-collections");
    expect(screen.getByText("Pick your set")).toBeInTheDocument();
    expect(screen.getByText("Choose your wear")).toBeInTheDocument();
    expect(screen.getByText("Press on pretty")).toBeInTheDocument();
    expect(screen.queryByText(/size/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sizing kit/i)).not.toBeInTheDocument();

    expect(hero.compareDocumentPosition(confidence) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(confidence.compareDocumentPosition(collections) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(collections.compareDocumentPosition(newArrivals) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Featured Sets" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Everything needed to apply and care for your set." })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pretty notes from future customers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Quick answers" })).toBeInTheDocument();
  });

  it("links FAQ teaser questions to the future FAQ page", () => {
    render(<HomePage />);

    expect(screen.getByRole("link", { name: "What comes with each set?" })).toHaveAttribute("href", "/faq");
    expect(screen.getByRole("link", { name: "How long do press-ons last?" })).toHaveAttribute("href", "/faq");
    expect(screen.getByRole("link", { name: "Can I reuse them?" })).toHaveAttribute("href", "/faq");
  });
});
