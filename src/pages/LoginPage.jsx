import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { USERS, ROLE_LABELS } from "../data/users";
import { PLANS } from "../data/subscription";
import { fonts, colors } from "../styles/theme";

export default function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAccounts, setShowAccounts] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const result = login(username, password);
    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      setError(result.error);
    }
  };

  const quickLogin = (u) => {
    setUsername(u.username);
    setPassword(u.password);
    const result = login(u.username, u.password);
    if (result.success) onLoginSuccess(result.user);
  };

  // Group users by plan
  const grouped = { starter: [], pro: [], enterprise: [] };
  USERS.forEach((u) => grouped[u.plan].push(u));

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse at 30% 20%, rgba(34,211,238,0.06) 0%, transparent 60%),
                   radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.04) 0%, transparent 60%),
                   ${colors.slate900}`,
      fontFamily: fonts.body, padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: "0 auto 14px",
            background: `linear-gradient(135deg, ${colors.cyan400}, ${colors.blue500})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
            boxShadow: "0 8px 30px rgba(34,211,238,0.3)",
          }}>{"\uD83D\uDCBB"}</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.slate100, fontFamily: fonts.heading, margin: "0 0 4px", letterSpacing: "-0.03em" }}>LapServ Pro</h1>
          <p style={{ fontSize: 13, color: colors.slate500, margin: 0 }}>Masuk ke dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{
          background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "28px 28px 24px",
          border: `1px solid ${colors.slate800}`, marginBottom: 16,
        }}>
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              fontSize: 12.5, color: colors.red500, fontWeight: 500,
            }}>{error}</div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: colors.slate400, marginBottom: 6 }}>Username</label>
            <input
              value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username" autoComplete="username"
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 13.5,
                border: `1px solid ${colors.slate700}`, background: "rgba(255,255,255,0.04)",
                color: colors.slate100, outline: "none", boxSizing: "border-box",
                fontFamily: fonts.body, transition: "border-color 0.2s",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: colors.slate400, marginBottom: 6 }}>Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password" autoComplete="current-password"
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 13.5,
                border: `1px solid ${colors.slate700}`, background: "rgba(255,255,255,0.04)",
                color: colors.slate100, outline: "none", boxSizing: "border-box",
                fontFamily: fonts.body, transition: "border-color 0.2s",
              }}
            />
          </div>

          <button type="submit" style={{
            width: "100%", padding: "12px", borderRadius: 10, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${colors.cyan400}, ${colors.blue500})`,
            color: colors.white, fontSize: 14, fontWeight: 700, fontFamily: fonts.body,
            boxShadow: "0 6px 20px rgba(34,211,238,0.25)",
          }}>Masuk</button>
        </form>

        {/* Quick Login Accounts */}
        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: 14, border: `1px solid ${colors.slate800}`,
          overflow: "hidden",
        }}>
          <button onClick={() => setShowAccounts(!showAccounts)} style={{
            width: "100%", padding: "12px 16px", background: "none", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
            color: colors.slate400, fontSize: 12.5, fontWeight: 600, fontFamily: fonts.body,
          }}>
            <span>{"\uD83D\uDD11"} Akun Demo — Klik untuk login cepat</span>
            <span style={{ transition: "transform 0.2s", transform: showAccounts ? "rotate(180deg)" : "rotate(0)" }}>{"\u25BC"}</span>
          </button>

          {showAccounts && (
            <div style={{ padding: "4px 12px 12px" }}>
              {Object.entries(grouped).map(([planId, users]) => {
                const pl = PLANS[planId];
                return (
                  <div key={planId} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, padding: "4px 0" }}>
                      <span style={{ fontSize: 14 }}>{pl.icon}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: pl.color, fontFamily: fonts.body }}>{pl.name}</span>
                      <span style={{ fontSize: 10, color: colors.slate600, padding: "1px 6px", borderRadius: 4, background: `${pl.color}15` }}>{pl.priceLabel}</span>
                    </div>
                    {users.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => quickLogin(u)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                          borderRadius: 8, cursor: "pointer", marginBottom: 2,
                          background: "rgba(255,255,255,0.02)", border: `1px solid transparent`,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = `${pl.color}10`; e.currentTarget.style.borderColor = `${pl.color}33`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "transparent"; }}
                      >
                        <span style={{ fontSize: 22 }}>{u.avatar}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: colors.slate200 }}>{u.name}</div>
                          <div style={{ fontSize: 10.5, color: colors.slate500 }}>{ROLE_LABELS[u.role]} {"\u2022"} {u.username} / {u.password}</div>
                        </div>
                        <span style={{ fontSize: 10, color: pl.color, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: `${pl.color}15` }}>{"\u25B6"} Login</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
