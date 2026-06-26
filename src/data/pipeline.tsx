import { useState } from "react";

type Pipeline = {
  id: string;
  name: string;
  status: string;
  pressure: number;
  flow: number;
  temp: number;
  lastChecked: string;
};

type PipelineTableProps = {
  dark: boolean;
  pipelines: Pipeline[];
  setPipelines: React.Dispatch<React.SetStateAction<Pipeline[]>>;
};

const statusColors: Record<string, string> = {
  Healthy: "#22c55e",
  Warning: "#f59e0b",
  Critical: "#ef4444",
};

export default function PipelineTable({
  dark,
  pipelines,
  setPipelines,
}: PipelineTableProps) {
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const addPipeline = () => {
    if (!newName.trim()) return;

    const newPipeline: Pipeline = {
      id: `PL-${Date.now()}`,
      name: newName,
      status: "Healthy",
      pressure: 80,
      flow: 600,
      temp: 65,
      lastChecked: "Just now",
    };

    setPipelines([...pipelines, newPipeline]);
    setNewName("");
  };

  const deletePipeline = (id: string) => {
    setPipelines(pipelines.filter((p) => p.id !== id));
  };

  const editPipeline = (id: string, currentName: string) => {
    const updatedName = prompt("Edit Pipeline Name", currentName);

    if (!updatedName) return;

    setPipelines(
      pipelines.map((p) =>
        p.id === id ? { ...p, name: updatedName } : p
      )
    );
  };

  const filteredPipelines = pipelines.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All"
        ? true
        : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div
      style={{
        background: dark ? "#1a1f2e" : "#fff",
        border: `1px solid ${dark ? "#2a2f42" : "#e5e7eb"}`,
        borderRadius: "12px",
        padding: "24px",
      }}
    >
      <h3
        style={{
          color: dark ? "#fff" : "#111",
          marginBottom: "16px",
        }}
      >
        Pipeline Status
      </h3>

      {/* Add Pipeline */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter pipeline name"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #374151",
            background: dark ? "#0d1117" : "#fff",
            color: dark ? "#fff" : "#111",
          }}
        />

        <button
          onClick={addPipeline}
          style={{
            background: "#22c55e",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add Pipeline
        </button>
      </div>

      {/* Search + Filter */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pipeline..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #374151",
            background: dark ? "#0d1117" : "#fff",
            color: dark ? "#fff" : "#111",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #374151",
            background: dark ? "#0d1117" : "#fff",
            color: dark ? "#fff" : "#111",
          }}
        >
          <option value="All">All</option>
          <option value="Healthy">Healthy</option>
          <option value="Warning">Warning</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "16px",
          fontSize: "13px",
        }}
      >
        Showing {filteredPipelines.length} of {pipelines.length} pipelines
      </p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: `1px solid ${
                dark ? "#2a2f42" : "#e5e7eb"
              }`,
            }}
          >
            {[
              "ID",
              "NAME",
              "STATUS",
              "PRESSURE (BAR)",
              "FLOW (M³/H)",
              "TEMP (°C)",
              "LAST CHECKED",
              "ACTIONS",
            ].map((h) => (
              <th
                key={h}
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  padding: "12px 16px",
                  textAlign: "left",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredPipelines.map((p) => (
            <tr
              key={p.id}
              style={{
                borderBottom: `1px solid ${
                  dark ? "#1e2435" : "#f3f4f6"
                }`,
              }}
            >
              <td style={{ padding: "16px", color: "#38bdf8" }}>
                {p.id}
              </td>

              <td
                style={{
                  padding: "16px",
                  color: dark ? "#e2e8f0" : "#111",
                }}
              >
                {p.name}
              </td>

              <td style={{ padding: "16px" }}>
                <span
                  style={{
                    background: statusColors[p.status] + "22",
                    color: statusColors[p.status],
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {p.status}
                </span>
              </td>

              <td style={{ padding: "16px" }}>{p.pressure}</td>
              <td style={{ padding: "16px" }}>{p.flow}</td>
              <td style={{ padding: "16px" }}>{p.temp}</td>

              <td
                style={{
                  padding: "16px",
                  color: "#6b7280",
                }}
              >
                {p.lastChecked}
              </td>

              <td style={{ padding: "16px" }}>
                <button
                  onClick={() =>
                    editPipeline(p.id, p.name)
                  }
                  style={{
                    background: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    marginRight: "8px",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deletePipeline(p.id)
                  }
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}