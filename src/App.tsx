import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { BrandHeader } from "./components/BrandHeader";
import { FooterEmailCapture } from "./components/FooterEmailCapture";
import { SiteFooter } from "./components/SiteFooter";
import { HelpHubPage, HelpSubpage, PolicyPlaceholderPage } from "./pages/HelpPage";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { ShopLandingPage } from "./pages/ShopLandingPage";
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
        <Route
          path="/shop/ready-to-ship"
          element={
            <ShopLandingPage
              title="Ready to Ship"
              body="A simple destination for in-stock sets that can ship first. Product filtering can be wired here when fulfillment rules are final."
            />
          }
        />
        <Route
          path="/shop/made-to-order"
          element={
            <ShopLandingPage
              title="Made to Order"
              body="A placeholder destination for designs made after purchase. Final timing and product grouping can be added when production rules are set."
            />
          }
        />
        <Route
          path="/shop/custom-orders"
          element={
            <ShopLandingPage
              title="Custom Orders"
              body="A simple route for custom-order interest while the full request flow is still being shaped."
            />
          }
        />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/help" element={<HelpHubPage />} />
        <Route path="/help/sizing" element={<HelpSubpage page="sizing" />} />
        <Route path="/help/how-to-apply" element={<HelpSubpage page="how-to-apply" />} />
        <Route path="/help/shipping-returns" element={<HelpSubpage page="shipping-returns" />} />
        <Route path="/help/faq" element={<HelpSubpage page="faq" />} />
        <Route path="/help/contact" element={<HelpSubpage page="contact" />} />
        <Route path="/privacy" element={<PolicyPlaceholderPage title="Privacy" />} />
        <Route path="/terms" element={<PolicyPlaceholderPage title="Terms" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FooterEmailCapture />
      <SiteFooter />
    </div>
  );
}

export default App;
