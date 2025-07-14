import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

// Import CW1–CW5 charts
import CW1WallChart from "./CW1/CW1WallChart";
import CW1NetOIChart from "./CW1/CW1NetOIChart";
import CW1NetGammaChart from "./CW1/CW1NetGammaChart";
import CW1DurationChart from "./CW1/CW1DurationChart";

import CW2WallChart from "./CW2/CW2WallChart";
import CW2NetOIChart from "./CW2/CW2NetOIChart";
import CW2NetGammaChart from "./CW2/CW2NetGammaChart";
import CW2DurationChart from "./CW2/CW2DurationChart";

import CW3WallChart from "./CW3/CW3WallChart";
import CW3NetOIChart from "./CW3/CW3NetOIChart";
import CW3NetGammaChart from "./CW3/CW3NetGammaChart";
import CW3DurationChart from "./CW3/CW3DurationChart";

import CW4WallChart from "./CW4/CW4WallChart";
import CW4NetOIChart from "./CW4/CW4NetOIChart";
import CW4NetGammaChart from "./CW4/CW4NetGammaChart";
import CW4DurationChart from "./CW4/CW4DurationChart";

import CW5WallChart from "./CW5/CW5WallChart";
import CW5NetOIChart from "./CW5/CW5NetOIChart";
import CW5NetGammaChart from "./CW5/CW5NetGammaChart";
import CW5DurationChart from "./CW5/CW5DurationChart";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const CallWallsTopFive = () => {
  const [lookback, setLookback] = useState<number>(400);
  const [loadingWallIndex, setLoadingWallIndex] = useState<number | null>(null);
  const [lastUpdatedMap, setLastUpdatedMap] = useState<Record<number, Date>>(
    {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  const refreshWall = async (index: number) => {
    const endpoint = `${apiBaseUrl}/api/refresh-cw${index + 1}`;
    try {
      setLoadingWallIndex(index);
      const res = await fetch(endpoint, { method: "POST" });
      if (!res.ok) throw new Error(`Failed to refresh CW${index + 1}`);
      setLastUpdatedMap((prev) => ({
        ...prev,
        [index]: new Date(),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWallIndex(null);
    }
  };

  const walls = [
    {
      title: "CW1 - Largest Wall",
      WallChart: CW1WallChart,
      NetOIChart: CW1NetOIChart,
      NetGammaChart: CW1NetGammaChart,
      DurationChart: CW1DurationChart,
    },
    {
      title: "CW2 - 2nd Largest Wall",
      WallChart: CW2WallChart,
      NetOIChart: CW2NetOIChart,
      NetGammaChart: CW2NetGammaChart,
      DurationChart: CW2DurationChart,
    },
    {
      title: "CW3 - 3rd Largest Wall",
      WallChart: CW3WallChart,
      NetOIChart: CW3NetOIChart,
      NetGammaChart: CW3NetGammaChart,
      DurationChart: CW3DurationChart,
    },
    {
      title: "CW4 - 4th Largest Wall",
      WallChart: CW4WallChart,
      NetOIChart: CW4NetOIChart,
      NetGammaChart: CW4NetGammaChart,
      DurationChart: CW4DurationChart,
    },
    {
      title: "CW5 - 5th Largest Wall",
      WallChart: CW5WallChart,
      NetOIChart: CW5NetOIChart,
      NetGammaChart: CW5NetGammaChart,
      DurationChart: CW5DurationChart,
    },
  ];

  return (
    <Container fluid className="mt-4">
      <Row className="g-4">
        {walls.map((wall, index) => {
          const { title, WallChart, NetOIChart, NetGammaChart, DurationChart } =
            wall;

          const lastUpdated = lastUpdatedMap[index];

          return (
            <Col xs={12} key={index} className="d-flex">
              <Card
                className="border-0 shadow-sm bg-body-emphasis d-flex flex-column h-100 w-100"
                style={{ background: "transparent" }}
              >
                <Card.Header className="bg-transparent border-0 pb-0">
                  <div className="d-flex justify-content-between align-items-center w-100 flex-wrap gap-2">
                    <h5 className="mb-0 fw-bold"></h5>
                    <div className="d-flex align-items-center gap-0">
                      <Form.Group className="mb-0" style={{ maxWidth: 220 }}>
                        <Form.Select
                          value={lookback}
                          onChange={handleChange}
                          aria-label="Select lookback period"
                          size="sm"
                          style={{
                            color: "#fff",
                            fontWeight: 700,
                            background: "#111",
                            border: "1px solid #b39ddb",
                            borderRadius: "6px",
                            boxShadow: "0 1px 4px rgba(111,66,193,0.08)",
                            fontFamily: "'Segoe UI', 'Arial', 'sans-serif'",
                          }}
                        >
                          <option value={25}>25 Days</option>
                          <option value={50}>50 Days</option>
                          <option value={100}>100 Days</option>
                          <option value={200}>200 Days</option>
                          <option value={400}>400 Days</option>
                        </Form.Select>
                      </Form.Group>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => refreshWall(index)}
                        disabled={loadingWallIndex === index}
                      >
                        {loadingWallIndex === index
                          ? "Refreshing..."
                          : "Refresh"}
                      </Button>
                      <span className="text-dark small">
                        Last updated:{" "}
                        {lastUpdated
                          ? lastUpdated.toLocaleTimeString()
                          : "Never"}
                      </span>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body style={{ background: "transparent" }}>
                  <Row className="g-0" style={{ background: "transparent" }}>
                    <Col xs={12}>
                      <WallChart
                        lookback={lookback}
                        selectedRange={null}
                        setSelectedRange={() => {}}
                        activeIndex={null}
                        setActiveIndex={() => {}}
                      />
                    </Col>
                    <Col xs={12}>
                      <NetOIChart
                        lookback={lookback}
                        selectedRange={null}
                        setSelectedRange={() => {}}
                        activeIndex={null}
                        setActiveIndex={() => {}}
                      />
                    </Col>
                    <Col xs={12}>
                      <NetGammaChart lookback={lookback} />
                    </Col>
                    <Col xs={12}>
                      <DurationChart lookback={lookback} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default CallWallsTopFive;
