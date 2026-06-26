import { useEffect, useState } from "react";

type Pipeline = {
  _id: string;
  name: string;
  status: string;
  pressure: number;
  flow: number;
  temp: number;
  lastChecked: string;
};

type AlertsProps = { dark: boolean };

export default function Alerts({ dark }: AlertsProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);

  useEffect(() => {
    const run = () =>
      fetch("https://pipelineiq-backendd.onrender.com/api/pipelines")
        .then(r => r.json())
        .then(setPipelines);
    run();
    const interval = setInterval(run, 4000);
    return () => clearInterval(interval);
  }, []);

  const critical = pipelines.filter(p => p.status === "Critical");
  const warning = pipelines.filter(p => p.status === "Warning");
  const healthy = pipelines.filter(p => p.status === "Healthy");

  const card = (bg: string, border: string) => ({
    background: bg, border: `1px solid ${border}`,
    borderRadius: "12px", padding: "20px", marginBottom: "16px",
  });

  const severityColor = (s: string) =>
    s === "Critical" ? "#ef4444" : s === "Warning" ? "#f59e0b" : "#22c55e";

  return (
    <div style={{ display: "flex", gap: "24px" }}>
      {/* Left — Alert Feed */}
      <div style={{ flex: 2 }}>
        {/* Stats Row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Critical", count: critical.length, color: "#ef4444" },
            { label: "Warning", count: warning.length, color: "#f59e0b" },
            { label: "Healthy", count: healthy.length, color: "#22c55e" },
            { label: "Total", count: pipelines.length, color: "#3b82f6" },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: dark ? "#1a1f2e" : "#fff",
              border: `1px solid ${s.color}33`,
              borderTop: `3px solid ${s.color}`,
              borderRadius: "12px", padding: "16px", textAlign: "center",
            }}>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 8px" }}>{s.label}</p>
              <p style={{ color: s.color, fontSize: "32px", fontWeight: 700, margin: 0 }}>{s.count}</p>
            </div>
          ))}
        </div>

        {/* Active Alerts */}
        <div style={card(dark ? "#1a1f2e" : "#fff", dark ? "#2a2f42" : "#e5e7eb")}>
          <h3 style={{ color: dark ? "#fff" : "#111", margin: "0 0 16px" }}>Active Alerts</h3>
          {[...critical, ...warning].length === 0 ? (
            <p style={{ color: "#22c55e", fontSize: "14px" }}>✅ All pipelines healthy</p>
          ) : (
            [...critical, ...warning].map(p => (
              <div key={p._id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 16px", marginBottom: "8px",
                background: dark ? "#0f1117" : "#f9fafb",
                borderLeft: `4px solid ${severityColor(p.status)}`,
                borderRadius: "8px",
              }}>
                <div>
                  <span style={{
                    color: severityColor(p.status), fontWeight: 700,
                    fontSize: "12px", marginRight: "8px",
                  }}>[{p.status.toUpperCase()}]</span>
                  <span style={{ color: dark ? "#e2e8f0" : "#111", fontSize: "14px" }}>{p.name}</span>
                  <p style={{ color: "#6b7280", fontSize: "12px", margin: "4px 0 0" }}>
                    Pressure: {p.pressure} bar · Flow: {p.flow} m³/h · Temp: {p.temp}°C
                  </p>
                </div>
                <span style={{ color: "#6b7280", fontSize: "12px" }}>{p.lastChecked}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right — Escalation Tracker + Pressure Overview */}
      <div style={{ flex: 1 }}>
        {/* Escalation Tracker */}
        <div style={card(dark ? "#1a1f2e" : "#fff", dark ? "#2a2f42" : "#e5e7eb")}>
          <h3 style={{ color: dark ? "#fff" : "#111", margin: "0 0 4px" }}>Escalation Tracker</h3>
          <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 16px" }}>Live severity by pipeline</p>
          {pipelines.filter(p => !p.name.startsWith("Auto")).map(p => {
            const color = severityColor(p.status);
            const width = p.status === "Critical" ? "100%" : p.status === "Warning" ? "60%" : "25%";
            return (
              <div key={p._id} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: dark ? "#e2e8f0" : "#111", fontSize: "12px" }}>{p.name.split(" ")[0]}</span>
                  <span style={{ color, fontSize: "11px", fontWeight: 700 }}>{p.status}</span>
                </div>
                <div style={{ background: dark ? "#0f1117" : "#f3f4f6", borderRadius: "999px", height: "6px" }}>
                  <div style={{
                    width, height: "100%", background: color,
                    borderRadius: "999px", transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pressure Overview */}
        <div style={card(dark ? "#1a1f2e" : "#fff", dark ? "#2a2f42" : "#e5e7eb")}>
          <h3 style={{ color: dark ? "#fff" : "#111", margin: "0 0 4px" }}>Pressure Overview</h3>
          <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 16px" }}>Warning below 60 bar</p>
          {pipelines.filter(p => !p.name.startsWith("Auto")).map(p => {
            const pct = Math.min((p.pressure / 100) * 100, 100);
            const color = p.pressure < 60 ? "#ef4444" : p.pressure < 75 ? "#f59e0b" : "#22c55e";
            return (
              <div key={p._id} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: dark ? "#e2e8f0" : "#111", fontSize: "12px" }}>{p.name.split(" ").slice(0, 2).join(" ")}</span>
                  <span style={{ color, fontSize: "11px", fontWeight: 700 }}>{p.pressure} bar</span>
                </div>
                <div style={{ background: dark ? "#0f1117" : "#f3f4f6", borderRadius: "999px", height: "6px" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%", background: color,
                    borderRadius: "999px", transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
