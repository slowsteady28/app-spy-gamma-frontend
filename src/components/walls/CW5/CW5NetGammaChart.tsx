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

////////////////////////////////////////////////////////////////////////////////
// Ensure you have the correct API base URL set in your environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type CallNetGammaChartProps = {
  lookback: number;
};

type NetGammaDataPoint = {
  date: string;
  gamma: number;
};

function CW5NetGammaChart({ lookback }: CallNetGammaChartProps) {
  const [data, setData] = useState<NetGammaDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw5-net-gamma?lookback=${lookback}`)
      .then((res) => {
        // Scale gamma by 10,000 for readability
        const transformed = res.data.map((d: NetGammaDataPoint) => ({
          ...d,
          gamma: d.gamma / 10000,
        }));
        setData(transformed);
      })
      .catch((err) => console.error("Error loading Net Gamma data", err));
  }, [lookback]);

  const minGamma = Math.round(Math.min(...data.map((d) => d.gamma ?? 0)));
  const maxGamma = Math.round(Math.max(...data.map((d) => d.gamma ?? 0)));

  // Custom tooltip formatter for commas
  const tooltipFormatter = (value: number) =>
    value?.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="my-1">
      <h4
        className="text-uppercase text-secondary small mb-2 mt-3 ps-2"
        style={{
          letterSpacing: "0.05em",
          fontWeight: 700,
        }}
      >
        Net Call Gamma (in 10,000s)
      </h4>
      <ResponsiveContainer width="100%" height={380}>
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
            cursor={{
              stroke: "rgb(191, 23, 45)",
              strokeWidth: 2,
              opacity: 0.7,
            }}
            formatter={tooltipFormatter}
          />
          <Bar
            dataKey="gamma"
            name="Net Gamma"
            fill="#0d6efd"
            barSize={14}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CW5NetGammaChart;
