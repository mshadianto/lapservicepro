import { useState } from "react";
import { useSubscription } from "../hooks/useSubscription";
import { PLANS, EK_PRODUCTS } from "../data/subscription";
import TierBar from "../components/TierBar";
import { fmt } from "../utils/format";
import { fonts, colors } from "../styles/theme";

function PriceDelta({ curr, prev }) {
  if (!prev || prev === curr) return null;
  const up = curr > prev;
  return <span style={{ fontSize: 9.5, fontWeight: 600, color: up ? colors.red500 : colors.green500 }}>{up ? "\u25B2" : "\u25BC"}{Math.abs(Math.round(((curr - prev) / prev) * 100))}%</span>;
}

function LiveDot() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: colors.green500 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.green500, animation: "pulse 2s infinite" }} />LIVE
    </span>
  );
}

export default function MarketplacePage() {
  const { plan, ekProducts } = useSubscription();
  const p = PLANS[plan];
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const cats = [...new Set(ekProducts.map((i) => i.cat))];
  const visible = ekProducts.slice(0, p.limits.ekProductsVisible);
  const filtered = visible.filter((i) => (cat === "all" || i.cat === cat) && (!search || i.name.toLowerCase().includes(search.toLowerCase())));

  const addToCart = (item) => {
    if (!p.limits.marketplaceOrder) return;
    setCart((prev) => {
      const ex = prev.find((c) => c.sku === item.sku);
      if (ex) return prev.map((c) => (c.sku === item.sku ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  return (
    <div>
      <TierBar />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: fonts.heading, margin: 0 }}>{"\uD83D\uDED2"} Marketplace Enterkomputer</h1>
          <p style={{ color: colors.slate500, fontSize: 11.5, margin: "3px 0 0", fontFamily: fonts.body }}>Harga realtime — Mangga Dua Mall Jakarta</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LiveDot />
          {cart.length > 0 && (
            <div style={{ background: colors.slate900, borderRadius: 9, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: colors.slate100, fontSize: 10.5 }}>{"\uD83D\uDED2"} {cart.reduce((s, c) => s + c.qty, 0)}</span>
              <span style={{ color: colors.cyan400, fontSize: 13, fontWeight: 700 }}>{fmt(cartTotal)}</span>
            </div>
          )}
        </div>
      </div>

      {plan === "starter" && (
        <div style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)", borderRadius: 10, padding: "12px 16px", marginBottom: 14, border: "1px solid #c7d2fe", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{"\uD83D\uDD13"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#4338ca" }}>Starter: Lihat 5 produk, order terkunci</div>
            <div style={{ fontSize: 10.5, color: "#6366f1" }}>Upgrade ke Pro untuk akses 25+ produk & order langsung</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari..." style={{
          padding: "6px 10px", borderRadius: 6, border: `1px solid ${colors.slate200}`, fontSize: 11.5,
          width: 190, outline: "none", background: colors.slate50, fontFamily: fonts.body,
        }} />
        {["all", ...cats].map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10.5, cursor: "pointer",
            border: `1px solid ${cat === c ? colors.blue500 : colors.slate200}`,
            background: cat === c ? colors.blue50 : colors.white,
            color: cat === c ? colors.blue500 : colors.slate500, fontFamily: fonts.body,
          }}>{c === "all" ? "Semua" : c}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {filtered.map((item) => {
          const up = item.price > item.prevPrice;
          const inCart = cart.find((c) => c.sku === item.sku);
          return (
            <div key={item.sku} style={{ background: colors.white, borderRadius: 11, border: `1px solid ${colors.slate200}`, overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: 6, left: 6, display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: colors.green500, animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 8.5, color: colors.green500, fontWeight: 600 }}>LIVE</span>
              </div>
              {up && <div style={{ position: "absolute", top: 6, right: 6, background: colors.red50, color: colors.red500, fontSize: 8.5, fontWeight: 700, padding: "1px 5px", borderRadius: 4 }}>{"\u25B2"}</div>}
              <div style={{ height: 55, background: colors.slate50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{item.img}</div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 9.5, color: colors.cyan400, fontWeight: 600, marginBottom: 1 }}>{item.brand}</div>
                <div style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 2, lineHeight: 1.3, minHeight: 28, color: colors.slate900 }}>{item.name}</div>
                <div style={{ fontSize: 9.5, color: colors.slate400, marginBottom: 5 }}>SKU: {item.sku}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{fmt(item.price)}</span>
                  <PriceDelta curr={item.price} prev={item.prevPrice} />
                </div>
                <button onClick={() => addToCart(item)} disabled={!p.limits.marketplaceOrder} style={{
                  width: "100%", padding: 6, borderRadius: 6,
                  border: inCart ? "none" : !p.limits.marketplaceOrder ? "1px dashed #d1d5db" : `1px solid ${colors.slate200}`,
                  background: inCart ? `linear-gradient(135deg, ${colors.green500}, #059669)` : !p.limits.marketplaceOrder ? colors.slate50 : colors.white,
                  color: inCart ? colors.white : !p.limits.marketplaceOrder ? colors.slate400 : colors.blue500,
                  fontSize: 10.5, fontWeight: 600, cursor: p.limits.marketplaceOrder ? "pointer" : "not-allowed", fontFamily: fonts.body,
                }}>{!p.limits.marketplaceOrder ? "\uD83D\uDD12 Order: Pro" : inCart ? `\u2713 (${inCart.qty})` : "+ Keranjang"}</button>
              </div>
            </div>
          );
        })}
        {plan === "starter" && (
          <div style={{ background: "linear-gradient(135deg, #f8fafc, #f5f3ff)", borderRadius: 11, border: "1px dashed #8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, cursor: "pointer" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{"\uD83D\uDD12"}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6366f1" }}>+{EK_PRODUCTS.length - 5} produk lagi</div>
              <div style={{ fontSize: 10.5, color: colors.violet500 }}>Upgrade ke Pro</div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}
