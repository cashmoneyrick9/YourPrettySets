import { FormEvent, useState } from "react";

export function FooterEmailCapture() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="site-footer-email-shell">
      <div className="site-footer__inner">
        <section
          className="site-footer-email site-footer-email--restored site-footer-email--image"
          aria-labelledby="site-footer-title"
        >
          <div className="site-footer-email__content">
            <h2 className="site-footer-email__title" id="site-footer-title">
              Get 15% off your first order
            </h2>
            <p className="site-footer-email__copy">
              Join our email list for new drops, restocks, and exclusive offers.
            </p>
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
                Get 15% Off
              </button>
            </form>
            <p className="site-footer-email__note">
              {submitted ? "You’re on the list. Your code is coming soon." : "No spam. Unsubscribe anytime."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
