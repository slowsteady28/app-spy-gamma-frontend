import { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

import CW1WallChart from "./CW1WallChart";
import CW1NetOIChart from "./CW1NetOIChart";
import CW1NetGammaChart from "./CW1NetGammaChart";
import CW1DurationChart from "./CW1DurationChart";

const CW1AppReady = () => {
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
          Largest Call Wall
        </Card.Title>
        {/* Dropdown Menu for Lookback Period Selection */}
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
            <CW1WallChart
              lookback={lookback}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <CW1NetOIChart
              lookback={lookback}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <CW1NetGammaChart lookback={lookback} />
          </Col>
          <Col md={6}>
            <CW1DurationChart lookback={lookback} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default CW1AppReady;
