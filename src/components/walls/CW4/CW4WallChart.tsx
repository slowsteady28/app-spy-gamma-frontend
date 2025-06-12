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

type CW4DataPoint = {
  date: string;
  cw4: number;
};

function CW4WallChart({
  lookback,
  selectedRange,
  setSelectedRange,
  activeIndex,
  setActiveIndex,
}: CallWallChartProps) {
  const [data, setData] = useState<CW4DataPoint[]>([]);
  const lineColor = "#0d6efd";

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw4-history?lookback=${lookback}`)
      .then((res) => {
        console.log("Call Wall Chart Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading CW4 data", err));
  }, [lookback]);

  const minCW4 = Math.min(...data.map((d) => d.cw4)) - 5;
  const maxCW4 = Math.max(...data.map((d) => d.cw4)) + 5;

  return (
    <div className="my-4">
      <h4
        className="text-uppercase text-secondary small mb-2 mt-3 ps-2"
        style={{
          letterSpacing: "0.05em",
          fontWeight: 700,
        }}
      >
        Call Wall
      </h4>
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            domain={[minCW4, maxCW4]}
            tickMargin={12}
            axisLine={{ stroke: "#ccc", strokeWidth: 1 }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: "#0d6efd", strokeWidth: 2, opacity: 0.7 }}
          />
          <Line
            type="monotone"
            dataKey="cw4"
            stroke={lineColor}
            name="CW4"
            strokeWidth={3}
            dot={{ r: 3, stroke: lineColor, fill: "#fff" }}
            activeDot={{ r: 5, stroke: lineColor, fill: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CW4WallChart;
