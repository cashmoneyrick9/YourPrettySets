import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { HelpStepItem } from "./types";

type HelpStepListProps = {
  className?: string;
  items: readonly HelpStepItem[];
  start?: number;
};

function StepBody({ children }: { children: ReactNode }) {
  if (typeof children === "string" || typeof children === "number") {
    return <p>{children}</p>;
  }

  return <div>{children}</div>;
}

export function HelpStepList({ className, items, start = 1 }: HelpStepListProps) {
  return (
    <ol className={cn("help-step-list", className)} start={start}>
      {items.map((item, index) => (
        <li className="help-step-list__item" key={`${item.title}-${index}`}>
          <span aria-hidden="true" className="help-step-list__number">
            {start + index}
          </span>
          <div className="help-step-list__content">
            <h3 className="help-step-list__title">{item.title}</h3>
            <div className="help-step-list__body">
              <StepBody>{item.body}</StepBody>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
