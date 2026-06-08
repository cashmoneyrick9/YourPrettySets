import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BrandHeader } from "./components/BrandHeader";
import { SiteFooter } from "./components/SiteFooter";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="site-shell">
      <BrandHeader />
      <ScrollToTop />
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
