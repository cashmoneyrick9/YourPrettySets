import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SiteFooter() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="site-footer-system">
      <Card aria-labelledby="site-footer-email-title" className="site-footer-email" role="region">
        <CardContent className="site-footer-email__content">
          <p className="site-footer-email__eyebrow">YOURPRETTYSETS</p>
          <h2 className="site-footer-email__title" id="site-footer-email-title">
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
            <Button className="site-footer-email__button" type="submit">
              Get 15% off
            </Button>
          </form>
          <p className="site-footer-email__note">
            {submitted ? "You're on the list. Your code is coming soon." : "No spam. Just pretty updates."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
