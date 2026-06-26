import { useEffect, useState } from "react";

const statusColors: Record<string, string> = {
  Healthy: "#22c55e", Warning: "#f59e0b", Critical: "#ef4444"
};

type Pipeline = {
  _id: string;
  name: string;
  status: string;
  pressure: number;
  flow: number;
  temp: number;
  lastChecked: string;
};

export default function PipelineTable() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Healthy");
  const [pressure, setPressure] = useState(80);
  const [flow, setFlow] = useState(600);
  const [temp, setTemp] = useState(70);

  const fetchPipelines = () => {
    fetch("http://localhost:5000/api/pipelines")
      .then(r => r.json())
      .then(setPipelines);
  };

  useEffect(() => {
    fetchPipelines();
    const interval = setInterval(() => {
      fetch("http://localhost:5000/api/simulate", { method: "POST" })
        .then(() => fetchPipelines());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const addPipeline = async () => {
    if (!name) return;
    await fetch("http://localhost:5000/api/pipelines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, status, pressure, flow, temp, lastChecked: "just now" }),
    });
    setName("");
    fetchPipelines();
  };

  const deletePipeline = async (id: string) => {
    await fetch(`http://localhost:5000/api/pipelines/${id}`, { method: "DELETE" });
    fetchPipelines();
  };

  const input = {
    background: "#0f1117", border: "1px solid #2a2f42",
    borderRadius: "8px", color: "#e2e8f0",
    padding: "8px 12px", fontSize: "13px",
  };

  return (
    <div style={{ background: "#1a1f2e", borderRadius: "12px", padding: "24px", border: "1px solid #2a2f42" }}>
      <h3 style={{ color: "#fff", marginBottom: "16px" }}>Pipeline Status</h3>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input style={input} placeholder="Pipeline Name" value={name} onChange={e => setName(e.target.value)} />
        <select style={input} value={status} onChange={e => setStatus(e.target.value)}>
          <option>Healthy</option>
          <option>Warning</option>
          <option>Critical</option>
        </select>
        <input style={input} type="number" placeholder="Pressure" value={pressure} onChange={e => setPressure(+e.target.value)} />
        <input style={input} type="number" placeholder="Flow" value={flow} onChange={e => setFlow(+e.target.value)} />
        <input style={input} type="number" placeholder="Temp" value={temp} onChange={e => setTemp(+e.target.value)} />
        <button onClick={addPipeline} style={{
          background: "#3b82f6", color: "#fff", border: "none",
          borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: 600
        }}>+ Add</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #2a2f42" }}>
            {["NAME", "STATUS", "PRESSURE", "FLOW", "TEMP", "LAST CHECKED", "ACTION"].map(h => (
              <th key={h} style={{ color: "#6b7280", fontSize: "12px", padding: "12px 16px", textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pipelines.map(p => (
            <tr key={p._id} style={{ borderBottom: "1px solid #1e2435" }}>
              <td style={{ padding: "16px", color: "#e2e8f0" }}>{p.name}</td>
              <td style={{ padding: "16px" }}>
                <span style={{
                  background: statusColors[p.status] + "22",
                  color: statusColors[p.status],
                  padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600
                }}>{p.status}</span>
              </td>
              <td style={{ padding: "16px", color: "#e2e8f0" }}>{p.pressure}</td>
              <td style={{ padding: "16px", color: "#e2e8f0" }}>{p.flow}</td>
              <td style={{ padding: "16px", color: "#e2e8f0" }}>{p.temp}</td>
              <td style={{ padding: "16px", color: "#6b7280" }}>{p.lastChecked}</td>
              <td style={{ padding: "16px" }}>
                <button onClick={() => deletePipeline(p._id)} style={{
                  background: "#ef444422", color: "#ef4444",
                  border: "1px solid #ef444433", borderRadius: "6px",
                  padding: "4px 12px", cursor: "pointer", fontSize: "12px"
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
