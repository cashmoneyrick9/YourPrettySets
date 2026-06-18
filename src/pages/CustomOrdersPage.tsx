import { X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function CustomOrdersPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Connect this form to the chosen email capture backend when one exists.
    setIsSubmitted(true);
  }

  return (
    <main className="custom-orders-page" aria-labelledby="custom-orders-title">
      <Link aria-label="Close custom orders and return to shop" className="custom-orders-page__close" to="/shop">
        <X aria-hidden="true" size={18} />
      </Link>

      <section className="custom-orders-page__card">
        <p className="custom-orders-page__eyebrow">YourPrettySets</p>
        <h1 id="custom-orders-title">Custom Orders Coming Soon</h1>
        <p className="custom-orders-page__copy">
          Join the list for first notice when one-of-one request spots open.
        </p>

        <form className="custom-orders-page__form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="custom-orders-email">
            Email address
          </label>
          <input
            autoComplete="email"
            id="custom-orders-email"
            onChange={(event) => {
              setEmail(event.target.value);
              setIsSubmitted(false);
            }}
            placeholder="Email address"
            required
            type="email"
            value={email}
          />
          <button type="submit">Notify me</button>
        </form>

        {isSubmitted ? <p className="custom-orders-page__confirmation">You’re on the list.</p> : null}
      </section>
    </main>
  );
}
