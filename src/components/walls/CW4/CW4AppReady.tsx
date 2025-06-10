import { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

import CW4WallChart from "./CW4WallChart";
import CW4NetOIChart from "./CW4NetOIChart";
import CW4NetGammaChart from "./CW4NetGammaChart";
import CW4DurationChart from "./CW4DurationChart";

const CW4AppReady = () => {
  const [lookback, setLookback] = useState<number>(25);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} className="d-flex">
          <Card className="border-0 shadow-sm bg-body-emphasis d-flex flex-column h-100 w-100">
            <Card.Header className="bg-transparent border-0 pb-0 d-flex align-items-center gap-2">
              <span
                className="text-primary"
                aria-hidden="true"
                style={{ fontSize: "1.25rem" }}
              >
                📈
              </span>
              <span className="fw-semibold">CW4 - 4th Largest Wall</span>
            </Card.Header>
            <Card.Body>
              <Form.Group as={Col} md="6" className="mb-4">
                <Form.Label>Lookback Period</Form.Label>
                <Form.Select
                  value={lookback}
                  onChange={handleChange}
                  aria-label="Select lookback period"
                >
                  <option value={25}>25 Days</option>
                  <option value={50}>50 Days</option>
                  <option value={100}>100 Days</option>
                  <option value={200}>200 Days</option>
                </Form.Select>
              </Form.Group>
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
