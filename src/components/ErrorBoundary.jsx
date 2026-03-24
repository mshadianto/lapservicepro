import { Component } from "react";
import { fonts, colors } from "../styles/theme";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 40, textAlign: "center", fontFamily: fonts.body, color: colors.slate700,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{"\u26A0\uFE0F"}</div>
          <h2 style={{ fontFamily: fonts.heading, color: colors.slate900, margin: "0 0 8px" }}>
            Terjadi Kesalahan
          </h2>
          <p style={{ fontSize: 14, color: colors.slate500, marginBottom: 20 }}>
            {this.state.error?.message || "Aplikasi mengalami error yang tidak terduga."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
              background: colors.blue500, color: colors.white, fontSize: 13,
              fontWeight: 600, fontFamily: fonts.body,
            }}
          >
            Coba Lagi
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
