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
      const res = await fetch("https://pipelineiq-backendd.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      localStorage.setItem("token", data.token);
      onLogin(data.token);
    } catch {
      setError("Server error.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0d1117",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif", padding: "16px",
    }}>
      <div style={{
        width: "100%", maxWidth: "400px",
        background: "rgba(26,31,46,0.95)",
        border: "1px solid #2a2f42", borderRadius: "20px",
        padding: "32px 24px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "44px", height: "44px", background: "#3b82f6",
            borderRadius: "10px", display: "grid", placeItems: "center",
            fontSize: "22px", margin: "0 auto 10px",
          }}>⚡</div>
          <p style={{ color: "#fff", fontWeight: 800, fontSize: "18px", margin: "0 0 2px" }}>PipelineIQ</p>
          <p style={{ color: "#3b82f6", fontSize: "10px", margin: 0, letterSpacing: "2px" }}>IOCL OPS MONITOR</p>
        </div>

        <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: "0 0 4px", textAlign: "center" }}>Operator Login</h2>
        <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 20px", textAlign: "center" }}>Authorized personnel only</p>

        <label style={{ color: "#9ca3af", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", display: "block", marginBottom: "6px" }}>USERNAME</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
          autoComplete="username"
          style={{
            width: "100%", padding: "12px 14px", marginBottom: "12px",
            background: "#0f1117", border: "1px solid #2a2f42",
            borderRadius: "10px", color: "#fff", fontSize: "16px",
            boxSizing: "border-box" as const, outline: "none",
          }}
        />

        <label style={{ color: "#9ca3af", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", display: "block", marginBottom: "6px" }}>PASSWORD</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          placeholder="Enter password"
          type="password"
          autoComplete="current-password"
          style={{
            width: "100%", padding: "12px 14px", marginBottom: "16px",
            background: "#0f1117", border: "1px solid #2a2f42",
            borderRadius: "10px", color: "#fff", fontSize: "16px",
            boxSizing: "border-box" as const, outline: "none",
          }}
        />

        {error && <div style={{ background: "#ef444422", border: "1px solid #ef444444", borderRadius: "8px", padding: "10px 14px", color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</div>}

        <button onClick={handleLogin} disabled={loading} style={{
          width: "100%", padding: "13px",
          background: loading ? "#1e3a5f" : "linear-gradient(135deg, #3b82f6, #2563eb)",
          color: "#fff", border: "none", borderRadius: "10px",
          fontSize: "15px", fontWeight: 700, cursor: "pointer",
        }}>
          {loading ? "Authenticating..." : "Login →"}
        </button>

        <div style={{ marginTop: "14px", padding: "10px", background: "#0f1117", borderRadius: "10px", border: "1px solid #2a2f42", textAlign: "center" }}>
          <p style={{ color: "#6b7280", fontSize: "10px", margin: "0 0 3px", letterSpacing: "1px" }}>DEMO CREDENTIALS</p>
          <p style={{ color: "#e2e8f0", fontSize: "13px", margin: 0 }}>
            <span style={{ color: "#3b82f6" }}>admin</span> / <span style={{ color: "#3b82f6" }}>admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
