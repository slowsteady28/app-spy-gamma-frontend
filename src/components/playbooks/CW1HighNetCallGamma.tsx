import React, { useEffect, useState } from "react";
import axios from "axios";

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

interface SPYHourlyChartProps {
  lookback: number; // 25 | 50 | 100 | 200 | 400
}

const SPYHourlyChart: React.FC<SPYHourlyChartProps> = ({ lookback }) => {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiBaseUrl}/hourly-spy-price-data?lookback=${lookback}`)
      .then((res) => {
        const rawData: CandleData[] = res.data;
      })
      .catch((err) => console.error("Error fetching hourly SPY data", err))
      .finally(() => setLoading(false));
  }, [lookback]);

  return (
    <div
      style={{
        width: "100%",
        background:
          "linear-gradient(90deg, rgb(248, 249, 250) 60%, rgb(233, 236, 239) 100%)",
      }}
    >
      Hello
    </div>
  );
};
export default SPYHourlyChart;
