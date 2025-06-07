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

function PW5DurationChart({ lookback }: PutDurationChartProps) {
  const [data, setData] = useState<DurationDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/pw5-duration?lookback=${lookback}`)
      .then((res) => {
        console.log("Put Duration Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading PW5 duration data", err));
  }, [lookback]);

  const min = Math.min(...data.map((d) => d.duration ?? 0));
  const max = Math.max(...data.map((d) => d.duration ?? 0));

  return (
    <div className="my-4">
      <h4>Average Put Gamma Duration</h4>
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

export default PW5DurationChart;
