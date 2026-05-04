const navItems = ["Home", "Shop Collections", "How It Works", "FAQ", "Bag"];

export function BrandHeader() {
  return (
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
  );
}
