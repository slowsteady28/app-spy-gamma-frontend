import { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

import CW5WallChart from "./CW5WallChart";
import CW5NetOIChart from "./CW5NetOIChart";
import CW5NetGammaChart from "./CW5NetGammaChart";
import CW5DurationChart from "./CW5DurationChart";

const CW5AppReady = () => {
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
              <span className="fw-semibold">CW5 - 5th Largest Wall</span>
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
                    <CW5WallChart
                      lookback={lookback}
                      selectedRange={null}
                      setSelectedRange={() => {}}
                      activeIndex={null}
                      setActiveIndex={() => {}}
                    />
                  </Card>
                </Col>
                <Col xs={12}>
                  <CW5NetOIChart
                    lookback={lookback}
                    selectedRange={null}
                    setSelectedRange={() => {}}
                    activeIndex={null}
                    setActiveIndex={() => {}}
                  />
                </Col>
                <Col xs={12}>
                  <CW5NetGammaChart lookback={lookback} />
                </Col>
                <Col xs={12}>
                  <CW5DurationChart lookback={lookback} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CW5AppReady;
