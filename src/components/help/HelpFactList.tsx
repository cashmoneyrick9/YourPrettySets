import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { HelpFactItem } from "./types";

type HelpFactListProps = {
  className?: string;
  items: readonly HelpFactItem[];
};

export function HelpFactList({ className, items }: HelpFactListProps) {
  return (
    <dl className={cn("help-fact-list", className)}>
      {items.map((item) => (
        <div className="help-fact-list__item" key={item.label}>
          <dt className="help-fact-list__term">{item.label}</dt>
          <dd className="help-fact-list__definition">
            <span className="help-fact-list__value">{item.value}</span>
            {item.detail ? <span className="help-fact-list__detail">{item.detail}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

type HelpPolicyBlockProps = {
  children: ReactNode;
  className?: string;
  intro?: ReactNode;
  title: string;
};

export function HelpPolicyBlock({ children, className, intro, title }: HelpPolicyBlockProps) {
  const titleId = `help-policy-${useId().replace(/:/g, "")}`;

  return (
    <section aria-labelledby={titleId} className={cn("help-policy-block", className)}>
      <div className="help-policy-block__heading">
        <h3 className="help-policy-block__title" id={titleId}>
          {title}
        </h3>
        {intro ? <div className="help-policy-block__intro">{intro}</div> : null}
      </div>
      <div className="help-policy-block__body">{children}</div>
    </section>
  );
}
