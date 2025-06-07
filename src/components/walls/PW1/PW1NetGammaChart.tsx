import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
} from "recharts";

////////////////////////////////////////////////////////////////////////////////
// Ensure you have the correct API base URL set in your environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL; //|| "http://127.0.0.1:8000";

type PutNetGammaChartProps = {
  lookback: number;
};

type NetGammaDataPoint = {
  date: string;
  gamma: number;
};

function PW1NetGammaChart({ lookback }: PutNetGammaChartProps) {
  const [data, setData] = useState<NetGammaDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/pw1-net-gamma?lookback=${lookback}`)
      .then((res) => {
        console.log("PW1 Net Gamma Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading PW1 net gamma data", err));
  }, [lookback]);

  const minGamma = Math.min(...data.map((d) => d.gamma ?? 0));
  const maxGamma = Math.max(...data.map((d) => d.gamma ?? 0));

  return (
    <div className="my-4">
      <h4>Net Put Gamma</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            domain={[minGamma, maxGamma]}
            label={{
              value: "Net Gamma",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
          />
          <Bar
            dataKey="gamma"
            name="Net Gamma"
            fill="#9933cc"
            barSize={14}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PW1NetGammaChart;
