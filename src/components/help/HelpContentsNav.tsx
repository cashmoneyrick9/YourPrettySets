import { useId, useRef } from "react";
import type { HelpContentsItem } from "./types";

type HelpContentsNavProps = {
  items: readonly HelpContentsItem[];
  label?: string;
  variant?: "desktop" | "mobile";
};

function ContentsLinks({ items, onNavigate }: Pick<HelpContentsNavProps, "items"> & { onNavigate?: () => void }) {
  return (
    <ol className="help-contents__list">
      {items.map((item) => (
        <li className="help-contents__item" key={item.id}>
          <a className="help-contents__link" href={`#${item.id}`} onClick={onNavigate}>
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function HelpContentsNav({ items, label = "On this page", variant = "desktop" }: HelpContentsNavProps) {
  const labelId = `help-contents-${useId().replace(/:/g, "")}`;
  const detailsRef = useRef<HTMLDetailsElement>(null);

  if (variant === "mobile") {
    return (
      <details className="help-contents help-contents--mobile" ref={detailsRef}>
        <summary className="help-contents__summary">
          <span>{label}</span>
          <span aria-hidden="true" className="help-contents__summary-icon">
            +
          </span>
        </summary>
        <nav aria-label={label} className="help-contents__nav help-contents__nav--mobile">
          <ContentsLinks items={items} onNavigate={() => detailsRef.current?.removeAttribute("open")} />
        </nav>
      </details>
    );
  }

  return (
    <nav aria-labelledby={labelId} className="help-contents help-contents--desktop">
      <p className="help-contents__title" id={labelId}>
        {label}
      </p>
      <ContentsLinks items={items} />
    </nav>
  );
}
