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
  CW5?: number;
  "Percentile Z-Score CW Gamma (Net) CW5"?: number;
  durationD?: number; // Percentile Z-Score Ave Length CW5 (0..1)
}

// Colors
const CW5_DEFAULT = "#33C3F0";
const CW5_NEON_GREEN = "#39FF14";
const CW5_REDDISH = "#FFCDD2";
const NEON_VIOLET = "#9D00FF"; // Duration low-ring
const NEON_ORANGE = "#FFAE00"; // Duration high-ring

interface SPYHourlyChartProps {
  lookback: number; // 25 | 50 | 100 | 200 | 400
}

const categoryColors: { [key: number]: string } = {
  1: "#333333",
  2: "#A5D6A7",
  3: "#81C784",
  4: "#4CAF50",
  5: "#2E7D32",
  6: "#333333",
  7: "#EF9A9A",
  8: "#E57373",
  9: "#F44336",
  10: "#B71C1C",
  11: "#333333",
  12: "#e5ed47",
  13: "#e5ed47",
  14: "#e0eb0c",
  15: "#e0eb0c",
  16: "#333333",
  17: "#e5ed47",
  18: "#e5ed47",
  19: "#e0eb0c",
  20: "#e0eb0c",
  21: "#1BFFFF",
  22: "#1BFFFF",
};

type DurationMode = "low" | "high" | "both";

const SPYHourlyChart: React.FC<SPYHourlyChartProps> = ({ lookback }) => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state for controls
  const [showCallWall, setShowCallWall] = useState(true);
  const [percentileLow, setPercentileLow] = useState(0.11); // ≤ low -> red
  const [percentileHigh, setPercentileHigh] = useState(0.89); // ≥ high -> green

  const [showDurationRings, setShowDurationRings] = useState(true);
  const [durationMode, setDurationMode] = useState<DurationMode>("both");
  const [durationLow, setDurationLow] = useState(0.11); // D ≤ low -> violet ring
  const [durationHigh, setDurationHigh] = useState(0.89); // D ≥ high -> orange ring

  // Helpers to keep thresholds sane
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const onPercentileLow = (v: number) => {
    const x = clamp01(v);
    if (x >= percentileHigh) setPercentileHigh(Math.min(1, x + 0.01));
    setPercentileLow(x);
  };
  const onPercentileHigh = (v: number) => {
    const x = clamp01(v);
    if (x <= percentileLow) setPercentileLow(Math.max(0, x - 0.01));
    setPercentileHigh(x);
  };
  const onDurationLow = (v: number) => setDurationLow(clamp01(v));
  const onDurationHigh = (v: number) => setDurationHigh(clamp01(v));

  // Dynamic color function using current percentile thresholds
  const colorForPercentile = (p?: number) => {
    if (p == null || Number.isNaN(p)) return CW5_DEFAULT;
    if (p >= percentileHigh) return CW5_NEON_GREEN;
    if (p <= percentileLow) return CW5_REDDISH;
    return CW5_DEFAULT;
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiBaseUrl}/hourly-spy-price-data?lookback=${lookback}`)
      .then((res) => {
        const rawData: CandleData[] = res.data;

        const categorized = rawData.map((d) => {
          const isUpClose = d["SPY CLOSE"] >= d["SPY OPEN"];
          const volumeZ = parseFloat(d["Volume Z-Score"] as any);
          const rangeZ = parseFloat(d["Range (Open - Close) Z-Score"] as any);
          const rangeX = parseFloat(d["Range (High - Low) Z-Score"] as any);

          const percentile = parseFloat(
            (d as any)["Percentile Z-Score CW Gamma (Net) CW5"] as any
          );
          const durationD = parseFloat(
            (d as any)["Percentile Z-Score Ave Length CW5"] as any
          );

          let category = 0;
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

          if (rangeZ >= -0.02 && rangeZ <= 0.02) category = 21;
          if (rangeX >= 1) category = 22;

          return {
            ...d,
            category,
            "Percentile Z-Score CW Gamma (Net) CW5": percentile,
            durationD,
          };
        });

        // Sort by datetime
        const sorted = categorized.sort(
          (a, b) =>
            new Date(`${a.Date} ${a.Time}`).getTime() -
            new Date(`${b.Date} ${b.Time}`).getTime()
        );

        // Client-side lookback (by trading days)
        const uniqueDates: string[] = [];
        for (const row of sorted) {
          if (
            uniqueDates.length === 0 ||
            uniqueDates[uniqueDates.length - 1] !== row.Date
          ) {
            uniqueDates.push(row.Date);
          }
        }
        const allowedDates = new Set(uniqueDates.slice(-Math.max(1, lookback)));
        const filtered = sorted.filter((row) => allowedDates.has(row.Date));

        setData(filtered);
      })
      .catch((err) => console.error("Error fetching hourly SPY data", err))
      .finally(() => setLoading(false));
  }, [lookback]);

  if (loading) return <div>Loading...</div>;
  if (!data.length) return <div>No data</div>;

  // Candlestick traces (one per bar)
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

  // Per-date start/end times
  const timeRangeMap: { [date: string]: { start: string; end: string } } = {};
  data.forEach((d) => {
    if (!timeRangeMap[d.Date]) {
      timeRangeMap[d.Date] = { start: d.Time, end: d.Time };
    } else {
      if (
        new Date(`${d.Date} ${d.Time}`) <
        new Date(`${d.Date} ${timeRangeMap[d.Date].start}`)
      )
        timeRangeMap[d.Date].start = d.Time;
      if (
        new Date(`${d.Date} ${d.Time}`) >
        new Date(`${d.Date} ${timeRangeMap[d.Date].end}`)
      )
        timeRangeMap[d.Date].end = d.Time;
    }
  });

  // Unique CW5 per date + percentile
  const cw5ShapesMap: { [date: string]: { cw5: number; p?: number } } = {};
  data.forEach((d) => {
    if (typeof d.CW5 === "number" && !(d.Date in cw5ShapesMap)) {
      cw5ShapesMap[d.Date] = {
        cw5: d.CW5,
        p: d["Percentile Z-Score CW Gamma (Net) CW5"],
      };
    }
  });

  // Daily min/max for rings
  const dailyPriceRange: {
    [date: string]: { minLow: number; maxHigh: number };
  } = {};
  data.forEach((d) => {
    const cur = dailyPriceRange[d.Date];
    if (!cur)
      dailyPriceRange[d.Date] = {
        minLow: d["SPY LOW"],
        maxHigh: d["SPY HIGH"],
      };
    else {
      if (d["SPY LOW"] < cur.minLow) cur.minLow = d["SPY LOW"];
      if (d["SPY HIGH"] > cur.maxHigh) cur.maxHigh = d["SPY HIGH"];
    }
  });

  // Identify days to ring using duration thresholds + mode
  const dayNeedsRingLowD = new Set<string>();
  const dayNeedsRingHighD = new Set<string>();
  const seenFirstBar = new Set<string>();
  for (const d of data) {
    if (!seenFirstBar.has(d.Date)) {
      seenFirstBar.add(d.Date);
      const D = d.durationD;
      if (Number.isFinite(D)) {
        if (
          (durationMode === "low" || durationMode === "both") &&
          (D as number) <= durationLow
        ) {
          dayNeedsRingLowD.add(d.Date);
        }
        if (
          (durationMode === "high" || durationMode === "both") &&
          (D as number) >= durationHigh
        ) {
          dayNeedsRingHighD.add(d.Date);
        }
      }
    }
  }

  // CW5 daily horizontal line shapes (color reacts to sliders)
  const cw5DailyShapes: Partial<Shape>[] = Object.entries(cw5ShapesMap)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, { cw5, p }]) => {
      const tr = timeRangeMap[date];
      if (!tr) return null;
      return {
        type: "line",
        xref: "x",
        yref: "y",
        x0: `${date} ${tr.start}`,
        x1: `${date} ${tr.end}`,
        y0: cw5,
        y1: cw5,
        line: { color: colorForPercentile(p), width: 2, dash: "solid" },
      } as Partial<Shape>;
    })
    .filter(Boolean) as Partial<Shape>[];

  // Build duration rings
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
      const y0 = Math.max(0.000001, yMin - pad); // log axis safe
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
        fillcolor: "rgba(0,0,0,0)",
        layer: "above",
      });
    }
    return rings;
  };

  const dayRingsLowD = showDurationRings
    ? buildDayRings(dayNeedsRingLowD, NEON_VIOLET)
    : [];
  const dayRingsHighD = showDurationRings
    ? buildDayRings(dayNeedsRingHighD, NEON_ORANGE)
    : [];

  // Combine shapes
  const shapes: Partial<Shape>[] = [
    ...(showCallWall ? cw5DailyShapes : []),
    ...dayRingsLowD,
    ...dayRingsHighD,
  ];

  // CW5 line data for colored bands + connector (bands react to sliders)
  const cw5LineData = data
    .filter((d) => typeof d.CW5 === "number")
    .map((d) => ({
      x: `${d.Date} ${d.Time}`,
      y: d.CW5 as number,
      p: d["Percentile Z-Score CW Gamma (Net) CW5"],
    }));

  const cw5Connector: Partial<PlotData> = {
    type: "scatter",
    mode: "lines",
    name: "CW5 connector",
    x: cw5LineData.map((d) => d.x),
    y: cw5LineData.map((d) => d.y),
    line: { color: CW5_DEFAULT, width: 1 },
    hoverinfo: "skip" as const,
    showlegend: false,
  };

  const makeCw5Trace = (
    label: string,
    color: string,
    predicate: (p?: number) => boolean
  ): Partial<PlotData> => ({
    type: "scatter",
    mode: "lines+markers",
    name: label,
    x: cw5LineData.map((d) => (predicate(d.p) ? d.x : null)) as any,
    y: cw5LineData.map((d) => (predicate(d.p) ? d.y : null)) as any,
    line: { color, width: 1, dash: "dot" },
    marker: { size: 4, color },
    hoverinfo: "x+y+name" as const,
    connectgaps: false,
    showlegend: false,
  });

  const cw5High = makeCw5Trace(
    `CW5 ≥ ${(percentileHigh * 100).toFixed(0)}th pct`,
    CW5_NEON_GREEN,
    (p) => (p ?? -1) >= percentileHigh
  );
  const cw5Low = makeCw5Trace(
    `CW5 ≤ ${(percentileLow * 100).toFixed(0)}th pct`,
    CW5_REDDISH,
    (p) => (p ?? 1) <= percentileLow
  );
  const cw5Mid = makeCw5Trace(
    `CW5 mid`,
    CW5_DEFAULT,
    (p) => p != null && p > percentileLow && p < percentileHigh
  );

  // Layout
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

  // Build Plot data with toggles
  const plotSeries: Partial<PlotData | CandlestickData>[] = [...traces];
  if (showCallWall) {
    plotSeries.push(cw5Connector, cw5High, cw5Mid, cw5Low);
  }

  // Control panel (simple HTML controls; no extra deps)
  const controls = (
    <div
      style={{
        marginTop: 8,
        background: "rgba(17,17,17,0.85)",
        border: "1px solid #0096b4",
        borderRadius: 8,
        padding: "10px 12px",
        color: "#fff",
        fontSize: 12,
        minWidth: 260,
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Overlays</div>

      <div style={{ display: "grid", gap: 8 }}>
        {/* CW5 Percentile */}
        <div style={{ borderBottom: "1px solid #2a2a2a", paddingBottom: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={showCallWall}
              onChange={(e) => setShowCallWall(e.target.checked)}
            />
            <span>
              Show Call Wall overlays (bands + connector + daily line)
            </span>
          </label>

          <div style={{ marginTop: 8, opacity: showCallWall ? 1 : 0.5 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Low threshold</span>
              <strong>{(percentileLow * 100).toFixed(0)}%</strong>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={percentileLow}
              onChange={(e) => onPercentileLow(parseFloat(e.target.value))}
              style={{ width: "100%" }}
              disabled={!showCallWall}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <span>High threshold</span>
              <strong>{(percentileHigh * 100).toFixed(0)}%</strong>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={percentileHigh}
              onChange={(e) => onPercentileHigh(parseFloat(e.target.value))}
              style={{ width: "100%" }}
              disabled={!showCallWall}
            />
          </div>
        </div>

        {/* Duration Rings */}
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={showDurationRings}
              onChange={(e) => setShowDurationRings(e.target.checked)}
            />
            <span>Show Duration rings</span>
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 6,
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>Mode</span>
            <select
              value={durationMode}
              onChange={(e) => setDurationMode(e.target.value as DurationMode)}
              style={{
                flex: 1,
                background: "#111",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: 6,
                padding: "2px 6px",
              }}
            >
              <option value="both">Both</option>
              <option value="low">Low only</option>
              <option value="high">High only</option>
            </select>
          </div>

          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Low D ≤</span>
              <strong>{(durationLow * 100).toFixed(0)}%</strong>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={durationLow}
              onChange={(e) => onDurationLow(parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <span>High D ≥</span>
              <strong>{(durationHigh * 100).toFixed(0)}%</strong>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={durationHigh}
              onChange={(e) => onDurationHigh(parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      <Plot
        data={plotSeries}
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
      <div> {controls}</div>
    </div>
  );
};

export default SPYHourlyChart;
