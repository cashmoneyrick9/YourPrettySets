import { BrandHeader } from "./components/BrandHeader";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <div className="site-shell">
      <BrandHeader />
      <HomePage />
      <footer className="site-footer">
        <a href="#home">Home</a>
        <a href="#shop-collections">Shop Collections</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#faq">FAQ</a>
        <a href="#contact">Contact placeholder</a>
        <a href="#instagram">Instagram placeholder</a>
        <a href="/shipping">Shipping policy placeholder</a>
        <a href="/returns">Returns policy placeholder</a>
        <a href="/privacy">Privacy policy placeholder</a>
      </footer>
    </div>
  );
}

export default App;
