import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type UIEvent as ReactUIEvent,
} from "react";
import { collectionLabels, products } from "../data/products";

const collectionDragClickThreshold = 6;
const collectionProgrammaticSettleGuardMs = 260;
const collectionScrollSettleDelayMs = 120;

const moodCollections = collectionLabels.filter((label) => label !== "New Arrivals");

type CollectionDragState = {
  didDrag: boolean;
  pointerId: number;
  startScrollLeft: number;
  startX: number;
};

function toCollectionSlug(title: string) {
  return title.toLowerCase().replace("/", "-").replace(/\s+/g, "-");
}

function getCollectionCardDistance(track: HTMLElement) {
  const firstCard = track.querySelector<HTMLElement>(".collection-card");
  if (!firstCard) return 0;

  const trackStyles = window.getComputedStyle(track);
  const parsedColumnGap = Number.parseFloat(trackStyles.columnGap);
  const parsedGap = Number.isFinite(parsedColumnGap) ? parsedColumnGap : Number.parseFloat(trackStyles.gap);
  const gap = Number.isFinite(parsedGap) ? parsedGap : 0;

  return firstCard.offsetWidth + gap;
}

function getNearestCollectionIndex(track: HTMLElement) {
  const cardDistance = getCollectionCardDistance(track);
  if (cardDistance <= 0) return 0;

  const roundedIndex = Math.round(track.scrollLeft / cardDistance);
  if (!Number.isFinite(roundedIndex)) return 0;

  return Math.max(0, Math.min(moodCollections.length - 1, roundedIndex));
}

export function CollectionFilters() {
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0);
  const [isCollectionInteracting, setIsCollectionInteracting] = useState(false);
  const collectionTrackRef = useRef<HTMLDivElement>(null);
  const collectionDragStateRef = useRef<CollectionDragState | null>(null);
  const collectionProgrammaticSettleTimeoutRef = useRef<number | null>(null);
  const collectionScrollSettleTimeoutRef = useRef<number | null>(null);
  const isCollectionProgrammaticSettleRef = useRef(false);
  const suppressNextCollectionClickRef = useRef(false);

  const clearCollectionScrollSettle = () => {
    if (collectionScrollSettleTimeoutRef.current === null) return;

    window.clearTimeout(collectionScrollSettleTimeoutRef.current);
    collectionScrollSettleTimeoutRef.current = null;
  };

  const clearCollectionProgrammaticSettle = () => {
    if (collectionProgrammaticSettleTimeoutRef.current === null) return;

    window.clearTimeout(collectionProgrammaticSettleTimeoutRef.current);
    collectionProgrammaticSettleTimeoutRef.current = null;
  };

  const updateActiveCollectionFromTrack = (track: HTMLElement) => {
    setActiveCollectionIndex(getNearestCollectionIndex(track));
  };

  const settleCollectionTrack = (track: HTMLElement) => {
    const cardDistance = getCollectionCardDistance(track);
    if (cardDistance <= 0) return;

    clearCollectionScrollSettle();
    clearCollectionProgrammaticSettle();

    const targetIndex = getNearestCollectionIndex(track);
    const targetScrollLeft = targetIndex * cardDistance;

    isCollectionProgrammaticSettleRef.current = true;
    if (typeof track.scrollTo === "function") {
      track.scrollTo({ behavior: "smooth", left: targetScrollLeft });
    } else {
      track.scrollLeft = targetScrollLeft;
    }
    setActiveCollectionIndex(targetIndex);
    collectionProgrammaticSettleTimeoutRef.current = window.setTimeout(() => {
      isCollectionProgrammaticSettleRef.current = false;
      collectionProgrammaticSettleTimeoutRef.current = null;
    }, collectionProgrammaticSettleGuardMs);
  };

  const handleCollectionPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType && event.pointerType !== "mouse") return;

    collectionDragStateRef.current = {
      didDrag: false,
      pointerId: event.pointerId,
      startScrollLeft: event.currentTarget.scrollLeft,
      startX: Number.isFinite(event.clientX) ? event.clientX : 0,
    };
    setIsCollectionInteracting(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleCollectionPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = collectionDragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const currentX = Number.isFinite(event.clientX) ? event.clientX : dragState.startX;
    const dragDistance = currentX - dragState.startX;
    if (Math.abs(dragDistance) > collectionDragClickThreshold) {
      dragState.didDrag = true;
    }

    event.currentTarget.scrollLeft = dragState.startScrollLeft - dragDistance;
    updateActiveCollectionFromTrack(event.currentTarget);
    event.preventDefault();
  };

  const endCollectionInteraction = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = collectionDragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    suppressNextCollectionClickRef.current = dragState.didDrag;
    collectionDragStateRef.current = null;
    setIsCollectionInteracting(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    settleCollectionTrack(event.currentTarget);
  };

  const handleCollectionScroll = (event: ReactUIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    updateActiveCollectionFromTrack(track);
    if (collectionDragStateRef.current || isCollectionProgrammaticSettleRef.current) return;

    clearCollectionScrollSettle();
    collectionScrollSettleTimeoutRef.current = window.setTimeout(() => {
      collectionScrollSettleTimeoutRef.current = null;
      settleCollectionTrack(track);
    }, collectionScrollSettleDelayMs);
  };

  const handleCollectionClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressNextCollectionClickRef.current) return;

    suppressNextCollectionClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleCollectionSelect = (index: number) => {
    const track = collectionTrackRef.current;
    setActiveCollectionIndex(index);
    if (!track) return;

    const cardDistance = getCollectionCardDistance(track);
    if (cardDistance <= 0) return;

    if (typeof track.scrollTo === "function") {
      track.scrollTo({ behavior: "smooth", left: index * cardDistance });
    } else {
      track.scrollLeft = index * cardDistance;
    }
  };

  const activeCollection = moodCollections[activeCollectionIndex];
  const activeCollectionProducts = products.filter((product) => product.collections.includes(activeCollection));
  const visibleCollectionProducts = activeCollectionProducts.slice(0, 4);
  const emptyCollectionSlots = Math.max(0, 4 - visibleCollectionProducts.length);

  useEffect(
    () => () => {
      clearCollectionScrollSettle();
      clearCollectionProgrammaticSettle();
    },
    []
  );

  return (
    <section className="section-block collection-section" id="shop-collections">
      <div className="section-heading collection-heading">
        <div>
          <p className="eyebrow">Collections</p>
          <h2>Browse</h2>
        </div>
        <a className="collection-heading__link" href="#collection-products">
          See all <span aria-hidden="true">→</span>
        </a>
      </div>

      <div
        className={`collection-carousel${isCollectionInteracting ? " collection-carousel--interacting" : ""}`}
        aria-label="Shop by collection"
      >
        <div
          className="collection-track"
          onClickCapture={handleCollectionClickCapture}
          onPointerCancel={endCollectionInteraction}
          onPointerDown={handleCollectionPointerDown}
          onPointerMove={handleCollectionPointerMove}
          onPointerUp={endCollectionInteraction}
          onScroll={handleCollectionScroll}
          ref={collectionTrackRef}
        >
          {moodCollections.map((collection, index) => {
            const slug = toCollectionSlug(collection);

            return (
              <button
                aria-pressed={index === activeCollectionIndex}
                className={`collection-card collection-card--${slug}${
                  index === activeCollectionIndex ? " collection-card--active" : ""
                }`}
                key={collection}
                onClick={() => handleCollectionSelect(index)}
                type="button"
              >
                <span>{collection}</span>
              </button>
            );
          })}
        </div>

        <div className="collection-pagination" aria-hidden="true">
          {moodCollections.map((collection, index) => (
            <span
              className={`collection-pagination__dot${
                index === activeCollectionIndex ? " collection-pagination__dot--active" : ""
              }`}
              key={collection}
            />
          ))}
        </div>
        <p className="collection-carousel__hint" aria-hidden="true">
          <span>←</span> Swipe to explore <span>→</span>
        </p>
      </div>

      <div className="collection-products" id="collection-products" aria-live="polite">
        <div className="collection-products__heading">
          <div>
            <p className="eyebrow">{activeCollection}</p>
            <h3>{activeCollection} sets</h3>
          </div>
          <span>{activeCollectionProducts.length} available</span>
        </div>
        <div className="collection-product-row">
          {visibleCollectionProducts.map((product) => (
            <a
              aria-label={`View ${product.name}`}
              className="collection-product-card"
              href={`#product-${product.slug}`}
              id={`product-${product.slug}`}
              key={product.id}
            >
              <span className="collection-product-card__blank" aria-hidden="true" />
            </a>
          ))}
          {Array.from({ length: emptyCollectionSlots }, (_, index) => (
            <div
              aria-hidden="true"
              className="collection-product-card collection-product-card--placeholder"
              key={`${activeCollection}-placeholder-${index}`}
            >
              <span className="collection-product-card__blank" />
            </div>
          ))}
        </div>
        <div className="collection-product-teaser" aria-hidden="true">
          <span className="collection-product-card collection-product-teaser__card">
            <span className="collection-product-card__blank" />
          </span>
          <span className="collection-product-card collection-product-teaser__card">
            <span className="collection-product-card__blank" />
          </span>
        </div>
        <a className="collection-products__more" href="#">
          See more
        </a>
      </div>
    </section>
  );
}
