import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

type PW2DataPoint = {
  date: string;
  pw2: number;
};

function PW2WallChart({
  lookback,
  selectedRange,
  setSelectedRange,
  activeIndex,
  setActiveIndex,
}: PutWallChartProps) {
  const [data, setData] = useState<PW2DataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/pw2-history?lookback=${lookback}`)
      .then((res) => {
        console.log("Put Wall Chart Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading PW2 data", err));
  }, [lookback]);

  const minPW2 = Math.min(...data.map((d) => d.pw2));
  const maxPW2 = Math.max(...data.map((d) => d.pw2));

  return (
    <div className="my-4">
      <h4>Put Wall</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            domain={[minPW2, maxPW2]}
            label={{
              value: "Put Wall (PW2)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
          />
          <Line
            type="monotone"
            dataKey="pw2"
            stroke="purple"
            name="PW2"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PW2WallChart;
