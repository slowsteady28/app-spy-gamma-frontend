import { Container, Row, Col, Card } from "react-bootstrap";

import PW3WallChart from "./PW3WallChart";
import PW3NetOIChart from "./PW3NetOIChart";
import PW3NetGammaChart from "./PW3NetGammaChart";
import PW3DurationChart from "./PW3DurationChart";

const PW3AppReady = () => {
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
            <PW3WallChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW3NetOIChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW3NetGammaChart lookback={25} />
          </Col>
          <Col md={6}>
            <PW3DurationChart lookback={25} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default PW3AppReady;
