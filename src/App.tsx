import { BrandHeader } from "./components/BrandHeader";
import { SiteFooter } from "./components/SiteFooter";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <div className="site-shell">
      <BrandHeader />
      <HomePage />
      <SiteFooter />
    </div>
  );
}

export default App;
