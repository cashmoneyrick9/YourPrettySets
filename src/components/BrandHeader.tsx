import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

const desktopNavItems = ["Home", "Shop Collections", "How It Works", "FAQ", "Bag"];
const mobileMenuItems = ["Home", "Shop Collections", "How It Works", "FAQ"];
const headerAtTopBodyClass = "header-at-top";
const headerScrolledBodyClass = "header-scrolled";

function hrefFor(item: string) {
  return `#${item.toLowerCase().replace(/\s+/g, "-")}`;
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

  return (
    <header className={`brand-header ${isScrolled ? "brand-header--scrolled" : "brand-header--at-top"}`}>
      <div className="brand-header__bar">
        <a className="brand-mark" href="#home" aria-label="YourPrettySets home">
          YourPrettySets
        </a>

        <nav className="brand-header__desktop-nav" aria-label="Primary navigation">
          {desktopNavItems.map((item) => (
            <a key={item} href={hrefFor(item)}>
              {item}
            </a>
          ))}
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
          <a className="brand-header__icon-button" href="#faq" aria-label="View bag">
            <ShoppingBag aria-hidden="true" size={18} />
          </a>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className="brand-header__mobile-menu"
        aria-label="Mobile navigation"
        hidden={!isMenuOpen}
      >
        {mobileMenuItems.map((item) => (
          <a key={item} href={hrefFor(item)} onClick={() => setIsMenuOpen(false)}>
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
