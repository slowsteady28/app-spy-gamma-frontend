import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

interface CandleData {
  Date: string;
  Time: string;
  "SPY OPEN": number;
  "SPY HIGH": number;
  "SPY LOW": number;
  "SPY CLOSE": number;
  "Volume Z-Score": number;
  category?: number;
}

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const categoryColors: { [key: number]: string } = {
  1: "#C8E6C9", // up 0-1 light green
  2: "#A5D6A7", // up 1-2
  3: "#81C784", // up 2-3
  4: "#4CAF50", // up 3-4
  5: "#2E7D32", // up > 4
  6: "#FFCDD2", // down 0-1 light red
  7: "#EF9A9A", // down 1-2
  8: "#E57373", // down 2-3
  9: "#F44336", // down 3-4
  10: "#B71C1C", // down > 4
};

const SPYHourlyChart: React.FC = () => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/hourly-spy-price-data?lookback=9999`)
      .then((res) => {
        const rawData: CandleData[] = res.data;
        const categorized = rawData.map((d) => {
          const isUpClose = d["SPY CLOSE"] > d["SPY OPEN"];
          const z = parseFloat(d["Volume Z-Score"] as any);
          let category = 0;

          if (isUpClose) {
            if (z >= 0 && z < 1) category = 1;
            else if (z >= 1 && z < 2) category = 2;
            else if (z >= 2 && z < 3) category = 3;
            else if (z >= 3 && z < 4) category = 4;
            else if (z >= 4) category = 5;
          } else {
            if (z >= 0 && z < 1) category = 6;
            else if (z >= 1 && z < 2) category = 7;
            else if (z >= 2 && z < 3) category = 8;
            else if (z >= 3 && z < 4) category = 9;
            else if (z >= 4) category = 10;
          }

          return { ...d, category };
        });

        const sorted = categorized.sort(
          (a, b) =>
            new Date(`${a.Date} ${a.Time}`).getTime() -
            new Date(`${b.Date} ${b.Time}`).getTime()
        );

        setData(sorted);
      })
      .catch((err) => console.error("Error fetching hourly SPY data", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  const traces = data.map((d, i) => {
    return {
      type: "candlestick",
      x: [`${d.Date} ${d.Time}`],
      open: [d["SPY OPEN"]],
      high: [d["SPY HIGH"]],
      low: [d["SPY LOW"]],
      close: [d["SPY CLOSE"]],
      name: "",
      increasing: {
        line: { color: categoryColors[d.category || 0] || "#ffffff" },
      },
      decreasing: {
        line: { color: categoryColors[d.category || 0] || "#ffffff" },
      },
      showlegend: false,
    };
  });

  const layout: Partial<Layout> = {
    margin: { l: 55, r: 40, t: 80, b: 140 },
    dragmode: "zoom",
    showlegend: false,
    title: {
      text: "SPY Hourly OHLC Chart",
      font: { size: 20, family: "Arial, sans-serif", color: "#FFFFFF" },
      x: 0.5,
      xanchor: "center",
    },
    xaxis: {
      color: "#FFFFFF",
      type: "category",
      tickangle: -45,
      dtick: 200,
      rangeslider: { visible: false },
    },
    yaxis: {
      color: "#FFFFFF",
      type: "log",
      autorange: true,
      fixedrange: false,
    },
    autosize: true,
    height: 800,
    plot_bgcolor: "#212529",
    paper_bgcolor: "#212529",
    shapes: [
      {
        type: "circle",
        xref: "x",
        yref: "y",
        x0: "07-07-2025 09:30:00",
        x1: "07-07-2025 11:30:00",
        y0: 621.5,
        y1: 623.5,
        fillcolor: "rgba(0, 0, 255, 0.1)",
        line: { width: 0 },
      },
    ],
  };

  if (loading) return <div className="p-4">Loading hourly SPY chart...</div>;

  return (
    <Plot
      data={traces}
      layout={layout}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true, displayModeBar: false }}
    />
  );
};

export default SPYHourlyChart;
