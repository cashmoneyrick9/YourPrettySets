import { BrandHeader } from "./components/BrandHeader";
import { SiteFooter } from "./components/SiteFooter";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";

function App() {
  const currentPath = window.location.pathname;
  const page = currentPath === "/shop" ? <ShopPage /> : <HomePage />;

  return (
    <div className="site-shell site-shell--barebones">
      <BrandHeader />
      {page}
      <SiteFooter />
    </div>
  );
}

export default App;
