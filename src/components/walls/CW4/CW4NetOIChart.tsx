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
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type NetOIChartProps = {
  lookback: number;
  selectedRange: [number, number] | null;
  setSelectedRange: (range: [number, number]) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
};

function CW4NetOIChart({
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
      .get(`${apiBaseUrl}/data/cw4-net-oi?lookback=${lookback}`)
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

  // Custom tooltip formatter for commas
  const tooltipFormatter = (value: number) =>
    value?.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="my-4">
      <h4
        className="text-uppercase text-secondary small mb-2 mt-3 ps-2"
        style={{
          letterSpacing: "0.05em",
          fontWeight: 700,
        }}
      >
        Change in Open Interest (Δ OI)
      </h4>
      <ResponsiveContainer width="100%" height={400} key={containerWidth}>
        <BarChart data={slicedData} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(value) =>
              value?.toLocaleString(undefined, { maximumFractionDigits: 0 })
            }
          />
          <Tooltip
            cursor={{
              stroke: "rgb(191, 23, 45)",
              strokeWidth: 2,
              opacity: 0.7,
            }}
            formatter={tooltipFormatter}
          />
          <Bar dataKey="call_oi" fill="green" name="Call OI Δ" barSize={16} />
          <Bar dataKey="put_oi" fill="red" name="Put OI Δ" barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CW4NetOIChart;
