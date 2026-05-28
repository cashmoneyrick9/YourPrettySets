import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    links: [{ href: "#shop-collections", label: "Collections" }]
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
      { href: "#faq", label: "Shipping" },
      { href: "#faq", label: "Returns" },
      { href: "#faq", label: "Privacy" }
    ]
  },
  {
    id: "social",
    label: "Social",
    links: [{ href: "#instagram", label: "Instagram" }]
  }
];

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__intro">
        <a className="site-footer__brand" href="#home">
          YourPrettySets
        </a>
        <p>Ready-to-wear press-ons, packed with care.</p>
      </div>

      <nav aria-label="Footer navigation" className="site-footer__groups">
        <Accordion collapsible={false} defaultValue="shop" type="single">
          {footerGroups.map((group) => (
            <AccordionItem className="site-footer__group" key={group.id} value={group.id}>
              <AccordionTrigger className="site-footer__toggle">
                <span>{group.label}</span>
              </AccordionTrigger>
              <AccordionContent className="site-footer__panel">
                {group.links.map((link) => (
                  <a href={link.href} key={`${group.id}-${link.label}`}>
                    {link.label}
                  </a>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>

      <p className="site-footer__fine-print">&copy; 2026 YourPrettySets</p>
    </footer>
  );
}
