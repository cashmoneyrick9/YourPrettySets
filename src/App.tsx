const navItems = ["Home", "Shop Collections", "How It Works", "FAQ", "Bag"];

function App() {
  return (
    <div className="site-shell">
      <header className="brand-header">
        <a className="brand-mark" href="#home" aria-label="YourPrettySets home">
          YourPrettySets
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}>
              {item}
            </a>
          ))}
        </nav>
      </header>
      <main id="home">
        <section className="hero-shell">
          <p className="eyebrow">Handmade ready-to-wear press-ons</p>
          <h1>Art on Miniature Canvases</h1>
          <p>
            Pretty sets made for everyday style, special plans, and salon-looking moments at home.
          </p>
          <a className="primary-button" href="#shop-collections">
            Shop ready-to-wear
          </a>
        </section>
      </main>
    </div>
  );
}

export default App;
