import { Container, Row, Col, Card } from "react-bootstrap";

import PW1WallChart from "./PW1WallChart";
import PW1NetOIChart from "./PW1NetOIChart";
import PW1NetGammaChart from "./PW1NetGammaChart";
import PW1DurationChart from "./PW1DurationChart";

const CW5AppReady = () => {
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
            <PW1WallChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW1NetOIChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW1NetGammaChart lookback={25} />
          </Col>
          <Col md={6}>
            <PW1DurationChart lookback={25} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default CW5AppReady;
