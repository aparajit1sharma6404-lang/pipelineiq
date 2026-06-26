export const pipelines = [
  { id: "PL-001", name: "Panipat Main Feed", status: "Healthy", pressure: 91, flow: 820, temp: 68, lastChecked: "2 min ago" },
  { id: "PL-002", name: "Gujarat Crude Line", status: "Warning", pressure: 74, flow: 610, temp: 82, lastChecked: "5 min ago" },
  { id: "PL-003", name: "Barauni Offsite-A", status: "Healthy", pressure: 88, flow: 740, temp: 71, lastChecked: "1 min ago" },
  { id: "PL-004", name: "Mathura Export Line", status: "Critical", pressure: 52, flow: 290, temp: 94, lastChecked: "8 min ago" },
  { id: "PL-005", name: "Haldia Crude Loop", status: "Healthy", pressure: 95, flow: 890, temp: 65, lastChecked: "3 min ago" },
  { id: "PL-006", name: "Digboi North Feed", status: "Warning", pressure: 69, flow: 520, temp: 79, lastChecked: "6 min ago" },
];

export const kpiData = {
  activePipelines: { value: 142, delta: "+3 vs yesterday", positive: true },
  avgPressure: { value: "87.4", unit: "bar", delta: "-1.2 vs yesterday", positive: false },
  flowRate: { value: "3,210", unit: "m³/h", delta: "+120 vs yesterday", positive: true },
  alertsToday: { value: 7, delta: "+2 vs yesterday", positive: false },
};
