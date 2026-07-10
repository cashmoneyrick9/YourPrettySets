import { useId, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { helpContentMetadata } from "@/data/storefrontFacts";
import { cn } from "@/lib/utils";
import { HelpContentsNav } from "./HelpContentsNav";
import type { HelpContentsItem } from "./types";

type HelpArticleShellProps = {
  backLabel?: string;
  backTo?: string;
  children: ReactNode;
  className?: string;
  contents?: readonly HelpContentsItem[];
  eyebrow: string;
  intro: ReactNode;
  lastUpdated?: string | false;
  title: string;
};

function ArticleIntro({ children }: { children: ReactNode }) {
  if (typeof children === "string" || typeof children === "number") {
    return <p className="help-article__intro">{children}</p>;
  }

  return <div className="help-article__intro">{children}</div>;
}

export function HelpArticleShell({
  backLabel = "Back to Press-On Guide",
  backTo = "/help",
  children,
  className,
  contents = [],
  eyebrow,
  intro,
  lastUpdated = helpContentMetadata.lastUpdated,
  title
}: HelpArticleShellProps) {
  const titleId = `help-article-${useId().replace(/:/g, "")}-title`;
  const hasContents = contents.length > 0;

  return (
    <main className={cn("help-page help-page--article help-article", className)}>
      <div className="help-page__inner help-page__inner--article help-article__inner">
        <Link className="help-page__back-link help-article__back-link" to={backTo}>
          <span aria-hidden="true" className="help-article__back-icon">
            ←
          </span>
          {backLabel}
        </Link>

        <div className={cn("help-article__layout", !hasContents && "help-article__layout--without-contents")}>
          {hasContents ? <HelpContentsNav items={contents} variant="desktop" /> : null}

          <article aria-labelledby={titleId} className="help-article__content">
            <header className="help-page__heading help-article__header">
              <p className="eyebrow help-article__eyebrow">{eyebrow}</p>
              <h1 className="help-article__title" id={titleId}>
                {title}
              </h1>
              <ArticleIntro>{intro}</ArticleIntro>
              {lastUpdated ? <p className="help-article__updated">Last updated {lastUpdated}</p> : null}
            </header>

            {hasContents ? <HelpContentsNav items={contents} variant="mobile" /> : null}

            <div className="help-article__body">{children}</div>
          </article>
        </div>
      </div>
    </main>
  );
}
