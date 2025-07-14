import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { useChartSync } from "../../../context/ChartSyncContext";
declare const Plotly: typeof import("plotly.js-dist-min");

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Props = {
  lookback: number;
};

const AGS3CallPutGammaChart = ({ lookback }: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [visible, setVisible] = useState<"both" | "call" | "put">("both");
  const chartRef = useRef<any>(null);

  const chartSyncContext = useChartSync();
  const hoveredDate = chartSyncContext?.hoveredDate || null;
  const setHoveredDate = chartSyncContext?.setHoveredDate || (() => {});

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/ags3-gamma?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("Error loading AGS3 Call/Put Gamma data", err)
      );
  }, [lookback]);

  const slicedData = Array.isArray(data) ? data : [];
  const dates = slicedData.map((d) => d.date);
  const callGamma = slicedData.map((d) => d.call_gamma);
  const putGamma = slicedData.map((d) => d.put_gamma);

  const callColor = "#3e3e3e";
  const putColor = "#8b0000";

  const traces: Plotly.Data[] = [];

  if (visible === "both" || visible === "call") {
    traces.push({
      type: "bar",
      x: dates,
      y: callGamma,
      name: "Call Gamma",
      marker: { color: callColor },
      hovertemplate:
        visible === "both"
          ? "Date: %{x}<br>Call Γ: %{y:,.0f}<br>Put Γ: %{customdata[0]:,.0f}<extra></extra>"
          : "Date: %{x}<br>Call Γ: %{y:,.0f}<extra></extra>",
      ...(visible === "both" ? { customdata: putGamma.map((v) => [v]) } : {}),
    });
  }

  if (visible === "both" || visible === "put") {
    traces.push({
      type: "bar",
      x: dates,
      y: putGamma,
      name: "Put Gamma",
      marker: { color: putColor },
      hovertemplate:
        visible === "both"
          ? "Date: %{x}<br>Call Γ: %{customdata[0]:,.0f}<br>Put Γ: %{y:,.0f}<extra></extra>"
          : "Date: %{x}<br>Put Γ: %{y:,.0f}<extra></extra>",
      ...(visible === "both" ? { customdata: callGamma.map((v) => [v]) } : {}),
    });
  }

  useEffect(() => {
    if (!hoveredDate || slicedData.length === 0) return;
    const el = chartRef.current?.el;
    const index = slicedData.findIndex((d) => d.date === hoveredDate);
    if (el && index !== -1) {
      try {
        Plotly.Fx.hover(el, [{ curveNumber: 0, pointNumber: index }]);
      } catch (err) {
        console.error("Fx.hover failed in AGS3CallPutGammaChart", err);
      }
    }
  }, [hoveredDate, slicedData]);

  const layout: Partial<Plotly.Layout> = {
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
        color: "white",
      },
      namelength: -1,
      align: "left",
    },
    xaxis: {
      visible: false,
      type: "category",
      rangeslider: { visible: false },
      fixedrange: true,
    },
    yaxis: {
      title: "Gamma",
      showgrid: false,
      fixedrange: true,
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
              color: "#8b0000",
              width: 1,
              dash: "dash",
            },
          },
        ]
      : [],
    plot_bgcolor: "transparent",
    paper_bgcolor: "transparent",
    font: { family: "'Segoe UI', 'Arial', sans-serif" },
    showlegend: false,
  };

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
          CALL & PUT GAMMA
        </h4>
        <div className="d-flex justify-content-end mb-2 me-2">
          <div
            className="btn-group btn-group-sm"
            role="group"
            aria-label="Gamma Visibility"
          >
            {["both", "call", "put"].map((type) => (
              <button
                key={type}
                className={`btn btn-outline-secondary ${
                  visible === type ? "active" : ""
                }`}
                onClick={() => setVisible(type as any)}
              >
                {type === "call" ? "Call Γ" : type === "put" ? "Put Γ" : "Both"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Plot
        ref={chartRef}
        data={traces}
        layout={layout}
        useResizeHandler
        style={{ width: "100%", height: "280px" }}
        config={{ responsive: true, displayModeBar: false }}
        onHover={(event) => {
          if (event.points?.[0]) setHoveredDate(event.points[0].x);
        }}
        onUnhover={() => setHoveredDate(null)}
      />
    </div>
  );
};

export default AGS3CallPutGammaChart;
