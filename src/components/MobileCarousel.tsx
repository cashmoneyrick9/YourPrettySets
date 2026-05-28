import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

type MobileCarouselProps = {
  ariaLabel: string;
  className?: string;
  options?: EmblaOptionsType;
  showDots?: boolean;
  slideClassName?: string;
  slideCount?: number;
  slides?: ReactNode[];
};

function joinClassNames(...classNames: (false | null | string | undefined)[]) {
  return classNames.filter(Boolean).join(" ");
}

export function MobileCarousel({
  ariaLabel,
  className,
  options,
  showDots = false,
  slideClassName,
  slideCount = 3,
  slides
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
    setSelectedIndex(api.selectedScrollSnap());
    setScrollSnaps(api.scrollSnapList());
    setCanScrollPrevious(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

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
    <section aria-label={ariaLabel} className={joinClassNames("mobile-carousel", className)} role="region">
      <div className="mobile-carousel__viewport" ref={viewportRef}>
        <div className="mobile-carousel__container">
          {renderedSlides.map((slide, index) => (
            <div className={joinClassNames("mobile-carousel__slide", slideClassName)} key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-carousel__controls">
        <button
          aria-label="Previous slide"
          className="mobile-carousel__button"
          disabled={!canScrollPrevious}
          onClick={scrollToPrevious}
          type="button"
        >
          <ChevronLeft aria-hidden size={18} strokeWidth={2} />
        </button>

        {showDots ? (
          <div aria-label="Carousel pagination" className="mobile-carousel__dots" role="group">
            {paginationItems.map((_, index) => (
              <button
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={index === selectedIndex}
                className="mobile-carousel__dot"
                key={index}
                onClick={() => carouselApi?.scrollTo(index)}
                type="button"
              />
            ))}
          </div>
        ) : null}

        <button
          aria-label="Next slide"
          className="mobile-carousel__button"
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
