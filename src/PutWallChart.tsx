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

const apiBaseUrl = process.env.REACT_APP_API_URL;

type PutWallChartProps = {
  lookback: number;
  selectedRange: [number, number] | null;
  setSelectedRange: (range: [number, number]) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
};

type PW1DataPoint = {
  date: string;
  pw1: number;
};

function PutWallChart({
  lookback,
  selectedRange,
  setSelectedRange,
  activeIndex,
  setActiveIndex,
}: PutWallChartProps) {
  const [data, setData] = useState<PW1DataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/pw1-history?lookback=${lookback}`)
      .then((res) => {
        console.log("Put Wall Chart Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading PW1 data", err));
  }, [lookback]);

  const minPW1 = Math.min(...data.map((d) => d.pw1));
  const maxPW1 = Math.max(...data.map((d) => d.pw1));

  return (
    <div className="my-4">
      <h4>Put Wall</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            domain={[minPW1, maxPW1]}
            label={{
              value: "Put Wall (PW1)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
          />
          <Line
            type="monotone"
            dataKey="pw1"
            stroke="purple"
            name="PW1"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PutWallChart;
