import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Chatbot from "./pages/Chatbot";
import Risk from "./pages/Risk";
import type { Thresholds } from "./pages/Settings";

function NotificationBell({ dark }: { dark: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [alerts, setAlerts] = React.useState<{name: string; status: string; pressure: number; temp: number}[]>([]);

  React.useEffect(() => {
    const fetch_ = () =>
      fetch("https://pipelineiq-backendd.onrender.com/api/pipelines")
        .then(r => r.json())
        .then((data: any[]) =>
          setAlerts(data.filter((p: any) => p.status !== "Healthy" && !p.name.startsWith("Auto")))
        );
    fetch_();
    const interval = setInterval(fetch_, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "relative", background: dark ? "#1a1f2e" : "#e5e7eb",
          border: "none", borderRadius: "8px", padding: "8px 12px",
          cursor: "pointer", fontSize: "16px",
        }}
      >
        🔔
        {alerts.length > 0 && (
          <span style={{
            position: "absolute", top: "-6px", right: "-6px",
            background: "#ef4444", color: "#fff",
            borderRadius: "999px", fontSize: "10px", fontWeight: 700,
            width: "18px", height: "18px", display: "grid", placeItems: "center",
          }}>{alerts.length}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "44px", right: 0,
          width: "320px", background: dark ? "#1a1f2e" : "#fff",
          border: "1px solid #2a2f42", borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          zIndex: 100, overflow: "hidden",
        }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #2a2f42", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: dark ? "#fff" : "#111", fontWeight: 700, fontSize: "14px" }}>Live Alerts</span>
            <span style={{ background: "#ef444422", color: "#ef4444", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px" }}>{alerts.length} active</span>
          </div>
          {alerts.length === 0 ? (
            <p style={{ color: "#22c55e", fontSize: "13px", padding: "16px", margin: 0 }}>All pipelines healthy</p>
          ) : (
            alerts.map((a, i) => (
              <div key={i} style={{
                padding: "12px 16px",
                borderBottom: "1px solid #2a2f4222",
                borderLeft: `4px solid ${a.status === "Critical" ? "#ef4444" : "#f59e0b"}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: dark ? "#e2e8f0" : "#111", fontSize: "13px", fontWeight: 600 }}>{a.name}</span>
                  <span style={{ color: a.status === "Critical" ? "#ef4444" : "#f59e0b", fontSize: "11px", fontWeight: 700 }}>{a.status}</span>
                </div>
                <span style={{ color: "#6b7280", fontSize: "11px" }}>Pressure: {a.pressure} bar · Temp: {a.temp}°C</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

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
    risk: ["Risk Intelligence", "AI-powered predictive risk scoring"],
    settings: ["Settings", "Account and system preferences"],
  };

  const getPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard dark={dark} />;
      case "analytics": return <Analytics dark={dark} />;
      case "alerts": return <Alerts dark={dark} />;
      case "chatbot": return <Chatbot dark={dark} />;
      case "risk": return <Risk dark={dark} />;
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
            <NotificationBell dark={dark} />
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
