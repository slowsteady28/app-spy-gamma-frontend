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

type CallDurationChartProps = {
  lookback: number;
};

type DurationDataPoint = {
  date: string;
  duration: number;
};

function CW3DurationChart({ lookback }: CallDurationChartProps) {
  const [data, setData] = useState<DurationDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw3-duration?lookback=${lookback}`)
      .then((res) => {
        console.log("Duration Chart Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading duration data", err));
  }, [lookback]);

  const min = Math.min(...data.map((d) => d.duration ?? 0));
  const max = Math.max(...data.map((d) => d.duration ?? 0));

  return (
    <div className="my-4">
      <h4>Average Call Gamma Duration</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis domain={[min, max]} />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
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

export default CW3DurationChart;
