import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";

////////////////////////////////////////////////////////////////////////////////
// Ensure you have the correct API base URL set in your environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type PutWallChartProps = {
  lookback: number;
  selectedRange: [number, number] | null;
  setSelectedRange: (range: [number, number]) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
};

type PW1DataPoint = {
  date: string;
  pw1: number;
  price: number; // <-- Add price to the data type
};

function PW1WallChart({
  lookback,
  selectedRange,
  setSelectedRange,
  activeIndex,
  setActiveIndex,
}: PutWallChartProps) {
  const [data, setData] = useState<PW1DataPoint[]>([]);
  const lineColor = "#6f42c1"; // Purple for Put Wall
  const priceColor = "#6c757d"; // Price line color

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/pw1-history?lookback=${lookback}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Error loading PW1 data", err));
  }, [lookback]);

  const minPW1 = Math.min(...data.map((d) => d.pw1)) - 5;
  const maxPW1 = Math.max(...data.map((d) => d.pw1)) + 5;

  return (
    <div
      className="my-1"
      style={{
        background: "linear-gradient(90deg, #f8f9fa 60%, #ede7f6 100%)", // Light background with a purple tint
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
          Put Wall
        </span>
      </h4>
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            yAxisId="left"
            domain={[minPW1, maxPW1]}
            tickMargin={12}
            axisLine={{ stroke: "#ccc", strokeWidth: 1 }}
            tickLine={false}
          />
          <Tooltip
            cursor={{
              stroke: lineColor,
              strokeWidth: 2,
              opacity: 0.7,
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="pw1"
            stroke={lineColor}
            name="PW1"
            strokeWidth={3}
            dot={{ r: 3, stroke: lineColor, fill: "#fff" }}
            activeDot={{ r: 5, stroke: lineColor, fill: "#fff" }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="price"
            stroke={priceColor}
            name="Price"
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
          <Brush
            dataKey="date"
            height={24}
            stroke={lineColor}
            travellerWidth={8}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PW1WallChart;
