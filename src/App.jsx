import { useState, useMemo } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import NewOrderPage from "./pages/NewOrderPage";
import PredictPage from "./pages/PredictPage";
import PartsPage from "./pages/PartsPage";
import TechniciansPage from "./pages/TechniciansPage";
import InvoicePage from "./pages/InvoicePage";
import ReportPage from "./pages/ReportPage";
import { useOrders } from "./hooks/useOrders";
import { colors } from "./styles/theme";

export default function App() {
  const [active, setActive] = useState("dashboard");
  const { orders, addOrder, updateStatus } = useOrders();

  const pendingCount = useMemo(
    () => orders.filter((o) => !["selesai", "dibatalkan"].includes(o.status)).length,
    [orders]
  );

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
      case "technicians":
        return <TechniciansPage />;
      case "invoice":
        return <InvoicePage orders={orders} />;
      case "report":
        return <ReportPage orders={orders} />;
      default:
        return <DashboardPage orders={orders} />;
    }
  })();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.slate100, fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar active={active} setActive={setActive} pendingCount={pendingCount} />
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxHeight: "100vh" }}>
        <ErrorBoundary>{page}</ErrorBoundary>
      </main>
    </div>
  );
}
