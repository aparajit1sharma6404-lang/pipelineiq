import { useEffect, useState } from "react";

type AnomalyPipeline = {
  name: string;
  status: string;
  pressure: number;
  flow: number;
  temp: number;
  isAnomaly: boolean;
  anomalyScore: number;
};

type AnomalyProps = { dark: boolean };

export default function Anomaly({ dark }: AnomalyProps) {
  const [pipelines, setPipelines] = useState<AnomalyPipeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = () =>
      fetch("https://pipelineiq-ml.onrender.com/api/anomalies")
        .then(r => r.json())
        .then(d => { setPipelines(d); setLoading(false); });
    fetch_();
    const interval = setInterval(fetch_, 6000);
    return () => clearInterval(interval);
  }, []);

  const anomalies = pipelines.filter(p => p.isAnomaly);
  const normal = pipelines.filter(p => !p.isAnomaly);

  const card = (border: string) => ({
    background: dark ? "#1a1f2e" : "#fff",
    border: `1px solid ${border}`,
    borderRadius: "12px", padding: "20px", marginBottom: "16px",
  });

  return (
    <div>
      {/* Summary */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Analysed", value: pipelines.length, color: "#3b82f6" },
          { label: "Anomalies Detected", value: anomalies.length, color: "#ef4444" },
          { label: "Normal", value: normal.length, color: "#22c55e" },
          { label: "Model", value: "IsoForest", color: "#8b5cf6" },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: dark ? "#1a1f2e" : "#fff",
            border: `1px solid ${s.color}33`,
            borderTop: `3px solid ${s.color}`,
            borderRadius: "12px", padding: "16px", textAlign: "center",
          }}>
            <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 8px" }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: "28px", fontWeight: 700, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#6b7280" }}>Running Isolation Forest model...</p>
      ) : (
        <div style={card(dark ? "#2a2f42" : "#e5e7eb")}>
          <h3 style={{ color: dark ? "#fff" : "#111", margin: "0 0 4px" }}>
            Isolation Forest Anomaly Detection
          </h3>
          <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 20px" }}>
            Unsupervised ML model detecting unusual sensor patterns — updated every 6 seconds
          </p>

          {pipelines.map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "14px 16px", marginBottom: "8px",
              background: dark ? "#0f1117" : "#f9fafb",
              borderRadius: "10px",
              borderLeft: `4px solid ${p.isAnomaly ? "#ef4444" : "#22c55e"}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <p style={{ color: dark ? "#e2e8f0" : "#111", fontSize: "14px", fontWeight: 600, margin: 0 }}>
                    {p.name}
                  </p>
                  {p.isAnomaly && (
                    <span style={{
                      background: "#ef444422", color: "#ef4444",
                      fontSize: "10px", fontWeight: 700, padding: "2px 8px",
                      borderRadius: "999px", border: "1px solid #ef444433",
                    }}>⚠ ANOMALY</span>
                  )}
                </div>
                <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                  Pressure: {p.pressure} bar · Flow: {p.flow} m³/h · Temp: {p.temp}°C
                </p>
              </div>

              <div style={{ width: "180px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#6b7280", fontSize: "11px" }}>Anomaly Score</span>
                  <span style={{
                    color: p.anomalyScore > 70 ? "#ef4444" : p.anomalyScore > 40 ? "#f59e0b" : "#22c55e",
                    fontSize: "11px", fontWeight: 700,
                  }}>{p.anomalyScore}%</span>
                </div>
                <div style={{ background: dark ? "#1a1f2e" : "#e5e7eb", borderRadius: "999px", height: "8px" }}>
                  <div style={{
                    width: `${p.anomalyScore}%`, height: "100%",
                    background: p.anomalyScore > 70 ? "#ef4444" : p.anomalyScore > 40 ? "#f59e0b" : "#22c55e",
                    borderRadius: "999px", transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
