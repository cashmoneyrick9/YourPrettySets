import { useId } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { HelpLink } from "./types";

type HelpRelatedLinksProps = {
  className?: string;
  links: readonly HelpLink[];
  title?: string;
};

export function HelpRelatedLinks({ className, links, title = "Continue with the guide" }: HelpRelatedLinksProps) {
  const titleId = `help-related-${useId().replace(/:/g, "")}`;

  return (
    <nav aria-labelledby={titleId} className={cn("help-related-guides", className)}>
      <h2 className="help-related-guides__title" id={titleId}>
        {title}
      </h2>
      <ul className="help-related-guides__list">
        {links.map((link) => (
          <li className="help-related-guides__item" key={link.to}>
            <Link className="help-related-guides__link" to={link.to}>
              <span className="help-related-guides__link-copy">
                <span className="help-related-guides__link-title">{link.title}</span>
                {link.description ? (
                  <span className="help-related-guides__link-description">{link.description}</span>
                ) : null}
              </span>
              <span aria-hidden="true" className="help-related-guides__link-icon">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
