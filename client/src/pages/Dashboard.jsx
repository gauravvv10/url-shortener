import { useState, useRef } from "react";
import UrlForm from "../components/UrlForm";
import UrlStats from "../components/UrlStats";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("shorten");

  // refs for scrolling
  const appRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // smooth scroll to tool section
    setTimeout(() => {
      appRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100); // small delay so tab switches first
  };

  return (
    <div className="page">

      {/* ───────── NAVBAR ───────── */}
      <nav className="nav">
        <div className="nav-logo">
          LinkLite <span className="nav-logo-dot" />
        </div>

        <div className="nav-badge">
          URL Shortener
        </div>
      </nav>

      {/* ───────── HERO ───────── */}
      <section className="hero">

        <div className="hero-pill">
          <span className="hero-pill-dot" />
          Fast • Secure • Analytics
        </div>

        <h1>
          Shorten links, <em>Simply</em>
        </h1>

        <p className="hero-sub">
          Create short links, generate QR codes, and track click analytics in real time.
        </p>

        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => handleTabChange("shorten")}
          >
            Start Shortening
          </button>

          <button
            className="btn-secondary"
            onClick={() => handleTabChange("stats")}
          >
            View Stats
          </button>
        </div>

      </section>

      {/* ───────── FEATURES ───────── */}
      <section className="features">

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <div>
            <h3>Instant Short Links</h3>
            <p>Create short URLs in milliseconds with optimized backend performance.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <div>
            <h3>Click Analytics</h3>
            <p>Track every click with real-time statistics and insights.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <div>
            <h3>QR Code Generator</h3>
            <p>Automatically generate QR codes for every short link.</p>
          </div>
        </div>

      </section>

      {/* ───────── APP SECTION ───────── */}
      <section className="app-section" ref={appRef}>

        <div className="section-label">
          <div className="section-label-line" />
          <span>Dashboard</span>
        </div>

        <div className="app-grid">

          {/* LEFT: TOOL */}
          <div>
            {activeTab === "shorten" ? (
              <UrlForm />
            ) : (
              <UrlStats />
            )}
          </div>

          {/* RIGHT: INFO */}
          <div className="card">
            <h3 style={{ marginBottom: "10px" }}>Quick Guide</h3>

            <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              • Paste any long URL to generate a short link<br />
              • Use stats tab to track clicks<br />
              • QR code is auto-generated<br />
              • Links never expire
            </p>

            <div style={{ marginTop: "18px" }}>
              <button
                className="btn-secondary"
                style={{ width: "100%" }}
                onClick={() => handleTabChange("shorten")}
              >
                Create New Link
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="footer">
        <p>© 2026 LinkLite</p>
        <p>Gaurav Adhikari</p>
      </footer>

    </div>
  );
}