import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { canonicalFaqItems, helpRoutes } from "../data/helpContent";
import {
  includedSetItems,
  orderPolicyFacts,
  shippingFacts,
  sizingFacts,
  supportDetails,
  wearEstimates
} from "../data/storefrontFacts";
import {
  ApplicationGuidePage,
  ContactSupportPage,
  FaqPage,
  HelpHubPage,
  RemovalGuidePage,
  ShippingReturnsPage,
  SizingGuidePage
} from "./HelpPage";

afterEach(() => cleanup());

function renderHelpPage(page: React.ReactNode) {
  return render(<MemoryRouter>{page}</MemoryRouter>);
}

function expectOneH1(name: string) {
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1, name })).toBeInTheDocument();
}

describe("Help pages", () => {
  it("routes customers through one grouped Press-On Guide hub", () => {
    renderHelpPage(<HelpHubPage />);

    expectOneH1(helpRoutes.hub.title);
    for (const groupTitle of ["Before you order", "Apply and care", "Order help", "More help"]) {
      expect(screen.getByRole("heading", { level: 2, name: groupTitle })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Find Your Fit" })).toHaveAttribute("href", "/help/sizing");
    expect(screen.getByRole("link", { name: "Sizing Kit" })).toHaveAttribute("href", "/products/sizing-kit");
    expect(screen.getByRole("link", { name: "Apply Your Set" })).toHaveAttribute("href", "/help/application");
    expect(screen.getByRole("link", { name: "Remove & Reuse" })).toHaveAttribute("href", "/help/removal");
    expect(screen.getByRole("link", { name: "Shipping, Returns & Order Issues" })).toHaveAttribute(
      "href",
      "/help/shipping-returns"
    );
    expect(screen.getByText(`${sizingFacts.readyToWearNailCount} nails in each set`)).toBeInTheDocument();
  });

  it("explains confirmed sizing paths without fabricating a measurement chart", () => {
    renderHelpPage(<SizingGuidePage />);

    expectOneH1(helpRoutes.sizing.title);
    expect(screen.getAllByText(new RegExp(sizingFacts.presetRange)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(`$${sizingFacts.standaloneKitPrice}`).length).toBeGreaterThan(0);
    expect(screen.getByText(/millimeter-to-size chart is not available/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sizing Kit product page" })).toHaveAttribute(
      "href",
      "/products/sizing-kit"
    );
    expect(screen.getByRole("img", { name: /Twenty-four pale blush press-on nails/i })).toHaveAttribute(
      "src",
      "/assets/nail-size-set.png"
    );
    expect(document.querySelector(".help-article__body table")).not.toBeInTheDocument();
  });

  it("uses semantic steps and approved estimates throughout the application guide", () => {
    renderHelpPage(<ApplicationGuidePage />);

    expectOneH1(helpRoutes.application.title);
    for (const item of includedSetItems) expect(screen.getAllByText(item).length).toBeGreaterThan(0);
    expect(screen.getAllByText(`Approximately ${wearEstimates.glue}`).length).toBeGreaterThan(0);
    expect(screen.getAllByText(`Approximately ${wearEstimates.tabs}`).length).toBeGreaterThan(0);
    expect(document.querySelectorAll("ol.help-step-list").length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole("img", { name: /aligning a pale blush press-on/i })).toHaveAttribute(
      "src",
      "/assets/help/apply-press-on-alignment.jpg"
    );
    expect(screen.getByText(/Wear time is not guaranteed/i)).toBeInTheDocument();
  });

  it("keeps tab removal conservative and the planned glue solution unavailable", () => {
    renderHelpPage(<RemovalGuidePage />);

    expectOneH1(helpRoutes.removal.title);
    expect(screen.getByText(/Warm-water soaking can assist adhesive-tab removal/i)).toBeInTheDocument();
    expect(screen.getByText(/not available, not currently included/i)).toBeInTheDocument();
    expect(screen.getByText(/There is no guaranteed number of reuses/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /resting in a shallow bowl/i })).toHaveAttribute(
      "src",
      "/assets/help/remove-adhesive-tabs-warm-water.jpg"
    );
    expect(document.body).not.toHaveTextContent(/acetone|chemical ingredients/i);
  });

  it("separates processing, transit, issue review, lost packages, and cancellations", () => {
    renderHelpPage(<ShippingReturnsPage />);

    expectOneH1(helpRoutes.shippingReturns.title);
    expect(screen.getByText(`Approximately ${shippingFacts.readyToShipProcessing}`)).toBeInTheDocument();
    expect(screen.getByText(`Approximately ${shippingFacts.madeToOrderProcessing}`)).toBeInTheDocument();
    expect(screen.getByText(`Approximately ${shippingFacts.carrierTransit}`)).toBeInTheDocument();
    expect(screen.getByText(orderPolicyFacts.cancellationRule)).toBeInTheDocument();
    expect(screen.getByText(/automatic refund or replacement is not promised/i)).toBeInTheDocument();
    expect(screen.getByText(/carrier claim may be required/i)).toBeInTheDocument();
  });

  it("renders the canonical FAQ as keyboard-accessible grouped accordions", async () => {
    const user = userEvent.setup();
    renderHelpPage(<FaqPage />);

    expectOneH1(helpRoutes.faq.title);
    expect(screen.getAllByRole("button")).toHaveLength(canonicalFaqItems.length);
    const firstItem = canonicalFaqItems[0];
    const trigger = screen.getByRole("button", { name: firstItem.question });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(firstItem.answer)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(firstItem.relatedLink.label) })).toHaveAttribute(
      "href",
      firstItem.relatedLink.href
    );
  });

  it("publishes one support email and a useful issue checklist without an SLA", () => {
    renderHelpPage(<ContactSupportPage />);

    expectOneH1(helpRoutes.contact.title);
    const emailLinks = screen.getAllByRole("link", { name: new RegExp(supportDetails.email) });
    expect(emailLinks.length).toBeGreaterThanOrEqual(2);
    for (const link of emailLinks) expect(link).toHaveAttribute("href", supportDetails.mailto);
    const checklist = screen.getByRole("heading", { level: 3, name: "Support checklist" }).closest("section");
    expect(checklist).not.toBeNull();
    expect(within(checklist as HTMLElement).getByText(/Order number/i)).toBeInTheDocument();
    expect(screen.getByText(/Support does not publish a guaranteed response time/i)).toBeInTheDocument();
  });
});
