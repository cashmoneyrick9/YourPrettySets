import { Navigate, Route, Routes } from "react-router-dom";
import { BrandHeader } from "./components/BrandHeader";
import { SiteFooter } from "./components/SiteFooter";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";

function App() {
  return (
    <div className="site-shell">
      <BrandHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SiteFooter />
    </div>
  );
}

export default App;
