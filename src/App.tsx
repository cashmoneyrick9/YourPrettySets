import { BrandHeader } from "./components/BrandHeader";
import { SiteFooter } from "./components/SiteFooter";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <div className="site-shell site-shell--barebones">
      <BrandHeader />
      <HomePage />
      <SiteFooter />
    </div>
  );
}

export default App;
