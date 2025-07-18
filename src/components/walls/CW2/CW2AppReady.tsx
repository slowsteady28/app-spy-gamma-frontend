import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { ChartSyncProvider } from "../../../context/ChartSyncContext";

import CW2WallChart from "./CW2WallChart";
import CW2NetOIChart from "./CW2NetOIChart";
import CW2NetGammaChart from "./CW2NetGammaChart";
import CW2DurationChart from "./CW2DurationChart";
import ChartSkeleton from "../utils/ChartSkeleton";

const mainColor = "#0096b4";
const priceColor = "#212529";
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const CW2AppReady = () => {
  const [lookback, setLookback] = useState<number>(400);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  const refreshCW2Data = () => {
    setLoading(true); // show skeleton immediately

    // Wait 3 seconds, then perform fetch
    setTimeout(() => {
      fetch(`${apiBaseUrl}/api/refresh-cw2`, { method: "POST" })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to refresh CW2 data");
          return res.json();
        })
        .then(() => setLastUpdated(new Date()))
        .catch((err) => console.error("Refresh CW2 error:", err))
        .finally(() => setLoading(false)); // hide skeleton once done
    }, 2000);
  };

  if (loading) return <ChartSkeleton />;

  return (
    <div
      style={{
        width: "100%",
        background:
          "linear-gradient(90deg, rgb(248, 249, 250) 60%, rgb(233, 236, 239) 100%)",
      }}
    >
      <Container
        fluid
        className="mt-4"
        style={{
          width: "100%",
          background: "linear-gradient(90deg, #f8f9fa 60%, #e9ecef 100%)",
          boxShadow:
            "inset 0 0 24px rgba(0, 150, 180, 0.08), 0 0 32px rgba(0, 150, 180, 0.08)",
          paddingBottom: "2rem",
          position: "relative",
        }}
      >
        <ChartSyncProvider>
          <Row
            className="justify-content-center"
            style={{ background: "transparent", margin: 0 }}
          >
            <Col
              xs={12}
              className="d-flex"
              style={{ background: "transparent", padding: 0 }}
            >
              <Card
                className="border-0 shadow-sm d-flex flex-column h-100 w-100"
                style={{ background: "transparent", boxShadow: "none" }}
              >
                <Card.Header className="bg-transparent border-0 pb-0">
                  <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap w-100">
                    <Form.Group
                      className="mb-2 mb-md-0"
                      style={{ maxWidth: 220 }}
                    >
                      <Form.Select
                        value={lookback}
                        onChange={handleChange}
                        aria-label="Select lookback period"
                        size="sm"
                        style={{
                          color: "#fff",
                          fontWeight: 700,
                          background: "#111",
                          border: `1px solid ${mainColor}`,
                          borderRadius: "6px",
                          boxShadow: `0 1px 4px ${mainColor}14`,
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
                      onClick={refreshCW2Data}
                      disabled={loading}
                    >
                      {loading ? "Refreshing..." : "Refresh"}
                    </Button>
                    <span className="text-dark small">
                      Last updated:{" "}
                      {lastUpdated ? lastUpdated.toLocaleTimeString() : "Never"}
                    </span>
                  </div>
                </Card.Header>

                <Card.Body style={{ background: "transparent", padding: 0 }}>
                  <Row
                    className="g-0"
                    style={{ background: "transparent", margin: 0 }}
                  >
                    <Col
                      xs={12}
                      style={{ background: "transparent", padding: 0 }}
                    >
                      <CW2WallChart
                        lookback={lookback}
                        selectedRange={null}
                        setSelectedRange={() => {}}
                        activeIndex={null}
                        setActiveIndex={() => {}}
                      />
                    </Col>
                  </Row>

                  <Row
                    className="g-0"
                    style={{ background: "transparent", margin: 0 }}
                  >
                    <Col
                      xs={12}
                      style={{ background: "transparent", padding: 0 }}
                    >
                      <CW2NetOIChart
                        lookback={lookback}
                        selectedRange={null}
                        setSelectedRange={() => {}}
                        activeIndex={null}
                        setActiveIndex={() => {}}
                      />
                    </Col>
                  </Row>

                  <Row
                    className="g-0"
                    style={{ background: "transparent", margin: 0 }}
                  >
                    <Col
                      xs={12}
                      style={{ background: "transparent", padding: 0 }}
                    >
                      <CW2NetGammaChart lookback={lookback} />
                    </Col>
                  </Row>

                  <Row
                    className="g-0"
                    style={{ background: "transparent", margin: 0 }}
                  >
                    <Col
                      xs={12}
                      style={{ background: "transparent", padding: 0 }}
                    >
                      <CW2DurationChart lookback={lookback} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </ChartSyncProvider>
      </Container>
    </div>
  );
};

export default CW2AppReady;
