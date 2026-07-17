import { Menu, ShoppingBag, X } from "lucide-react";
import { TouchEvent, WheelEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type NavItem = {
  children?: { href: string; label: string }[];
  href: string;
  label: string;
};

const mainNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/shop",
    label: "Shop",
    children: [
      { href: "/shop/ready-to-ship", label: "Ready to Ship" },
      { href: "/shop/made-to-order", label: "Made to Order" },
      { href: "/shop/custom-orders", label: "Custom Orders" }
    ]
  },
  {
    href: "/help",
    label: "Help",
    children: [
      { href: "/help", label: "Press-On Guide" },
      { href: "/help/sizing", label: "Find Your Fit" },
      { href: "/help/application", label: "Apply Your Set" },
      { href: "/help/removal", label: "Remove & Reuse" },
      { href: "/help/shipping-returns", label: "Shipping, Returns & Order Issues" },
      { href: "/help/faq", label: "FAQ" },
      { href: "/help/contact", label: "Contact Support" }
    ]
  }
];

type MobileMenuSection = NavItem & {
  eyebrow?: string;
  id: "home" | "shop" | "help";
};

const mobileMenuSections: MobileMenuSection[] = mainNavItems.map((item) => ({
  ...item,
  eyebrow: item.children ? item.label.toUpperCase() : undefined,
  id: item.label.toLowerCase() as MobileMenuSection["id"]
}));

type MobileContentSectionId = Exclude<MobileMenuSection["id"], "home">;
type MobileMenuMode = "default" | "expanded" | "collapsing";

const mobileContentSectionIds: MobileContentSectionId[] = ["shop", "help"];
const headerAtTopBodyClass = "header-at-top";
const headerScrolledBodyClass = "header-scrolled";
const mobileMenuOpenBodyClass = "mobile-menu-open";
const mobileMenuCollapseDuration = 620;

export function BrandHeader() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [mobileMenuMode, setMobileMenuMode] = useState<MobileMenuMode>("default");
  const [activeMobileSectionId, setActiveMobileSectionId] =
    useState<MobileContentSectionId | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const wheelLockRef = useRef(false);
  const wheelLockTimeoutRef = useRef<number | null>(null);
  const mobileMenuCloseFrameRef = useRef<number | null>(null);
  const mobileSubmenuCloseTimeoutRef = useRef<number | null>(null);
  const mobileMenuUnlockRef = useRef<(() => void) | null>(null);
  const pendingAfterCloseRef = useRef<(() => void) | undefined>(undefined);
  const isMenuClosingRef = useRef(isMenuClosing);
  const mobileMenuModeRef = useRef(mobileMenuMode);
  const [isScrolled, setIsScrolled] = useState(false);

  isMenuClosingRef.current = isMenuClosing;
  mobileMenuModeRef.current = mobileMenuMode;

  const prefersReducedMotion = () =>
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clearMobileMenuCloseFrame = () => {
    if (mobileMenuCloseFrameRef.current !== null) {
      window.cancelAnimationFrame(mobileMenuCloseFrameRef.current);
      mobileMenuCloseFrameRef.current = null;
    }
  };

  const clearMobileSubmenuCloseTimeout = () => {
    if (mobileSubmenuCloseTimeoutRef.current) {
      window.clearTimeout(mobileSubmenuCloseTimeoutRef.current);
      mobileSubmenuCloseTimeoutRef.current = null;
    }
  };

  const getMobileMenuFocusTargets = () => {
    const dialog = document.getElementById("mobile-navigation");
    const candidates = [
      menuButtonRef.current,
      ...(dialog
        ? Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          )
        : [])
    ];

    return candidates.filter((element): element is HTMLElement => {
      if (!element || element.tabIndex < 0) return false;
      if (element.closest("[hidden]")) return false;
      if (element.closest('[aria-hidden="true"]')) return false;

      return true;
    });
  };

  useEffect(() => {
    const syncHeaderState = () => {
      setIsScrolled(window.scrollY > 8);
    };

    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncHeaderState);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle(headerAtTopBodyClass, !isScrolled);
    document.body.classList.toggle(headerScrolledBodyClass, isScrolled);

    return () => {
      document.body.classList.remove(headerAtTopBodyClass, headerScrolledBodyClass);
    };
  }, [isScrolled]);

  useEffect(() => {
    document.body.classList.toggle(mobileMenuOpenBodyClass, isMenuOpen);

    if (!isMenuOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousRootOverflow = document.documentElement.style.overflow;
    const lockedScrollY = window.scrollY;
    const headerElement = menuButtonRef.current?.closest(".brand-header");
    const pageSiblings = headerElement?.parentElement
      ? Array.from(headerElement.parentElement.children).filter(
          (child): child is HTMLElement => child instanceof HTMLElement && child !== headerElement
        )
      : [];
    const previousPageSiblingState = pageSiblings.map((element) => ({
      ariaHidden: element.getAttribute("aria-hidden"),
      element,
      hadAriaHidden: element.hasAttribute("aria-hidden"),
      hadInert: element.hasAttribute("inert")
    }));

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
    pageSiblings.forEach((element) => {
      element.setAttribute("aria-hidden", "true");
      element.setAttribute("inert", "");
    });

    const preventMenuScroll = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest(".brand-header__mobile-menu-content--expanded")
      ) {
        return;
      }

      event.preventDefault();
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    const keepFocusInMobileMenu = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const focusTargets = getMobileMenuFocusTargets();
      if (!focusTargets.length) {
        return;
      }

      const firstTarget = focusTargets[0];
      const lastTarget = focusTargets[focusTargets.length - 1];
      const activeElement = document.activeElement;

      if (!activeElement || !focusTargets.includes(activeElement as HTMLElement)) {
        event.preventDefault();
        firstTarget.focus();
        return;
      }

      if (event.shiftKey && activeElement === firstTarget) {
        event.preventDefault();
        lastTarget.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastTarget) {
        event.preventDefault();
        firstTarget.focus();
      }
    };

    window.addEventListener("wheel", preventMenuScroll, { passive: false });
    window.addEventListener("touchmove", preventMenuScroll, { passive: false });
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("keydown", keepFocusInMobileMenu);
    menuButtonRef.current?.focus();

    let hasRestoredPage = false;
    const restorePage = () => {
      if (hasRestoredPage) {
        return;
      }

      hasRestoredPage = true;
      document.body.classList.remove(mobileMenuOpenBodyClass);
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener("wheel", preventMenuScroll);
      window.removeEventListener("touchmove", preventMenuScroll);
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("keydown", keepFocusInMobileMenu);
      previousPageSiblingState.forEach(({ ariaHidden, element, hadAriaHidden, hadInert }) => {
        if (hadAriaHidden) {
          element.setAttribute("aria-hidden", ariaHidden ?? "");
        } else {
          element.removeAttribute("aria-hidden");
        }

        if (!hadInert) {
          element.removeAttribute("inert");
        }
      });
      if (lockedScrollY > 0) {
        try {
          window.scrollTo(0, lockedScrollY);
        } catch {
          // JSDOM does not implement scroll restoration.
        }
      }
    };

    mobileMenuUnlockRef.current = restorePage;

    return () => {
      restorePage();
      if (mobileMenuUnlockRef.current === restorePage) {
        mobileMenuUnlockRef.current = null;
      }
    };
  }, [isMenuOpen]);

  useEffect(() => {
    return () => {
      if (wheelLockTimeoutRef.current) {
        window.clearTimeout(wheelLockTimeoutRef.current);
      }
      clearMobileMenuCloseFrame();
      clearMobileSubmenuCloseTimeout();
      mobileMenuUnlockRef.current?.();
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      return;
    }

    mobileMenuModeRef.current = "default";
    setActiveMobileSectionId(null);
    setMobileMenuMode("default");
  }, [isMenuOpen]);

  const closeMobileMenu = (afterClose?: () => void) => {
    const currentMobileMenuMode = mobileMenuModeRef.current;

    if (!isMenuOpen || isMenuClosingRef.current || currentMobileMenuMode === "collapsing") {
      return;
    }

    clearMobileMenuCloseFrame();
    clearMobileSubmenuCloseTimeout();
    pendingAfterCloseRef.current = afterClose;

    const hideMenu = () => {
      mobileMenuCloseFrameRef.current = null;
      isMenuClosingRef.current = false;
      setIsMenuOpen(false);
      setIsMenuClosing(false);
      window.setTimeout(() => {
        pendingAfterCloseRef.current?.();
        pendingAfterCloseRef.current = undefined;
        menuButtonRef.current?.focus();
      }, 0);
    };

    const finishClose = () => {
      mobileSubmenuCloseTimeoutRef.current = null;
      mobileMenuUnlockRef.current?.();

      if (prefersReducedMotion()) {
        hideMenu();
        return;
      }

      mobileMenuCloseFrameRef.current = window.requestAnimationFrame(() => {
        mobileMenuCloseFrameRef.current = window.requestAnimationFrame(hideMenu);
      });
    };

    const startClose = () => {
      isMenuClosingRef.current = true;
      setIsMenuClosing(true);
    };

    if (prefersReducedMotion()) {
      startClose();
      finishClose();
      return;
    }

    startClose();

    if (currentMobileMenuMode === "expanded") {
      mobileSubmenuCloseTimeoutRef.current = window.setTimeout(
        finishClose,
        mobileMenuCollapseDuration
      );
      return;
    }

    finishClose();
  };

  const followMobileMenuLink = (href: string) => {
    closeMobileMenu(() => {
      if (href === pathname) {
        const pageHeading = document.querySelector<HTMLElement>("main h1");
        pageHeading?.setAttribute("tabindex", "-1");
        pageHeading?.focus({ preventScroll: true });
      }
    });
  };

  const openMobileMenu = () => {
    clearMobileMenuCloseFrame();
    clearMobileSubmenuCloseTimeout();
    wheelLockRef.current = false;
    if (wheelLockTimeoutRef.current) {
      window.clearTimeout(wheelLockTimeoutRef.current);
      wheelLockTimeoutRef.current = null;
    }
    mobileMenuModeRef.current = "default";
    isMenuClosingRef.current = false;
    setMobileMenuMode("default");
    setActiveMobileSectionId(null);
    setIsMenuClosing(false);
    setIsMenuOpen(true);
  };

  const toggleMobileMenu = () => {
    if (isMenuOpen) {
      closeMobileMenu();
      return;
    }

    openMobileMenu();
  };

  const rotateMobileSection = (direction: 1 | -1) => {
    setActiveMobileSectionId((current) => {
      if (!current) {
        return "shop";
      }

      const currentIndex = mobileContentSectionIds.indexOf(current);
      const nextIndex =
        (currentIndex + direction + mobileContentSectionIds.length) % mobileContentSectionIds.length;

      return mobileContentSectionIds[nextIndex];
    });
  };

  const handleSelectorWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (mobileMenuMode !== "expanded") {
      return;
    }

    if (Math.abs(event.deltaY) < 8) {
      return;
    }

    event.preventDefault();
    if (wheelLockRef.current) {
      return;
    }

    rotateMobileSection(event.deltaY > 0 ? 1 : -1);
    wheelLockRef.current = true;
    wheelLockTimeoutRef.current = window.setTimeout(() => {
      wheelLockRef.current = false;
      wheelLockTimeoutRef.current = null;
    }, 400);
  };

  const handleSelectorTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (mobileMenuMode !== "expanded") {
      return;
    }

    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleSelectorTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (mobileMenuMode !== "expanded") {
      return;
    }

    const touchStartY = touchStartYRef.current;
    const touchEndY = event.changedTouches[0]?.clientY ?? null;
    touchStartYRef.current = null;

    if (touchStartY === null || touchEndY === null || Math.abs(touchStartY - touchEndY) < 32) {
      return;
    }

    rotateMobileSection(touchEndY < touchStartY ? 1 : -1);
  };

  const selectMobileContentSection = (sectionId: MobileContentSectionId) => {
    if (mobileMenuMode === "collapsing" || isMenuClosing) {
      return;
    }

    if (mobileMenuMode === "expanded" && activeMobileSectionId === sectionId) {
      mobileMenuModeRef.current = "collapsing";
      setMobileMenuMode("collapsing");

      if (prefersReducedMotion()) {
        setActiveMobileSectionId(null);
        mobileMenuModeRef.current = "default";
        setMobileMenuMode("default");
        return;
      }

      clearMobileSubmenuCloseTimeout();
      mobileSubmenuCloseTimeoutRef.current = window.setTimeout(() => {
        mobileSubmenuCloseTimeoutRef.current = null;
        setActiveMobileSectionId(null);
        mobileMenuModeRef.current = "default";
        setMobileMenuMode("default");
      }, mobileMenuCollapseDuration);
      return;
    }

    clearMobileSubmenuCloseTimeout();
    setActiveMobileSectionId(sectionId);
    mobileMenuModeRef.current = "expanded";
    setMobileMenuMode("expanded");
  };

  const activeMobileSection = mobileMenuSections.find((section) => section.id === activeMobileSectionId);

  const getSelectorOffset = (sectionId: MobileMenuSection["id"]) => {
    if (mobileMenuMode === "default" || mobileMenuMode === "collapsing" || !activeMobileSectionId) {
      return sectionId === "home" ? -1 : sectionId === "shop" ? 0 : 1;
    }

    if (sectionId === activeMobileSectionId) {
      return 0;
    }

    if (activeMobileSectionId === "shop") {
      return sectionId === "home" ? -1 : 1;
    }

    if (sectionId === "shop") {
      return -1;
    }

    return 1;
  };

  const headerClasses = [
    "brand-header",
    isScrolled ? "brand-header--scrolled" : "brand-header--at-top",
    isMenuOpen ? "brand-header--menu-open" : "",
    isMenuClosing ? "brand-header--menu-closing" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClasses}>
      <div className="brand-header__bar">
        <Link
          aria-hidden={isMenuOpen ? "true" : undefined}
          aria-label="YourPrettySets home"
          className="brand-mark"
          to="/"
          tabIndex={isMenuOpen ? -1 : undefined}
        >
          YourPrettySets
        </Link>

        <nav className="brand-header__desktop-nav" aria-label="Primary navigation">
          {mainNavItems.map((item) => {
            return (
              <Link key={item.href} to={item.href}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="brand-header__mobile-actions" aria-label="Mobile header actions">
          <button
            ref={menuButtonRef}
            className="brand-header__icon-button"
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobileMenu}
          >
            {isMenuOpen ? <X aria-hidden="true" size={16} strokeWidth={1.7} /> : <Menu aria-hidden="true" size={18} />}
          </button>
          <button
            aria-disabled="true"
            aria-hidden={isMenuOpen ? "true" : undefined}
            aria-label="Bag coming soon"
            className="brand-header__icon-button"
            tabIndex={isMenuOpen ? -1 : undefined}
            title="Bag coming soon"
            type="button"
          >
            <ShoppingBag aria-hidden="true" size={18} />
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        aria-label="Mobile menu"
        aria-modal="true"
        className="brand-header__mobile-menu-dialog"
        role="dialog"
        hidden={!isMenuOpen}
      >
        <nav
          aria-label="Mobile navigation"
          className={[
            "brand-header__mobile-menu",
            `brand-header__mobile-menu--${mobileMenuMode}`,
            isMenuClosing ? "brand-header__mobile-menu--closing" : "",
            activeMobileSectionId ? `brand-header__mobile-menu--active-${activeMobileSectionId}` : ""
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            aria-label="Menu sections"
            className={[
              "brand-header__mobile-menu-selector",
              `brand-header__mobile-menu-selector--${mobileMenuMode}`
            ].join(" ")}
            onTouchEnd={handleSelectorTouchEnd}
            onTouchStart={handleSelectorTouchStart}
            onWheel={handleSelectorWheel}
          >
            <span className="brand-header__mobile-selector-indicator" aria-hidden="true" />
            {mobileMenuSections.map((section) => {
              const selectorOffset = getSelectorOffset(section.id);
              const isActive = mobileMenuMode === "expanded" && section.id === activeMobileSectionId;
              const selectorClasses = [
                "brand-header__mobile-selector-item",
                isActive ? "brand-header__mobile-selector-item--active" : "",
                `brand-header__mobile-selector-item--offset-${selectorOffset}`
              ]
                .filter(Boolean)
                .join(" ");

              if (section.id === "home") {
                return (
                  <Link
                    aria-label="Home"
                    className={selectorClasses}
                    data-offset={selectorOffset}
                    key={section.id}
                    onClick={() => followMobileMenuLink(section.href)}
                    to={section.href}
                  >
                    {section.label}
                  </Link>
                );
              }

              const contentSectionId = section.id as MobileContentSectionId;

              return (
                <button
                  aria-label={section.label}
                  aria-controls="brand-header-mobile-menu-content"
                  aria-expanded={isActive}
                  className={selectorClasses}
                  data-offset={selectorOffset}
                  key={section.id}
                  onClick={() => selectMobileContentSection(contentSectionId)}
                  type="button"
                >
                  {section.label}
                </button>
              );
            })}
          </div>

          <div
            aria-hidden={mobileMenuMode !== "expanded" ? "true" : undefined}
            className={[
              "brand-header__mobile-menu-content",
              `brand-header__mobile-menu-content--${mobileMenuMode}`
            ].join(" ")}
            id="brand-header-mobile-menu-content"
          >
            {activeMobileSection ? (
              <div
                className="brand-header__mobile-submenu-panel"
                key={activeMobileSection.id}
                data-active-section={activeMobileSection.id}
              >
                <p className="brand-header__mobile-submenu-eyebrow">{activeMobileSection.eyebrow}</p>
                <div className="brand-header__mobile-submenu-links">
                  {activeMobileSection.children?.map((child) => (
                    <Link
                      className="brand-header__mobile-submenu-link"
                      key={child.href}
                      onClick={() => followMobileMenuLink(child.href)}
                      to={child.href}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
