import { useState } from "react";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Chatbot from "./pages/Chatbot";
import type { Thresholds } from "./pages/Settings";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [thresholds, setThresholds] = useState<Thresholds>(() => {
    const saved = localStorage.getItem("settings_thresholds");
    return saved ? JSON.parse(saved) : { minPressure: 60, maxTemp: 90, minFlow: 400 };
  });

  if (!token) return <Login onLogin={(t) => setToken(t)} />;

  const logout = () => { localStorage.removeItem("token"); setToken(""); };
  const bg = dark ? "#0d1117" : "#f1f5f9";

  const titles: Record<string, [string, string]> = {
    dashboard: ["Operations Dashboard", "Real-time refinery pipeline monitor"],
    analytics: ["Analytics", "Historical flow and pressure trends"],
    alerts: ["Alerts", "Active warnings and critical events"],
    chatbot: ["AI Assistant", "Ask questions about your pipelines"],
    settings: ["Settings", "Account and system preferences"],
  };

  const getPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard dark={dark} />;
      case "analytics": return <Analytics dark={dark} />;
      case "alerts": return <Alerts dark={dark} />;
      case "chatbot": return <Chatbot dark={dark} />;
      case "settings": return <Settings dark={dark} thresholds={thresholds} setThresholds={setThresholds} />;
      default: return <Dashboard dark={dark} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 40, display: "none",
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: "fixed" as const,
        left: sidebarOpen ? 0 : undefined,
        zIndex: 50,
      }} className="sidebar-wrapper">
        <Sidebar
          activePage={page}
          setPage={(p: string) => { setPage(p); setSidebarOpen(false); }}
          dark={dark}
          toggleDark={() => setDark(d => !d)}
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "24px", minWidth: 0 }} className="main-content">
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Hamburger for mobile */}
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(o => !o)}
              style={{
                background: dark ? "#1a1f2e" : "#e5e7eb",
                border: "none", borderRadius: "8px",
                padding: "8px", cursor: "pointer",
                color: dark ? "#fff" : "#111", fontSize: "18px",
                display: "none",
              }}
            >☰</button>
            <div>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: dark ? "#fff" : "#111" }}>
                {titles[page][0]}
              </h1>
              <p style={{ margin: "2px 0 0", color: "#6b7280", fontSize: "13px" }}>{titles[page][1]}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: dark ? "#fff" : "#111", background: dark ? "#1a1f2e" : "#e5e7eb", padding: "8px 12px", borderRadius: "8px" }}>🔔</span>
            <span style={{ color: dark ? "#fff" : "#111", fontWeight: 600, fontSize: "14px" }}>Admin</span>
            <button onClick={logout} style={{
              background: "#ef444422", color: "#ef4444",
              border: "1px solid #ef444433", borderRadius: "8px",
              padding: "8px 12px", cursor: "pointer", fontSize: "13px", fontWeight: 600,
            }}>Logout</button>
          </div>
        </div>
        {getPage()}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-wrapper {
            position: fixed !important;
            top: 0;
            left: ${sidebarOpen ? "0" : "-240px"} !important;
            height: 100vh;
            z-index: 50;
            transition: left 0.3s ease;
          }
          .mobile-overlay {
            display: block !important;
          }
          .hamburger {
            display: block !important;
          }
          .main-content {
            padding: 16px !important;
            margin-left: 0 !important;
          }
        }
        @media (min-width: 769px) {
          .sidebar-wrapper {
            position: relative !important;
            left: 0 !important;
          }
          .main-content {
            padding: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}
