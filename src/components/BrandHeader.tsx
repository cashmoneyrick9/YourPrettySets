import { Menu, ShoppingBag, X } from "lucide-react";
import { TouchEvent, WheelEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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
      { href: "/help", label: "Help Center" },
      { href: "/help/sizing", label: "Sizing Guide" },
      { href: "/help/how-to-apply", label: "How to Apply" },
      { href: "/help/shipping-returns", label: "Shipping & Returns" },
      { href: "/help/faq", label: "FAQ" },
      { href: "/help/contact", label: "Contact" }
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

const mobileContentSectionIds: MobileContentSectionId[] = ["shop", "help"];
const headerAtTopBodyClass = "header-at-top";
const headerScrolledBodyClass = "header-scrolled";
const mobileMenuOpenBodyClass = "mobile-menu-open";

export function BrandHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMobileSectionId, setActiveMobileSectionId] = useState<MobileContentSectionId>("shop");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

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

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    const preventMenuScroll = (event: Event) => {
      event.preventDefault();
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("wheel", preventMenuScroll, { passive: false });
    window.addEventListener("touchmove", preventMenuScroll, { passive: false });
    window.addEventListener("keydown", closeOnEscape);
    menuButtonRef.current?.focus();

    return () => {
      document.body.classList.remove(mobileMenuOpenBodyClass);
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener("wheel", preventMenuScroll);
      window.removeEventListener("touchmove", preventMenuScroll);
      window.removeEventListener("keydown", closeOnEscape);
      if (lockedScrollY > 0) {
        try {
          window.scrollTo(0, lockedScrollY);
        } catch {
          // JSDOM does not implement scroll restoration.
        }
      }
    };
  }, [isMenuOpen]);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    window.setTimeout(() => {
      menuButtonRef.current?.focus();
    }, 0);
  };

  const openMobileMenu = () => {
    setActiveMobileSectionId("shop");
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
      const currentIndex = mobileContentSectionIds.indexOf(current);
      const nextIndex =
        (currentIndex + direction + mobileContentSectionIds.length) % mobileContentSectionIds.length;

      return mobileContentSectionIds[nextIndex];
    });
  };

  const handleSelectorWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 8) {
      return;
    }

    event.preventDefault();
    rotateMobileSection(event.deltaY > 0 ? 1 : -1);
  };

  const handleSelectorTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleSelectorTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const touchStartY = touchStartYRef.current;
    const touchEndY = event.changedTouches[0]?.clientY ?? null;
    touchStartYRef.current = null;

    if (touchStartY === null || touchEndY === null || Math.abs(touchStartY - touchEndY) < 32) {
      return;
    }

    rotateMobileSection(touchEndY < touchStartY ? 1 : -1);
  };

  const activeMobileSection = mobileMenuSections.find((section) => section.id === activeMobileSectionId);

  const getSelectorOffset = (sectionId: MobileMenuSection["id"]) => {
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
    isMenuOpen ? "brand-header--menu-open" : ""
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
          className={`brand-header__mobile-menu brand-header__mobile-menu--active-${activeMobileSectionId}`}
        >
          <div
            aria-label="Menu sections"
            className="brand-header__mobile-menu-selector"
            onTouchEnd={handleSelectorTouchEnd}
            onTouchStart={handleSelectorTouchStart}
            onWheel={handleSelectorWheel}
          >
            <span className="brand-header__mobile-selector-indicator" aria-hidden="true" />
            {mobileMenuSections.map((section) => {
              const selectorOffset = getSelectorOffset(section.id);
              const isActive = section.id === activeMobileSectionId;
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
                    onClick={closeMobileMenu}
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
                  aria-current={isActive ? "page" : undefined}
                  className={selectorClasses}
                  data-offset={selectorOffset}
                  key={section.id}
                  onClick={() => setActiveMobileSectionId(contentSectionId)}
                  type="button"
                >
                  {isActive ? section.label.toUpperCase() : section.label}
                </button>
              );
            })}
          </div>

          <div className="brand-header__mobile-menu-content">
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
                      onClick={closeMobileMenu}
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
