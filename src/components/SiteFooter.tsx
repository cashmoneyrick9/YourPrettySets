import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FooterGroupId = "shop" | "help" | "policies" | "social";

type FooterLink = {
  href: string;
  label: string;
};

type FooterGroup = {
  id: FooterGroupId;
  label: string;
  links: FooterLink[];
};

const footerGroups: FooterGroup[] = [
  {
    id: "shop",
    label: "Shop",
    links: [
      { href: "#shop-collections", label: "Collections" },
      { href: "#this-weeks-set", label: "This week's set" },
      { href: "#shop-more", label: "Shop more" }
    ]
  },
  {
    id: "help",
    label: "Help",
    links: [
      { href: "#how-it-works", label: "How it works" },
      { href: "#faq", label: "Care tips" },
      { href: "#contact", label: "Contact us" }
    ]
  },
  {
    id: "policies",
    label: "Policies",
    links: [
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/privacy", label: "Privacy" }
    ]
  },
  {
    id: "social",
    label: "Social",
    links: [{ href: "#instagram", label: "Instagram" }]
  }
];

export function SiteFooter() {
  const [openGroup, setOpenGroup] = useState<FooterGroupId>("shop");

  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__intro">
        <a className="site-footer__brand" href="#home">
          YourPrettySets
        </a>
        <p>Ready-to-wear press-ons, packed with care.</p>
        <a className="site-footer__contact" href="#contact">
          Contact us
        </a>
      </div>

      <nav aria-label="Footer navigation" className="site-footer__groups">
        {footerGroups.map((group) => {
          const isOpen = openGroup === group.id;
          const panelId = `footer-panel-${group.id}`;

          return (
            <section className={`site-footer__group${isOpen ? " site-footer__group--open" : ""}`} key={group.id}>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="site-footer__toggle"
                onClick={() => setOpenGroup(group.id)}
                type="button"
              >
                <span>{group.label}</span>
                <ChevronDown aria-hidden="true" />
              </button>
              {isOpen && (
                <div className="site-footer__panel" id={panelId}>
                  {group.links.map((link) => (
                    <a href={link.href} key={`${group.id}-${link.label}`}>
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </nav>

      <p className="site-footer__fine-print">&copy; 2026 YourPrettySets</p>
    </footer>
  );
}
