import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

type MobileCarouselProps = {
  ariaLabel: string;
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
  const paginationItems = scrollSnaps.length ? scrollSnaps : renderedSlides;

  const updateCarouselState = useCallback((api: EmblaCarouselType) => {
    const nextSelectedIndex = api.selectedScrollSnap();
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

  const scrollToPrevious = () => carouselApi?.scrollPrev();
  const scrollToNext = () => carouselApi?.scrollNext();

  return (
    <section
      aria-label={ariaLabel}
      className={joinClassNames("mobile-carousel", className)}
      data-active-step={dataActiveStep}
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

      <div className={joinClassNames("mobile-carousel__controls", controlsClassName)}>
        <button
          aria-label={previousLabel}
          className={joinClassNames("mobile-carousel__button", buttonClassName)}
          disabled={!canScrollPrevious}
          onClick={scrollToPrevious}
          type="button"
        >
          <ChevronLeft aria-hidden size={18} strokeWidth={2} />
        </button>

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

        <button
          aria-label={nextLabel}
          className={joinClassNames("mobile-carousel__button", buttonClassName)}
          disabled={!canScrollNext}
          onClick={scrollToNext}
          type="button"
        >
          <ChevronRight aria-hidden size={18} strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
