import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type HelpIssueChecklistProps = {
  className?: string;
  intro?: ReactNode;
  items: readonly ReactNode[];
  title: string;
};

export function HelpIssueChecklist({ className, intro, items, title }: HelpIssueChecklistProps) {
  const titleId = `help-checklist-${useId().replace(/:/g, "")}`;

  return (
    <section aria-labelledby={titleId} className={cn("help-issue-checklist", className)}>
      <div className="help-issue-checklist__heading">
        <h3 className="help-issue-checklist__title" id={titleId}>
          {title}
        </h3>
        {intro ? <div className="help-issue-checklist__intro">{intro}</div> : null}
      </div>
      <ul className="help-issue-checklist__list">
        {items.map((item, index) => (
          <li className="help-issue-checklist__item" key={index}>
            <span aria-hidden="true" className="help-issue-checklist__mark">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
