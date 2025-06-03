import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

////////////////////////////////////////////////////////////////////////////////
// Ensure you have the correct API base URL set in your environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type GammaDataPoint = {
  date: string;
  call_gamma: number;
  put_gamma: number;
};

type Props = {
  lookback: number;
};

function KGS1CallPutGammaChart({ lookback }: Props) {
  const [data, setData] = useState<GammaDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/kgs1-gamma?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading KGS1 gamma data", err));
  }, [lookback]);

  const gammaValues = data
    .flatMap((d) => [d.call_gamma, d.put_gamma])
    .filter((v) => typeof v === "number" && !isNaN(v));
  const minY = gammaValues.length ? Math.min(...gammaValues) : 0;
  const maxY = gammaValues.length ? Math.max(...gammaValues) : 100;
  const buffer = (maxY - minY) * 0.05;

  return (
    <div className="my-4">
      <h4>Call & Put Gamma</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis domain={[minY - buffer, maxY + buffer]} />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
          />
          <Bar dataKey="call_gamma" name="Call Gamma" fill="#007acc" />
          <Bar dataKey="put_gamma" name="Put Gamma" fill="#cc3366" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default KGS1CallPutGammaChart;
