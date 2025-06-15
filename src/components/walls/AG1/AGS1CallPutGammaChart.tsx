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

const mainColor = "#212529"; // Dark Bootstrap Gray
const accentColor = "#495057"; // Slightly lighter gray
const deepRed = "#8B0000"; // Deep Red for Put Gamma

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type GammaDataPoint = {
  date: string;
  call_gamma: number;
  put_gamma: number;
};

type Props = {
  lookback: number;
};

function AbsGamma1CallPutGammaChart({ lookback }: Props) {
  const [data, setData] = useState<GammaDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/ags1-gamma?lookback=${lookback}`)
      .then((res) => {
        console.log("AbsGamma1 Call/Put Gamma Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading AbsGamma1 gamma data", err));
  }, [lookback]);

  const gammaValues = data
    .flatMap((d) => [d.call_gamma, d.put_gamma])
    .filter((v) => typeof v === "number" && !isNaN(v));
  const minY = gammaValues.length ? Math.min(...gammaValues) : 0;
  const maxY = gammaValues.length ? Math.max(...gammaValues) : 100;
  const buffer = (maxY - minY) * 0.05;

  return (
    <div
      className="my-1"
      style={{
        background: "linear-gradient(90deg, #f8f9fa 0%, #dee2e6 100%)",
        borderRadius: "12px",
        boxShadow: "0 2px 14px rgba(33, 37, 41, 0.07)",
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
          Call & Put Gamma
        </span>
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis domain={[minY - buffer, maxY + buffer]} />
          <Tooltip
            cursor={{ stroke: accentColor, strokeWidth: 2, opacity: 0.5 }}
            formatter={(value: number) =>
              value?.toLocaleString(undefined, { maximumFractionDigits: 0 })
            }
          />
          <Legend />
          <Bar
            dataKey="call_gamma"
            name="Call Gamma"
            fill="#343a40"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="put_gamma"
            name="Put Gamma"
            fill={deepRed}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AbsGamma1CallPutGammaChart;
