import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
} from "recharts";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type PutNetGammaChartProps = {
  lookback: number;
};

type NetGammaDataPoint = {
  date: string;
  gamma: number;
};

function CW1NetGammaChart({ lookback }: PutNetGammaChartProps) {
  const [data, setData] = useState<NetGammaDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw1-net-gamma?lookback=${lookback}`)
      .then((res) => {
        console.log("cW1 Net Gamma Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading cW1 net gamma data", err));
  }, [lookback]);

  const minGamma = Math.min(...data.map((d) => d.gamma ?? 0));
  const maxGamma = Math.max(...data.map((d) => d.gamma ?? 0));

  const mainColor = "#0096b4"; // Updated from purple to teal

  return (
    <div
      className="my-1"
      style={{
        background: "linear-gradient(90deg, #f8f9fa 60%, #d0f0f7 100%)", // ✅ Teal background
        borderRadius: "12px",
        boxShadow: "0 2px 12px 0 rgba(0,150,180,0.07)", // ✅ Teal shadow
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
          textShadow: "0 1px 4px rgba(0,150,180,0.08)", // ✅ Teal shadow
          fontFamily: "'Segoe UI', 'Arial', 'sans-serif'",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "linear-gradient(90deg, #0096b4 60%, #33cbe0 100%)", // ✅ Teal gradient
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
            letterSpacing: "0.08em",
          }}
        >
          Net Call Gamma
        </span>
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            domain={[minGamma, maxGamma]}
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
            dataKey="gamma"
            name="Net Gamma"
            fill={mainColor}
            barSize={14}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CW1NetGammaChart;
