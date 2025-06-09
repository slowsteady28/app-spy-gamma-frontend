import { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

import PW5WallChart from "./PW5WallChart";
import PW5NetOIChart from "./PW5NetOIChart";
import PW5NetGammaChart from "./PW5NetGammaChart";
import PW5DurationChart from "./PW5DurationChart";

const PW5AppReady = () => {
  const [lookback, setLookback] = useState<number>(25);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };
  return (
    <Container fluid className="mt-4">
      <Card className="mb-4 shadow-sm rounded-4 p-3">
        <Card.Title
          className="mb-3"
          style={{ fontSize: "1.2rem", fontWeight: 600 }}
        >
          5th Largest Wall
        </Card.Title>
        <Form.Group as={Col} md="3" className="mb-4">
          <Form.Label>Lookback Period</Form.Label>
          <Form.Select value={lookback} onChange={handleChange}>
            <option value={25}>25 Days</option>
            <option value={50}>50 Days</option>
            <option value={100}>100 Days</option>
            <option value={200}>200 Days</option>
          </Form.Select>
        </Form.Group>
        <Row className="g-3">
          <Col md={6}>
            <PW5WallChart
              lookback={lookback}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW5NetOIChart
              lookback={lookback}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW5NetGammaChart lookback={lookback} />
          </Col>
          <Col md={6}>
            <PW5DurationChart lookback={lookback} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default PW5AppReady;
