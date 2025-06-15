import { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

// Import AGS1–ABS3 charts
import AGS1StrikeChart from "./AG1/AGS1HisGammaChart";
import AGS1NetOIChart from "./AG1/AGS1NetOIChart";
import AGS1CallPutGammaChart from "./AG1/AGS1CallPutGammaChart";
import AGS1DurationChart from "./AG1/AGS1DurationChart";

import AGS2StrikeChart from "./AG2/AGS2HisGammaChart";
import AGS2NetOIChart from "./AG2/AGS2NetOIChart";
import AGS2CallPutGammaChart from "./AG2/AGS2CallPutGammaChart";
import AGS2DurationChart from "./AG2/AGS2DurationChart";

import AGS3StrikeChart from "./AG3/AGS3HisGammaChart";
import AGS3NetOIChart from "./AG3/AGS3NetOIChart";
import AGS3CallPutGammaChart from "./AG3/AGS3CallPutGammaChart";
import AGS3DurationChart from "./AG3/AGS3DurationChart";

const AbsGammaTopThree = () => {
  const [lookback, setLookback] = useState<number>(400);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  const walls = [
    {
      title: "AGS1 - Largest Wall",
      WallChart: AGS1StrikeChart,
      NetOIChart: AGS1NetOIChart,
      CallPutGammaChart: AGS1CallPutGammaChart,
      DurationChart: AGS1DurationChart,
    },
    {
      title: "AGS2 - 2nd Largest Wall",
      WallChart: AGS2StrikeChart,
      NetOIChart: AGS2NetOIChart,
      CallPutGammaChart: AGS2CallPutGammaChart,
      DurationChart: AGS2DurationChart,
    },
    {
      title: "AGS3 - 3rd Largest Wall",
      WallChart: AGS3StrikeChart,
      NetOIChart: AGS3NetOIChart,
      CallPutGammaChart: AGS3CallPutGammaChart,
      DurationChart: AGS3DurationChart,
    },
  ];

  return (
    <Container fluid className="mt-4">
      <Row className="g-4">
        {walls.map((wall, index) => {
          const {
            title,
            WallChart,
            NetOIChart,
            CallPutGammaChart,
            DurationChart,
          } = wall;
          return (
            <Col xs={12} key={index} className="d-flex">
              <Card
                className="border-0 shadow-sm bg-body-emphasis d-flex flex-column h-100 w-100"
                style={{ background: "transparent" }}
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
                <Card.Body style={{ background: "transparent" }}>
                  <Row className="g-3" style={{ background: "transparent" }}>
                    <Col xs={12}>
                      <WallChart lookback={lookback} />
                    </Col>
                    <Col xs={12}>
                      <NetOIChart lookback={lookback} />
                    </Col>
                    <Col xs={12}>
                      <CallPutGammaChart lookback={lookback} />
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

export default AbsGammaTopThree;
