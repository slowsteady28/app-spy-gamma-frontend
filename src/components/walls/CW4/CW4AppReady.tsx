import { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

import CW4WallChart from "./CW4WallChart";
import CW4NetOIChart from "./CW4NetOIChart";
import CW4NetGammaChart from "./CW4NetGammaChart";
import CW4DurationChart from "./CW4DurationChart";

const CW4AppReady = () => {
  const [lookback, setLookback] = useState<number>(400); // Default to 200 days

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        {/* Make the card take nearly the full width on all screens */}
        <Col xs={12} className="d-flex">
          <Card className="border-0 shadow-sm bg-body-emphasis d-flex flex-column h-100 w-100">
            <Card.Header className="bg-transparent border-0 pb-0 d-flex align-items-center">
              <span
                className="text-primary"
                aria-hidden="true"
                style={{ fontSize: "1.25rem" }}
              >
                📈
              </span>
              <span className="fw-semibold ms-2">CW4 - 4th Largest Wall</span>
              <div className="ms-auto d-flex align-items-center">
                <div className="d-flex flex-column align-items-end">
                  <Form.Select
                    value={lookback}
                    onChange={handleChange}
                    aria-label="Select lookback period"
                    size="sm"
                    style={{ minWidth: 120 }}
                  >
                    <option value={25}>25 Days</option>
                    <option value={50}>50 Days</option>
                    <option value={100}>100 Days</option>
                    <option value={200}>200 Days</option>
                    <option value={400}>400 Days</option>
                  </Form.Select>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="g-4">
                <Col xs={12} className="d-flex">
                  <Card className="border-0 shadow-sm bg-body-emphasis d-flex flex-column h-100 w-100">
                    <CW4WallChart
                      lookback={lookback}
                      selectedRange={null}
                      setSelectedRange={() => {}}
                      activeIndex={null}
                      setActiveIndex={() => {}}
                    />
                  </Card>
                </Col>
                <Col xs={12}>
                  <CW4NetOIChart
                    lookback={lookback}
                    selectedRange={null}
                    setSelectedRange={() => {}}
                    activeIndex={null}
                    setActiveIndex={() => {}}
                  />
                </Col>
                <Col xs={12}>
                  <CW4NetGammaChart lookback={lookback} />
                </Col>
                <Col xs={12}>
                  <CW4DurationChart lookback={lookback} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CW4AppReady;
