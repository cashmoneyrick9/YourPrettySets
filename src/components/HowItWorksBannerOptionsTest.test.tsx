import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HowItWorksBannerOptionsTest } from "./HowItWorksBannerOptionsTest";

afterEach(cleanup);

describe("HowItWorksBannerOptionsTest", () => {
  it("opens on the three-image journey and switches to the earlier directions", () => {
    render(<HowItWorksBannerOptionsTest />);

    expect(screen.getByRole("heading", { level: 2, name: "Compare the directions" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "E · Journey + Type" })).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelectorAll(".how-it-works-options-test__step")).toHaveLength(6);
    expect(document.querySelectorAll(".how-it-works-options-test__viewport img")).toHaveLength(6);
    expect(
      screen.getByRole("img", { name: "Choose your set. Find the design that feels like you." })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Choose your method. Choose the hold that works for you." })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Wear. Press on and enjoy your finished set." })).toBeInTheDocument();
    expect(document.querySelector(".how-it-works-options-test__viewport img")).toHaveAttribute(
      "src",
      "/assets/how-it-works-banner-test/how-it-works-option-e-v4-choose.jpg"
    );
    expect(document.querySelector(".how-it-works-options-test__viewport")).toHaveClass(
      "how-it-works-options-test__viewport--steps"
    );

    fireEvent.click(screen.getByRole("button", { name: "A · Objects" }));

    expect(screen.getByRole("button", { name: "A · Objects" })).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelectorAll(".how-it-works-options-test__viewport img")).toHaveLength(2);
    expect(document.querySelector(".how-it-works-options-test__viewport img")).toHaveAttribute(
      "src",
      "/assets/how-it-works-banner-test/how-it-works-option-a-products.jpg"
    );

    fireEvent.click(screen.getByRole("button", { name: "C · Journey" }));

    expect(screen.getByRole("button", { name: "C · Journey" })).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".how-it-works-options-test__viewport img")).toHaveAttribute(
      "src",
      "/assets/how-it-works-banner-test/how-it-works-option-c-journey.jpg"
    );
  });

  it("keeps typography and clean versions together under option D", () => {
    render(<HowItWorksBannerOptionsTest />);

    fireEvent.click(screen.getByRole("button", { name: "D · Type" }));

    expect(screen.getByRole("button", { name: "Typography mockup" })).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".how-it-works-options-test__viewport img")).toHaveAttribute(
      "src",
      "/assets/how-it-works-banner-test/how-it-works-option-d-typography.jpg"
    );

    fireEvent.click(screen.getByRole("button", { name: "Clean image" }));

    expect(screen.getByRole("button", { name: "Clean image" })).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".how-it-works-options-test__viewport img")).toHaveAttribute(
      "src",
      "/assets/how-it-works-banner-test/how-it-works-option-d-clean.jpg"
    );
  });

  it("pauses the active preview on focus or pointer interaction", () => {
    render(<HowItWorksBannerOptionsTest />);
    const preview = screen.getByRole("group", {
      name: "Three-step journey moving banner preview. Focus or touch to pause movement."
    });

    fireEvent.focus(preview);
    expect(preview).toHaveClass("how-it-works-banner-test__viewport--paused");

    fireEvent.blur(preview);
    expect(preview).not.toHaveClass("how-it-works-banner-test__viewport--paused");

    fireEvent.pointerDown(preview);
    expect(preview).toHaveClass("how-it-works-banner-test__viewport--paused");

    fireEvent.pointerUp(preview);
    expect(preview).not.toHaveClass("how-it-works-banner-test__viewport--paused");
  });
});
