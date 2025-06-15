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
const mainColor = "#212529"; // Dark Bootstrap Gray
const accentColor = "#495057"; // Slightly lighter gray
const priceColor = "#8B0000";

type AGS1DataPoint = {
  date: string;
  ags1: number;
  price: number;
};

type Props = {
  lookback: number;
};

function AbsGamma1WallChart({ lookback }: Props) {
  const [data, setData] = useState<AGS1DataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/ags1-history?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading AGS1 data", err));
  }, [lookback]);

  const ags1Values = data
    .map((d) => d.ags1)
    .filter((v) => typeof v === "number" && !isNaN(v));

  const minY = ags1Values.length > 0 ? Math.min(...ags1Values) : 0;
  const maxY = ags1Values.length > 0 ? Math.max(...ags1Values) : 100;
  const buffer = (maxY - minY) * 0.05;

  return (
    <div
      className="my-1"
      style={{
        background: "linear-gradient(90deg, #f8f9fa 0%, #dee2e6 100%)",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(33, 37, 41, 0.07)",
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
          Absolute Gamma Wall
        </span>
      </h4>
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis domain={[minY - buffer, maxY + buffer]} />
          <Tooltip
            cursor={{
              stroke: accentColor,
              strokeWidth: 2,
              opacity: 0.7,
            }}
            formatter={(value: number) =>
              value?.toLocaleString(undefined, { maximumFractionDigits: 0 })
            }
          />
          <Line
            type="monotone"
            dataKey="ags1"
            name="Gamma Strike"
            stroke={mainColor}
            strokeWidth={3}
            dot={{ r: 3, stroke: mainColor, fill: "#fff" }}
            activeDot={{ r: 5, stroke: mainColor, fill: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            name="Price"
            stroke={priceColor}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
          <Brush
            dataKey="date"
            height={24}
            stroke={mainColor}
            travellerWidth={8}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AbsGamma1WallChart;
