import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type HelpImageSource =
  | {
      alt: string;
      src: string;
    }
  | {
      alt?: never;
      src?: never;
    };

type HelpImagePanelProps = HelpImageSource & {
  caption?: ReactNode;
  className?: string;
  placeholderDescription?: ReactNode;
  placeholderTitle?: string;
};

export function HelpImagePanel({
  alt,
  caption,
  className,
  placeholderDescription,
  placeholderTitle = "Instructional image coming soon",
  src
}: HelpImagePanelProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const showImage = Boolean(src) && !imageFailed;

  return (
    <figure className={cn("help-image-panel", className)}>
      <div className="help-image-panel__media">
        {showImage ? (
          <img
            alt={alt}
            className="help-image-panel__image"
            decoding="async"
            loading="lazy"
            onError={() => setImageFailed(true)}
            src={src}
          />
        ) : (
          <div className="help-image-panel__placeholder">
            <span aria-hidden="true" className="help-image-panel__placeholder-mark" />
            <p className="help-image-panel__placeholder-title">{placeholderTitle}</p>
            {placeholderDescription ? (
              <div className="help-image-panel__placeholder-description">{placeholderDescription}</div>
            ) : null}
          </div>
        )}
      </div>
      {caption ? <figcaption className="help-image-panel__caption">{caption}</figcaption> : null}
    </figure>
  );
}
