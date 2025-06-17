import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

// API base URL
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type GammaFlipDataPoint = {
  date: string;
  price: number;
  gamma_flip: number;
  vix: number;
  call_wall: number;
  put_wall: number;
  abs_gamma: number;
};

// Optimized color scheme for high contrast and clarity
const mainColor = "#0096b4"; // Gamma Flip - Teal
const priceColor = "#d7263d"; // Price - Vivid Red
const vixColor = "#7c3aed"; // VIX - Vivid Purple
const callWallColor = "#fbbf24"; // Call Wall - Amber/Gold
const putWallColor = "#10b981"; // Put Wall - Emerald Green
const absGammaColor = "#6366f1"; // Abs Gamma - Indigo

const lineOptions = [
  { key: "gamma_flip", label: "Gamma Flip", color: mainColor },
  { key: "price", label: "Price", color: priceColor },
  { key: "call_wall", label: "Call Wall", color: callWallColor },
  { key: "put_wall", label: "Put Wall", color: putWallColor },
  { key: "abs_gamma", label: "Abs Gamma", color: absGammaColor },
  { key: "vix", label: "Vix", color: vixColor },
];

const GammaFlip = () => {
  const [lookback, setLookback] = useState<number>(400);
  const [data, setData] = useState<GammaFlipDataPoint[]>([]);
  const [visibleLines, setVisibleLines] = useState<string[]>([
    "gamma_flip",
    "price",
    "call_wall",
    "put_wall",
    "abs_gamma",
    "vix",
  ]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/gamma-flip?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading Gamma Flip data", err));
  }, [lookback]);

  const minGammaFlip = Math.min(...data.map((d) => d.gamma_flip));
  const maxGammaFlip = Math.max(...data.map((d) => d.gamma_flip));

  // Calculate min/max for Vix for right Y axis
  const vixValues = data
    .map((d) => d.vix)
    .filter((v) => typeof v === "number" && !isNaN(v));
  const minVix = vixValues.length ? Math.min(...vixValues) : 0;
  const maxVix = vixValues.length ? Math.max(...vixValues) : 100;

  // Calculate min/max for all left-axis metrics
  const leftAxisKeys = [
    "gamma_flip",
    "price",
    "call_wall",
    "put_wall",
    "abs_gamma",
  ];
  const leftAxisValues = data
    .flatMap((d) =>
      leftAxisKeys.map((key) => {
        const val = d[key as keyof typeof d];
        return typeof val === "number" && !isNaN(val) ? val : undefined;
      })
    )
    .filter((v): v is number => typeof v === "number" && !isNaN(v));

  // Exclude zeros if you don't want them as min
  const nonZeroLeftAxisValues = leftAxisValues.filter((v) => v !== 0);
  const minLeft = nonZeroLeftAxisValues.length
    ? Math.min(...nonZeroLeftAxisValues)
    : 0;
  const maxLeft = leftAxisValues.length ? Math.max(...leftAxisValues) : 100;

  console.log("leftAxisValues:", leftAxisValues, "minLeft:", minLeft); // Debugging line

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  const toggleLine = (key: string) => {
    setVisibleLines((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <Card
      style={{
        background: "linear-gradient(120deg, #e0f7fa 0%, #fff 100%)",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0, 150, 180, 0.08)",
        marginBottom: "24px",
        marginTop: "10.5rem", // Add this line to push the card down
      }}
    >
      <Card.Header
        style={{
          background: "linear-gradient(90deg, #0096b4 0%, #80deea 100%)",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.2rem",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          borderBottom: "none",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <span>Gamma Flip</span>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <ButtonGroup className="me-2">
              {lineOptions.map((opt) => (
                <Button
                  key={opt.key}
                  variant={
                    visibleLines.includes(opt.key) ? "dark" : "outline-dark"
                  }
                  size="sm"
                  style={{
                    fontWeight: 500,
                    color: visibleLines.includes(opt.key) ? "#fff" : opt.color,
                    borderColor: opt.color,
                    background: visibleLines.includes(opt.key)
                      ? opt.color
                      : "#fff",
                  }}
                  onClick={() => toggleLine(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
            </ButtonGroup>
            <Form.Group className="mb-0" style={{ minWidth: 200 }}>
              <Form.Select
                value={lookback}
                onChange={handleChange}
                aria-label="Select lookback period"
                style={{
                  width: "160px",
                  background: "#fff",
                  border: `1px solid ${mainColor}`,
                  color: mainColor,
                  fontWeight: "bold",
                  fontSize: "0.98rem",
                  marginLeft: "auto",
                }}
                size="sm"
              >
                <option value={25}>25 Days</option>
                <option value={50}>50 Days</option>
                <option value={100}>100 Days</option>
                <option value={200}>200 Days</option>
                <option value={400}>400 Days</option>
              </Form.Select>
            </Form.Group>
          </div>
        </div>
      </Card.Header>
      <Card.Body style={{ background: "transparent" }}>
        <ResponsiveContainer width="100%" height={1200}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            {/* Left Y Axis for Gamma Flip, Price, Call Wall, Put Wall, Abs Gamma */}
            <YAxis
              yAxisId="left"
              domain={[
                (dataMin: number) => {
                  // Exclude zeros for min calculation
                  const filtered = leftAxisValues.filter((v) => v !== 0);
                  return filtered.length ? Math.min(...filtered) : 0;
                },
                (dataMax: number) => maxLeft + 5,
              ]}
              tick={{ fill: mainColor }}
              label={{
                angle: -90,
                position: "insideLeft",
                fill: mainColor,
              }}
            />
            {/* Right Y Axis for Vix */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[minVix - 5, maxVix + 5]}
              tick={{ fill: vixColor }}
              label={{
                angle: 90,
                position: "insideRight",
                fill: vixColor,
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{ background: "#e0f7fa", borderColor: mainColor }}
              labelStyle={{ color: mainColor }}
            />
            <Legend />
            {visibleLines.includes("gamma_flip") && (
              <Line
                type="monotone"
                dataKey="gamma_flip"
                stroke={mainColor}
                strokeWidth={3}
                dot={false}
                name="Gamma Flip"
                yAxisId="left"
              />
            )}
            {visibleLines.includes("price") && (
              <Line
                type="monotone"
                dataKey="price"
                stroke={priceColor}
                strokeWidth={2}
                dot={false}
                name="Price"
                yAxisId="left"
                connectNulls
              />
            )}
            {visibleLines.includes("call_wall") && (
              <Line
                type="monotone"
                dataKey="call_wall"
                stroke={callWallColor}
                strokeWidth={2}
                dot={false}
                name="Call Wall"
                yAxisId="left"
                connectNulls
              />
            )}
            {visibleLines.includes("put_wall") && (
              <Line
                type="monotone"
                dataKey="put_wall"
                stroke={putWallColor}
                strokeWidth={2}
                dot={false}
                name="Put Wall"
                yAxisId="left"
                connectNulls
              />
            )}
            {visibleLines.includes("abs_gamma") && (
              <Line
                type="monotone"
                dataKey="abs_gamma"
                stroke={absGammaColor}
                strokeWidth={2}
                dot={false}
                name="Abs Gamma"
                yAxisId="left"
                connectNulls
              />
            )}
            {visibleLines.includes("vix") && (
              <Line
                type="monotone"
                dataKey="vix"
                stroke={vixColor}
                strokeWidth={2}
                dot={false}
                name="Vix"
                yAxisId="right"
                connectNulls
              />
            )}
            <Brush
              dataKey="date"
              height={24}
              stroke={mainColor}
              travellerWidth={8}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default GammaFlip;
