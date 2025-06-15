import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

////////////////////////////////////////////////////////////////////////////////
// Ensure you have the correct API base URL set in your environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type PutDurationChartProps = {
  lookback: number;
};

type DurationDataPoint = {
  date: string;
  duration: number;
};

const mainColor = "#6f42c1";

function PW2DurationChart({ lookback }: PutDurationChartProps) {
  const [data, setData] = useState<DurationDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/pw2-duration?lookback=${lookback}`)
      .then((res) => {
        console.log("Put Duration Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading PW2 duration data", err));
  }, [lookback]);

  const min = Math.min(...data.map((d) => d.duration ?? 0));
  const max = Math.max(...data.map((d) => d.duration ?? 0));

  return (
    <div
      className="my-1"
      style={{
        background: "linear-gradient(90deg, #f8f9fa 60%, #ede7f6 100%)", // Match Put Wall background
        borderRadius: "12px",
        boxShadow: "0 2px 12px 0 rgba(111,66,193,0.07)",
        padding: "1.5rem 1rem",
      }}
    >
      <h4
        className="text-uppercase mb-2 mt-1 ps-2"
        style={{
          letterSpacing: "0.05em",
          fontWeight: 900,
          color: "#6f42c1",
          fontSize: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textShadow: "0 1px 4px rgba(111,66,193,0.08)",
          fontFamily: "'Segoe UI', 'Arial', 'sans-serif'",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "linear-gradient(90deg, #6f42c1 60%, #b39ddb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
            letterSpacing: "0.08em",
          }}
        >
          Duration (Average # of days till expiration*)
        </span>
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            domain={[min, max]}
            tickFormatter={(value) =>
              value?.toLocaleString(undefined, { maximumFractionDigits: 0 })
            }
            tickMargin={12}
            axisLine={{ stroke: "#ccc", strokeWidth: 1 }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: mainColor, strokeWidth: 2, opacity: 0.7 }}
            formatter={(value: number) =>
              value?.toLocaleString(undefined, { maximumFractionDigits: 0 })
            }
          />
          <Bar
            dataKey="duration"
            name="Duration"
            fill={mainColor}
            barSize={14}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PW2DurationChart;
