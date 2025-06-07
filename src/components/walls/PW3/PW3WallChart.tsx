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
const apiBaseUrl = import.meta.env.VITE_API_URL; //|| "http://127.0.0.1:8000";

type PutWallChartProps = {
  lookback: number;
  selectedRange: [number, number] | null;
  setSelectedRange: (range: [number, number]) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
};

type PW3DataPoint = {
  date: string;
  pw3: number;
};

function PW3WallChart({
  lookback,
  selectedRange,
  setSelectedRange,
  activeIndex,
  setActiveIndex,
}: PutWallChartProps) {
  const [data, setData] = useState<PW3DataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/pw3-history?lookback=${lookback}`)
      .then((res) => {
        console.log("Put Wall Chart Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading PW3 data", err));
  }, [lookback]);

  const minPW3 = Math.min(...data.map((d) => d.pw3));
  const maxPW3 = Math.max(...data.map((d) => d.pw3));

  return (
    <div className="my-4">
      <h4>Put Wall</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            domain={[minPW3, maxPW3]}
            label={{
              value: "Put Wall (PW3)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
          />
          <Line
            type="monotone"
            dataKey="pw3"
            stroke="purple"
            name="PW3"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PW3WallChart;
