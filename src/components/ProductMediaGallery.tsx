import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Maximize2, Minus, Play, Plus, RotateCcw, Star, X } from "lucide-react";
import { Dialog } from "radix-ui";
import type { Product } from "../data/products";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

type Point = {
  x: number;
  y: number;
};

type ZoomTransform = Point & {
  scale: number;
};

type ProductImageMedia = {
  alt: string;
  id: "clean" | "editorial";
  kind: "image";
  src?: string;
  thumbnailLabel: string;
  zoomLabel: string;
};

type ProductVideoMedia = {
  id: "video";
  kind: "video";
  label: string;
  poster?: string;
  src?: string;
  thumbnail?: string;
  thumbnailLabel: string;
};

type ProductCustomerMedia = {
  customerName: string;
  id: "customer";
  kind: "customer";
  metadata: string;
  src: string;
  thumbnailLabel: string;
};

type ProductMediaItem = ProductCustomerMedia | ProductImageMedia | ProductVideoMedia;

type DragGesture = {
  kind: "drag";
  origin: Point;
  startOffset: Point;
};

type PinchGesture = {
  kind: "pinch";
  startDistance: number;
  startMidpoint: Point;
  startOffset: Point;
  startScale: number;
};

type ZoomGesture = DragGesture | PinchGesture;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function getDistance(first: Point, second: Point) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function getMidpoint(first: Point, second: Point): Point {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2
  };
}

function getMediaItems(product: Product): ProductMediaItem[] {
  return [
    {
      alt: product.images.clean,
      id: "clean",
      kind: "image",
      src: product.media?.clean,
      thumbnailLabel: "Show clean product image",
      zoomLabel: `Zoom ${product.name} image`
    },
    {
      alt: product.images.editorial,
      id: "editorial",
      kind: "image",
      src: product.media?.editorial,
      thumbnailLabel: "Show editorial product image",
      zoomLabel: `Zoom ${product.name} editorial image`
    },
    {
      id: "video",
      kind: "video",
      label: `${product.name} product video`,
      poster: product.media?.video?.poster,
      src: product.media?.video?.src,
      thumbnail: product.media?.video?.thumbnail,
      thumbnailLabel: "Show product video"
    },
    {
      customerName: "Maya",
      id: "customer",
      kind: "customer",
      metadata: "Almond · Extra Short",
      src: "/assets/placeholders/placeholder-worn-by-soft-blush.jpg",
      thumbnailLabel: "Show how a customer wears this set"
    }
  ];
}

function ProductImage({ image, zoomed = false }: { image: ProductImageMedia; zoomed?: boolean }) {
  if (image.src) {
    return (
      <img
        alt={image.alt}
        className={zoomed ? "product-media-zoom__image" : "product-page__gallery-image"}
        draggable="false"
        src={image.src}
      />
    );
  }

  return (
    <span
      aria-label={image.alt}
      className={zoomed ? "product-media-zoom__image-placeholder" : "product-page__image-placeholder"}
      role="img"
    />
  );
}

function ProductImageZoom({ image, open, onOpenChange, productName }: {
  image: ProductImageMedia;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  productName: string;
}) {
  const [transform, setTransform] = useState<ZoomTransform>({ scale: MIN_ZOOM, x: 0, y: 0 });
  const transformRef = useRef(transform);
  const stageRef = useRef<HTMLDivElement>(null);
  const activePointersRef = useRef(new Map<number, Point>());
  const gestureRef = useRef<ZoomGesture | null>(null);

  const applyTransform = (nextScale: number, nextOffset: Point = transformRef.current) => {
    const scale = clamp(nextScale, MIN_ZOOM, MAX_ZOOM);

    if (scale === MIN_ZOOM) {
      const resetTransform = { scale: MIN_ZOOM, x: 0, y: 0 };
      transformRef.current = resetTransform;
      setTransform(resetTransform);
      return;
    }

    const bounds = stageRef.current?.getBoundingClientRect();
    const maximumX = bounds ? (bounds.width * (scale - 1)) / 2 : Number.POSITIVE_INFINITY;
    const maximumY = bounds ? (bounds.height * (scale - 1)) / 2 : Number.POSITIVE_INFINITY;
    const nextTransform = {
      scale,
      x: clamp(nextOffset.x, -maximumX, maximumX),
      y: clamp(nextOffset.y, -maximumY, maximumY)
    };

    transformRef.current = nextTransform;
    setTransform(nextTransform);
  };

  const resetZoom = () => {
    activePointersRef.current.clear();
    gestureRef.current = null;
    applyTransform(MIN_ZOOM, { x: 0, y: 0 });
  };

  const beginPinch = () => {
    const [first, second] = Array.from(activePointersRef.current.values());

    if (!first || !second) {
      return;
    }

    gestureRef.current = {
      kind: "pinch",
      startDistance: Math.max(1, getDistance(first, second)),
      startMidpoint: getMidpoint(first, second),
      startOffset: { x: transformRef.current.x, y: transformRef.current.y },
      startScale: transformRef.current.scale
    };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    activePointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointersRef.current.size >= 2) {
      beginPinch();
      return;
    }

    if (transformRef.current.scale > MIN_ZOOM) {
      gestureRef.current = {
        kind: "drag",
        origin: { x: event.clientX, y: event.clientY },
        startOffset: { x: transformRef.current.x, y: transformRef.current.y }
      };
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!activePointersRef.current.has(event.pointerId)) {
      return;
    }

    activePointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const gesture = gestureRef.current;

    if (!gesture) {
      return;
    }

    if (gesture.kind === "pinch" && activePointersRef.current.size >= 2) {
      const [first, second] = Array.from(activePointersRef.current.values());
      const currentDistance = getDistance(first, second);
      const currentMidpoint = getMidpoint(first, second);
      const scale = gesture.startScale * (currentDistance / gesture.startDistance);

      applyTransform(scale, {
        x: gesture.startOffset.x + currentMidpoint.x - gesture.startMidpoint.x,
        y: gesture.startOffset.y + currentMidpoint.y - gesture.startMidpoint.y
      });
      return;
    }

    if (gesture.kind === "drag") {
      applyTransform(transformRef.current.scale, {
        x: gesture.startOffset.x + event.clientX - gesture.origin.x,
        y: gesture.startOffset.y + event.clientY - gesture.origin.y
      });
    }
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    activePointersRef.current.delete(event.pointerId);
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    const remainingPointer = Array.from(activePointersRef.current.values())[0];
    if (remainingPointer && transformRef.current.scale > MIN_ZOOM) {
      gestureRef.current = {
        kind: "drag",
        origin: remainingPointer,
        startOffset: { x: transformRef.current.x, y: transformRef.current.y }
      };
      return;
    }

    gestureRef.current = null;
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    applyTransform(transformRef.current.scale + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
  };

  useEffect(() => {
    if (open) {
      resetZoom();
    }
  }, [image.id, open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="product-media-zoom__overlay" />
        <Dialog.Content
          aria-describedby={undefined}
          aria-label={`${productName} image zoom`}
          className="product-media-zoom"
        >
          <Dialog.Title className="product-media-zoom__title">{productName} image zoom</Dialog.Title>
          <div className="product-media-zoom__topbar">
            <p>Pinch, scroll, or double tap to zoom</p>
            <Dialog.Close aria-label="Close image zoom" className="product-media-zoom__close">
              <X aria-hidden="true" size={22} strokeWidth={1.8} />
            </Dialog.Close>
          </div>

          <div
            className="product-media-zoom__stage"
            onDoubleClick={() => applyTransform(transform.scale === MIN_ZOOM ? 2 : MIN_ZOOM)}
            onPointerCancel={handlePointerEnd}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onWheel={handleWheel}
            ref={stageRef}
          >
            <div
              className="product-media-zoom__transform"
              style={{ transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})` }}
            >
              <ProductImage image={image} zoomed />
            </div>
          </div>

          <div className="product-media-zoom__controls" aria-label="Image zoom controls">
            <button
              aria-label="Zoom out"
              disabled={transform.scale <= MIN_ZOOM}
              onClick={() => applyTransform(transform.scale - ZOOM_STEP)}
              type="button"
            >
              <Minus aria-hidden="true" size={19} />
            </button>
            <span aria-live="polite">{Math.round(transform.scale * 100)}%</span>
            <button
              aria-label="Zoom in"
              disabled={transform.scale >= MAX_ZOOM}
              onClick={() => applyTransform(transform.scale + ZOOM_STEP)}
              type="button"
            >
              <Plus aria-hidden="true" size={19} />
            </button>
            <button
              aria-label="Reset zoom"
              disabled={transform.scale === MIN_ZOOM && transform.x === 0 && transform.y === 0}
              onClick={resetZoom}
              type="button"
            >
              <RotateCcw aria-hidden="true" size={18} />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ProductMediaGallery({ product }: { product: Product }) {
  const mediaItems = getMediaItems(product);
  const [selectedMediaId, setSelectedMediaId] = useState<ProductMediaItem["id"]>(mediaItems[0].id);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const selectedMedia = mediaItems.find((item) => item.id === selectedMediaId) ?? mediaItems[0];

  return (
    <section
      aria-label={`${product.name} media gallery`}
      className="product-page__media product-page__media-gallery"
    >
      <div className="product-page__media-stage">
        {selectedMedia.kind === "image" ? (
          <button
            aria-label={selectedMedia.zoomLabel}
            className="product-page__media-zoom-trigger"
            onClick={() => setIsZoomOpen(true)}
            type="button"
          >
            <ProductImage image={selectedMedia} />
            <span aria-hidden="true" className="product-page__media-zoom-icon">
              <Maximize2 size={18} strokeWidth={1.8} />
            </span>
          </button>
        ) : selectedMedia.kind === "video" ? (
          <div className="product-page__video-shell">
            <video
              aria-label={selectedMedia.label}
              controls
              playsInline
              poster={selectedMedia.poster}
              preload="metadata"
              src={selectedMedia.src}
            />
            {!selectedMedia.src ? (
              <span aria-hidden="true" className="product-page__video-placeholder-copy">
                Product video coming soon
              </span>
            ) : null}
          </div>
        ) : (
          <article className="product-page__customer-slide">
            <img
              alt={`Customer wearing a soft blush press-on nail set in ${selectedMedia.metadata}`}
              src={selectedMedia.src}
            />
            <div className="product-page__customer-slide-copy">
              <div aria-label="5 out of 5 stars" className="product-page__customer-stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star aria-hidden="true" fill="currentColor" key={index} size={13} strokeWidth={1.5} />
                ))}
              </div>
              <p>Worn by {selectedMedia.customerName}</p>
              <span>{selectedMedia.metadata}</span>
              <a href="#customer-reviews">
                See customer reviews <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
              </a>
            </div>
          </article>
        )}
      </div>

      <div className="product-page__media-thumbnails" aria-label="Product media choices">
        {mediaItems.map((item) => (
          <button
            aria-label={item.thumbnailLabel}
            aria-pressed={item.id === selectedMedia.id}
            className="product-page__media-thumbnail"
            key={item.id}
            onClick={() => {
              setIsZoomOpen(false);
              setSelectedMediaId(item.id);
            }}
            type="button"
          >
            {item.kind === "image" ? (
              item.src ? <img alt="" src={item.src} /> : <span aria-hidden="true" />
            ) : item.kind === "video" ? (
              <span className="product-page__media-video-thumbnail">
                {item.thumbnail ? <img alt="" src={item.thumbnail} /> : null}
                <Play
                  aria-hidden="true"
                  data-testid="product-video-play-icon"
                  fill="currentColor"
                  size={20}
                />
              </span>
            ) : (
              <span className="product-page__media-customer-thumbnail">
                <img alt="" src={item.src} />
                <small>Worn by</small>
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedMedia.kind === "image" ? (
        <ProductImageZoom
          image={selectedMedia}
          onOpenChange={setIsZoomOpen}
          open={isZoomOpen}
          productName={product.name}
        />
      ) : null}
    </section>
  );
}
