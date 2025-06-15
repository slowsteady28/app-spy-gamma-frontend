import { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

import PW3WallChart from "./PW3WallChart";
import PW3NetOIChart from "./PW3NetOIChart";
import PW3NetGammaChart from "./PW3NetGammaChart";
import PW3DurationChart from "./PW3DurationChart";

const mainColor = "#6f42c1";
const priceColor = "#212529";

const PW3AppReady = () => {
  const [lookback, setLookback] = useState<number>(400);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  return (
    <div
      style={{
        // minHeight: "100vh", // Removed as requested
        width: "100%",
        background: "linear-gradient(90deg, #f8f9fa 60%, #ede7f6 100%)",
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
                    <PW3WallChart
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
                    <PW3NetOIChart
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
                    <PW3NetGammaChart lookback={lookback} />
                  </Col>
                  <Col
                    xs={12}
                    style={{ background: "transparent", padding: 0 }}
                  >
                    <PW3DurationChart lookback={lookback} />
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

export default PW3AppReady;
