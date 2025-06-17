import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

const mainColor = "#212529";
const accentColor = "#495057";
const deepRed = "#8B0000";
const callGray = "#343a40";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type DurationDataPoint = {
  date: string;
  call_duration: number;
  put_duration: number;
};

type Props = {
  lookback: number;
};

function AGS3DurationChart({ lookback }: Props) {
  const [data, setData] = useState<DurationDataPoint[]>([]);
  const [visible, setVisible] = useState<"both" | "call" | "put">("both");

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/ags3-duration?lookback=${lookback}`)
      .then((res) => {
        // Check if your API returns { data: [...] } or just [...]
        const arr = Array.isArray(res.data) ? res.data : res.data.data;
        setData(arr);
      })
      .catch((err) => console.error("Error loading AGS3 Duration data", err));
  }, [lookback]);

  // Add this for debugging
  console.log("Duration data:", data);

  const tooltipFormatter = (value: number) =>
    value?.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div
      className="my-1"
      style={{
        background: "linear-gradient(90deg, #f8f9fa 0%, #dee2e6 100%)",
        borderRadius: "12px",
        boxShadow: "0 2px 12px 0 rgba(33, 37, 41, 0.07)",
        padding: "1.5rem 1rem",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4
          className="text-uppercase mb-0 ps-2"
          style={{
            letterSpacing: "0.05em",
            fontWeight: 900,
            color: mainColor,
            fontSize: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textShadow: "0 1px 4px rgba(33, 37, 41, 0.15)",
            fontFamily: "'Segoe UI', 'Arial', 'sans-serif'",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg, #212529, #868e96)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            Call & Put Duration
          </span>
        </h4>
        <ButtonGroup>
          <Button
            variant={visible === "both" ? "dark" : "outline-dark"}
            size="sm"
            onClick={() => setVisible("both")}
          >
            Both
          </Button>
          <Button
            variant={visible === "call" ? "dark" : "outline-dark"}
            size="sm"
            onClick={() => setVisible("call")}
          >
            Call Duration
          </Button>
          <Button
            variant={visible === "put" ? "dark" : "outline-dark"}
            size="sm"
            onClick={() => setVisible("put")}
          >
            Put Duration
          </Button>
        </ButtonGroup>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            cursor={{ stroke: accentColor, strokeWidth: 2, opacity: 0.5 }}
            formatter={tooltipFormatter}
          />
          <Legend />
          {(visible === "both" || visible === "call") && (
            <Bar
              dataKey="call_duration"
              name="Call Duration"
              fill={callGray}
              radius={[4, 4, 0, 0]}
            />
          )}
          {(visible === "both" || visible === "put") && (
            <Bar
              dataKey="put_duration"
              name="Put Duration"
              fill={deepRed}
              radius={[4, 4, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AGS3DurationChart;
