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

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const mainColor = "#212529"; // Dark Bootstrap Gray
const accentColor = "#495057"; // Slightly lighter gray
const deepRed = "#8B0000"; // Deep Red for Put bars
const callGray = "#343a40"; // Dark Gray for Call bars

type DurationDataPoint = {
  date: string;
  call_duration: number;
  put_duration: number;
};

type Props = {
  lookback: number;
};

function AbsGamma3DurationChart({ lookback }: Props) {
  const [data, setData] = useState<DurationDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/ags3-duration?lookback=${lookback}`)
      .then((res) => {
        console.log("AbsGamma3 Duration Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading AGS1 Duration", err));
  }, [lookback]);

  const durations = data.flatMap((d) => [d.call_duration, d.put_duration]);
  const min = Math.min(...durations);
  const max = Math.max(...durations);

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
      <h4
        className="text-uppercase mb-2 mt-1 ps-2"
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
          Avg Duration (Calls vs Puts)
        </span>
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis domain={[min - 1, max + 1]} />
          <Tooltip
            cursor={{ stroke: accentColor, strokeWidth: 2, opacity: 0.7 }}
            formatter={(value: number) =>
              value?.toLocaleString(undefined, { maximumFractionDigits: 0 })
            }
          />
          <Legend />
          <Bar
            dataKey="call_duration"
            name="Call Duration"
            fill={callGray}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="put_duration"
            name="Put Duration"
            fill={deepRed}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AbsGamma3DurationChart;
