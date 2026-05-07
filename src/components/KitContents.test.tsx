import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { KitContents } from "./KitContents";

afterEach(() => {
  cleanup();
});

describe("KitContents", () => {
  it("renders a compact kit summary with grouped accordions", () => {
    render(<KitContents />);

    expect(screen.getByRole("heading", { name: "Everything ready for your set." })).toBeInTheDocument();
    expect(screen.getByText("24 nails plus the tools to apply, wear, and store them.")).toBeInTheDocument();
    expect(document.querySelector(".kit-flatlay")).toBeInTheDocument();
    expect(document.querySelectorAll(".kit-flatlay__nail")).toHaveLength(6);

    expect(screen.getByRole("button", { name: /In the set/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("24 nails")).toBeInTheDocument();
    expect(screen.getByText("Adhesive tabs")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /For application/i })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Nail glue, Nail file, Cuticle pusher")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /For aftercare/i })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Alcohol wipe, Application card, Storage box")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See care tips" })).toHaveAttribute("href", "#faq");
    expect(document.querySelector(".kit-list")).not.toBeInTheDocument();
  });

  it("expands one kit group at a time", async () => {
    const user = userEvent.setup();
    render(<KitContents />);

    await user.click(screen.getByRole("button", { name: /For application/i }));

    expect(screen.getByRole("button", { name: /In the set/i })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: /For application/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Nail glue")).toBeInTheDocument();
    expect(screen.getByText("Nail file")).toBeInTheDocument();
    expect(screen.getByText("Cuticle pusher")).toBeInTheDocument();
    expect(screen.queryByText("Adhesive tabs")).not.toBeInTheDocument();
  });
});
