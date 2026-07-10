import { useId, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { HelpLink } from "./types";

type HelpSupportCtaProps = {
  body: ReactNode;
  className?: string;
  linkLabel?: string;
  secondaryLink?: HelpLink;
  title: string;
  to?: string;
};

export function HelpSupportCta({
  body,
  className,
  linkLabel = "Contact Support",
  secondaryLink,
  title,
  to = "/help/contact"
}: HelpSupportCtaProps) {
  const titleId = `help-support-${useId().replace(/:/g, "")}`;

  return (
    <aside aria-labelledby={titleId} className={cn("help-support-cta", className)}>
      <div className="help-support-cta__copy">
        <h2 className="help-support-cta__title" id={titleId}>
          {title}
        </h2>
        <div className="help-support-cta__body">{body}</div>
      </div>
      <div className="help-support-cta__actions">
        <Link className="help-support-cta__primary-link" to={to}>
          {linkLabel}
          <span aria-hidden="true">→</span>
        </Link>
        {secondaryLink ? (
          <Link className="help-support-cta__secondary-link" to={secondaryLink.to}>
            {secondaryLink.title}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
