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
const deepRed = "#8B0000"; // Deep Red for Put OI
const callGray = "#343a40"; // Dark Gray for Call OI

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type NetOIDataPoint = {
  date: string;
  call_oi: number;
  put_oi: number;
};

type Props = {
  lookback: number;
};

function AbsGamma1NetOIChart({ lookback }: Props) {
  const [data, setData] = useState<NetOIDataPoint[]>([]);
  const [visible, setVisible] = useState<"both" | "call" | "put">("both");

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data/ags1-net-oi?lookback=${lookback}`)
      .then((res) => {
        console.log("AbsGamma1 Net OI Data:", res.data);
        setData(res.data.data);
      })
      .catch((err) => console.error("Error loading AGS1 Net OI", err));
  }, [lookback]);

  const tooltipFormatter = (value: number) =>
    value?.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div
      className="my-1"
      style={{
        background: "linear-gradient(90deg, #f8f9fa 0%, #dee2e6 100%)",
        borderRadius: "12px",
        boxShadow: "0 2px 12px 0 rgba(33, 37, 41, 0.07)",
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
            Net OI Change (Absolute Gamma)
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
            Call OI Δ
          </Button>
          <Button
            variant={visible === "put" ? "dark" : "outline-dark"}
            size="sm"
            onClick={() => setVisible("put")}
          >
            Put OI Δ
          </Button>
        </ButtonGroup>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} syncId="spy-sync">
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(value) =>
              value?.toLocaleString(undefined, { maximumFractionDigits: 0 })
            }
            tickMargin={12}
            axisLine={{ stroke: "#ccc", strokeWidth: 1 }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: accentColor, strokeWidth: 2, opacity: 0.7 }}
            formatter={tooltipFormatter}
          />
          <Legend />
          {(visible === "both" || visible === "call") && (
            <Bar
              dataKey="call_oi"
              name="Call OI Δ"
              fill={callGray}
              barSize={16}
              radius={[4, 4, 0, 0]}
            />
          )}
          {(visible === "both" || visible === "put") && (
            <Bar
              dataKey="put_oi"
              name="Put OI Δ"
              fill={deepRed}
              barSize={16}
              radius={[4, 4, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AbsGamma1NetOIChart;
