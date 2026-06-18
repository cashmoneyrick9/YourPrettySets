import { Link } from "react-router-dom";

const shopLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "New Arrivals", href: "/shop" },
  { label: "Best Sellers", href: "/shop" }
];

const helpLinks = [
  { label: "Sizing", href: "/help/sizing" },
  { label: "Application", href: "/help/how-to-apply" },
  { label: "Contact", href: "/help/contact" }
];

const policyLinks = [
  { label: "Shipping", href: "/help/shipping-returns" },
  { label: "Returns", href: "/help/shipping-returns" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" }
];

// TODO: Replace placeholder social hrefs with real brand URLs when accounts are available.
const socialLinks = [
  { label: "Instagram ↗", href: "#instagram" },
  { label: "TikTok ↗", href: "#tiktok" },
  { label: "Pinterest ↗", href: "#pinterest" },
  { label: "Email", href: "mailto:hello@yourprettysets.com" }
];

const footerColumns = [
  { title: "Shop", links: shopLinks },
  { title: "Help", links: helpLinks },
  { title: "Policies", links: policyLinks }
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-block">
          <p className="site-footer__brand">YourPrettySets</p>
          <p className="site-footer__love-note">made for you, with love</p>
        </div>

        <nav className="site-footer__columns" aria-label="Footer navigation">
          {footerColumns.map((column) => (
            <div className="site-footer__column" key={column.title}>
              <h2 className="site-footer__column-title">{column.title}</h2>
              <ul className="site-footer__link-list">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link className="site-footer__text-link" to={link.href}>
                        {link.label}
                      </Link>
                    ) : (
                      <a className="site-footer__text-link" href={link.href}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <nav className="site-footer__social-links" aria-label="Footer social and contact links">
          {socialLinks.map((link) => (
            <a className="site-footer__social-link" href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-footer__copyright">
          <p>© {currentYear} YourPrettySets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
