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
    expect(kitImage).toHaveAttribute("src", "/assets/kit-contents-spread-v2.png");
    expect(document.querySelector(".kit-spread")?.children).toHaveLength(1);
    expect(document.querySelectorAll(".kit-spread__piece")).toHaveLength(0);

    expect(screen.getByRole("button", { name: /Made to fit/i })).toBeInTheDocument();
    expect(screen.getByText("Made to fit")).toBeInTheDocument();
    expect(screen.getByText("24 nails in multiple sizes")).toBeInTheDocument();
    expect(screen.queryByText("Extra sizes help you find the best fit for each finger before applying.")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Twenty-four press-on nails in multiple sizes with small fruit details" })).toHaveAttribute(
      "src",
      "/assets/nail-size-set.png"
    );
    expect(document.querySelector(".kit-size-row__image")).toBeInTheDocument();
    expect(document.querySelectorAll(".kit-size-tile")).toHaveLength(0);

    expect(screen.getByRole("button", { name: /Prep \+ apply kit/i })).toBeInTheDocument();
    expect(screen.getByText("Prep + apply kit")).toBeInTheDocument();
    expect(screen.getByText("Tabs, glue, file, wipe + pusher")).toBeInTheDocument();
    const applyCareLink = screen.getByRole("link", { name: /HOW TO APPLY & CARE/i });
    expect(applyCareLink).toHaveAttribute("href", "#faq");
    expect(applyCareLink).toHaveClass("kit-primary-link");
    expect(applyCareLink).toHaveAttribute("data-slot", "button");
    const faqLink = screen.getByRole("link", { name: "Have a question? Visit our FAQ" });
    expect(faqLink).toHaveAttribute("href", "#faq");
    expect(faqLink).toHaveClass("kit-faq-link");
    expect(faqLink).toHaveAttribute("data-slot", "button");

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
    expect(screen.queryByText("Extra sizes help you find the best fit for each finger before applying.")).not.toBeInTheDocument();
    expect(screen.queryByText("Adhesive tabs")).not.toBeInTheDocument();

    await user.click(prepButton);

    expect(fitButton).toHaveAttribute("aria-expanded", "false");
    expect(prepButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByText("Extra sizes help you find the best fit for each finger before applying.")).not.toBeInTheDocument();
    expect(screen.getByText("Adhesive tabs")).toBeInTheDocument();
    expect(screen.getByText("Nail glue")).toBeInTheDocument();
    expect(screen.getByText("Nail file")).toBeInTheDocument();
    expect(screen.getByText("Cuticle pusher")).toBeInTheDocument();
    expect(screen.getByText("Alcohol wipe")).toBeInTheDocument();
    expect(screen.getByText("Storage case/card")).toBeInTheDocument();
    expect(document.querySelector(".kit-item-preview")).not.toBeInTheDocument();
    expect(document.querySelectorAll(".kit-item-card")).toHaveLength(6);
    expect(document.querySelectorAll(".kit-item-card__image")).toHaveLength(6);
    expect([...document.querySelectorAll<HTMLImageElement>(".kit-item-card__image")].map((image) => image.getAttribute("src"))).toEqual([
      "/assets/adhesive-tabs.png",
      "/assets/nail-glue.png",
      "/assets/nail-file.png",
      "/assets/cuticle-pusher.png",
      "/assets/alcohol-wipe.png",
      "/assets/storage-case.png"
    ]);
    expect(screen.queryByRole("button", { name: "Adhesive tabs" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Nail glue" })).not.toBeInTheDocument();
  });

  it("does not render the old accordion controls or care tips CTA", () => {
    render(<KitContents />);

    expect(screen.queryByRole("link", { name: /See care tips/i })).not.toBeInTheDocument();
    expect(document.querySelector(".kit-care-link")).not.toBeInTheDocument();
    expect(document.querySelector(".kit-info-card")).not.toBeInTheDocument();
  });
});
