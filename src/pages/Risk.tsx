import { useEffect, useState } from "react";

type RiskPipeline = {
  _id: string;
  name: string;
  status: string;
  pressure: number;
  flow: number;
  temp: number;
  riskScore: number;
};

type RiskProps = { dark: boolean };

export default function Risk({ dark }: RiskProps) {
  const [pipelines, setPipelines] = useState<RiskPipeline[]>([]);

  useEffect(() => {
    const fetch_ = () =>
      fetch("https://pipelineiq-backendd.onrender.com/api/risk")
        .then(r => r.json())
        .then(setPipelines);
    fetch_();
    const interval = setInterval(fetch_, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (score: number) =>
    score >= 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#22c55e";

  const getRiskLabel = (score: number) =>
    score >= 70 ? "HIGH RISK" : score >= 40 ? "MEDIUM" : "LOW";

  const avg = pipelines.length
    ? Math.round(pipelines.reduce((s, p) => s + p.riskScore, 0) / pipelines.length)
    : 0;

  const high = pipelines.filter(p => p.riskScore >= 70).length;
  const medium = pipelines.filter(p => p.riskScore >= 40 && p.riskScore < 70).length;
  const low = pipelines.filter(p => p.riskScore < 40).length;

  const card = (border: string) => ({
    background: dark ? "#1a1f2e" : "#fff",
    border: `1px solid ${border}`,
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
  });

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Avg Risk Score", value: `${avg}`, color: getRiskColor(avg) },
          { label: "High Risk", value: high, color: "#ef4444" },
          { label: "Medium Risk", value: medium, color: "#f59e0b" },
          { label: "Low Risk", value: low, color: "#22c55e" },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: dark ? "#1a1f2e" : "#fff",
            border: `1px solid ${s.color}33`,
            borderTop: `3px solid ${s.color}`,
            borderRadius: "12px", padding: "16px", textAlign: "center",
          }}>
            <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 8px" }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: "32px", fontWeight: 700, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Risk Table */}
      <div style={card(dark ? "#2a2f42" : "#e5e7eb")}>
        <h3 style={{ color: dark ? "#fff" : "#111", margin: "0 0 4px" }}>AI Predictive Risk Scores</h3>
        <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 20px" }}>
          Ranked by risk — calculated from pressure, flow, temperature & status
        </p>

        {pipelines.filter(p => !p.name.startsWith("Auto")).map((p, i) => (
          <div key={p._id} style={{
            display: "flex", alignItems: "center", gap: "16px",
            padding: "14px 16px", marginBottom: "8px",
            background: dark ? "#0f1117" : "#f9fafb",
            borderRadius: "10px",
            borderLeft: `4px solid ${getRiskColor(p.riskScore)}`,
          }}>
            <span style={{ color: "#6b7280", fontSize: "13px", width: "24px" }}>#{i + 1}</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: dark ? "#e2e8f0" : "#111", fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>
                {p.name}
              </p>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                Pressure: {p.pressure} bar · Flow: {p.flow} m³/h · Temp: {p.temp}°C
              </p>
            </div>

            {/* Risk Bar */}
            <div style={{ width: "160px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: getRiskColor(p.riskScore), fontSize: "11px", fontWeight: 700 }}>
                  {getRiskLabel(p.riskScore)}
                </span>
                <span style={{ color: getRiskColor(p.riskScore), fontSize: "11px", fontWeight: 700 }}>
                  {p.riskScore}/100
                </span>
              </div>
              <div style={{ background: dark ? "#1a1f2e" : "#e5e7eb", borderRadius: "999px", height: "8px" }}>
                <div style={{
                  width: `${p.riskScore}%`, height: "100%",
                  background: getRiskColor(p.riskScore),
                  borderRadius: "999px", transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
