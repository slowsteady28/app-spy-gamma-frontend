import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import type { Layout } from "plotly.js";
import { expirationLines } from "../utils/expirationDates";
import { useChartSync } from "../../../context/ChartSyncContext";
declare const Plotly: typeof import("plotly.js-dist-min");

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Props = {
  lookback: number;
};

const AGS3HisGammaChart = ({ lookback }: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expirationType, setExpirationType] = useState<
    "Monthly" | "Quarterly" | "Both" | "None"
  >("Both");

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
          `${apiBaseUrl}/data/ags3-history?lookback=${lookback}`
        );
        const rawData = response.data;

        const formattedData = rawData.map((d: any) => ({
          date: d.date,
          ags3: d.ags3,
          open: d["SPY OPEN"],
          high: d["SPY HIGH"],
          low: d["SPY LOW"],
          close: d["SPY CLOSE"],
        }));

        const traceAGS3 = {
          type: "scatter",
          x: formattedData.map((d) => d.date),
          y: formattedData.map((d) => d.ags3),
          name: "AGS3",
          mode: "lines+markers",
          line: {
            color: "#212529",
            width: 2,
          },
          hovertemplate: "Date: %{x}<br>AGS3: %{y:.0f}<extra></extra>",
        };

        const traceCandle = {
          type: "candlestick",
          x: formattedData.map((d) => d.date),
          open: formattedData.map((d) => d.open),
          high: formattedData.map((d) => d.high),
          low: formattedData.map((d) => d.low),
          close: formattedData.map((d) => d.close),
          name: "SPY",
          increasing: { line: { color: "#71c287" } },
          decreasing: { line: { color: "#f08080" } },
          hoverinfo: "skip",
        };

        setData([traceAGS3, traceCandle]);
      } catch (err: any) {
        setError(`Failed to load AGS3 data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [lookback]);

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
    dragmode: "crosshair",
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

  useEffect(() => {
    if (!hoveredDate || !data.length) return;
    const el = chartRef.current?.el;
    const index = data[0].x?.findIndex((d: any) => d === hoveredDate);
    if (el && index !== -1) {
      try {
        Plotly.Fx.hover(el, [{ curveNumber: 0, pointNumber: index }]);
      } catch (err) {
        console.error("Fx.hover failed in AGS3HisGammaChart", err);
      }
    }
  }, [hoveredDate, data]);

  if (isLoading && data.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading AGS3 data...</span>
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
          ABSOLUTE GAMMA STRIKE
        </h4>
        <div className="d-flex justify-content-end me-2">
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
        </div>
      </div>

      <Plot
        ref={chartRef}
        data={data}
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
          if (event.points?.[0]) setHoveredDate(event.points[0].x);
        }}
        onUnhover={() => setHoveredDate(null)}
      />
    </div>
  );
};

export default AGS3HisGammaChart;
