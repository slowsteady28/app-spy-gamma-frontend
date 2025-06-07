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

type CallWallChartProps = {
  lookback: number;
  selectedRange: [number, number] | null;
  setSelectedRange: (range: [number, number]) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
};

type CW1DataPoint = {
  date: string;
  cw1: number;
};

function CW2WallChart({
  lookback,
  selectedRange,
  setSelectedRange,
  activeIndex,
  setActiveIndex,
}: CallWallChartProps) {
  const [data, setData] = useState<CW1DataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw2-history?lookback=${lookback}`)
      .then((res) => {
        console.log("Call Wall Chart Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading CW2 data", err));
  }, [lookback]);

  const minCW1 = Math.min(...data.map((d) => d.cw1));
  const maxCW1 = Math.max(...data.map((d) => d.cw1));

  return (
    <div className="my-4">
      <h4>Call Wall</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            domain={[minCW1, maxCW1]}
            label={{
              value: "Call Wall (CW2)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
          />
          <Line
            type="monotone"
            dataKey="cw2"
            stroke="orange"
            name="CW2"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CW2WallChart;
