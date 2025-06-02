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
const apiBaseUrl = import.meta.env.VITE_API_URL; // || "http://127.0.0.1:8000";

type KGS1DataPoint = {
  date: string;
  kgs1: number;
};

type Props = {
  lookback: number;
};

function KGS1StrikeChart({ lookback }: Props) {
  const [data, setData] = useState<KGS1DataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/kgs1-history?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading KGS1 data", err));
  }, [lookback]);

  // Filter and compute min/max
  const kgs1Values = data
    .map((d) => d.kgs1)
    .filter((v) => typeof v === "number" && !isNaN(v));

  const minY = kgs1Values.length > 0 ? Math.min(...kgs1Values) : 0;
  const maxY = kgs1Values.length > 0 ? Math.max(...kgs1Values) : 100;
  const buffer = (maxY - minY) * 0.05;

  console.log("Y-Axis Range", { minY, maxY, buffer });

  return (
    <div className="my-4">
      <h4>Key Gamma Strike</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis domain={[minY - buffer, maxY + buffer]} />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
          />
          <Line
            type="monotone"
            dataKey="kgs1"
            stroke="#ff6600"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default KGS1StrikeChart;
