type SidebarProps = {
  activePage: string;
  setPage: (p: string) => void;
  dark: boolean;
  toggleDark: () => void;
};
const navItems = [
  { label: "Dashboard", icon: "⊞", page: "dashboard" },
  { label: "Analytics", icon: "〜", page: "analytics" },
  { label: "Alerts", icon: "🔔", page: "alerts" },
  { label: "AI Assistant", icon: "🤖", page: "chatbot" },
  { label: "Settings", icon: "⚙", page: "settings" },
];
export default function Sidebar({ activePage, setPage, dark, toggleDark }: SidebarProps) {
  return (
    <div style={{
      width: "220px", minHeight: "100vh",
      background: dark ? "#0f1117" : "#ffffff",
      borderRight: `1px solid ${dark ? "#2a2f42" : "#e5e7eb"}`,
      display: "flex", flexDirection: "column",
      padding: "24px 0", transition: "background 0.3s",
    }}>
      <div style={{ padding: "0 20px 32px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ background: "#3b82f6", borderRadius: "8px", width: 36, height: 36, display: "grid", placeItems: "center", color: "#fff", fontSize: "18px" }}>⚡</div>
        <div>
          <p style={{ color: dark ? "#fff" : "#111", fontWeight: 700, margin: 0 }}>PipelineIQ</p>
          <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>IOCL Ops Monitor</p>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {navItems.map(item => (
          <button key={item.page} onClick={() => setPage(item.page)} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "12px 20px",
            background: activePage === item.page ? "#1e3a5f" : "transparent",
            color: activePage === item.page ? "#38bdf8" : (dark ? "#9ca3af" : "#6b7280"),
            border: "none", cursor: "pointer", fontSize: "14px",
            width: "100%", textAlign: "left",
          }}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "16px" }}>
        <button onClick={toggleDark} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          background: dark ? "#facc15" : "#1e3a5f",
          color: dark ? "#000" : "#fff",
          border: "none", borderRadius: "8px",
          padding: "10px", width: "100%",
          cursor: "pointer", fontWeight: 700, fontSize: "13px",
        }}>
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </div>
  );
}
