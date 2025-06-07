import { Container, Row, Col, Card } from "react-bootstrap";

import PW5WallChart from "./PW5WallChart";
import PW5NetOIChart from "./PW5NetOIChart";
import PW5NetGammaChart from "./PW5NetGammaChart";
import PW5DurationChart from "./PW5DurationChart";

const PW5AppReady = () => {
  return (
    <Container fluid className="mt-4">
      <Card className="mb-4 shadow-sm rounded-4 p-3">
        <Card.Title
          className="mb-3"
          style={{ fontSize: "1.2rem", fontWeight: 600 }}
        >
          5th Largest Wall
        </Card.Title>
        <Row className="g-3">
          <Col md={6}>
            <PW5WallChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW5NetOIChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW5NetGammaChart lookback={25} />
          </Col>
          <Col md={6}>
            <PW5DurationChart lookback={25} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default PW5AppReady;
