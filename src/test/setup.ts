import "@testing-library/jest-dom/vitest";

if (typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      addEventListener: () => undefined,
      addListener: () => undefined,
      dispatchEvent: () => false,
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: () => undefined,
      removeListener: () => undefined
    })
  });
}

if (typeof window.IntersectionObserver !== "function") {
  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    value: class IntersectionObserver {
      disconnect() {
        return undefined;
      }

      observe() {
        return undefined;
      }

      takeRecords() {
        return [];
      }

      unobserve() {
        return undefined;
      }
    }
  });
}

if (typeof window.ResizeObserver !== "function") {
  Object.defineProperty(window, "ResizeObserver", {
    configurable: true,
    value: class ResizeObserver {
      disconnect() {
        return undefined;
      }

      observe() {
        return undefined;
      }

      unobserve() {
        return undefined;
      }
    }
  });
}
