import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
declare const Plotly: typeof import("plotly.js-dist-min");
import { Layout, PlotData } from "plotly.js";
import { useChartSync } from "../../../context/ChartSyncContext";
import { expirationLines } from "../utils/expirationDates";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface WallPriceData {
  date: string;
  price: number;
  pw2: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sd: number;
}

interface PW2WallChartProps {
  lookback: number;
  selectedRange: [number, number] | null;
  setSelectedRange: (range: [number, number] | null) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
}

function PW2WallChart({
  lookback = 400,
  selectedRange,
  setSelectedRange,
  activeIndex,
  setActiveIndex,
}: PW2WallChartProps) {
  const [expirationType, setExpirationType] = useState<
    "Monthly" | "Quarterly" | "Both" | "None"
  >("Both");
  const [wallPriceData, setWallPriceData] = useState<WallPriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const chartRef = useRef<any>(null);
  const chartSyncContext = useChartSync();
  const hoveredDate = chartSyncContext?.hoveredDate || null;
  const setHoveredDate = chartSyncContext?.setHoveredDate || (() => {});

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${apiBaseUrl}/data/pw2-history?lookback=${lookback}`
      );
      const formattedData = Array.isArray(response.data)
        ? response.data.map((item: any) => ({
            date: item["date"] || item["Date"],
            price: Number(item["price"] || item["Price"]),
            pw2: Number(item["pw2"] || item["PW2"]),
            open: Number(item["open"] || item["SPY OPEN"]),
            high: Number(item["high"] || item["SPY HIGH"]),
            low: Number(item["low"] || item["SPY LOW"]),
            close: Number(item["close"] || item["SPY CLOSE"]),
            volume: Number(item["volume"] || item["SPY VOLUME"]),
            sd: Number(item["sd"] || item["SPY SD"]),
          }))
        : response.data.data.map((item: any) => ({
            date: item["Date"] || item.date,
            price: Number(item["Price"] || item.price),
            pw2: Number(item["PW2"] || item.pw2),
            open: Number(item["SPY OPEN"] || item.open),
            high: Number(item["SPY HIGH"] || item.high),
            low: Number(item["SPY LOW"] || item.low),
            close: Number(item["SPY CLOSE"] || item.close),
            volume: Number(item["SPY VOLUME"] || item.volume),
            sd: Number(item["SPY SD"] || item.sd),
          }));

      setWallPriceData(formattedData);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lookback]);

  useEffect(() => {
    if (!hoveredDate || wallPriceData.length === 0) return;
    const el = chartRef.current?.el;
    const index = wallPriceData.findIndex((d) => d.date === hoveredDate);
    if (el && index !== -1) {
      try {
        Plotly.Fx.hover(el, [{ curveNumber: 0, pointNumber: index }]);
      } catch (err) {
        console.error("Fx.hover failed", err);
      }
    }
  }, [hoveredDate, wallPriceData]);

  const expirationShapes = [];
  if (expirationType === "Monthly" || expirationType === "Both") {
    expirationShapes.push(
      ...expirationLines.monthly.map((date) => ({
        type: "line",
        x0: date,
        x1: date,
        yref: "paper",
        y0: 0,
        y1: 1,
        line: {
          color: "rgba(255,0,0,0.3)",
          width: 1,
          dash: "dot",
        },
      }))
    );
  }
  if (expirationType === "Quarterly" || expirationType === "Both") {
    expirationShapes.push(
      ...expirationLines.quarterly.map((date) => ({
        type: "line",
        x0: date,
        x1: date,
        yref: "paper",
        y0: 0,
        y1: 1,
        line: {
          color: "rgba(0,0,255,0.3)",
          width: 1,
          dash: "dot",
        },
      }))
    );
  }
  if (hoveredDate) {
    expirationShapes.push({
      type: "line",
      x0: hoveredDate,
      x1: hoveredDate,
      yref: "paper",
      y0: 0,
      y1: 1,
      line: {
        color: "#0096b4",
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
      tickangle: -45,
      rangeslider: { visible: false },
      tickmode: "linear",
      dtick: 10,
      tickfont: {
        size: 10,
        family: "'Segoe UI', 'Arial', sans-serif",
      },
      fixedrange: true,
      constrain: "domain",
    },
    yaxis: {
      side: "left",
      showgrid: false,
      type: "log",
      fixedrange: true,
      constrain: "domain",
    },
    hovermode: "closest",
    shapes: expirationShapes,
    legend: {
      orientation: "h",
      y: 1.1,
      x: 0.5,
      xanchor: "center",
    },
    dragmode: "crosshair",
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
        weight: "bold",
      },
      namelength: -1,
      align: "left",
    },
  };

  if (isLoading && wallPriceData.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading put wall data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        <h4 className="alert-heading">Data Loading Error</h4>
        <p>{error}</p>
        <hr />
        <button className="btn btn-outline-primary" onClick={fetchData}>
          Try Again
        </button>
      </div>
    );
  }

  if (wallPriceData.length === 0) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        <h4 className="alert-heading">No Data Available</h4>
        <p>Unable to retrieve put wall data at this time.</p>
        <button className="btn btn-outline-primary" onClick={fetchData}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className="my-1 border rounded"
      style={{
        background: "linear-gradient(180deg, #ffffff 20%, #ede4f8 100%)",
        borderRadius: "18px",
        boxShadow:
          "0 4px 20px rgba(111, 66, 193, 0.25), 0 0 12px rgba(111, 66, 193, 0.15)",
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
          2ND LARGEST PUT WALL
        </h4>
        <div className="d-flex justify-content-end mb-2 me-2">
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
        data={[
          {
            type: "scatter",
            x: wallPriceData.map((item) => item.date),
            y: wallPriceData.map((item) => item.pw2),
            name: "PW",
            mode: "lines+markers",
            line: {
              color: "#6F42C1",
              width: 2,
            },
            hovertemplate: "Date: %{x}<br>PW: %{y:.0f}<extra></extra>",
          },
          {
            type: "candlestick",
            x: wallPriceData.map((item) => item.date),
            open: wallPriceData.map((item) => item.open),
            high: wallPriceData.map((item) => item.high),
            low: wallPriceData.map((item) => item.low),
            close: wallPriceData.map((item) => item.close),
            name: "SPY",
            increasing: { line: { color: "#71c287" } },
            decreasing: { line: { color: "#f08080" } },
            hoverinfo: "skip",
          },
        ]}
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
          if (event.points && event.points.length > 0) {
            setHoveredDate(event.points[0].x as string);
          }
        }}
        onUnhover={() => setHoveredDate(null)}
      />
    </div>
  );
}

export default PW2WallChart;
