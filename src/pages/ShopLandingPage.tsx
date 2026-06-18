import { Link } from "react-router-dom";

type ShopLandingPageProps = {
  body: string;
  title: "Ready to Ship" | "Made to Order" | "Custom Orders";
};

export function ShopLandingPage({ body, title }: ShopLandingPageProps) {
  return (
    <main className="shop-landing-page">
      <section className="shop-landing-page__inner" aria-labelledby="shop-landing-title">
        <div className="shop-landing-page__heading">
          <p className="eyebrow">Shop</p>
          <h1 id="shop-landing-title">{title}</h1>
          <p>{body}</p>
        </div>

        <Link className="shop-landing-page__link" to="/shop">
          Shop all sets
        </Link>
      </section>
    </main>
  );
}
