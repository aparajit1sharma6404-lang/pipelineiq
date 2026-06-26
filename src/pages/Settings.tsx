import { useState } from "react";

export type Thresholds = {
  minPressure: number;
  maxTemp: number;
  minFlow: number;
};

type SettingsProps = {
  thresholds: Thresholds;
  setThresholds: (t: Thresholds) => void;
  dark: boolean;
};

export default function Settings({ thresholds, setThresholds, dark }: SettingsProps) {
  const [name, setName] = useState(() => localStorage.getItem("settings_name") || "Admin");
  const [email, setEmail] = useState(() => localStorage.getItem("settings_email") || "admin@iocl.in");
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [local, setLocal] = useState(thresholds);

  const card = {
    background: dark ? "#1a1f2e" : "#fff",
    border: "1px solid #2a2f42",
    borderRadius: "12px",
    padding: "32px",
    marginBottom: "24px",
  };

  const inputStyle = {
    background: dark ? "#0f1117" : "#f1f5f9",
    border: "1px solid #2a2f42",
    borderRadius: "8px",
    color: dark ? "#e2e8f0" : "#111",
    padding: "10px 14px",
    width: "100%",
    marginBottom: "16px",
    fontSize: "14px",
  };

  const label = { color: "#6b7280", fontSize: "12px", display: "block", marginBottom: "6px" };

  return (
    <div style={{ maxWidth: "560px" }}>
      {/* Account */}
      <div style={card}>
        <h3 style={{ color: dark ? "#fff" : "#111", marginBottom: "24px" }}>Account Settings</h3>
        <label style={label}>Display Name</label>
        <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
        <label style={label}>Email</label>
        <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
        <label style={label}>New Password</label>
        <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
        <button
          onClick={() => {
            localStorage.setItem("settings_name", name);
            localStorage.setItem("settings_email", email);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", cursor: "pointer", fontWeight: 600 }}
        >
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Thresholds */}
      <div style={card}>
        <h3 style={{ color: dark ? "#fff" : "#111", marginBottom: "8px" }}>Alert Thresholds</h3>
        <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "24px" }}>
          Alerts fire automatically when any pipeline breaches these limits.
        </p>

        {[
          { label: "Min Pressure (bar)", key: "minPressure", min: 0, max: 100, color: "#38bdf8" },
          { label: "Max Temperature (°C)", key: "maxTemp", min: 0, max: 150, color: "#f59e0b" },
          { label: "Min Flow Rate (m³/h)", key: "minFlow", min: 0, max: 1000, color: "#22c55e" },
        ].map(({ label: lbl, key, min, max, color }) => (
          <div key={key} style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={label}>{lbl}</label>
              <span style={{ color, fontWeight: 700, fontSize: "14px" }}>
                {local[key as keyof Thresholds]}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={local[key as keyof Thresholds]}
              onChange={e => setLocal({ ...local, [key]: Number(e.target.value) })}
              style={{ width: "100%", accentColor: color }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#374151", fontSize: "11px" }}>{min}</span>
              <span style={{ color: "#374151", fontSize: "11px" }}>{max}</span>
            </div>
          </div>
        ))}

        <button
          onClick={() => {
            setThresholds(local);
            localStorage.setItem("settings_thresholds", JSON.stringify(local));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", cursor: "pointer", fontWeight: 600 }}
        >
          {saved ? "✓ Applied!" : "Apply Thresholds"}
        </button>
      </div>
    </div>
  );
}