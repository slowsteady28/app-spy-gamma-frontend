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
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type CallWallChartProps = {
  lookback: number;
  selectedRange: [number, number] | null;
  setSelectedRange: (range: [number, number]) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
};

type CW5DataPoint = {
  date: string;
  cw5: number;
  price: number;
};

function CW5WallChart({
  lookback,
  selectedRange,
  setSelectedRange,
  activeIndex,
  setActiveIndex,
}: CallWallChartProps) {
  const [data, setData] = useState<CW5DataPoint[]>([]);
  const lineColor = "#0d6efd";
  const priceColor = "#6c757d";

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw5-history?lookback=${lookback}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Error loading CW5 data", err));
  }, [lookback]);

  const minCW5 = Math.min(...data.map((d) => d.cw5)) - 5;
  const maxCW5 = Math.max(...data.map((d) => d.cw5)) + 5;

  return (
    <div className="my-1">
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
            yAxisId="left"
            domain={[minCW5, maxCW5]}
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
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="cw5"
            stroke="rgb(191, 23, 45)"
            name="CW5"
            strokeWidth={3}
            dot={{ r: 3, stroke: "rgb(191, 23, 45)", fill: "#fff" }}
            activeDot={{ r: 5, stroke: "rgb(191, 23, 45)", fill: "#fff" }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="price"
            stroke={priceColor}
            name="Price"
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CW5WallChart;
