import { Container, Row, Col, Card } from "react-bootstrap";

import PW4WallChart from "./PW4WallChart";
import PW4NetOIChart from "./PW4NetOIChart";
import PW4NetGammaChart from "./PW4NetGammaChart";
import PW4DurationChart from "./PW4DurationChart";

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
            <PW4WallChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW4NetOIChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW4NetGammaChart lookback={25} />
          </Col>
          <Col md={6}>
            <PW4DurationChart lookback={25} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default CW5AppReady;
