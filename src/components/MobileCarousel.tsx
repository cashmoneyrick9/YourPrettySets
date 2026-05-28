import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type MobileCarouselProps = {
  ariaLabel: string;
  autoRotate?: boolean;
  autoRotateSpeedPxPerSecond?: number;
  buttonClassName?: string;
  className?: string;
  containerClassName?: string;
  controlsClassName?: string;
  dataActiveStep?: string;
  dotClassName?: string;
  dotLabel?: (index: number) => string;
  dotsClassName?: string;
  nextLabel?: string;
  onSelectedIndexChange?: (index: number) => void;
  options?: EmblaOptionsType;
  previousLabel?: string;
  resumeDelayMs?: number;
  showArrows?: boolean;
  showDots?: boolean;
  slideClassName?: string;
  slideCount?: number;
  slides?: ReactNode[];
  viewportClassName?: string;
};

function joinClassNames(...classNames: (false | null | string | undefined)[]) {
  return classNames.filter(Boolean).join(" ");
}

export function MobileCarousel({
  ariaLabel,
  autoRotate = false,
  autoRotateSpeedPxPerSecond = 24,
  buttonClassName,
  className,
  containerClassName,
  controlsClassName,
  dataActiveStep,
  dotClassName,
  dotLabel = (index) => `Go to slide ${index + 1}`,
  dotsClassName,
  nextLabel = "Next slide",
  onSelectedIndexChange,
  options,
  previousLabel = "Previous slide",
  resumeDelayMs = 3200,
  showArrows = true,
  showDots = false,
  slideClassName,
  slideCount = 3,
  slides,
  viewportClassName
}: MobileCarouselProps) {
  const renderedSlides = useMemo(() => {
    if (slides?.length) return slides;

    return Array.from({ length: slideCount }, (_, index) => (
      <div aria-hidden="true" className="mobile-carousel__placeholder" key={`placeholder-${index}`} />
    ));
  }, [slideCount, slides]);
  const [viewportRef, carouselApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    ...options
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const autoRotateFrameRef = useRef<number | null>(null);
  const lastAutoRotateTimeRef = useRef<number | null>(null);
  const selectedIndexRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const paginationItems = scrollSnaps.length ? scrollSnaps : renderedSlides;

  const updateCarouselState = useCallback((api: EmblaCarouselType) => {
    const nextSelectedIndex = api.selectedScrollSnap();
    selectedIndexRef.current = nextSelectedIndex;
    setSelectedIndex(nextSelectedIndex);
    setScrollSnaps(api.scrollSnapList());
    setCanScrollPrevious(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    onSelectedIndexChange?.(nextSelectedIndex);
  }, [onSelectedIndexChange]);

  useEffect(() => {
    if (!carouselApi) return;

    updateCarouselState(carouselApi);
    carouselApi.on("select", updateCarouselState);
    carouselApi.on("reInit", updateCarouselState);

    return () => {
      carouselApi.off("select", updateCarouselState);
      carouselApi.off("reInit", updateCarouselState);
    };
  }, [carouselApi, updateCarouselState]);

  const clearAutoRotateFrame = useCallback(() => {
    if (!autoRotateFrameRef.current) return;

    window.cancelAnimationFrame(autoRotateFrameRef.current);
    autoRotateFrameRef.current = null;
    lastAutoRotateTimeRef.current = null;
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (!resumeTimerRef.current) return;

    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = null;
  }, []);

  const updateContinuousSelection = useCallback((api: EmblaCarouselType) => {
    const nextSelectedIndex = api.internalEngine().scrollTarget.byDistance(0, false).index;

    if (nextSelectedIndex === selectedIndexRef.current) return;

    selectedIndexRef.current = nextSelectedIndex;
    setSelectedIndex(nextSelectedIndex);
    onSelectedIndexChange?.(nextSelectedIndex);
  }, [onSelectedIndexChange]);

  const startAutoRotate = useCallback(() => {
    clearAutoRotateFrame();

    if (!autoRotate || prefersReducedMotion || isPausedRef.current || !carouselApi) return;

    const step = (timestamp: number) => {
      if (isPausedRef.current) {
        clearAutoRotateFrame();
        return;
      }

      const previousTimestamp = lastAutoRotateTimeRef.current ?? timestamp;
      const deltaMs = Math.min(timestamp - previousTimestamp, 64);
      lastAutoRotateTimeRef.current = timestamp;

      const engine = carouselApi.internalEngine();
      const distance = (autoRotateSpeedPxPerSecond * deltaMs) / 1000;
      const nextLocation = engine.location.get() - distance;

      engine.location.set(nextLocation);
      engine.target.set(nextLocation);
      engine.previousLocation.set(nextLocation);
      engine.offsetLocation.set(nextLocation);
      if (options?.loop) {
        engine.scrollLooper.loop(-1);
        engine.slideLooper.loop();
      }
      engine.translate.to(engine.offsetLocation.get());
      updateContinuousSelection(carouselApi);

      autoRotateFrameRef.current = window.requestAnimationFrame(step);
    };

    autoRotateFrameRef.current = window.requestAnimationFrame(step);
  }, [
    autoRotate,
    autoRotateSpeedPxPerSecond,
    carouselApi,
    clearAutoRotateFrame,
    prefersReducedMotion,
    updateContinuousSelection
  ]);

  const pauseAutoRotate = useCallback(() => {
    isPausedRef.current = true;
    clearAutoRotateFrame();
    clearResumeTimer();
  }, [clearAutoRotateFrame, clearResumeTimer]);

  const resumeAutoRotate = useCallback(() => {
    clearResumeTimer();

    if (!autoRotate || prefersReducedMotion) return;

    resumeTimerRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
      startAutoRotate();
    }, resumeDelayMs);
  }, [autoRotate, clearResumeTimer, prefersReducedMotion, resumeDelayMs, startAutoRotate]);

  useEffect(() => {
    startAutoRotate();

    return () => {
      clearAutoRotateFrame();
      clearResumeTimer();
    };
  }, [clearAutoRotateFrame, clearResumeTimer, startAutoRotate]);

  const scrollToPrevious = () => carouselApi?.scrollPrev();
  const scrollToNext = () => carouselApi?.scrollNext();

  return (
    <section
      aria-label={ariaLabel}
      className={joinClassNames("mobile-carousel", className)}
      data-active-step={dataActiveStep}
      data-auto-rotate={autoRotate ? "true" : undefined}
      data-loop={options?.loop ? "true" : undefined}
      data-rotate-speed={autoRotate ? autoRotateSpeedPxPerSecond : undefined}
      onBlurCapture={resumeAutoRotate}
      onFocusCapture={pauseAutoRotate}
      onMouseEnter={pauseAutoRotate}
      onMouseLeave={resumeAutoRotate}
      onPointerCancel={resumeAutoRotate}
      onPointerDown={pauseAutoRotate}
      onPointerUp={resumeAutoRotate}
      role="region"
    >
      <div className={joinClassNames("mobile-carousel__viewport", viewportClassName)} ref={viewportRef}>
        <div className={joinClassNames("mobile-carousel__container", containerClassName)}>
          {renderedSlides.map((slide, index) => (
            <div className={joinClassNames("mobile-carousel__slide", slideClassName)} key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showArrows || showDots ? (
        <div className={joinClassNames("mobile-carousel__controls", controlsClassName)}>
          {showArrows ? (
            <button
              aria-label={previousLabel}
              className={joinClassNames("mobile-carousel__button", buttonClassName)}
              disabled={!canScrollPrevious}
              onClick={scrollToPrevious}
              type="button"
            >
              <ChevronLeft aria-hidden size={18} strokeWidth={2} />
            </button>
          ) : null}

          {showDots ? (
            <div aria-label="Carousel pagination" className={joinClassNames("mobile-carousel__dots", dotsClassName)} role="group">
              {paginationItems.map((_, index) => (
                <button
                  aria-label={dotLabel(index)}
                  aria-pressed={index === selectedIndex}
                  className={joinClassNames("mobile-carousel__dot", dotClassName)}
                  key={index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  type="button"
                />
              ))}
            </div>
          ) : null}

          {showArrows ? (
            <button
              aria-label={nextLabel}
              className={joinClassNames("mobile-carousel__button", buttonClassName)}
              disabled={!canScrollNext}
              onClick={scrollToNext}
              type="button"
            >
              <ChevronRight aria-hidden size={18} strokeWidth={2} />
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
