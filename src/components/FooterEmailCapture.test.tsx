import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { FooterEmailCapture } from "./FooterEmailCapture";

afterEach(() => {
  cleanup();
});

describe("FooterEmailCapture", () => {
  it("renders the image-backed footer email capture and submit feedback", async () => {
    const user = userEvent.setup();
    render(<FooterEmailCapture />);

    const emailCapture = screen.getByRole("region", { name: "Get 15% off your first order" });

    expect(emailCapture).toHaveClass("site-footer-email--restored");
    expect(emailCapture).toHaveClass("site-footer-email--image");
    expect(within(emailCapture).queryByText("YOURPRETTYSETS")).not.toBeInTheDocument();
    expect(within(emailCapture).getByText("Join our email list for new drops, restocks, and exclusive offers.")).toBeInTheDocument();
    expect(within(emailCapture).getByPlaceholderText("Email address")).toHaveAttribute("type", "email");
    expect(within(emailCapture).getByPlaceholderText("Email address")).toHaveAttribute("required");
    expect(within(emailCapture).getByPlaceholderText("Email address")).toHaveAttribute("autocomplete", "email");
    expect(within(emailCapture).getByRole("button", { name: "Get 15% Off" })).toHaveAttribute("type", "submit");
    expect(within(emailCapture).getByText("No spam. Unsubscribe anytime.")).toBeInTheDocument();
    expect(within(emailCapture).queryByText("Early access + exclusive drops")).not.toBeInTheDocument();

    await user.type(within(emailCapture).getByPlaceholderText("Email address"), "shopper@example.com");
    await user.click(within(emailCapture).getByRole("button", { name: "Get 15% Off" }));

    expect(within(emailCapture).getByText("You’re on the list. Your code is coming soon.")).toBeInTheDocument();
  });
});
