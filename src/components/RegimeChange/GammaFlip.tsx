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

// API base URL
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type GammaFlipDataPoint = {
  date: string;
  price: number;
  gamma_flip: number;
};

const mainColor = "#0096b4"; // Teal for regime shift
const priceColor = "#ff9800"; // Orange for price

const GammaFlip = () => {
  const [lookback, setLookback] = useState<number>(400);
  const [data, setData] = useState<GammaFlipDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/gamma-flip?lookback=${lookback}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading Gamma Flip data", err));
  }, [lookback]);

  const minGammaFlip = Math.min(...data.map((d) => d.gamma_flip));
  const maxGammaFlip = Math.max(...data.map((d) => d.gamma_flip));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  return (
    <Card
      style={{
        background: "linear-gradient(120deg, #e0f7fa 0%, #fff 100%)",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0, 150, 180, 0.08)",
        marginBottom: "24px",
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
        Gamma Flip
      </Card.Header>
      <Card.Body style={{ background: "transparent" }}>
        <Row className="mb-3">
          <Col xs={12} md={4} lg={3}>
            <Form.Group>
              <Form.Label style={{ color: mainColor, fontWeight: 600 }}>
                Lookback Period
              </Form.Label>
              <Form.Select
                value={lookback}
                onChange={handleChange}
                aria-label="Select lookback period"
                style={{
                  width: "200px",
                  background: "#fff",
                  border: `1px solid ${mainColor}`,
                  color: mainColor,
                  fontWeight: "bold",
                }}
              >
                <option value={25}>25 Days</option>
                <option value={50}>50 Days</option>
                <option value={100}>100 Days</option>
                <option value={200}>200 Days</option>
                <option value={400}>400 Days</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis
              domain={[
                (dataMin: number) => dataMin - 5,
                (dataMax: number) => dataMax + 5,
              ]}
              tick={{ fill: mainColor }}
              label={{
                angle: -90,
                position: "insideLeft",
                fill: mainColor,
              }}
            />
            <Tooltip
              contentStyle={{ background: "#e0f7fa", borderColor: mainColor }}
              labelStyle={{ color: mainColor }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="gamma_flip"
              stroke={mainColor}
              strokeWidth={3}
              dot={false}
              name="Gamma Flip"
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={priceColor}
              strokeWidth={2}
              dot={false}
              name="Price"
              yAxisId={0}
              connectNulls
            />
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
