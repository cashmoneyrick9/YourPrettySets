import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

afterEach(() => {
  cleanup();
});

function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

describe("App", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.history.pushState({}, "", "/");
  });

  it("renders the YourPrettySets home experience", () => {
    renderApp();

    expect(document.querySelector(".site-shell")).not.toHaveClass("site-shell--barebones");
    expect(
      within(screen.getByRole("banner")).getByRole("link", { name: "YourPrettySets home" })
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("navigation", { name: "Primary navigation" })).getByRole("link", {
        name: "Shop Collections"
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ready-to-wear sets for pretty plans" })).toBeInTheDocument();
  });

  it("renders the Shop All page at /shop", () => {
    window.history.pushState({}, "", "/shop");

    renderApp();

    expect(screen.getByRole("heading", { name: "Shop All" })).toBeInTheDocument();
    expect(screen.getByText("33 sets")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Ready-to-wear sets for pretty plans" })).not.toBeInTheDocument();
  });

  it("navigates from Home to Shop All without reloading the document", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(
      within(screen.getByRole("navigation", { name: "Primary navigation" })).getByRole("link", {
        name: "Shop Collections"
      })
    );

    expect(screen.getByRole("heading", { name: "Shop All" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Ready-to-wear sets for pretty plans" })).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/shop");
  });

  it("navigates from the hero Shop sets CTA to Shop All", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("link", { name: "Shop sets" }));

    expect(screen.getByRole("heading", { name: "Shop All" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/shop");
  });

  it("resets scroll when navigating from Home collection previews to Shop", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.mocked(window.scrollTo);
    renderApp();
    scrollTo.mockClear();

    await user.click(screen.getByRole("link", { name: "See more" }));

    expect(screen.getByRole("heading", { name: "Shop All" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/shop");
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });

  it("does not reset scroll for hash-only homepage navigation", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.mocked(window.scrollTo);
    renderApp();
    scrollTo.mockClear();

    await user.click(
      within(screen.getByRole("navigation", { name: "Primary navigation" })).getByRole("link", {
        name: "FAQ"
      })
    );

    expect(window.location.pathname).toBe("/");
    expect(window.location.hash).toBe("#faq");
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("renders the approved footer system at the bottom", () => {
    renderApp();

    const footer = screen.getByRole("contentinfo");

    expect(within(footer).getByRole("navigation", { name: "Footer shop navigation" })).toBeInTheDocument();
    expect(within(footer).getByRole("region", { name: "Get 15% off your first set" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Cohesive footer preview" })).not.toBeInTheDocument();
  });
});
