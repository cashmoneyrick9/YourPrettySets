import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type HelpCalloutVariant = "important" | "status" | "tip";

type HelpCalloutProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  variant: HelpCalloutVariant;
};

const defaultTitles: Record<HelpCalloutVariant, string> = {
  important: "Important",
  status: "Current status",
  tip: "Tip"
};

export function HelpCallout({ children, className, title, variant }: HelpCalloutProps) {
  const titleId = `help-callout-${useId().replace(/:/g, "")}`;

  return (
    <aside
      aria-labelledby={titleId}
      className={cn("help-callout", `help-callout--${variant}`, className)}
      role="note"
    >
      <p className="help-callout__title" id={titleId}>
        {title ?? defaultTitles[variant]}
      </p>
      <div className="help-callout__body">{children}</div>
    </aside>
  );
}
