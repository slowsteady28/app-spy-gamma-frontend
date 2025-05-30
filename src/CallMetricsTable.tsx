import { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";

function SpyMetricsTable() {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/download/call-metrics", {
        responseType: "blob",
      })
      .then((response) => {
        const reader = new FileReader();
        reader.onload = () => {
          const csvText = reader.result as string;
          const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
          });
          setHeaders(parsed.meta.fields ?? []);
          setData(parsed.data as any[]);
        };
        reader.readAsText(response.data);
      })
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);

  const downloadCSV = () => {
    const link = document.createElement("a");
    link.href = "http://localhost:8000/download/call-metrics";
    link.download = "spy_metrics.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4>SPY Metrics Table</h4>
        <button className="btn btn-primary" onClick={downloadCSV}>
          Download CSV
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="table table-striped table-bordered table-sm">
          <thead className="thead-dark">
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {headers.map((header) => (
                  <td key={header}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SpyMetricsTable;
