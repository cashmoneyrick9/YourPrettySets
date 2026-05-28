import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MobileCarousel } from "./MobileCarousel";

afterEach(() => {
  cleanup();
});

describe("MobileCarousel", () => {
  it("renders flexible slide content with accessible controls and optional dots", () => {
    render(
      <MobileCarousel
        ariaLabel="Reusable carousel demo"
        showDots
        slides={[
          <div key="one">Slide one</div>,
          <div key="two">Slide two</div>,
          <div key="three">Slide three</div>
        ]}
      />
    );

    const carousel = screen.getByRole("region", { name: "Reusable carousel demo" });

    expect(within(carousel).getByText("Slide one")).toBeInTheDocument();
    expect(within(carousel).getByText("Slide two")).toBeInTheDocument();
    expect(within(carousel).getByRole("button", { name: "Previous slide" })).toBeInTheDocument();
    expect(within(carousel).getByRole("button", { name: "Next slide" })).toBeInTheDocument();
    expect(within(carousel).getAllByRole("button", { name: /Go to slide/i })).toHaveLength(3);
  });

  it("can render a blank placeholder carousel for future section content", () => {
    render(<MobileCarousel ariaLabel="Blank carousel" slideCount={2} showDots />);

    const carousel = screen.getByRole("region", { name: "Blank carousel" });

    expect(carousel.querySelectorAll(".mobile-carousel__placeholder")).toHaveLength(2);
    expect(within(carousel).getAllByRole("button", { name: /Go to slide/i })).toHaveLength(2);
  });

  it("can hide arrow controls while keeping swipeable slides", () => {
    render(<MobileCarousel ariaLabel="Swipe-only carousel" showArrows={false} slideCount={2} />);

    const carousel = screen.getByRole("region", { name: "Swipe-only carousel" });

    expect(carousel.querySelectorAll(".mobile-carousel__placeholder")).toHaveLength(2);
    expect(within(carousel).queryByRole("button", { name: "Previous slide" })).not.toBeInTheDocument();
    expect(within(carousel).queryByRole("button", { name: "Next slide" })).not.toBeInTheDocument();
    expect(carousel.querySelector(".mobile-carousel__controls")).not.toBeInTheDocument();
  });

});
