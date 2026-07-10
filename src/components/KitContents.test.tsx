import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { includedSetItems, sizingFacts, wearEstimates } from "../data/storefrontFacts";
import { KitContents } from "./KitContents";

afterEach(() => {
  cleanup();
});

describe("KitContents", () => {
  function renderKitContents() {
    return render(
      <BrowserRouter>
        <KitContents />
      </BrowserRouter>
    );
  }

  it("renders the approved mobile-first What’s Included section with compact detail tabs", () => {
    renderKitContents();

    expect(screen.getByText("THE COMPLETE SET")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What’s Included" })).toBeInTheDocument();
    expect(screen.getByText("Everything you need for your set.")).toBeInTheDocument();
    expect(document.querySelector(".kit-spread")).toBeInTheDocument();
    const kitImage = screen.getByRole("img", { name: "Press-on nail kit with tabs and tools" });
    expect(kitImage).toHaveAttribute("src", "/assets/kit-contents-spread-v2.png");
    expect(document.querySelector(".kit-spread")?.children).toHaveLength(1);
    expect(document.querySelectorAll(".kit-spread__piece")).toHaveLength(0);

    expect(screen.getByRole("tablist", { name: "Included kit items" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.getByRole("tab", { name: "Nails" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Glue / tabs" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Prep tools" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Case + care" })).toHaveAttribute("aria-selected", "false");

    const activePanel = screen.getByRole("tabpanel", { name: "Nails" });
    expect(activePanel).toHaveTextContent("A broader fit range");
    expect(activePanel).toHaveTextContent(
      `Ready-to-wear sets include ${sizingFacts.readyToWearNailCount} ${includedSetItems[0].toLowerCase()} in multiple sizes.`
    );
    expect(screen.getByRole("img", { name: "Twenty-four press-on nails in multiple sizes with small fruit details" })).toHaveAttribute(
      "src",
      "/assets/nail-size-set.png"
    );

    const applyCareLink = screen.getByRole("link", { name: /APPLY YOUR SET/i });
    expect(applyCareLink).toHaveAttribute("href", "/help/application");
    expect(applyCareLink).toHaveClass("kit-primary-link");
    expect(applyCareLink).toHaveAttribute("data-slot", "button");
    const faqLink = screen.getByRole("link", { name: "Have a question? Visit our FAQ" });
    expect(faqLink).toHaveAttribute("href", "/help/faq");
    expect(faqLink).toHaveClass("kit-faq-link");
    expect(faqLink).toHaveAttribute("data-slot", "button");

    expect(screen.queryByText("Prep and size")).not.toBeInTheDocument();
    expect(screen.queryByText("Apply with glue or tabs")).not.toBeInTheDocument();
    expect(screen.queryByText("Press, hold, and wear")).not.toBeInTheDocument();
    expect(screen.queryByText("Reuse with proper care")).not.toBeInTheDocument();
  });

  it("switches the compact detail panel from the visual tabs", async () => {
    const user = userEvent.setup();
    renderKitContents();

    await user.click(screen.getByRole("tab", { name: "Glue / tabs" }));

    expect(screen.getByRole("tab", { name: "Nails" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Glue / tabs" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Glue / tabs" })).toHaveTextContent("Choose your wear");
    expect(screen.getByRole("tabpanel", { name: "Glue / tabs" })).toHaveTextContent(
      `${includedSetItems[1]} and ${includedSetItems[2].toLowerCase()} are included.`
    );
    expect(screen.getByRole("tabpanel", { name: "Glue / tabs" })).toHaveTextContent(
      `Glue is estimated at ${wearEstimates.glue}; tabs are estimated at ${wearEstimates.tabs}.`
    );
    expect(screen.getByRole("img", { name: "Nail glue and adhesive tabs" })).toHaveAttribute("src", "/assets/nail-glue.png");
    expect(screen.getByRole("img", { name: "Adhesive tabs" })).toHaveAttribute("src", "/assets/adhesive-tabs.png");

    await user.click(screen.getByRole("tab", { name: "Prep tools" }));

    expect(screen.getByRole("tab", { name: "Glue / tabs" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Prep tools" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Prep tools" })).toHaveTextContent("Prep + apply kit");
    expect(screen.getByRole("tabpanel", { name: "Prep tools" })).toHaveTextContent(
      `${includedSetItems[3]}, ${includedSetItems[4].toLowerCase()}, and ${includedSetItems[5].toLowerCase()} are included for preparation and application.`
    );
    expect(screen.getByRole("img", { name: "Nail file" })).toHaveAttribute("src", "/assets/nail-file.png");
    expect(screen.getByRole("img", { name: "Cuticle stick" })).toHaveAttribute("src", "/assets/cuticle-pusher.png");
    expect(screen.getByRole("img", { name: "Alcohol wipe" })).toHaveAttribute("src", "/assets/alcohol-wipe.png");

    await user.click(screen.getByRole("tab", { name: "Case + care" }));

    expect(screen.getByRole("tabpanel", { name: "Case + care" })).toHaveTextContent(includedSetItems[6]);
  });

  it("does not render the old accordion controls or care tips CTA", () => {
    renderKitContents();

    expect(document.querySelector('[data-slot="accordion"].kit-accordion')).not.toBeInTheDocument();
    expect(document.querySelector(".kit-accordion__item")).not.toBeInTheDocument();
    expect(document.querySelector(".kit-accordion__button")).not.toBeInTheDocument();
    expect(document.querySelector(".kit-item-grid")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /See care tips/i })).not.toBeInTheDocument();
    expect(document.querySelector(".kit-care-link")).not.toBeInTheDocument();
    expect(document.querySelector(".kit-info-card")).not.toBeInTheDocument();
  });

  it("supports simple arrow-key movement between tabs", async () => {
    const user = userEvent.setup();
    renderKitContents();

    const nailsTab = screen.getByRole("tab", { name: "Nails" });
    nailsTab.focus();

    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Glue / tabs" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Glue / tabs" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowLeft}");

    expect(nailsTab).toHaveFocus();
    expect(nailsTab).toHaveAttribute("aria-selected", "true");
  });
});
