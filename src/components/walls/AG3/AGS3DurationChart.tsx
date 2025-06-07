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
const apiBaseUrl = import.meta.env.VITE_API_URL; //|| "http://127.0.0.1:8000";

type Props = {
  lookback: number;
};

function AGS3DurationChart({ lookback }: Props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/ags3-duration?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading AGS3 Duration", err));
  }, [lookback]);

  return (
    <div className="my-4">
      <h4>Call & Put Gamma Duration</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
          />
          <Bar dataKey="call_duration" name="Call Duration" fill="#3366cc" />
          <Bar dataKey="put_duration" name="Put Duration" fill="#cc3366" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AGS3DurationChart;
