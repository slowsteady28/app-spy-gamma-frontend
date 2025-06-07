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

type AGS2DataPoint = {
  date: string;
  ags2: number;
};

type Props = {
  lookback: number;
};

function AGS2StrikeChart({ lookback }: Props) {
  const [data, setData] = useState<AGS2DataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/ags2-history?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading AGS2 data", err));
  }, [lookback]);

  // Filter and compute min/max
  const Ags2Values = data
    .map((d) => d.ags2)
    .filter((v) => typeof v === "number" && !isNaN(v));

  const minY = Ags2Values.length > 0 ? Math.min(...Ags2Values) : 0;
  const maxY = Ags2Values.length > 0 ? Math.max(...Ags2Values) : 100;
  const buffer = (maxY - minY) * 0.05;

  console.log("Y-Axis Range", { minY, maxY, buffer });

  return (
    <div className="my-4">
      <h4>Absolute Gamma Wall</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis domain={[minY - buffer, maxY + buffer]} />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
          />
          <Line
            type="monotone"
            dataKey="ags2"
            stroke="#ff6600"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AGS2StrikeChart;
