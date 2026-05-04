import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the YourPrettySets brand shell", () => {
    render(<App />);

    expect(screen.getByText("YourPrettySets")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop Collections" })).toBeInTheDocument();
  });
});
