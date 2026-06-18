import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const mainNavItems = ["Home", "Shop", "Help"];
const headerAtTopBodyClass = "header-at-top";
const headerScrolledBodyClass = "header-scrolled";
const mobileMenuOpenBodyClass = "mobile-menu-open";

function hrefFor(item: string) {
  if (item === "Home") {
    return "/";
  }

  if (item === "Shop") {
    return "/shop";
  }

  if (item === "Help") {
    return "/help";
  }

  return "/";
}

export function BrandHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            const href = hrefFor(item);

            return (
              <Link key={item} to={href}>
                {item}
              </Link>
            );
          })}
        </nav>

        <div className="brand-header__mobile-actions" aria-label="Mobile header actions">
          <button
            className="brand-header__icon-button"
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
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

      <nav
        id="mobile-navigation"
        className="brand-header__mobile-menu"
        aria-label="Mobile navigation"
        hidden={!isMenuOpen}
      >
        {mainNavItems.map((item) => {
          const href = hrefFor(item);

          return (
            <Link key={item} to={href} onClick={() => setIsMenuOpen(false)}>
              {item}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
