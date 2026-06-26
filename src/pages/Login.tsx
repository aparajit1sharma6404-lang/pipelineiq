import { useState } from "react";

type LoginProps = { onLogin: (token: string) => void };

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      localStorage.setItem("token", data.token);
      onLogin(data.token);
    } catch {
      setError("Server error. Is backend running?");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1117",
      display: "flex",
      fontFamily: "'Inter', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Animated background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        zIndex: 0,
      }} />

      {/* Glow blobs */}
      <div style={{
        position: "absolute", width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
        top: "-200px", left: "-200px", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        bottom: "-100px", right: "-100px", zIndex: 0,
      }} />

      {/* Left Panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "80px",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <div style={{
            width: "44px", height: "44px", background: "#3b82f6",
            borderRadius: "10px", display: "grid", placeItems: "center",
            fontSize: "22px", boxShadow: "0 0 20px rgba(59,130,246,0.4)",
          }}>⚡</div>
          <div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: "18px", margin: 0 }}>PipelineIQ</p>
            <p style={{ color: "#3b82f6", fontSize: "11px", margin: 0, letterSpacing: "2px" }}>IOCL OPS MONITOR</p>
          </div>
        </div>

        <h1 style={{
          color: "#fff", fontSize: "48px", fontWeight: 800,
          lineHeight: 1.15, margin: "0 0 20px",
        }}>
          Real-time<br />
          <span style={{ color: "#3b82f6" }}>Pipeline</span><br />
          Intelligence
        </h1>
        <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: 1.7, maxWidth: "420px", margin: "0 0 48px" }}>
          Monitor pressure, flow rate, and temperature across all IOCL refinery pipelines. AI-powered alerts and live analytics.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: "32px" }}>
          {[
            { value: "142", label: "Active Pipelines" },
            { value: "99.8%", label: "Uptime" },
            { value: "<2s", label: "Alert Latency" },
          ].map(s => (
            <div key={s.label}>
              <p style={{ color: "#3b82f6", fontSize: "28px", fontWeight: 800, margin: "0 0 4px" }}>{s.value}</p>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{
        width: "480px", display: "flex", alignItems: "center",
        justifyContent: "center", padding: "40px",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: "100%", background: "rgba(26,31,46,0.8)",
          border: "1px solid #2a2f42",
          borderRadius: "20px", padding: "48px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}>
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, margin: "0 0 8px" }}>
            Operator Login
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 32px" }}>
            Authorized personnel only
          </p>

          {/* Username */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: "#9ca3af", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
              USERNAME
            </label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{
                width: "100%", padding: "14px 16px",
                background: "#0f1117", border: "1px solid #2a2f42",
                borderRadius: "10px", color: "#fff",
                fontSize: "14px", boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ color: "#9ca3af", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
              PASSWORD
            </label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter password"
              type="password"
              style={{
                width: "100%", padding: "14px 16px",
                background: "#0f1117", border: "1px solid #2a2f42",
                borderRadius: "10px", color: "#fff",
                fontSize: "14px", boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "#ef444422", border: "1px solid #ef444444",
              borderRadius: "8px", padding: "10px 14px",
              color: "#ef4444", fontSize: "13px", marginBottom: "16px",
            }}>{error}</div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading ? "#1e3a5f" : "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "#fff", border: "none", borderRadius: "10px",
              fontSize: "15px", fontWeight: 700, cursor: "pointer",
              boxShadow: loading ? "none" : "0 0 20px rgba(59,130,246,0.35)",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Authenticating..." : "Login →"}
          </button>

          <div style={{
            marginTop: "24px", padding: "14px",
            background: "#0f1117", borderRadius: "10px",
            border: "1px solid #2a2f42",
          }}>
            <p style={{ color: "#6b7280", fontSize: "11px", margin: "0 0 6px", letterSpacing: "1px" }}>DEMO CREDENTIALS</p>
            <p style={{ color: "#e2e8f0", fontSize: "13px", margin: 0 }}>
              <span style={{ color: "#3b82f6" }}>admin</span> / <span style={{ color: "#3b82f6" }}>admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
