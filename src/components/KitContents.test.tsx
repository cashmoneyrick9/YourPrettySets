import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { KitContents } from "./KitContents";

afterEach(() => {
  cleanup();
});

describe("KitContents", () => {
  it("renders the approved mobile-first What’s Included section", () => {
    render(<KitContents />);

    expect(screen.getByText("THE COMPLETE SET")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What’s Included" })).toBeInTheDocument();
    expect(screen.getByText("Everything you need for your set.")).toBeInTheDocument();
    expect(document.querySelector(".kit-spread")).toBeInTheDocument();
    const kitImage = screen.getByRole("img", { name: "Press-on nail kit with tabs and tools" });
    expect(kitImage).toHaveAttribute("src", "/assets/kit-contents-spread.png");
    expect(document.querySelector(".kit-spread")?.children).toHaveLength(1);
    expect(document.querySelectorAll(".kit-spread__piece")).toHaveLength(0);

    expect(screen.getByRole("button", { name: /Made to fit/i })).toBeInTheDocument();
    expect(screen.getByText("Made to fit")).toBeInTheDocument();
    expect(screen.getByText("24 nails in multiple sizes")).toBeInTheDocument();
    expect(screen.getByText("Extra sizes help you find the best fit for each finger before applying.")).toBeInTheDocument();
    expect(document.querySelectorAll(".kit-size-tile")).toHaveLength(8);

    expect(screen.getByRole("button", { name: /Prep \+ apply kit/i })).toBeInTheDocument();
    expect(screen.getByText("Prep + apply kit")).toBeInTheDocument();
    expect(screen.getByText("Tabs, glue, file, wipe + pusher")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /HOW TO APPLY & CARE/i })).toHaveAttribute("href", "#faq");
    expect(screen.getByRole("link", { name: "Have a question? Visit our FAQ" })).toHaveAttribute("href", "#faq");

    expect(screen.queryByText(/24 press-on nails/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Prep and size")).not.toBeInTheDocument();
    expect(screen.queryByText("Apply with glue or tabs")).not.toBeInTheDocument();
    expect(screen.queryByText("Press, hold, and wear")).not.toBeInTheDocument();
    expect(screen.queryByText("Reuse with proper care")).not.toBeInTheDocument();
  });

  it("opens Made to fit by default and switches one accordion card at a time", async () => {
    const user = userEvent.setup();
    render(<KitContents />);

    const fitButton = screen.getByRole("button", { name: /Made to fit/i });
    const prepButton = screen.getByRole("button", { name: /Prep \+ apply kit/i });

    expect(fitButton).toHaveAttribute("aria-expanded", "true");
    expect(prepButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Extra sizes help you find the best fit for each finger before applying.")).toBeInTheDocument();
    expect(screen.queryByText("Adhesive tabs")).not.toBeInTheDocument();

    await user.click(prepButton);

    expect(fitButton).toHaveAttribute("aria-expanded", "false");
    expect(prepButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByText("Extra sizes help you find the best fit for each finger before applying.")).not.toBeInTheDocument();
    expect(screen.getByText("Adhesive tabs")).toBeInTheDocument();
    expect(screen.getByText("Storage pouch/card")).toBeInTheDocument();
  });

  it("does not render the old accordion controls or care tips CTA", () => {
    render(<KitContents />);

    expect(screen.queryByRole("link", { name: /See care tips/i })).not.toBeInTheDocument();
    expect(document.querySelector(".kit-care-link")).not.toBeInTheDocument();
    expect(document.querySelector(".kit-info-card")).not.toBeInTheDocument();
  });
});
