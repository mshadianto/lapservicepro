import { useState, useEffect } from "react";
import { SERVICE_TYPES, TECHNICIANS } from "../data/constants";
import { fmt } from "../utils/format";
import { fonts, colors } from "../styles/theme";

const HERO_STATS = [
  { value: "815+", label: "Laptop Diperbaiki" },
  { value: "4.8", label: "Rating Pelanggan" },
  { value: "3", label: "Teknisi Ahli" },
  { value: "24jam", label: "Estimasi Cepat" },
];

const FEATURES = [
  {
    icon: "\uD83D\uDD0D",
    title: "Diagnosa AI",
    desc: "Prediksi kerusakan otomatis berdasarkan gejala laptop dengan estimasi biaya akurat.",
  },
  {
    icon: "\uD83D\uDCCB",
    title: "Tracking Real-time",
    desc: "Pantau status servis laptop dari antrian hingga selesai secara transparan.",
  },
  {
    icon: "\uD83D\uDD27",
    title: "Teknisi Berpengalaman",
    desc: "Tim teknisi bersertifikat dengan spesialisasi hardware, software, dan display.",
  },
  {
    icon: "\uD83D\uDCB0",
    title: "Harga Transparan",
    desc: "Estimasi biaya jelas di awal. Tidak ada biaya tersembunyi.",
  },
  {
    icon: "\uD83D\uDCE6",
    title: "Spare Part Original",
    desc: "Stok spare part lengkap dan original dengan garansi penggantian.",
  },
  {
    icon: "\uD83E\uDDFE",
    title: "Invoice Digital",
    desc: "Cetak invoice langsung untuk setiap order servis, rapi dan profesional.",
  },
];

const TESTIMONIALS = [
  { name: "Ahmad Rizki", text: "Laptop gaming saya overheat parah, ditangani Pak Hendra cuma 2 hari. Mantap!", rating: 5, device: "Asus ROG Strix" },
  { name: "Siti Nurhaliza", text: "Upgrade SSD + RAM di sini cepat dan harga wajar. Laptop jadi ngebut lagi!", rating: 5, device: "Lenovo IdeaPad 3" },
  { name: "Budi Santoso", text: "LCD retak diganti dengan part original. Hasilnya seperti baru. Recommended!", rating: 5, device: "HP Pavilion 14" },
];

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = parseInt(target) || 0;
    if (num === 0) { setCount(target); return; }
    let current = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(current);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{typeof count === "number" ? count + suffix : target}</>;
}

export default function LandingPage({ onEnterApp }) {
  const [hoveredService, setHoveredService] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: colors.slate900, color: colors.white, fontFamily: fonts.body, overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(15,23,42,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: `linear-gradient(135deg, ${colors.cyan400}, ${colors.blue500})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            boxShadow: "0 4px 15px rgba(34,211,238,0.3)",
          }}>{"\uD83D\uDCBB"}</div>
          <span style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>LapServ Pro</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Layanan", "Teknisi", "Testimoni"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color: colors.slate400, fontSize: 13.5, textDecoration: "none",
              fontWeight: 500, transition: "color 0.2s",
            }}>{item}</a>
          ))}
          <button onClick={onEnterApp} style={{
            padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${colors.cyan400}, ${colors.blue500})`,
            color: colors.white, fontSize: 13, fontWeight: 700, fontFamily: fonts.body,
            boxShadow: "0 4px 15px rgba(34,211,238,0.25)", transition: "transform 0.2s",
          }}>Buka Dashboard</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "120px 40px 80px", position: "relative",
        background: `radial-gradient(ellipse at 30% 20%, rgba(34,211,238,0.08) 0%, transparent 60%),
                     radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.06) 0%, transparent 60%),
                     ${colors.slate900}`,
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "8%", width: 300, height: 300,
          borderRadius: "50%", background: `radial-gradient(circle, rgba(34,211,238,0.06), transparent 70%)`,
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "10%", width: 250, height: 250,
          borderRadius: "50%", background: `radial-gradient(circle, rgba(59,130,246,0.06), transparent 70%)`,
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{ textAlign: "center", maxWidth: 800, position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px",
            borderRadius: 20, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)",
            marginBottom: 28, fontSize: 12.5, color: colors.cyan400, fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", animation: "pulse 2s infinite" }} />
            Service Center Terpercaya di Indonesia
          </div>

          <h1 style={{
            fontSize: 56, fontWeight: 800, fontFamily: fonts.heading, lineHeight: 1.1,
            margin: "0 0 20px", letterSpacing: "-0.04em",
            background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Solusi Terbaik untuk{" "}
            <span style={{
              background: `linear-gradient(135deg, ${colors.cyan400}, ${colors.blue500})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Service Laptop</span>{" "}
            Anda
          </h1>

          <p style={{
            fontSize: 17, color: colors.slate400, lineHeight: 1.7, margin: "0 auto 36px",
            maxWidth: 560, fontFamily: fonts.body,
          }}>
            Diagnosa cepat, teknisi berpengalaman, spare part original, dan tracking real-time.
            Dari kerusakan ringan hingga berat — kami tangani semua.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 56 }}>
            <button onClick={onEnterApp} style={{
              padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg, ${colors.cyan400}, ${colors.blue500})`,
              color: colors.white, fontSize: 15, fontWeight: 700, fontFamily: fonts.body,
              boxShadow: "0 8px 30px rgba(34,211,238,0.3)", transition: "transform 0.2s, box-shadow 0.2s",
            }}>Mulai Sekarang</button>
            <a href="#layanan" style={{
              padding: "14px 32px", borderRadius: 12, textDecoration: "none",
              border: `1px solid ${colors.slate700}`, background: "rgba(255,255,255,0.03)",
              color: colors.slate300, fontSize: 15, fontWeight: 600, fontFamily: fonts.body,
              display: "inline-flex", alignItems: "center", gap: 8, transition: "border-color 0.2s",
            }}>Lihat Layanan {"\u2193"}</a>
          </div>

          <div style={{ display: "flex", gap: 0, justifyContent: "center" }}>
            {HERO_STATS.map((s, i) => (
              <div key={i} style={{
                padding: "20px 36px", textAlign: "center",
                borderRight: i < HERO_STATS.length - 1 ? `1px solid ${colors.slate800}` : "none",
              }}>
                <div style={{
                  fontSize: 28, fontWeight: 800, fontFamily: fonts.heading,
                  background: `linear-gradient(135deg, ${colors.cyan400}, ${colors.blue500})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  {parseInt(s.value) ? <AnimatedCounter target={s.value} suffix={s.value.includes("+") ? "+" : ""} /> : s.value}
                </div>
                <div style={{ fontSize: 12, color: colors.slate500, marginTop: 4, fontFamily: fonts.body }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LAYANAN ── */}
      <section id="layanan" style={{
        padding: "100px 40px", position: "relative",
        background: `linear-gradient(180deg, ${colors.slate900} 0%, #0c1222 100%)`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: colors.cyan400, letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 12, fontFamily: fonts.mono,
            }}>LAYANAN KAMI</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, fontFamily: fonts.heading, margin: "0 0 12px", letterSpacing: "-0.03em" }}>
              Service Lengkap untuk Laptop Anda
            </h2>
            <p style={{ fontSize: 15, color: colors.slate400, maxWidth: 500, margin: "0 auto" }}>
              Mulai dari diagnosa hingga perbaikan berat, semua ditangani profesional
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {SERVICE_TYPES.map((s, i) => (
              <div
                key={s.id}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  padding: "22px 24px", borderRadius: 14,
                  background: hoveredService === i ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${hoveredService === i ? "rgba(34,211,238,0.2)" : colors.slate800}`,
                  transition: "all 0.25s", cursor: "default",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: colors.slate100, fontFamily: fonts.body }}>{s.name}</div>
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: colors.cyan400, fontFamily: fonts.mono,
                  }}>{fmt(s.price)}</span>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: colors.slate500 }}>
                  <span>{"\u23F1"} {s.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{
        padding: "100px 40px",
        background: `linear-gradient(180deg, #0c1222 0%, ${colors.slate900} 100%)`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: colors.blue500, letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 12, fontFamily: fonts.mono,
            }}>KENAPA KAMI</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, fontFamily: fonts.heading, margin: "0 0 12px", letterSpacing: "-0.03em" }}>
              Fitur yang Membedakan Kami
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                padding: "30px 26px", borderRadius: 16,
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${colors.slate800}`, transition: "all 0.3s",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 18,
                  background: `linear-gradient(135deg, rgba(34,211,238,0.1), rgba(59,130,246,0.1))`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                  border: "1px solid rgba(34,211,238,0.15)",
                }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: colors.slate100, marginBottom: 8, fontFamily: fonts.heading }}>{f.title}</div>
                <div style={{ fontSize: 13.5, color: colors.slate400, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEKNISI ── */}
      <section id="teknisi" style={{
        padding: "100px 40px",
        background: `radial-gradient(ellipse at 50% 0%, rgba(34,211,238,0.04) 0%, transparent 60%), ${colors.slate900}`,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: colors.cyan400, letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 12, fontFamily: fonts.mono,
            }}>TIM KAMI</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, fontFamily: fonts.heading, margin: 0, letterSpacing: "-0.03em" }}>
              Teknisi Berpengalaman
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {TECHNICIANS.map((t) => (
              <div key={t.id} style={{
                padding: 28, borderRadius: 16, textAlign: "center",
                background: "rgba(255,255,255,0.02)", border: `1px solid ${colors.slate800}`,
                transition: "all 0.3s",
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px",
                  background: `linear-gradient(135deg, ${colors.blue500}, ${colors.cyan400})`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
                  boxShadow: "0 8px 25px rgba(59,130,246,0.25)",
                }}>{"\uD83D\uDC68\u200D\uD83D\uDD27"}</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: fonts.heading, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 13, color: colors.cyan400, fontWeight: 500, marginBottom: 16 }}>{t.specialty}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: colors.amber500, fontFamily: fonts.heading }}>{"\u2B50"} {t.rating}</div>
                    <div style={{ fontSize: 11, color: colors.slate500 }}>Rating</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: colors.blue500, fontFamily: fonts.heading }}>{t.jobs}</div>
                    <div style={{ fontSize: 11, color: colors.slate500 }}>Jobs</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONI ── */}
      <section id="testimoni" style={{
        padding: "100px 40px",
        background: `linear-gradient(180deg, ${colors.slate900} 0%, #0c1222 100%)`,
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: colors.blue500, letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 12, fontFamily: fonts.mono,
            }}>TESTIMONI</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, fontFamily: fonts.heading, margin: 0, letterSpacing: "-0.03em" }}>
              Apa Kata Pelanggan
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                padding: "28px 24px", borderRadius: 16,
                background: "rgba(255,255,255,0.02)", border: `1px solid ${colors.slate800}`,
              }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                  {Array.from({ length: t.rating }, (_, j) => (
                    <span key={j} style={{ fontSize: 16, color: colors.amber500 }}>{"\u2B50"}</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: colors.slate300, lineHeight: 1.7, margin: "0 0 18px", fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ borderTop: `1px solid ${colors.slate800}`, paddingTop: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: colors.slate100 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: colors.slate500 }}>{t.device}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 40px", textAlign: "center" }}>
        <div style={{
          maxWidth: 700, margin: "0 auto", padding: "56px 40px", borderRadius: 24,
          background: `linear-gradient(135deg, rgba(34,211,238,0.08), rgba(59,130,246,0.08))`,
          border: "1px solid rgba(34,211,238,0.15)",
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, fontFamily: fonts.heading, margin: "0 0 12px", letterSpacing: "-0.03em" }}>
            Laptop Bermasalah?
          </h2>
          <p style={{ fontSize: 15, color: colors.slate400, margin: "0 0 28px" }}>
            Masuk ke dashboard untuk membuat order servis baru atau cek prediksi kerusakan.
          </p>
          <button onClick={onEnterApp} style={{
            padding: "16px 40px", borderRadius: 12, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${colors.cyan400}, ${colors.blue500})`,
            color: colors.white, fontSize: 16, fontWeight: 700, fontFamily: fonts.body,
            boxShadow: "0 8px 30px rgba(34,211,238,0.3)",
          }}>Buka Dashboard {"\u2192"}</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "32px 40px", borderTop: `1px solid ${colors.slate800}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{"\uD83D\uDCBB"}</span>
          <span style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 14, color: colors.slate400 }}>LapServ Pro</span>
        </div>
        <div style={{ fontSize: 12, color: colors.slate600 }}>
          &copy; {new Date().getFullYear()} LapServ Pro. All rights reserved.
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        html { scroll-behavior: smooth; }
        a:hover { color: ${colors.slate200} !important; }
      `}</style>
    </div>
  );
}
