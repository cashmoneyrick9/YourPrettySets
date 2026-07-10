import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { BrandHeader } from "./components/BrandHeader";
import { FooterEmailCapture } from "./components/FooterEmailCapture";
import { SiteFooter } from "./components/SiteFooter";
import { legacyHelpRedirects } from "./data/helpContent";
import { CustomOrdersPage } from "./pages/CustomOrdersPage";
import {
  ApplicationGuidePage,
  ContactSupportPage,
  FaqPage,
  HelpHubPage,
  PolicyPlaceholderPage,
  RemovalGuidePage,
  ShippingReturnsPage,
  SizingGuidePage
} from "./pages/HelpPage";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { ShopPage } from "./pages/ShopPage";

function ScrollToTop() {
  const { hash, pathname } = useLocation();
  const navigationType = useNavigationType();
  const previousLocation = useRef(`${pathname}${hash}`);

  useEffect(() => {
    const currentLocation = `${pathname}${hash}`;
    const locationChanged = previousLocation.current !== currentLocation;
    previousLocation.current = currentLocation;

    if (!locationChanged || navigationType === "POP") {
      return;
    }

    let hashTarget: HTMLElement | null = null;

    if (hash) {
      try {
        hashTarget = document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch {
        hashTarget = document.getElementById(hash.slice(1));
      }
    }

    if (hashTarget) {
      hashTarget.scrollIntoView?.({ block: "start", behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    const focusTarget = hashTarget
      ? hashTarget.matches("h1, h2, h3")
        ? hashTarget
        : hashTarget.querySelector<HTMLElement>("h1, h2, h3") ?? hashTarget
      : document.querySelector<HTMLElement>("main h1");

    if (focusTarget) {
      focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus({ preventScroll: true });
    }
  }, [hash, navigationType, pathname]);

  return null;
}

function App() {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollToTop />
      {pathname === "/shop/custom-orders" ? (
        <Routes>
          <Route path="/shop/custom-orders" element={<CustomOrdersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <div className="site-shell">
          <BrandHeader />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/ready-to-ship" element={<ShopPage orderType="ready-to-ship" />} />
            <Route path="/shop/made-to-order" element={<ShopPage orderType="made-to-order" />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/help" element={<HelpHubPage />} />
            <Route path="/help/sizing" element={<SizingGuidePage />} />
            <Route path="/help/application" element={<ApplicationGuidePage />} />
            <Route path="/help/removal" element={<RemovalGuidePage />} />
            <Route
              path={legacyHelpRedirects[0].from}
              element={<Navigate to={legacyHelpRedirects[0].to} replace />}
            />
            <Route path="/help/shipping-returns" element={<ShippingReturnsPage />} />
            <Route path="/help/faq" element={<FaqPage />} />
            <Route path="/help/contact" element={<ContactSupportPage />} />
            <Route path="/privacy" element={<PolicyPlaceholderPage title="Privacy" />} />
            <Route path="/terms" element={<PolicyPlaceholderPage title="Terms" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <FooterEmailCapture />
          <SiteFooter />
        </div>
      )}
    </>
  );
}

export default App;
