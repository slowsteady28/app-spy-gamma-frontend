import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import { Layout, CandlestickData, Shape } from "plotly.js";

interface CandleData {
  Date: string;
  Time: string;
  "SPY OPEN": number;
  "SPY HIGH": number;
  "SPY LOW": number;
  "SPY CLOSE": number;
  "Volume Z-Score": number;
  category?: number;
  "Range (Open - Close) Z-Score": number;
  "Range (High - Low) Z-Score": number;
  CW1?: number;
}

interface SPYHourlyChartProps {
  lookback: number;
}

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const categoryColors: { [key: number]: string } = {
  1: "#333333", // up 0-1
  2: "#A5D6A7", // up 1-2
  3: "#81C784", // up 2-3
  4: "#4CAF50", // up 3-4
  5: "#2E7D32", // up >4

  6: "#333333", // down 0-1
  7: "#EF9A9A", // down 1-2
  8: "#E57373", // down 2-3
  9: "#F44336", // down 3-4
  10: "#B71C1C", // down >4

  11: "#333333", // up -1 to 0
  12: "#e5ed47", // up -2 to -1
  13: "#e5ed47", // up -3 to -2
  14: "#e0eb0c", // up -4 to -3
  15: "#e0eb0c", // up < -4

  16: "#333333", // down -1 to 0
  17: "#e5ed47", // down -2 to -1
  18: "#e5ed47", // down -3 to -2
  19: "#e0eb0c", // down -4 to -3
  20: "#e0eb0c", // down < -4

  21: "#1BFFFF", // neon blue for small body candles
  22: "#1BFFFF", // neon blue for small range candles
};

const SPYHourlyChart: React.FC<SPYHourlyChartProps> = ({ lookback }) => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/hourly-spy-price-data?lookback=${lookback}`)
      .then((res) => {
        const rawData: CandleData[] = res.data;

        const categorized = rawData.map((d) => {
          const isUpClose = d["SPY CLOSE"] >= d["SPY OPEN"];
          const volumeZ = parseFloat(d["Volume Z-Score"] as any);
          const rangeZ = parseFloat(d["Range (Open - Close) Z-Score"] as any);
          const rangeX = parseFloat(d["Range (High - Low) Z-Score"] as any);
          let category = 0;

          // Volume Z-Score based categories
          if (isUpClose) {
            if (volumeZ >= 0 && volumeZ < 1) category = 1;
            else if (volumeZ >= 1 && volumeZ < 2) category = 2;
            else if (volumeZ >= 2 && volumeZ < 3) category = 3;
            else if (volumeZ >= 3 && volumeZ < 4) category = 4;
            else if (volumeZ >= 4) category = 5;
            else if (volumeZ < 0 && volumeZ >= -1) category = 11;
            else if (volumeZ < -1 && volumeZ >= -2) category = 12;
            else if (volumeZ < -2 && volumeZ >= -3) category = 13;
            else if (volumeZ < -3 && volumeZ >= -4) category = 14;
            else if (volumeZ < -4) category = 15;
          } else {
            if (volumeZ >= 0 && volumeZ < 1) category = 6;
            else if (volumeZ >= 1 && volumeZ < 2) category = 7;
            else if (volumeZ >= 2 && volumeZ < 3) category = 8;
            else if (volumeZ >= 3 && volumeZ < 4) category = 9;
            else if (volumeZ >= 4) category = 10;
            else if (volumeZ < 0 && volumeZ >= -1) category = 16;
            else if (volumeZ < -1 && volumeZ >= -2) category = 17;
            else if (volumeZ < -2 && volumeZ >= -3) category = 18;
            else if (volumeZ < -3 && volumeZ >= -4) category = 19;
            else if (volumeZ < -4) category = 20;
          }

          // Range (Open - Close) Z-Score check — overrides above
          if (rangeZ >= -0.02 && rangeZ <= 0.02) {
            category = 21;
          }

          // Range (High - Low) Z-Score check
          if (rangeX >= 1) {
            category = 22; // very small range candle
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

  const traces: Partial<CandlestickData>[] = data.map((d) => ({
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
    text: [
      `${d.Date} ${d.Time}<br>O: ${d["SPY OPEN"]}<br>H: ${d["SPY HIGH"]}<br>L: ${d["SPY LOW"]}<br>C: ${d["SPY CLOSE"]}<br>VolZ: ${d["Volume Z-Score"]}`,
    ],
    hoverinfo: "text",
    showlegend: false,
  }));

  // Get unique CW1 per date
  const cw1ShapesMap: { [date: string]: number } = {};
  data.forEach((d) => {
    if (typeof d.CW1 === "number" && !(d.Date in cw1ShapesMap)) {
      cw1ShapesMap[d.Date] = d.CW1;
    }
  });

  // Build a map of start and end times per date
  const timeRangeMap: { [date: string]: { start: string; end: string } } = {};
  data.forEach((d) => {
    if (!timeRangeMap[d.Date]) {
      timeRangeMap[d.Date] = { start: d.Time, end: d.Time };
    } else {
      if (
        new Date(`${d.Date} ${d.Time}`) <
        new Date(`${d.Date} ${timeRangeMap[d.Date].start}`)
      ) {
        timeRangeMap[d.Date].start = d.Time;
      }
      if (
        new Date(`${d.Date} ${d.Time}`) >
        new Date(`${d.Date} ${timeRangeMap[d.Date].end}`)
      ) {
        timeRangeMap[d.Date].end = d.Time;
      }
    }
  }); // ✅ This was missing!

  // Now create shapes using actual time ranges
  const shapes: Partial<Shape>[] = Object.entries(cw1ShapesMap)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, cw1]) => {
      const timeRange = timeRangeMap[date];
      if (!timeRange) return null;
      return {
        type: "line",
        xref: "x",
        yref: "y",
        x0: `${date} ${timeRange.start}`,
        x1: `${date} ${timeRange.end}`,
        y0: cw1,
        y1: cw1,
        line: {
          color: "lightblue",
          width: 1,
          dash: "solid",
        },
      };
    })
    .filter(Boolean) as Partial<Shape>[];

  const cw1LineData = data
    .filter((d) => typeof d.CW1 === "number")
    .map((d) => ({
      x: `${d.Date} ${d.Time}`,
      y: d.CW1,
    }));

  const cw1Trace: Partial<Plotly.ScatterData> = {
    type: "scatter",
    mode: "lines+markers",
    name: "CW1",
    x: cw1LineData.map((d) => d.x),
    y: cw1LineData
      .map((d) => d.y)
      .filter((y): y is number => typeof y === "number"), // removes undefined/null
    line: {
      color: "#33C3F0",
      width: 2,
      dash: "dot", // ✅ Type-safe literal
    },
    marker: {
      size: 2,
      color: "#33C3F0",
    },
  };

  const layout: Partial<Layout> = {
    margin: { l: 55, r: 40, t: 80, b: 10 },
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
      visible: false,
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
    shapes, // <-- add this line to include CW1 horizontal lines
  };

  return (
    <Plot
      data={[...traces, cw1Trace]}
      layout={layout}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
      config={{
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        editable: true, // <-- allows shape editing
        modeBarButtonsToAdd: ["drawline", "eraseshape"] as any,
        modeBarButtonsToRemove: ["zoom2d", "select2d", "lasso2d"],
      }}
    />
  );
};

export default SPYHourlyChart;
