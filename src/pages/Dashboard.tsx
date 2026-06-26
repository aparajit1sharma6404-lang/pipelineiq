import { useEffect, useState } from "react";
import KpiCard from "../components/KpiCard";
import PipelineTable from "../components/PipelineTable";

type Pipeline = {
  _id: string;
  name: string;
  status: string;
  pressure: number;
  flow: number;
  temp: number;
  lastChecked: string;
};

type DashboardProps = { dark: boolean };

export default function Dashboard({ dark }: DashboardProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [prev, setPrev] = useState({ count: 0, pressure: 0, flow: 0, alerts: 0 });

  useEffect(() => {
    const fetchData = () =>
      fetch("http://localhost:5000/api/pipelines")
        .then(r => r.json())
        .then((data: Pipeline[]) => {
          setPipelines(prev => {
            const prevCount = prev.length;
            const prevPressure = prev.length ? prev.reduce((s, p) => s + p.pressure, 0) / prev.length : 0;
            const prevFlow = prev.reduce((s, p) => s + p.flow, 0);
            const prevAlerts = prev.filter(p => p.status !== "Healthy").length;
            setPrev({ count: prevCount, pressure: prevPressure, flow: prevFlow, alerts: prevAlerts });
            return data;
          });
        });
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const count = pipelines.length;
  const avgPressure = count ? (pipelines.reduce((s, p) => s + p.pressure, 0) / count).toFixed(1) : "0";
  const totalFlow = pipelines.reduce((s, p) => s + p.flow, 0);
  const alerts = pipelines.filter(p => p.status !== "Healthy").length;

  const diff = (curr: number, p: number) => {
    const d = curr - p;
    return `${d >= 0 ? "+" : ""}${typeof curr === typeof 1.1 ? d.toFixed(1) : d} vs last`;
  };

  const kpis = [
    { title: "Active Pipelines", value: count, delta: diff(count, prev.count), positive: count >= prev.count },
    { title: "Avg. Pressure", value: avgPressure, unit: "bar", delta: diff(+avgPressure, prev.pressure), positive: +avgPressure >= prev.pressure },
    { title: "Flow Rate", value: totalFlow.toLocaleString(), unit: "m³/h", delta: diff(totalFlow, prev.flow), positive: totalFlow >= prev.flow },
    { title: "Alerts Today", value: alerts, delta: diff(alerts, prev.alerts), positive: alerts <= prev.alerts },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {kpis.map(k => (
          <KpiCard key={k.title} dark={dark} {...k} value={k.value as string | number} />
        ))}
      </div>
      <PipelineTable />
    </div>
  );
}
