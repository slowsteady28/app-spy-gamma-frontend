import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import type { PlotData } from "plotly.js";

// API base URL
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type DataPoint = {
  date: string;
  cw1_strike: number;
  max_gamma_date: string;
  price: number;
};

type CW1LongTermExpChartProps = {
  lookback: number;
};

const CW1LongTermExpChart: React.FC<CW1LongTermExpChartProps> = ({
  lookback,
}) => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/cw1-long-term-exp?lookback=${lookback}`)
      .then((res) => {
        const sorted = [...res.data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setData(sorted);
      })
      .catch((err) => console.error("Axios error", err));
  }, [lookback]);

  const strikeTrace: Partial<PlotData> = {
    x: data.map((d) => {
      const [month, day, year] = d.date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }),
    y: data.map((d) => d.cw1_strike),
    mode: "lines+markers",
    name: "CW1 Strike (by Date)",
    marker: { color: "#0096b4", size: 6 },
    line: { shape: "linear", width: 2 },
    type: "scatter",
  };

  const priceTrace: Partial<PlotData> = {
    x: data.map((d) => {
      const [month, day, year] = d.date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }),
    y: data.map((d) => d.price),
    mode: "lines+markers",
    name: "SPY Price",
    marker: { color: "#f4c542", size: 5 },
    line: { shape: "linear", width: 2 },
    type: "scatter",
  };

  const maxGammaTrace: Partial<PlotData> = {
    x: data.map((d) => d.max_gamma_date),
    y: data.map((d) => d.cw1_strike),
    mode: "markers",
    name: "Max Gamma Expiration",
    marker: { color: "#e76f51", size: 10, symbol: "x" },
    type: "scatter",
  };

  return (
    <Plot
      data={[strikeTrace, priceTrace, maxGammaTrace]}
      layout={{
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: { color: "#e0e0e0" },
        xaxis: {
          title: { text: "Date" },
          type: "date",
          tickangle: -45,
          showspikes: true,
          spikemode: "across",
          spikesnap: "cursor",
          spikedash: "solid",
          spikethickness: 1,
          spikecolor: "#888",
          color: "#e0e0e0",
          gridcolor: "transparent", // ⬅️ Remove grid
          zerolinecolor: "transparent", // ⬅️ Remove axis line
        },
        yaxis: {
          showspikes: true,
          spikemode: "across",
          spikedash: "solid",
          color: "#e0e0e0",
          gridcolor: "transparent", // ⬅️ Remove grid
          zerolinecolor: "transparent", // ⬅️ Remove axis line
        },
        hovermode: "x unified",
        autosize: true,
        margin: { t: 50, l: 60, b: 100, r: 30 },
        legend: {
          orientation: "h",
          x: 0,
          y: 1.15,
          font: { color: "#e0e0e0" },
        },
      }}
      style={{ width: "100%", height: "600px", background: "transparent" }}
      useResizeHandler={true}
    />
  );
};

export default CW1LongTermExpChart;
