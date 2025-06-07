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

type AGS3DataPoint = {
  date: string;
  ags3: number;
};

type Props = {
  lookback: number;
};

function AGS3StrikeChart({ lookback }: Props) {
  const [data, setData] = useState<AGS3DataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/ags3-history?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading AGS3 data", err));
  }, [lookback]);

  // Filter and compute min/max
  const Ags3Values = data
    .map((d) => d.ags3)
    .filter((v) => typeof v === "number" && !isNaN(v));

  const minY = Ags3Values.length > 0 ? Math.min(...Ags3Values) : 0;
  const maxY = Ags3Values.length > 0 ? Math.max(...Ags3Values) : 100;
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
            dataKey="ags3"
            stroke="#ff6600"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AGS3StrikeChart;
