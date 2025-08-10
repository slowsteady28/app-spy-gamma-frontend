import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import { Layout, CandlestickData, Shape, PlotData } from "plotly.js";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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
  "Percentile Z-Score CW Gamma (Net) CW1"?: number;
  durationD?: number; // Percentile Z-Score Ave Length CW1 (0..1)
}

// Color constants
const CW1_DEFAULT = "#33C3F0"; // blue
const CW1_NEON_GREEN = "#39FF14"; // neon green
const CW1_REDDISH = "#FFCDD2"; // soft reddish
const NEON_VIOLET = "#9D00FF"; // neon violet ring (low D)
const NEON_ORANGE = "#FFAE00"; // neon orange ring (high D)

const getCW1Color = (p?: number) => {
  if (p == null || Number.isNaN(p)) return CW1_DEFAULT;
  if (p >= 0.89) return CW1_NEON_GREEN;
  if (p <= 0.11) return CW1_REDDISH;
  return CW1_DEFAULT;
};

interface SPYHourlyChartProps {
  lookback: number; // number of trading days to show (25/50/100/200/400)
}

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
    setLoading(true);
    axios
      .get(`${apiBaseUrl}/hourly-spy-price-data?lookback=${lookback}`)
      .then((res) => {
        const rawData: CandleData[] = res.data;

        // Normalize/derive fields
        const categorized = rawData.map((d) => {
          const isUpClose = d["SPY CLOSE"] >= d["SPY OPEN"];
          const volumeZ = parseFloat(d["Volume Z-Score"] as any);
          const rangeZ = parseFloat(d["Range (Open - Close) Z-Score"] as any);
          const rangeX = parseFloat(d["Range (High - Low) Z-Score"] as any);

          // Parse percentile fields
          const percentile = parseFloat(
            (d as any)["Percentile Z-Score CW Gamma (Net) CW1"] as any
          );
          const durationD = parseFloat(
            (d as any)["Percentile Z-Score Ave Length CW1"] as any
          ); // 0..1 percentile fraction

          let category = 0;

          // Volume Z-Score categories
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

          // Small body override
          if (rangeZ >= -0.02 && rangeZ <= 0.02) {
            category = 21;
          }

          // Small range override
          if (rangeX >= 1) {
            category = 22;
          }

          return {
            ...d,
            category,
            "Percentile Z-Score CW Gamma (Net) CW1": percentile,
            durationD,
          };
        });

        // Sort by datetime ASC
        const sorted = categorized.sort(
          (a, b) =>
            new Date(`${a.Date} ${a.Time}`).getTime() -
            new Date(`${b.Date} ${b.Time}`).getTime()
        );

        // --- CLIENT-SIDE LOOKBACK (by trading days) ---
        // Build ordered list of unique dates from sorted rows
        const uniqueDates: string[] = [];
        for (const row of sorted) {
          if (
            uniqueDates.length === 0 ||
            uniqueDates[uniqueDates.length - 1] !== row.Date
          ) {
            uniqueDates.push(row.Date);
          }
        }

        // Keep only the last {lookback} dates
        const allowedDates = new Set(
          uniqueDates.slice(-Math.max(1, lookback)) // guard against zero/negative
        );

        const filtered = sorted.filter((row) => allowedDates.has(row.Date));
        setData(filtered);
      })
      .catch((err) => console.error("Error fetching hourly SPY data", err))
      .finally(() => setLoading(false));
  }, [lookback]);

  if (loading) return <div>Loading...</div>;
  if (!data.length) return <div>No data</div>;

  // Build candlestick traces (one per bar)
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

  // Unique CW1 per date + its percentile (first seen per day in filtered data)
  const cw1ShapesMap: { [date: string]: { cw1: number; p?: number } } = {};
  data.forEach((d) => {
    if (typeof d.CW1 === "number" && !(d.Date in cw1ShapesMap)) {
      cw1ShapesMap[d.Date] = {
        cw1: d.CW1,
        p: d["Percentile Z-Score CW Gamma (Net) CW1"],
      };
    }
  });

  // Per-date start/end times (span of the trading day in the filtered dataset)
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
  });

  // Daily min/max (filtered)
  const dailyPriceRange: {
    [date: string]: { minLow: number; maxHigh: number };
  } = {};
  data.forEach((d) => {
    const cur = dailyPriceRange[d.Date];
    if (!cur) {
      dailyPriceRange[d.Date] = {
        minLow: d["SPY LOW"],
        maxHigh: d["SPY HIGH"],
      };
    } else {
      if (d["SPY LOW"] < cur.minLow) cur.minLow = d["SPY LOW"];
      if (d["SPY HIGH"] > cur.maxHigh) cur.maxHigh = d["SPY HIGH"];
    }
  });

  // Identify days to ring based on first bar in filtered data
  // - Low Duration (<= 11th percentile): NEON_VIOLET
  // - High Duration (>= 89th percentile): NEON_ORANGE
  const dayNeedsRingLowD = new Set<string>();
  const dayNeedsRingHighD = new Set<string>();
  const seenFirstBar = new Set<string>();

  for (const d of data) {
    if (!seenFirstBar.has(d.Date)) {
      seenFirstBar.add(d.Date);
      const D = d.durationD;
      if (Number.isFinite(D) && (D as number) <= 0.11)
        dayNeedsRingLowD.add(d.Date);
      if (Number.isFinite(D) && (D as number) >= 0.89)
        dayNeedsRingHighD.add(d.Date);
    }
  }

  // CW1 daily horizontal line shapes (color by percentile)
  const cw1DailyShapes: Partial<Shape>[] = Object.entries(cw1ShapesMap)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, { cw1, p }]) => {
      const tr = timeRangeMap[date];
      if (!tr) return null;
      return {
        type: "line",
        xref: "x",
        yref: "y",
        x0: `${date} ${tr.start}`,
        x1: `${date} ${tr.end}`,
        y0: cw1,
        y1: cw1,
        line: { color: getCW1Color(p), width: 2, dash: "solid" },
      } as Partial<Shape>;
    })
    .filter(Boolean) as Partial<Shape>[];

  // Neon rings around the day's candles
  const buildDayRings = (
    dates: Set<string>,
    color: string
  ): Partial<Shape>[] => {
    const rings: Partial<Shape>[] = [];
    for (const date of dates) {
      const tr = timeRangeMap[date];
      const pr = dailyPriceRange[date];
      if (!tr || !pr) continue;

      const yMin = pr.minLow;
      const yMax = pr.maxHigh;
      const pad = (yMax - yMin) * 0.02 || 0.1;
      const y0 = Math.max(0, yMin - pad);
      const y1 = yMax + pad;

      rings.push({
        type: "rect",
        xref: "x",
        yref: "y",
        x0: `${date} ${tr.start}`,
        x1: `${date} ${tr.end}`,
        y0,
        y1,
        line: { color, width: 2 },
        fillcolor: "rgba(0,0,0,0)", // pure ring; change alpha if you want a halo
        layer: "above",
      });
    }
    return rings;
  };

  const dayRingsLowD = buildDayRings(dayNeedsRingLowD, NEON_VIOLET);
  const dayRingsHighD = buildDayRings(dayNeedsRingHighD, NEON_ORANGE);

  // Combine shapes
  const shapes: Partial<Shape>[] = [
    ...cw1DailyShapes,
    ...dayRingsLowD,
    ...dayRingsHighD,
  ];

  // CW1 line data (x,y,p) for colored segments + connector
  const cw1LineData = data
    .filter((d) => typeof d.CW1 === "number")
    .map((d) => ({
      x: `${d.Date} ${d.Time}`,
      y: d.CW1 as number,
      p: d["Percentile Z-Score CW Gamma (Net) CW1"],
    }));

  // Connector line for continuity
  const cw1Connector: Partial<PlotData> = {
    type: "scatter",
    mode: "lines",
    name: "CW1 connector",
    x: cw1LineData.map((d) => d.x),
    y: cw1LineData.map((d) => d.y),
    line: { color: CW1_DEFAULT, width: 1 },
    hoverinfo: "skip" as const,
    showlegend: false,
  };

  const makeCw1Trace = (
    label: string,
    color: string,
    predicate: (p?: number) => boolean
  ): Partial<PlotData> => ({
    type: "scatter",
    mode: "lines+markers",
    name: label,
    x: cw1LineData.map((d) => (predicate(d.p) ? d.x : null)) as any,
    y: cw1LineData.map((d) => (predicate(d.p) ? d.y : null)) as any,
    line: { color, width: 1, dash: "dot" },
    marker: { size: 4, color },
    hoverinfo: "x+y+name" as const,
    connectgaps: false,
    showlegend: false,
  });

  const cw1High = makeCw1Trace(
    "CW1 ≥ 89th pct",
    CW1_NEON_GREEN,
    (p) => (p ?? -1) >= 0.89
  );
  const cw1Low = makeCw1Trace(
    "CW1 ≤ 11th pct",
    CW1_REDDISH,
    (p) => (p ?? 1) <= 0.11
  );
  const cw1Mid = makeCw1Trace(
    "CW1",
    CW1_DEFAULT,
    (p) => p != null && p > 0.11 && p < 0.89
  );

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
      showspikes: true,
      spikemode: "across",
      spikesnap: "cursor",
      spikedash: "solid",
      spikethickness: 1,
      spikecolor: "#888",
    },
    yaxis: {
      color: "#FFFFFF",
      type: "log",
      autorange: true,
      fixedrange: false,
      showspikes: true,
      spikemode: "across",
      spikedash: "solid",
    },
    autosize: true,
    height: 800,
    plot_bgcolor: "#212529",
    paper_bgcolor: "#212529",
    shapes,
  };

  return (
    <Plot
      data={[...traces, cw1Connector, cw1High, cw1Mid, cw1Low]}
      layout={{ ...layout, shapes }}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
      config={{
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        editable: true,
        modeBarButtonsToAdd: ["drawline", "eraseshape"] as any,
        modeBarButtonsToRemove: ["zoom2d", "select2d", "lasso2d"],
      }}
    />
  );
};

export default SPYHourlyChart;
