import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import { canonicalFaqItems, helpQuickTasks, helpRoutes } from "../data/helpContent";
import { siteMedia } from "../data/siteMedia";
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

function LocationProbe() {
  const { hash, pathname } = useLocation();
  return <output data-testid="location-probe">{pathname}{hash}</output>;
}

function renderHelpPage(page: React.ReactNode, initialEntry = "/help") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      {page}
      <LocationProbe />
    </MemoryRouter>
  );
}

function expectOneH1(name: string) {
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1, name })).toBeInTheDocument();
}

describe("Help pages", () => {
  it("answers common customer tasks directly on the Help hub", async () => {
    const user = userEvent.setup();
    renderHelpPage(<HelpHubPage />);

    expectOneH1("What do you need help with?");
    expect(screen.getByRole("searchbox", { name: "Search the guide" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Tap your task" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Keep going only if you need to" })).toBeInTheDocument();
    for (const task of helpQuickTasks) {
      expect(screen.getByRole("button", { name: new RegExp(task.title) })).toBeInTheDocument();
      expect(screen.getByText(task.summary)).toBeInTheDocument();
    }
    const firstTask = screen.getByRole("button", { name: /Find my size/i });
    expect(firstTask).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /Open Find Your Fit/i })).toHaveAttribute("href", "/help/sizing");

    await user.click(screen.getByRole("button", { name: /Fix a damaged order/i }));
    expect(firstTask).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("link", { name: /See the order-issue process/i })).toHaveAttribute(
      "href",
      "/help/shipping-returns#order-problems"
    );
    expect(screen.getByRole("link", { name: /Remove and reuse/i })).toHaveAttribute("href", "/help/removal");
    expect(document.querySelector(".help-task-hub img")).not.toBeInTheDocument();
  });

  it("finds deep Help results and supports keyboard entry", async () => {
    const user = userEvent.setup();
    renderHelpPage(<HelpHubPage />);

    const search = screen.getByRole("searchbox", { name: "Search the guide" });
    await user.type(search, "choose glue tabs");

    const result = screen.getByRole("link", { name: /Choose nail glue or adhesive tabs/i });
    expect(result).toHaveAttribute("href", "/help/application#choose-adhesive");

    await user.keyboard("{ArrowDown}");
    expect(result).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("location-probe")).toHaveTextContent("/help/application#choose-adhesive");
  });

  it("offers useful recovery when Help search has no match", async () => {
    const user = userEvent.setup();
    renderHelpPage(<HelpHubPage />);

    await user.type(screen.getByRole("searchbox", { name: "Search the guide" }), "meteor polish");
    const emptyMessage = screen.getByText(/No guide results for “meteor polish”/i);
    expect(emptyMessage).toBeInTheDocument();
    const emptyState = emptyMessage.closest(".help-search__results");
    expect(emptyState).not.toBeNull();
    expect(within(emptyState as HTMLElement).getByRole("link", { name: "Browse the FAQ" })).toHaveAttribute("href", "/help/faq");
    expect(within(emptyState as HTMLElement).getByRole("link", { name: "Contact Support" })).toHaveAttribute("href", "/help/contact");

    await user.click(screen.getByRole("button", { name: "Clear Help search" }));
    expect(screen.queryByText(/No guide results/i)).not.toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search the guide" })).toHaveFocus();
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
    expect(screen.getByRole("heading", { level: 2, name: "Quick answer" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: siteMedia.kit.nails.alt })).toHaveAttribute("src", siteMedia.kit.nails.src);
    expect(document.querySelector(".help-article--guide")).toBeInTheDocument();
    expect(document.querySelector(".help-article__body table")).not.toBeInTheDocument();
  });

  it("uses nine semantic, linked steps and approved estimates throughout the application guide", () => {
    renderHelpPage(<ApplicationGuidePage />, "/help/application");

    expectOneH1(helpRoutes.application.title);
    for (const item of includedSetItems) expect(screen.getAllByText(item).length).toBeGreaterThan(0);
    expect(screen.getAllByText(`Approximately ${wearEstimates.glue}`).length).toBeGreaterThan(0);
    expect(screen.getAllByText(`Approximately ${wearEstimates.tabs}`).length).toBeGreaterThan(0);
    const expectedSections = [
      "included",
      "choose-adhesive",
      "prepare-natural-nails",
      "select-and-arrange",
      "apply-with-glue",
      "apply-with-tabs",
      "aftercare",
      "application-problems",
      "next-removal"
    ];
    expect(
      Array.from(document.querySelectorAll(".application-step, .application-next"), (section) => section.id)
    ).toEqual(expectedSections);
    expect(document.querySelectorAll("ol.application-procedure")).toHaveLength(3);
    const guideNavigations = screen.getAllByRole("navigation", { name: "In this guide" });
    expect(guideNavigations).toHaveLength(2);
    for (const navigation of guideNavigations) {
      expect(within(navigation).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(
        expectedSections.map((id) => `#${id}`)
      );
    }
    expect(screen.getByRole("heading", { level: 2, name: "Quick answer" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: siteMedia.help.applicationAlignment.alt })).toHaveAttribute(
      "src",
      siteMedia.help.applicationAlignment.src
    );
    expect(screen.queryByRole("img", { name: /application supplies with adhesive tabs/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Wear time is not guaranteed/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open Remove & Reuse/i })).toHaveAttribute("href", "/help/removal");
  });

  it("keeps tab removal conservative and the planned glue solution unavailable", () => {
    renderHelpPage(<RemovalGuidePage />);

    expectOneH1(helpRoutes.removal.title);
    expect(screen.getByRole("heading", { level: 2, name: "Quick answer" })).toBeInTheDocument();
    expect(screen.getAllByText(/Warm water can assist adhesive tabs/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/not available, not currently included/i)).toBeInTheDocument();
    expect(screen.getByText(/There is no guaranteed number of reuses/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: siteMedia.help.adhesiveTabRemoval.alt })).toHaveAttribute(
      "src",
      siteMedia.help.adhesiveTabRemoval.src
    );
    expect(document.body).not.toHaveTextContent(/acetone|chemical ingredients/i);
  });

  it("separates processing, transit, issue review, lost packages, and cancellations", () => {
    renderHelpPage(<ShippingReturnsPage />);

    expectOneH1(helpRoutes.shippingReturns.title);
    expect(screen.getByText(`Approximately ${shippingFacts.readyToShipProcessing}`)).toBeInTheDocument();
    expect(screen.getByText(`Approximately ${shippingFacts.madeToOrderProcessing}`)).toBeInTheDocument();
    expect(screen.getByText(`Approximately ${shippingFacts.carrierTransit}`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "At a glance" })).toBeInTheDocument();
    expect(screen.getByText(`Within ${orderPolicyFacts.issueReportingWindowDays} days of confirmed delivery`)).toBeInTheDocument();
    expect(screen.getByText(orderPolicyFacts.cancellationRule)).toBeInTheDocument();
    expect(screen.getByText(/automatic refund or replacement is not promised/i)).toBeInTheDocument();
    expect(screen.getByText(/carrier claim may be required/i)).toBeInTheDocument();
  });

  it("renders the canonical FAQ as keyboard-accessible grouped accordions", async () => {
    const user = userEvent.setup();
    renderHelpPage(<FaqPage />);

    expectOneH1(helpRoutes.faq.title);
    const mobileContents = document.querySelector("details.help-contents--mobile");
    expect(mobileContents).toHaveAttribute("open");
    await user.click(screen.getByText("Browse questions", { selector: "summary span" }));
    expect(mobileContents).not.toHaveAttribute("open");
    expect(screen.getAllByRole("button")).toHaveLength(canonicalFaqItems.length);
    const firstItem = canonicalFaqItems[0];
    const trigger = screen.getByRole("button", { name: firstItem.question });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(mobileContents).not.toHaveAttribute("open");
    expect(screen.getByText(firstItem.answer)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(firstItem.relatedLink.label) })).toHaveAttribute(
      "href",
      firstItem.relatedLink.href
    );
  });

  it("publishes one support email and a useful issue checklist without an SLA", () => {
    renderHelpPage(<ContactSupportPage />);

    expectOneH1(helpRoutes.contact.title);
    expect(screen.getByRole("heading", { level: 2, name: "What do you need help with?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Fit question" })).toBeInTheDocument();
    const emailLinks = screen.getAllByRole("link", { name: new RegExp(supportDetails.email) });
    expect(emailLinks).toHaveLength(1);
    for (const link of emailLinks) expect(link).toHaveAttribute("href", supportDetails.mailto);
    const checklist = screen.getByRole("heading", { level: 3, name: "Support checklist" }).closest("section");
    expect(checklist).not.toBeNull();
    expect(within(checklist as HTMLElement).getByText(/Order number/i)).toBeInTheDocument();
    expect(screen.getByText(/Support does not publish a guaranteed response time/i)).toBeInTheDocument();
  });
});
