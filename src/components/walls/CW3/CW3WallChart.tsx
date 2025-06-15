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

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type CallWallChartProps = {
  lookback: number;
  selectedRange: [number, number] | null;
  setSelectedRange: (range: [number, number]) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
};

type cW3DataPoint = {
  date: string;
  cw3: number;
  price: number;
};

function CW3WallChart({
  lookback,
  selectedRange,
  setSelectedRange,
  activeIndex,
  setActiveIndex,
}: CallWallChartProps) {
  const [data, setData] = useState<cW3DataPoint[]>([]);
  const lineColor = "#0096b4"; // 🔵 Replaced from purple
  const priceColor = "#6c757d";

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw3-history?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading cW3 data", err));
  }, [lookback]);

  const mincW3 = Math.min(...data.map((d) => d.cw3)) - 5;
  const maxcW3 = Math.max(...data.map((d) => d.cw3)) + 5;

  return (
    <div
      className="my-1"
      style={{
        background: "linear-gradient(90deg, #f8f9fa 60%, #d0f0f7 100%)", // 💠 teal-tinted background
        borderRadius: "12px",
        boxShadow: "0 2px 12px 0 rgba(0,150,180,0.07)", // 🟦 teal shadow
        padding: "1.5rem 1rem",
      }}
    >
      <h4
        className="text-uppercase mb-2 mt-1 ps-2"
        style={{
          letterSpacing: "0.05em",
          fontWeight: 900,
          color: lineColor,
          fontSize: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textShadow: "0 1px 4px rgba(0,150,180,0.08)",
          fontFamily: "'Segoe UI', 'Arial', 'sans-serif'",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "linear-gradient(90deg, #0096b4 60%, #33cbe0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
            letterSpacing: "0.08em",
          }}
        >
          Call Wall
        </span>
      </h4>
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            yAxisId="left"
            domain={[mincW3, maxcW3]}
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
            dataKey="cw3"
            stroke={lineColor}
            name="cW3"
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

export default CW3WallChart;
