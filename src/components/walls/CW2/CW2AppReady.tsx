import { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

import CW2WallChart from "./CW2WallChart";
import CW2NetOIChart from "./CW2NetOIChart";
import CW2NetGammaChart from "./CW2NetGammaChart";
import CW2DurationChart from "./CW2DurationChart";

const mainColor = "#0096b4"; // Teal for brand consistency
const priceColor = "#212529";

const CW2AppReady = () => {
  const [lookback, setLookback] = useState<number>(400);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  return (
    <div
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #f8f9fa 60%, #e0f7fa 100%)", // Teal tint
      }}
    >
      <Container
        fluid
        className="mt-4"
        style={{ background: "transparent", padding: 0 }}
      >
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
                <div className="d-flex align-items-center justify-content-end w-100">
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
                        border: `1px solid ${mainColor}`,
                        borderRadius: "6px",
                        boxShadow: `0 1px 4px ${mainColor}14`, // ~8% opacity
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
                  <Col
                    xs={12}
                    style={{ background: "transparent", padding: 0 }}
                  >
                    <CW2NetGammaChart lookback={lookback} />
                  </Col>
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
      </Container>
    </div>
  );
};

export default CW2AppReady;
