type KpiCardProps = {
  title: string;
  value: string | number;
  unit?: string;
  delta: string;
  positive: boolean;
  dark: boolean;
};

export default function KpiCard({ title, value, unit, delta, positive, dark }: KpiCardProps) {
  return (
    <div style={{
      background: dark ? "#1a1f2e" : "#fff",
      border: `1px solid ${dark ? "#2a2f42" : "#e5e7eb"}`,
      borderRadius: "12px", padding: "24px", flex: 1,
    }}>
      <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px" }}>{title}</p>
      <h2 style={{ color: dark ? "#fff" : "#111", fontSize: "32px", fontWeight: 700, margin: "0 0 8px" }}>
        {value} {unit && <span style={{ fontSize: "18px", color: "#9ca3af" }}>{unit}</span>}
      </h2>
      <p style={{ color: positive ? "#22c55e" : "#ef4444", fontSize: "13px", margin: 0 }}>{delta}</p>
    </div>
  );
}