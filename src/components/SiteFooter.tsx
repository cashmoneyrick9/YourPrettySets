import { FormEvent, useState } from "react";
import {
  ChevronRight,
  FileText,
  Instagram,
  Lock,
  Mail,
  Music2,
  Pin,
  RotateCcw,
  Truck,
  Youtube
} from "lucide-react";

const shopLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "New Arrivals", href: "/shop" },
  { label: "Best Sellers", href: "/shop" },
  { label: "Accessories", href: "#kit-heading" }
];

const policyLinks = [
  { label: "Shipping", href: "#help-center", icon: Truck },
  { label: "Returns", href: "#help-center", icon: RotateCcw },
  { label: "Privacy", href: "#privacy", icon: Lock },
  { label: "Terms", href: "#terms", icon: FileText }
];

const socialLinks = [
  // Placeholder social URLs until the real brand accounts are available.
  { label: "Instagram", href: "#instagram", icon: Instagram },
  { label: "TikTok", href: "#tiktok", icon: Music2 },
  { label: "Pinterest", href: "#pinterest", icon: Pin },
  { label: "YouTube", href: "#youtube", icon: Youtube },
  { label: "Email", href: "mailto:hello@yourprettysets.com", icon: Mail }
];

export function SiteFooter() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <footer className="site-footer" aria-labelledby="site-footer-title">
      <div className="site-footer__inner">
        <section className="site-footer-email site-footer-email--restored" aria-labelledby="site-footer-title">
          <div className="site-footer-email__content">
            <p className="site-footer-email__eyebrow">YOURPRETTYSETS</p>
            <h2 className="site-footer-email__title" id="site-footer-title">
              Get 15% off your first set
            </h2>
            <p className="site-footer-email__copy">Join the list for new drops, restocks, and exclusive offers.</p>
            <form className="site-footer-email__form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="site-footer-email-input">
                Email address
              </label>
              <input
                autoComplete="email"
                className="site-footer-email__input"
                id="site-footer-email-input"
                placeholder="Email address"
                required
                type="email"
              />
              <button className="site-footer-email__button" type="submit">
                Get 15% off
              </button>
            </form>
            <p className="site-footer-email__note">
              {submitted ? "You're on the list. Your code is coming soon." : "No spam. Just pretty updates."}
            </p>
          </div>
        </section>

        <nav className="site-footer__shop-nav" aria-label="Footer shop navigation">
          {shopLinks.map((link) => (
            <a className="site-footer__shop-link" href={link.href} key={link.label}>
              <span>{link.label}</span>
              <ChevronRight aria-hidden size={18} strokeWidth={1.7} />
            </a>
          ))}
        </nav>

        <nav className="site-footer__policy-bar" aria-label="Footer policy navigation">
          {policyLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a className="site-footer__policy-link" href={link.href} key={link.label}>
                <Icon aria-hidden size={19} strokeWidth={1.45} />
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="site-footer__social-block">
          <p>Follow Us</p>
          <div className="site-footer__social-links">
            {socialLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a href={link.href} key={link.label} aria-label={link.label}>
                  <Icon aria-hidden size={18} strokeWidth={1.65} />
                </a>
              );
            })}
          </div>
        </div>

        <p className="site-footer__love-note">made for you, with love. ♡</p>

        <div className="site-footer__copyright">
          <p>© 2024 YourPrettySets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
