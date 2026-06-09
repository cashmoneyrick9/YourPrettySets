import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { BrandHeader } from "./components/BrandHeader";
import { FooterEmailCapture } from "./components/FooterEmailCapture";
import { SiteFooter } from "./components/SiteFooter";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { ShopPage } from "./pages/ShopPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const pathnameChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (!pathnameChanged || navigationType === "POP") {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [navigationType, pathname]);

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
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FooterEmailCapture />
      <SiteFooter />
    </div>
  );
}

export default App;
