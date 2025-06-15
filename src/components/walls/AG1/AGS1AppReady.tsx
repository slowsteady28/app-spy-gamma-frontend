import { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

import AbsGamma1WallChart from "./AGS1HisGammaChart";
import AbsGamma1NetOIChart from "./AGS1NetOIChart";
import AGS1CallPutGammaChart from "./AGS1CallPutGammaChart";
import AbsGamma1DurationChart from "./AGS1DurationChart";

const mainColor = "#212529"; // Dark Gray
const highlightColor = "#495057"; // Slightly lighter gray for contrast

const AbsGamma1AppReady = () => {
  const [lookback, setLookback] = useState<number>(400);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  return (
    <div
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #f8f9fa 60%, #d3d3d3 100%)", // Subtle grayish background
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
                        background: mainColor,
                        border: `1px solid ${highlightColor}`,
                        borderRadius: "6px",
                        boxShadow: `0 1px 4px ${mainColor}22`, // ~13% opacity
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
                  <Col xs={12} style={{ padding: 0 }}>
                    <AbsGamma1WallChart lookback={lookback} />
                  </Col>
                  <Col xs={12} style={{ padding: 0 }}>
                    <AbsGamma1NetOIChart lookback={lookback} />
                  </Col>
                  <Col xs={12} style={{ padding: 0 }}>
                    <AGS1CallPutGammaChart lookback={lookback} />
                  </Col>
                  <Col xs={12} style={{ padding: 0 }}>
                    <AbsGamma1DurationChart lookback={lookback} />
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

export default AbsGamma1AppReady;
