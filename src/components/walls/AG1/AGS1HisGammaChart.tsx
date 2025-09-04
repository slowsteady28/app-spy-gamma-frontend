import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import type { Layout } from "plotly.js";
import { expirationLines } from "../utils/expirationDates";
import { useChartSync } from "../../../context/ChartSyncContext";
import * as PlotlyJS from "plotly.js-dist-min";

// ✅ Simple cast
const Plotly: any = PlotlyJS;

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Props = {
  lookback: number;
};

type Row = {
  date: string;
  ags1: number | null;
  open: number;
  high: number;
  low: number;
  close: number;
  gamma_flip?: number | null;
  cw1?: number | null;
  pw1?: number | null;
};

const AGS1HisGammaChart = ({ lookback }: Props) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---- Filters / Toggles (mirrors CW1) -------------------------------------
  const [expirationType, setExpirationType] = useState<
    "Monthly" | "Quarterly" | "Both" | "None"
  >("Both");
  const [showGammaFlip, setShowGammaFlip] = useState<boolean>(true);
  const [showLargestCW, setShowLargestCW] = useState<boolean>(true);
  const [showLargestPW, setShowLargestPW] = useState<boolean>(true);
  // --------------------------------------------------------------------------

  const chartRef = useRef<any>(null);
  const chartSyncContext = useChartSync();
  const hoveredDate = chartSyncContext?.hoveredDate || null;
  const setHoveredDate = chartSyncContext?.setHoveredDate || (() => {});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${apiBaseUrl}/data/ags1-history?lookback=${lookback}`
        );
        const raw = response.data;

        const formatted: Row[] = raw.map((d: any) => ({
          date: d.date ?? d.Date,
          ags1: d.ags1 ?? d.AGS1 ?? null,
          open: Number(d["SPY OPEN"] ?? d.open),
          high: Number(d["SPY HIGH"] ?? d.high),
          low: Number(d["SPY LOW"] ?? d.low),
          close: Number(d["SPY CLOSE"] ?? d.close),
          // Include optional series so we can toggle them like CW1
          gamma_flip: d.gamma_flip ?? d["Gamma Flip"] ?? null,
          cw1: d.cw1 ?? d.CW1 ?? null,
          pw1: d.pw1 ?? d.PW1 ?? null,
        }));

        setRows(formatted);
      } catch (err: any) {
        setError(`Failed to load AGS1 data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Optional: refresh on tab return like CW1 (kept minimal here)
    const onVis = () => {
      if (document.visibilityState === "visible") {
        // Re-fetch to stay fresh
        // (Uncomment if you want the same behavior)
        // fetchData();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [lookback]);

  // Draw vertical lines for expirations and hovered date
  const shapes: any[] = [];
  if (expirationType === "Monthly" || expirationType === "Both") {
    shapes.push(
      ...expirationLines.monthly.map((date) => ({
        type: "line",
        x0: date,
        x1: date,
        yref: "paper",
        y0: 0,
        y1: 1,
        line: {
          color: "rgba(139, 0, 0, 0.35)",
          width: 1.5,
          dash: "dot",
        },
      }))
    );
  }
  if (expirationType === "Quarterly" || expirationType === "Both") {
    shapes.push(
      ...expirationLines.quarterly.map((date) => ({
        type: "line",
        x0: date,
        x1: date,
        yref: "paper",
        y0: 0,
        y1: 1,
        line: {
          color: "rgba(111, 66, 193, 0.35)",
          width: 1.5,
          dash: "dot",
        },
      }))
    );
  }
  if (hoveredDate) {
    shapes.push({
      type: "line",
      x0: hoveredDate,
      x1: hoveredDate,
      yref: "paper",
      y0: 0,
      y1: 1,
      line: {
        color: "#8b0000",
        width: 1,
        dash: "dash",
      },
    });
  }

  const layout: Partial<Layout> = {
    xaxis: {
      visible: false,
      type: "category",
      showgrid: false,
      rangeslider: { visible: false },
      fixedrange: true,
      constrain: "domain",
    },
    yaxis: {
      side: "left",
      showgrid: false,
      fixedrange: true,
      constrain: "domain",
    },
    hovermode: "closest",
    dragmode: false,
    shapes,
    margin: { l: 35, r: 0, t: 0, b: 0 },
    autosize: true,
    height: 500,
    plot_bgcolor: "transparent",
    paper_bgcolor: "transparent",
    showlegend: false,
    hoverlabel: {
      bgcolor: "#6c757d",
      bordercolor: "#212529",
      font: {
        family: "Arial, sans-serif",
        size: 20,
        color: "white",
      },
      namelength: -1,
      align: "left",
    },
  };

  // Build traces (AGS1 + optional overlays + candlestick)
  const traces: any[] = [
    {
      type: "scatter",
      x: rows.map((d) => d.date),
      y: rows.map((d) => d.ags1),
      name: "AGS1",
      mode: "lines+markers",
      line: { color: "#212529", width: 2 },
      hovertemplate: "Date: %{x}<br>AGS1: %{y:.0f}<extra></extra>",
    },
    ...(showGammaFlip
      ? [
          {
            type: "scatter" as const,
            mode: "lines+markers" as const,
            x: rows.map((d) => d.date),
            y: rows.map((d) => d.gamma_flip),
            name: "Gamma Flip",
            line: { color: "#ffa500", width: 2, dash: "dot" as const },
            hovertemplate: "Date: %{x}<br>Gamma Flip: %{y:.0f}<extra></extra>",
          },
        ]
      : []),
    ...(showLargestCW
      ? [
          {
            type: "scatter" as const,
            mode: "lines+markers" as const,
            x: rows.map((d) => d.date),
            y: rows.map((d) => d.cw1),
            name: "Largest Call Wall",
            line: { color: "#0096b4", width: 2, dash: "dot" as const },
            hovertemplate:
              "Date: %{x}<br>Largest Call Wall: %{y:.0f}<extra></extra>",
          },
        ]
      : []),
    ...(showLargestPW
      ? [
          {
            type: "scatter" as const,
            mode: "lines+markers" as const,
            x: rows.map((d) => d.date),
            y: rows.map((d) => d.pw1),
            name: "Largest Put Wall",
            line: { color: "#6f42c1", width: 2, dash: "dot" as const },
            hovertemplate:
              "Date: %{x}<br>Largest Put Wall: %{y:.0f}<extra></extra>",
          },
        ]
      : []),
    {
      type: "candlestick",
      x: rows.map((d) => d.date),
      open: rows.map((d) => d.open),
      high: rows.map((d) => d.high),
      low: rows.map((d) => d.low),
      close: rows.map((d) => d.close),
      name: "SPY",
      increasing: { line: { color: "#71c287" } },
      decreasing: { line: { color: "#f08080" } },
      hoverinfo: "skip",
    },
  ];

  useEffect(() => {
    if (!hoveredDate || rows.length === 0) return;
    const el = chartRef.current?.el;
    const index = rows.findIndex((d) => d.date === hoveredDate);
    if (el && index !== -1) {
      try {
        Plotly.Fx.hover(el, [{ curveNumber: 0, pointNumber: index }]);
      } catch (err) {
        console.error("Fx.hover failed in AGS1HisGammaChart", err);
      }
    }
  }, [hoveredDate, rows]);

  if (isLoading && rows.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading AGS1 data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        <h4 className="alert-heading">Data Loading Error</h4>
        <p>{error}</p>
        <hr />
        <button
          className="btn btn-outline-primary"
          onClick={() => location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className="my-1 border rounded"
      style={{
        background:
          "linear-gradient(180deg, #fff 25%, rgba(56, 52, 52, 0.4) 100%)",
        borderRadius: "18px",
        boxShadow:
          "0 6px 20px rgba(85, 47, 47, 0.50), 0 4px 10px rgba(85, 47, 47, 0.50)",
        padding: "1rem 0.75rem 2rem 0.75rem",
        marginBottom: "1.5rem",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4
          className="text-uppercase mb-0 ps-2"
          style={{
            letterSpacing: "0.05em",
            fontWeight: 900,
            fontSize: "1.25rem",
            color: "#212529",
          }}
        >
          LARGEST ABSOLUTE GAMMA WALL
        </h4>
        <div className="d-flex justify-content-end mb-2 me-2">
          {/* Expiration filter (unchanged) */}
          <div
            className="btn-group btn-group-sm"
            role="group"
            aria-label="Expiration Filter"
          >
            {["None", "Monthly", "Quarterly", "Both"].map((type) => (
              <button
                key={type}
                className={`btn btn-outline-secondary ${
                  expirationType === type ? "active" : ""
                }`}
                onClick={() => setExpirationType(type as any)}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Gamma Flip toggle */}
          <div
            className="btn-group btn-group-sm ms-2"
            role="group"
            aria-label="Gamma Flip Toggle"
          >
            <button
              className={`btn btn-outline-secondary ${
                showGammaFlip ? "active" : ""
              }`}
              onClick={() => setShowGammaFlip(true)}
            >
              Show Gamma Flip
            </button>
            <button
              className={`btn btn-outline-secondary ${
                !showGammaFlip ? "active" : ""
              }`}
              onClick={() => setShowGammaFlip(false)}
            >
              Hide Gamma Flip
            </button>
          </div>

          {/* Largest Call Wall toggle */}
          <div
            className="btn-group btn-group-sm ms-2"
            role="group"
            aria-label="Largest Call Wall Toggle"
          >
            <button
              className={`btn btn-outline-secondary ${
                showLargestCW ? "active" : ""
              }`}
              onClick={() => setShowLargestCW(true)}
            >
              Show Largest CW
            </button>
            <button
              className={`btn btn-outline-secondary ${
                !showLargestCW ? "active" : ""
              }`}
              onClick={() => setShowLargestCW(false)}
            >
              Hide Largest CW
            </button>
          </div>

          {/* Largest Put Wall toggle */}
          <div
            className="btn-group btn-group-sm ms-2"
            role="group"
            aria-label="Largest Put Wall Toggle"
          >
            <button
              className={`btn btn-outline-secondary ${
                showLargestPW ? "active" : ""
              }`}
              onClick={() => setShowLargestPW(true)}
            >
              Show Largest PW
            </button>
            <button
              className={`btn btn-outline-secondary ${
                !showLargestPW ? "active" : ""
              }`}
              onClick={() => setShowLargestPW(false)}
            >
              Hide Largest PW
            </button>
          </div>
        </div>
      </div>

      <Plot
        ref={chartRef}
        data={traces}
        layout={layout}
        useResizeHandler={true}
        style={{ width: "100%", height: "500px" }}
        config={{
          responsive: true,
          displayModeBar: false,
          displaylogo: false,
          scrollZoom: false,
          doubleClick: false,
          modeBarButtonsToRemove: ["zoom2d", "pan2d", "select2d", "lasso2d"],
          editable: false,
          staticPlot: false,
        }}
        onHover={(event) => {
          if (event.points?.[0]) {
            const hoveredX = String(event.points[0].x);
            setHoveredDate(hoveredX);
          }
        }}
        onUnhover={() => setHoveredDate(null)}
      />
    </div>
  );
};

export default AGS1HisGammaChart;
