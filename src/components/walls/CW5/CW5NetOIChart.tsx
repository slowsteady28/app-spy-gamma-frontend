import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

////////////////////////////////////////////////////////////////////////////////
// Ensure you have the correct API base URL set in your environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL; //|| "http://127.0.0.1:8000";

type NetOIChartProps = {
  lookback: number;
  selectedRange: [number, number] | null;
  setSelectedRange: (range: [number, number]) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
};

function CW5NetOIChart({
  lookback,
  selectedRange,
  setSelectedRange,
  activeIndex,
  setActiveIndex,
}: NetOIChartProps) {
  const [data, setData] = useState([]);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw5-net-oi?lookback=${lookback}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.error("Error loading OI data", err));
  }, [lookback]);

  useEffect(() => {
    const handleResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slicedData = selectedRange
    ? data.slice(selectedRange[0], selectedRange[1] + 1)
    : data;

  return (
    <div className="my-4">
      <h4>Call/Put Open Interest Change</h4>
      <ResponsiveContainer width="100%" height={400} key={containerWidth}>
        <BarChart data={slicedData} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            cursor={{ stroke: "orange", strokeWidth: 2, opacity: 0.7 }}
          />
          <Bar dataKey="call_oi" fill="green" name="Call OI Δ" barSize={16} />
          <Bar dataKey="put_oi" fill="red" name="Put OI Δ" barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CW5NetOIChart;
