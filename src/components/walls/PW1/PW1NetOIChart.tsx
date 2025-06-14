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

type NetOIChartProps = {
  lookback: number;
  selectedRange: [number, number] | null;
  setSelectedRange: (range: [number, number]) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
};

function PW1NetOIChart({
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
      .get(`${apiBaseUrl}/data/pw1-net-oi?lookback=${lookback}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.error("Error loading PW1 Net OI", err));
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
    <div
      className="my-1"
      style={{
        background: "linear-gradient(90deg, #f8f9fa 60%, #ede7f6 100%)", // Match Put Wall background
        borderRadius: "12px",
        boxShadow: "0 2px 12px 0 rgba(111,66,193,0.07)",
        padding: "1.5rem 1rem",
      }}
    >
      <h4
        className="text-uppercase mb-2 mt-1 ps-2"
        style={{
          letterSpacing: "0.05em",
          fontWeight: 900,
          color: "#6f42c1",
          fontSize: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textShadow: "0 1px 4px rgba(111,66,193,0.08)",
          fontFamily: "'Segoe UI', 'Arial', 'sans-serif'",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "linear-gradient(90deg, #6f42c1 60%, #b39ddb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
            letterSpacing: "0.08em",
          }}
        >
          Net OI Change
        </span>
      </h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={slicedData} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(value) =>
              value?.toLocaleString(undefined, { maximumFractionDigits: 0 })
            }
            tickMargin={12}
            axisLine={{ stroke: "#ccc", strokeWidth: 1 }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: "#6f42c1", strokeWidth: 2, opacity: 0.7 }}
            formatter={tooltipFormatter}
          />
          <Bar dataKey="call_oi" name="Call OI Δ" fill="#6f42c1" barSize={16} />
          <Bar dataKey="put_oi" name="Put OI Δ" fill="#212529" barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PW1NetOIChart;
