import { Container, Row, Col, Card } from "react-bootstrap";

import PW2WallChart from "./PW2WallChart";
import PW2NetOIChart from "./PW2NetOIChart";
import PW2NetGammaChart from "./PW2NetGammaChart";
import PW2DurationChart from "./PW2DurationChart";

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
            <PW2WallChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW2NetOIChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <PW2NetGammaChart lookback={25} />
          </Col>
          <Col md={6}>
            <PW2DurationChart lookback={25} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default CW5AppReady;
