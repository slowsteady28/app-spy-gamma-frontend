import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { Layout } from "plotly.js";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface SPYHourlyData {
  Date: string;
  Time: string;
  "SPY OPEN": number;
  "SPY HIGH": number;
  "SPY LOW": number;
  "SPY CLOSE": number;
  "Volume Z-Score": number;
  "Range (Open - Close) Z-Score": number;
  "Range (High - Low) Z-Score": number;
}

interface SPYHourlyChartProps {
  lookback: number;
}

const SPYHourlyChart: React.FC<SPYHourlyChartProps> = ({ lookback }) => {
  const [data, setData] = useState<SPYHourlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/hourly-spy-price-data?lookback=${lookback}`)
      .then((res) => {
        console.log("Fetched hourly SPY data:", res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching hourly SPY data", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const timestamps = data.map((d) => `${d.Date} ${d.Time}`);
  const open = data.map((d) => d["SPY OPEN"]);
  const high = data.map((d) => d["SPY HIGH"]);
  const low = data.map((d) => d["SPY LOW"]);
  const close = data.map((d) => d["SPY CLOSE"]);

  const layout: Partial<Layout> = {
    dragmode: "zoom",
    showlegend: false,
    title: {
      text: "SPY Hourly OHLC Chart",
      font: {
        size: 20,
        family: "Arial, sans-serif",
      },
      x: 0.5, // Center the title
      xanchor: "center",
    },
    xaxis: {
      title: {
        text: "Date & Time",
        font: { size: 14 },
      },
      type: "category",
      rangeslider: {
        visible: false,
      },
    },
    yaxis: {
      title: {
        text: "Price",
        font: { size: 14 },
      },
      type: "log", // Use logarithmic scale for better visibility
      autorange: true,
      fixedrange: false, // allow zooming and panning
    },
    autosize: true,
    height: 600,
    plot_bgcolor: "#ffffff",
    paper_bgcolor: "#ffffff",
    shapes: [
      {
        type: "circle",
        xref: "x",
        yref: "y",
        x0: "07-07-2025 09:30:00",
        x1: "07-07-2025 11:30:00",
        y0: 621.5,
        y1: 623.5,
        fillcolor: "rgba(0, 0, 255, 0.1)", // light blue across entire chart height
        line: { width: 0 },
      },
    ],
  };

  return loading ? (
    <div className="p-4">Loading hourly SPY chart...</div>
  ) : (
    <Plot
      data={[
        {
          type: "candlestick",
          x: timestamps,
          open,
          high,
          low,
          close,
          name: "SPY",
          increasing: { line: { color: "#4CAF50" } },
          decreasing: { line: { color: "#F44336" } },
        },
      ]}
      layout={layout}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
      config={{
        responsive: true,
        displayModeBar: false,
      }}
    />
  );
};

export default SPYHourlyChart;
