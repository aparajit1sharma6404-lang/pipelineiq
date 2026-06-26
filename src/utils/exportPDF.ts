import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Pipeline = {
  _id: string;
  name: string;
  status: string;
  pressure: number;
  flow: number;
  temp: number;
  lastChecked: string;
};

export const exportPipelineReport = (pipelines: Pipeline[]) => {
  const doc = new jsPDF();

  doc.setFillColor(13, 17, 23);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(59, 130, 246);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("PipelineIQ", 14, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("IOCL Operations Monitor — Pipeline Status Report", 14, 28);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);

  const healthy = pipelines.filter(p => p.status === "Healthy").length;
  const warning = pipelines.filter(p => p.status === "Warning").length;
  const critical = pipelines.filter(p => p.status === "Critical").length;
  const avgPressure = pipelines.length
    ? (pipelines.reduce((s, p) => s + p.pressure, 0) / pipelines.length).toFixed(1)
    : "0";
  const totalFlow = pipelines.reduce((s, p) => s + p.flow, 0).toLocaleString();

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 14, 52);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Pipelines: ${pipelines.length}`, 14, 62);
  doc.text(`Healthy: ${healthy}`, 14, 69);
  doc.text(`Warning: ${warning}`, 14, 76);
  doc.text(`Critical: ${critical}`, 14, 83);
  doc.text(`Avg Pressure: ${avgPressure} bar`, 100, 62);
  doc.text(`Total Flow Rate: ${totalFlow} m³/h`, 100, 69);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Pipeline Status Details", 14, 98);

  autoTable(doc, {
    startY: 104,
    head: [["Pipeline Name", "Status", "Pressure (bar)", "Flow (m³/h)", "Temp (°C)", "Last Checked"]],
    body: pipelines.filter(p => !p.name.startsWith("Auto")).map(p => [
      p.name, p.status, p.pressure, p.flow, p.temp, p.lastChecked,
    ]),
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold", fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    didParseCell: (data) => {
      if (data.column.index === 1 && data.section === "body") {
        const val = data.cell.raw as string;
        if (val === "Critical") data.cell.styles.textColor = [239, 68, 68];
        else if (val === "Warning") data.cell.styles.textColor = [245, 158, 11];
        else data.cell.styles.textColor = [34, 197, 94];
      }
    },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("PipelineIQ — Confidential", 14, 290);
    doc.text(`Page ${i} of ${pageCount}`, 180, 290);
  }

  doc.save(`PipelineIQ_Report_${new Date().toISOString().split("T")[0]}.pdf`);
};
