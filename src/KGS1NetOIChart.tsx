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

const apiBaseUrl = process.env.REACT_APP_API_URL;

type Props = {
  lookback: number;
};

function KGS1NetOIChart({ lookback }: Props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/kgs1-net-oi?lookback=${lookback}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.error("Error loading KGS1 Net OI", err));
  }, [lookback]);

  return (
    <div className="my-4">
      <h4>Call/Put Open Interest Change</h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
          />
          <Bar dataKey="call_oi" name="Call OI Δ" fill="#33cc33" />
          <Bar dataKey="put_oi" name="Put OI Δ" fill="#cc3333" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default KGS1NetOIChart;
