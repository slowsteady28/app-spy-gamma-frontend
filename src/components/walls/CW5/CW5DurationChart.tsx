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
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type CallDurationChartProps = {
  lookback: number;
};

type DurationDataPoint = {
  date: string;
  duration: number;
};

function CW5DurationChart({ lookback }: CallDurationChartProps) {
  const [data, setData] = useState<DurationDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw5-duration?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading duration data", err));
  }, [lookback]);

  const min = Math.round(Math.min(...data.map((d) => d.duration ?? 0)));
  const max = Math.round(Math.max(...data.map((d) => d.duration ?? 0)));

  // Custom tooltip formatter for commas
  const tooltipFormatter = (value: number) =>
    value?.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="my-4">
      <h4
        className="text-uppercase text-secondary small mb-2 mt-3 ps-2"
        style={{
          letterSpacing: "0.05em",
          fontWeight: 700,
        }}
      >
        Duration (the average of the # of days till expiration)
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            domain={[min, max]}
            tickFormatter={(value) =>
              value?.toLocaleString(undefined, { maximumFractionDigits: 0 })
            }
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
            dataKey="duration"
            name="Duration"
            fill="steelblue"
            barSize={14}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CW5DurationChart;
