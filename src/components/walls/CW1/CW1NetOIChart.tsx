import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { useChartSync } from "../../../context/ChartSyncContext";
import type { Layout } from "plotly.js";
import * as PlotlyJS from "plotly.js-dist-min";

// ✅ Simple cast
const Plotly: any = PlotlyJS;

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type NetOIChartProps = {
  lookback: number;
  selectedRange: [number, number] | null;
  setSelectedRange: (range: [number, number]) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
};

function CW1NetOIChart({
  lookback,
  selectedRange,
  setSelectedRange,
  activeIndex,
  setActiveIndex,
}: NetOIChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [visible, setVisible] = useState<"both" | "call" | "put">("both");
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  const chartRef = useRef<any>(null);
  const chartSyncContext = useChartSync();
  const hoveredDate = chartSyncContext?.hoveredDate || null;
  const setHoveredDate = chartSyncContext?.setHoveredDate || (() => {});

  const teal = "#0096b4";
  const dark = "#212529";

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw1-net-oi?lookback=${lookback}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.error("Error loading cW1 Net OI", err));
  }, [lookback]);

  useEffect(() => {
    const handleResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slicedData = Array.isArray(data)
    ? selectedRange
      ? data.slice(selectedRange[0], selectedRange[1] + 1)
      : data
    : [];

  const dates = slicedData.map((d) => d.date);
  const callOI = slicedData.map((d) => d.call_oi);
  const putOI = slicedData.map((d) => d.put_oi);

  const traces: Plotly.Data[] = [];

  if (visible === "both" || visible === "call") {
    traces.push({
      type: "bar",
      x: dates,
      y: callOI,
      name: "Call OI Δ",
      marker: { color: teal },
      hovertemplate:
        visible === "both"
          ? "Date: %{x}<br>Call OI Δ: %{y:,.0f}<br>Put OI Δ: %{customdata[0]:,.0f}<extra></extra>"
          : "Date: %{x}<br>Call OI Δ: %{y:,.0f}<extra></extra>",
      ...(visible === "both" ? { customdata: putOI.map((v) => [v]) } : {}),
    });
  }

  if (visible === "both" || visible === "put") {
    traces.push({
      type: "bar",
      x: dates,
      y: putOI,
      name: "Put OI Δ",
      marker: { color: dark },
      hovertemplate:
        visible === "both"
          ? "Date: %{x}<br>Call OI Δ: %{customdata[0]:,.0f}<br>Put OI Δ: %{y:,.0f}<extra></extra>"
          : "Date: %{x}<br>Put OI Δ: %{y:,.0f}<extra></extra>",
      ...(visible === "both" ? { customdata: callOI.map((v) => [v]) } : {}),
    });
  }

  // Sync hover effect when hoveredDate changes
  useEffect(() => {
    if (!hoveredDate || slicedData.length === 0) return;

    const el = chartRef.current?.el;
    const index = slicedData.findIndex((d) => d.date === hoveredDate);

    if (el && index !== -1) {
      try {
        Plotly.Fx.hover(el, [{ curveNumber: 0, pointNumber: index }]);
      } catch (err) {
        console.error("Fx.hover failed in Net OI", err);
      }
    }
  }, [hoveredDate, slicedData]);

  return (
    <div
      className="my-1 border rounded"
      style={{
        background: "linear-gradient(180deg, #ffffff 20%, #e3f4f6 100%)",
        borderRadius: "18px",
        boxShadow:
          "0 4px 16px rgba(0, 150, 180, 0.15), 0 0 8px rgba(0, 150, 180, 0.15)",
        padding: "1rem 0.75rem 2rem 0.75rem",
        marginBottom: "1.5rem",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4
          className="text-uppercase mb-0 ps-2"
          style={{
            letterSpacing: "0.05em",
            fontWeight: 900,
            fontSize: "1.25rem",
            color: "#212529",
          }}
        >
          NET OI Δ
        </h4>
        <div className="d-flex justify-content-end mb-2 me-2">
          <div
            className="btn-group btn-group-sm"
            role="group"
            aria-label="OI Visibility"
          >
            {[
              { label: "Both", value: "both" },
              { label: "Call OI Δ", value: "call" },
              { label: "Put OI Δ", value: "put" },
            ].map(({ label, value }) => (
              <button
                key={value}
                className={`btn btn-outline-secondary ${
                  visible === value ? "active" : ""
                }`}
                onClick={() => setVisible(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Plot
        ref={chartRef}
        data={traces}
        layout={{
          height: 310,
          margin: { t: 5, b: 5, l: 35, r: 10 },
          barmode: "group",
          hovermode: "closest",
          hoverlabel: {
            bgcolor: "#6c757d",
            bordercolor: "#212529",
            font: {
              family: "Arial, sans-serif",
              size: 20,
              weight: "bold",
              color: "black",
            },
            namelength: -1,
            align: "left",
          },
          xaxis: {
            visible: false,
            title: "Date",
            type: "category",
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
            title: "OI Δ",
            showgrid: false,
            fixedrange: true,
            constrain: "domain",
          },
          shapes: hoveredDate
            ? [
                {
                  type: "line",
                  x0: hoveredDate,
                  x1: hoveredDate,
                  yref: "paper",
                  y0: 0,
                  y1: 1,
                  line: {
                    color: teal,
                    width: 1,
                    dash: "dash",
                  },
                },
              ]
            : [],
          plot_bgcolor: "transparent",
          paper_bgcolor: "transparent",
          font: { family: "'Segoe UI', 'Arial', 'sans-serif'" },
          showlegend: false,
        }}
        useResizeHandler
        style={{ width: "100%", height: "280px" }}
        config={{ responsive: true, displayModeBar: false }}
        onHover={(event) => {
          if (event.points && event.points.length > 0) {
            setHoveredDate(event.points[0].x);
          }
        }}
        onUnhover={() => setHoveredDate(null)}
      />
    </div>
  );
}

export default CW1NetOIChart;
