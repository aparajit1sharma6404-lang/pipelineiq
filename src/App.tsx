import { useState } from "react";
import Sidebar from "./components/Sidebar";
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
      <Sidebar activePage={page} setPage={setPage} dark={dark} toggleDark={() => setDark(d => !d)} />
      <div style={{ flex: 1, padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: dark ? "#fff" : "#111" }}>
              {titles[page][0]}
            </h1>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>{titles[page][1]}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ color: dark ? "#fff" : "#111", background: dark ? "#1a1f2e" : "#e5e7eb", padding: "8px 16px", borderRadius: "8px" }}>🔔</span>
            <span style={{ color: dark ? "#fff" : "#111", fontWeight: 600 }}>Admin</span>
            <button onClick={logout} style={{
              background: "#ef444422", color: "#ef4444",
              border: "1px solid #ef444433", borderRadius: "8px",
              padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 600,
            }}>Logout</button>
          </div>
        </div>
        {getPage()}
      </div>
    </div>
  );
}
