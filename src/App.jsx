import { useState, useMemo, useCallback } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Sidebar from "./components/Sidebar";
import LockedSection from "./components/LockedSection";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import NewOrderPage from "./pages/NewOrderPage";
import PredictPage from "./pages/PredictPage";
import PartsPage from "./pages/PartsPage";
import TechniciansPage from "./pages/TechniciansPage";
import InvoicePage from "./pages/InvoicePage";
import ReportPage from "./pages/ReportPage";
import MarketplacePage from "./pages/MarketplacePage";
import FinancePage from "./pages/FinancePage";
import { useOrders } from "./hooks/useOrders";
import { SubscriptionProvider } from "./hooks/useSubscription";
import { colors, fonts } from "./styles/theme";

const responsiveStyles = `
  @media (max-width: 768px) {
    .sidebar {
      position: fixed !important;
      top: 0; left: 0; bottom: 0;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    .sidebar-open {
      transform: translateX(0) !important;
    }
    .sidebar-overlay {
      display: block !important;
    }
    .app-main {
      padding: 16px !important;
      padding-top: 68px !important;
      max-height: none !important;
    }
    .mobile-header {
      display: flex !important;
    }
  }
`;

function MobileHeader({ onMenuOpen }) {
  return (
    <div className="mobile-header" style={{
      display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 997,
      height: 56, padding: "0 16px", alignItems: "center", gap: 12,
      background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <button onClick={onMenuOpen} style={{
        background: "none", border: "none", cursor: "pointer", padding: 6,
        color: colors.slate300, fontSize: 22, lineHeight: 1,
      }}>{"\u2630"}</button>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: `linear-gradient(135deg, ${colors.cyan400}, ${colors.blue500})`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
        }}>{"\uD83D\uDCBB"}</div>
        <span style={{ color: colors.slate100, fontWeight: 800, fontSize: 14, fontFamily: fonts.heading }}>LapServ Pro</span>
      </div>
    </div>
  );
}

function AppInner() {
  const [view, setView] = useState("landing");
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { orders, addOrder, updateStatus } = useOrders();

  const pendingCount = useMemo(
    () => orders.filter((o) => !["selesai", "dibatalkan"].includes(o.status)).length,
    [orders]
  );

  const enterApp = useCallback(() => setView("app"), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  if (view === "landing") {
    return (
      <ErrorBoundary>
        <LandingPage onEnterApp={enterApp} />
      </ErrorBoundary>
    );
  }

  const page = (() => {
    switch (active) {
      case "dashboard":
        return <DashboardPage orders={orders} />;
      case "orders":
        return <OrdersPage orders={orders} updateStatus={updateStatus} setActive={setActive} />;
      case "new":
        return <NewOrderPage addOrder={addOrder} setActive={setActive} />;
      case "predict":
        return <PredictPage />;
      case "parts":
        return <PartsPage />;
      case "marketplace":
        return <MarketplacePage />;
      case "finance":
        return <LockedSection feature="finance_report" requiredPlan="pro"><FinancePage orders={orders} /></LockedSection>;
      case "technicians":
        return <LockedSection feature="ai_diagnosis_full" requiredPlan="pro"><TechniciansPage /></LockedSection>;
      case "invoice":
        return <InvoicePage orders={orders} />;
      case "report":
        return <ReportPage orders={orders} />;
      default:
        return <DashboardPage orders={orders} />;
    }
  })();

  return (
    <>
      <style>{responsiveStyles}</style>
      <MobileHeader onMenuOpen={() => setSidebarOpen(true)} />
      <div style={{ display: "flex", minHeight: "100vh", background: colors.slate100, fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar
          active={active}
          setActive={setActive}
          pendingCount={pendingCount}
          mobileOpen={sidebarOpen}
          onClose={closeSidebar}
        />
        <main className="app-main" style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxHeight: "100vh" }}>
          <ErrorBoundary>{page}</ErrorBoundary>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <SubscriptionProvider>
      <AppInner />
    </SubscriptionProvider>
  );
}
