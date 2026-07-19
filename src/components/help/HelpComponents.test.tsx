import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { helpContentMetadata } from "@/data/storefrontFacts";
import {
  HelpArticleShell,
  HelpCallout,
  HelpFactList,
  HelpImagePanel,
  HelpIssueChecklist,
  HelpPolicyBlock,
  HelpRelatedLinks,
  HelpSection,
  HelpStepList,
  HelpSupportCta
} from ".";

describe("Help article primitives", () => {
  it("creates one article heading, two responsive contents controls, and semantic content groups", () => {
    render(
      <MemoryRouter>
        <HelpArticleShell
          contents={[{ id: "prepare", label: "Prepare your nails" }]}
          contentsDefaultOpen
          contentsLabel="In this guide"
          eyebrow="Apply and care"
          heroMedia={{ alt: "Application kit", src: "/assets/kit.png" }}
          intro="A short, task-focused guide."
          quickAnswer="Prep, align, and press without shifting."
          title="Apply Your Set"
          variant="guide"
        >
          <HelpSection id="prepare" title="Prepare your nails">
            <HelpStepList
              items={[
                { body: "Wash and dry your hands.", title: "Start clean" },
                { body: "Use the included prep tools.", title: "Prepare each nail" }
              ]}
            />
            <HelpCallout variant="important">Do not force a step.</HelpCallout>
            <HelpPolicyBlock title="Wear is an estimate">
              <HelpFactList items={[{ label: "Adhesive tabs", value: "Example estimate" }]} />
            </HelpPolicyBlock>
            <HelpIssueChecklist items={["Your order details", "Clear photos"]} title="What to include" />
          </HelpSection>
          <HelpRelatedLinks links={[{ title: "Remove & Reuse", to: "/help/removal" }]} />
          <HelpSupportCta body="Use self-service first, then contact us if you still need help." title="Still unsure?" />
        </HelpArticleShell>
      </MemoryRouter>
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Apply Your Set" })).toBeInTheDocument();
    expect(screen.getByText(`Last updated ${helpContentMetadata.lastUpdated}`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Quick answer" })).toBeInTheDocument();
    expect(screen.getByText("Prep, align, and press without shifting.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to Press-On Guide/ })).toHaveAttribute("href", "/help");
    expect(screen.getAllByRole("link", { name: "Prepare your nails" })).toHaveLength(2);
    expect(document.querySelector(".help-article--guide")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Application kit" })).toHaveAttribute("src", "/assets/kit.png");
    expect(document.querySelector("details.help-contents--mobile")).toHaveAttribute("open");
    expect(document.querySelector("details.help-contents--mobile > summary")).toHaveTextContent("In this guide");
    const stepList = document.querySelector(".help-step-list");
    expect(stepList).toHaveAttribute("start", "1");
    expect(within(stepList as HTMLElement).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("note", { name: "Important" })).toHaveTextContent("Do not force a step.");
    expect(screen.getByText("Adhesive tabs").closest("dl")).toHaveClass("help-fact-list");
    expect(screen.getByRole("link", { name: /Remove & Reuse/ })).toHaveAttribute("href", "/help/removal");
    expect(screen.getByRole("link", { name: /Contact Support/ })).toHaveAttribute("href", "/help/contact");
  });

  it("renders useful image alt text and replaces an unavailable image with the prepared fallback", () => {
    const { rerender } = render(
      <HelpImagePanel
        alt="Hands pressing a nail into place"
        caption="Press and hold each nail steadily."
        placeholderTitle="Application image in production"
        src="/assets/help/application.png"
      />
    );

    const image = screen.getByRole("img", { name: "Hands pressing a nail into place" });
    expect(image).toHaveAttribute("loading", "lazy");
    fireEvent.error(image);
    expect(screen.getByText("Application image in production")).toBeInTheDocument();

    rerender(
      <HelpImagePanel
        placeholderDescription="A future image will demonstrate the nearby written steps."
        placeholderTitle="Removal image in production"
      />
    );
    expect(screen.getByText("Removal image in production")).toBeInTheDocument();
    expect(screen.getByText(/future image will demonstrate/i)).toBeInTheDocument();
  });
});
