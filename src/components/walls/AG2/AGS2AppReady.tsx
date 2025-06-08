import { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

import AGS2StrikeChart from "./AGS2HisGammaChart";
import AGS2NetOIChart from "./AGS2NetOIChart";
import AGS2CallPutGammaChart from "./AGS2CallPutGammaChart";
import AGS2DurationChart from "./AGS2DurationChart";

const AGS2AppReady = () => {
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
            <AGS2StrikeChart lookback={lookback} />
          </Col>
          <Col md={6}>
            <AGS2NetOIChart lookback={lookback} />
          </Col>
          <Col md={6}>
            <AGS2CallPutGammaChart lookback={lookback} />
          </Col>
          <Col md={6}>
            <AGS2DurationChart lookback={lookback} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default AGS2AppReady;
