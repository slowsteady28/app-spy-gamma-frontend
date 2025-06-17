import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

const mainColor = "#212529"; // Dark Bootstrap Gray
const accentColor = "#495057"; // Slightly lighter gray
const deepRed = "#8B0000"; // Deep Red for Put Gamma
const callGray = "#343a40"; // Dark Gray for Call Gamma

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type GammaDataPoint = {
  date: string;
  call_gamma: number;
  put_gamma: number;
};

type Props = {
  lookback: number;
};

function AbsGamma3CallPutGammaChart({ lookback }: Props) {
  const [data, setData] = useState<GammaDataPoint[]>([]);
  const [visible, setVisible] = useState<"both" | "call" | "put">("both");

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/ags3-gamma?lookback=${lookback}`)
      .then((res) => {
        console.log("AbsGamma3 Call/Put Gamma Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error loading AbsGamma3 gamma data", err));
  }, [lookback]);

  const gammaValues = data
    .flatMap((d) => [d.call_gamma, d.put_gamma])
    .filter((v) => typeof v === "number" && !isNaN(v));
  const minY = gammaValues.length ? Math.min(...gammaValues) : 0;
  const maxY = gammaValues.length ? Math.max(...gammaValues) : 100;
  const buffer = (maxY - minY) * 0.05;

  return (
    <div
      className="my-1"
      style={{
        background: "linear-gradient(90deg, #f8f9fa 0%, #dee2e6 100%)",
        borderRadius: "12px",
        boxShadow: "0 2px 14px rgba(33, 37, 41, 0.07)",
        padding: "1.5rem 1rem",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4
          className="text-uppercase mb-0 ps-2"
          style={{
            letterSpacing: "0.05em",
            fontWeight: 900,
            color: mainColor,
            fontSize: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textShadow: "0 1px 4px rgba(33, 37, 41, 0.15)",
            fontFamily: "'Segoe UI', 'Arial', 'sans-serif'",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg, #212529, #868e96)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            Call & Put Gamma
          </span>
        </h4>
        <ButtonGroup>
          <Button
            variant={visible === "both" ? "dark" : "outline-dark"}
            size="sm"
            onClick={() => setVisible("both")}
          >
            Both
          </Button>
          <Button
            variant={visible === "call" ? "dark" : "outline-dark"}
            size="sm"
            onClick={() => setVisible("call")}
          >
            Call Gamma
          </Button>
          <Button
            variant={visible === "put" ? "dark" : "outline-dark"}
            size="sm"
            onClick={() => setVisible("put")}
          >
            Put Gamma
          </Button>
        </ButtonGroup>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis domain={[minY - buffer, maxY + buffer]} />
          <Tooltip
            cursor={{ stroke: accentColor, strokeWidth: 2, opacity: 0.5 }}
            formatter={(value: number) =>
              value?.toLocaleString(undefined, { maximumFractionDigits: 0 })
            }
          />
          <Legend />
          {(visible === "both" || visible === "call") && (
            <Bar
              dataKey="call_gamma"
              name="Call Gamma"
              fill={callGray}
              radius={[4, 4, 0, 0]}
            />
          )}
          {(visible === "both" || visible === "put") && (
            <Bar
              dataKey="put_gamma"
              name="Put Gamma"
              fill={deepRed}
              radius={[4, 4, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AbsGamma3CallPutGammaChart;
