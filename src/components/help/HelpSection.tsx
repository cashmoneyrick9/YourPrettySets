import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HelpSectionProps = {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  id: string;
  intro?: ReactNode;
  title: string;
};

function SectionIntro({ children }: { children: ReactNode }) {
  if (typeof children === "string" || typeof children === "number") {
    return <p className="help-section__intro">{children}</p>;
  }

  return <div className="help-section__intro">{children}</div>;
}

export function HelpSection({ children, className, eyebrow, id, intro, title }: HelpSectionProps) {
  const titleId = `${id}-title`;

  return (
    <section aria-labelledby={titleId} className={cn("help-section", className)} id={id}>
      <header className="help-section__header">
        {eyebrow ? <p className="help-section__eyebrow">{eyebrow}</p> : null}
        <h2 className="help-section__title" id={titleId}>
          {title}
        </h2>
        {intro ? <SectionIntro>{intro}</SectionIntro> : null}
      </header>
      <div className="help-section__body">{children}</div>
    </section>
  );
}
