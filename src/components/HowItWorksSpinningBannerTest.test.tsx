import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { HowItWorksSpinningBannerTest } from "./HowItWorksSpinningBannerTest";

const styles = readFileSync("src/components/HowItWorksSpinningBannerTest.css", "utf8");

afterEach(cleanup);

describe("HowItWorksSpinningBannerTest", () => {
  it("renders two matching three-step panels for a seamless isolated loop", () => {
    render(<HowItWorksSpinningBannerTest />);

    expect(screen.getByText("HOW IT WORKS")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "3 EASY STEPS" })).toBeInTheDocument();
    expect(document.querySelectorAll(".how-it-works-banner-test__panel")).toHaveLength(2);
    expect(document.querySelectorAll(".how-it-works-banner-test__panel img")).toHaveLength(6);
    expect(document.querySelector(".how-it-works-banner-test__panel--duplicate")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("img", { name: "Choose your set. Find the design that feels like you." })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Choose your method. Choose the hold that works for you." })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Wear. Press on and enjoy your finished set." })).toBeInTheDocument();
    expect(document.querySelector(".how-it-works-banner-test__panel img")).toHaveAttribute(
      "src",
      "/assets/how-it-works-banner-test/how-it-works-option-e-v4-choose.jpg"
    );
    expect(document.querySelector(".how-it-works-banner-test__viewport")).toHaveClass(
      "how-it-works-banner-test__viewport--selected"
    );
    expect(document.querySelector(".how-it-works-banner-test__steps")).not.toBeInTheDocument();
  });

  it("pauses while focused or touched", () => {
    render(<HowItWorksSpinningBannerTest />);
    const viewport = screen.getByRole("group", { name: /continuous three-step how it works banner/i });

    fireEvent.focus(viewport);
    expect(viewport).toHaveClass("how-it-works-banner-test__viewport--paused");

    fireEvent.blur(viewport);
    expect(viewport).not.toHaveClass("how-it-works-banner-test__viewport--paused");

    fireEvent.pointerDown(viewport);
    expect(viewport).toHaveClass("how-it-works-banner-test__viewport--paused");

    fireEvent.pointerUp(viewport);
    expect(viewport).not.toHaveClass("how-it-works-banner-test__viewport--paused");
  });

  it("defines a linear seamless loop and a stable reduced-motion state", () => {
    expect(styles).toContain("animation: how-it-works-banner-test-loop 16s linear infinite;");
    expect(styles).toContain("transform: translateX(-50%);");
    expect(styles).toContain("padding: clamp(18px, 3vw, 32px) 0 clamp(20px, 3vw, 32px);");
    expect(styles).toContain("border-radius: 0;");
    expect(styles).toContain("width: 200%;");
    expect(styles).not.toContain(".how-it-works-banner-test__panel::after");
    expect(styles).not.toContain(".how-it-works-banner-test__steps");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).toContain("animation: none;");
    expect(styles).toContain(".how-it-works-banner-test__panel--duplicate");
    expect(styles).toContain("display: none;");
  });
});
