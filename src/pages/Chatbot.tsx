import { useState } from "react";

type Message = { role: "user" | "ai"; content: string };
type ChatbotProps = { dark: boolean };

export default function Chatbot({ dark }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm PipelineIQ AI. Ask me about pipeline health, alerts, or recommendations." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("https://pipelineiq-backendd.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Error connecting to AI." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{
        background: dark ? "#1a1f2e" : "#fff",
        border: "1px solid #2a2f42",
        borderRadius: "12px",
        padding: "24px",
        height: "500px",
        overflowY: "auto",
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              background: m.role === "user" ? "#3b82f6" : (dark ? "#0f1117" : "#f1f5f9"),
              color: m.role === "user" ? "#fff" : (dark ? "#e2e8f0" : "#111"),
              padding: "12px 16px",
              borderRadius: "12px",
              maxWidth: "70%",
              fontSize: "14px",
              lineHeight: "1.5",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ color: "#6b7280", fontSize: "13px" }}>AI is thinking...</div>
        )}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask about pipelines..."
          style={{
            flex: 1, padding: "12px 16px",
            background: dark ? "#1a1f2e" : "#fff",
            border: "1px solid #2a2f42",
            borderRadius: "8px",
            color: dark ? "#e2e8f0" : "#111",
            fontSize: "14px",
          }}
        />
        <button onClick={send} style={{
          background: "#3b82f6", color: "#fff",
          border: "none", borderRadius: "8px",
          padding: "12px 24px", cursor: "pointer",
          fontWeight: 600,
        }}>Send</button>
      </div>
    </div>
  );
}
