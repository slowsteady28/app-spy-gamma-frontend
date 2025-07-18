import { useRef, useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { useChartSync } from "../../../context/ChartSyncContext";
import * as PlotlyJS from "plotly.js-dist-min";

// ✅ Simple cast
const Plotly: any = PlotlyJS;

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type DurationChartProps = {
  lookback: number;
};

type DurationDataPoint = {
  date: string;
  duration: number;
};

function CW2DurationChart({ lookback }: DurationChartProps) {
  const chartRef = useRef<any>(null);
  const chartSyncContext = useChartSync();
  const hoveredDate = chartSyncContext?.hoveredDate || null;
  const setHoveredDate = chartSyncContext?.setHoveredDate || (() => {});
  const [data, setData] = useState<DurationDataPoint[]>([]);
  const teal = "#0096b4";

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw2-duration?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("Error loading CW2 duration chart data:", err)
      );
  }, [lookback]);

  const dates = data.map((d) => d.date);
  const durations = data.map((d) => d.duration);

  useEffect(() => {
    if (!hoveredDate || data.length === 0) return;

    const el = chartRef.current?.el;
    const index = data.findIndex((d) => d.date === hoveredDate);

    if (el && index !== -1) {
      try {
        Plotly.Fx.hover(el, [{ curveNumber: 0, pointNumber: index }]);
      } catch (err) {
        console.error("Fx.hover failed in Duration Chart", err);
      }
    }
  }, [hoveredDate, data]);

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
      <h4
        className="text-uppercase mb-0 ps-2"
        style={{
          letterSpacing: "0.05em",
          fontWeight: 900,
          fontSize: "1.25rem",
          color: "#212529",
        }}
      >
        DURATION
      </h4>

      <Plot
        ref={chartRef}
        data={
          [
            {
              x: dates,
              y: durations,
              type: "bar" as const, // ✅ ensures it's a valid trace type
              name: "Avg Days Held",
              marker: { color: teal },
              hovertemplate:
                "Date: %{x}<br>Duration: %{y:.1f} days<extra></extra>",
            },
          ] as Plotly.Data[]
        } // ✅ force TS to treat it as valid
        layout={
          {
            height: 220,
            margin: { t: 0, b: 0, l: 40, r: 10 },
            xaxis: {
              visible: false,
              type: "category",
            },
            yaxis: {
              title: "Duration (days)",
              showgrid: false,
            },
            shapes: hoveredDate
              ? ([
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
                ] as Plotly.Shape[])
              : [],
            hovermode: "closest",
            hoverlabel: {
              bgcolor: "#6c757d",
              bordercolor: "#212529",
              font: {
                family: "Arial, sans-serif",
                size: 20,
                color: "black",
              },
              namelength: -1,
              align: "left",
            },
            showlegend: false,
            plot_bgcolor: "transparent",
            paper_bgcolor: "transparent",
            font: { family: "'Segoe UI', 'Arial', 'sans-serif'" },
          } as Partial<Plotly.Layout>
        } // ✅ cast to loosen validation
        useResizeHandler
        style={{ width: "100%", height: "220px" }}
        config={{ responsive: true, displayModeBar: false, staticPlot: true }}
        onHover={(event) => {
          if (event.points && event.points.length > 0) {
            setHoveredDate(String(event.points[0].x));
          }
        }}
        onUnhover={() => setHoveredDate(null)}
      />
    </div>
  );
}

export default CW2DurationChart;
