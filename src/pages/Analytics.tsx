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

type AnalyticsProps = { dark: boolean };

export default function Analytics({ dark }: AnalyticsProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [activeMetric, setActiveMetric] = useState<"flow" | "pressure" | "temp">("flow");

  useEffect(() => {
    const run = () => {
      fetch("https://pipelineiq-backendd.onrender.com/api/simulate", { method: "POST" })
        .then(() => fetch("https://pipelineiq-backendd.onrender.com/api/pipelines"))
        .then(r => r.json())
        .then(setPipelines);
    };
    run();
    const interval = setInterval(run, 4000);
    return () => clearInterval(interval);
  }, []);

  const card = {
    background: dark ? "#1a1f2e" : "#fff",
    border: `1px solid ${dark ? "#2a2f42" : "#e5e7eb"}`,
    borderRadius: "12px", padding: "24px", marginBottom: "24px",
  };

  const avgFlow = pipelines.length ? Math.round(pipelines.reduce((s, p) => s + p.flow, 0) / pipelines.length) : 0;
  const avgPressure = pipelines.length ? (pipelines.reduce((s, p) => s + p.pressure, 0) / pipelines.length).toFixed(1) : "0";
  const avgTemp = pipelines.length ? (pipelines.reduce((s, p) => s + p.temp, 0) / pipelines.length).toFixed(1) : "0";
  const peak = pipelines.length ? pipelines.reduce((a, b) => a.flow > b.flow ? a : b) : null;

  const metricConfig = {
    flow: { label: "Flow Rate (m³/h)", color: "#3b82f6" },
    pressure: { label: "Pressure (bar)", color: "#22c55e" },
    temp: { label: "Temperature (°C)", color: "#f59e0b" },
  };
  const { label, color } = metricConfig[activeMetric];
  const maxVal = pipelines.length ? Math.max(...pipelines.map(p => p[activeMetric])) : 1;

  return (
    <div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Avg Flow Rate", value: avgFlow, unit: "m³/h", color: "#3b82f6" },
          { label: "Avg Pressure", value: avgPressure, unit: "bar", color: "#22c55e" },
          { label: "Avg Temperature", value: avgTemp, unit: "°C", color: "#f59e0b" },
          { label: "Peak Pipeline", value: peak?.name?.split(" ")[0] ?? "-", unit: `${peak?.flow ?? 0} m³/h`, color: "#a78bfa" },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: dark ? "#1a1f2e" : "#fff",
            border: `1px solid ${dark ? "#2a2f42" : "#e5e7eb"}`,
            borderRadius: "12px", padding: "20px", borderTop: `3px solid ${k.color}`,
          }}>
            <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 8px" }}>{k.label}</p>
            <p style={{ color: dark ? "#fff" : "#111", fontSize: "26px", fontWeight: 700, margin: "0 0 4px" }}>{k.value}</p>
            <p style={{ color: k.color, fontSize: "12px", margin: 0 }}>{k.unit}</p>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h3 style={{ color: dark ? "#fff" : "#111", margin: "0 0 4px" }}>Live Pipeline Metrics</h3>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>Current readings — {label}</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {(["flow", "pressure", "temp"] as const).map(m => (
              <button key={m} onClick={() => setActiveMetric(m)} style={{
                padding: "6px 14px", borderRadius: "999px",
                border: `1px solid ${activeMetric === m ? metricConfig[m].color : (dark ? "#2a2f42" : "#e5e7eb")}`,
                background: activeMetric === m ? metricConfig[m].color + "22" : "transparent",
                color: activeMetric === m ? metricConfig[m].color : "#6b7280",
                cursor: "pointer", fontSize: "12px", fontWeight: 600,
              }}>
                {m === "flow" ? "Flow" : m === "pressure" ? "Pressure" : "Temp"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "180px" }}>
          {pipelines.filter(p => !p.name.startsWith("Auto")).map((p) => {
            const val = p[activeMetric];
            const h = (val / maxVal) * 100;
            return (
              <div key={p._id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
                <span style={{ color, fontSize: "11px", fontWeight: 700 }}>{val}</span>
                <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "flex-end" }}>
                  <div style={{
                    width: "100%", height: `${h}%`,
                    background: `linear-gradient(180deg, ${color}, ${color}88)`,
                    borderRadius: "4px 4px 0 0", transition: "height 0.5s ease",
                  }} />
                </div>
                <span style={{ color: "#6b7280", fontSize: "10px", textAlign: "center" }}>{p.name.split(" ")[0]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={card}>
        <h3 style={{ color: dark ? "#fff" : "#111", margin: "0 0 4px" }}>Pipeline Performance</h3>
        <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 20px" }}>Live readings across all active pipelines</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${dark ? "#2a2f42" : "#e5e7eb"}` }}>
              {["PIPELINE", "FLOW RATE", "PRESSURE", "TEMPERATURE", "HEALTH"].map(h => (
                <th key={h} style={{ color: "#6b7280", fontSize: "11px", padding: "10px 12px", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pipelines.filter(p => !p.name.startsWith("Auto")).map(p => {
              const health = p.status === "Healthy" ? 100 : p.status === "Warning" ? 60 : 25;
              const hColor = p.status === "Healthy" ? "#22c55e" : p.status === "Warning" ? "#f59e0b" : "#ef4444";
              return (
                <tr key={p._id} style={{ borderBottom: `1px solid ${dark ? "#1e2435" : "#f3f4f6"}` }}>
                  <td style={{ padding: "14px 12px", color: dark ? "#e2e8f0" : "#111", fontSize: "13px" }}>{p.name}</td>
                  <td style={{ padding: "14px 12px", color: dark ? "#e2e8f0" : "#111", fontSize: "13px" }}>{p.flow} m³/h</td>
                  <td style={{ padding: "14px 12px", color: dark ? "#e2e8f0" : "#111", fontSize: "13px" }}>{p.pressure} bar</td>
                  <td style={{ padding: "14px 12px", color: dark ? "#e2e8f0" : "#111", fontSize: "13px" }}>{p.temp}°C</td>
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ background: dark ? "#0f1117" : "#f3f4f6", borderRadius: "999px", height: "6px", width: "60px" }}>
                        <div style={{ width: `${health}%`, height: "100%", background: hColor, borderRadius: "999px" }} />
                      </div>
                      <span style={{ color: hColor, fontSize: "11px", fontWeight: 700 }}>{health}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
