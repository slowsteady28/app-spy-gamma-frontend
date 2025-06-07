import { Container, Row, Col, Card } from "react-bootstrap";

import CW1WallChart from "./CW2WallChart";
import CW1NetOIChart from "./CW2NetOIChart";
import CW1NetGammaChart from "./CW2NetGammaChart";
import CW1DurationChart from "./CW2DurationChart";

const CW2AppReady = () => {
  return (
    <Container fluid className="mt-4">
      <Card className="mb-4 shadow-sm rounded-4 p-3">
        <Card.Title
          className="mb-3"
          style={{ fontSize: "1.2rem", fontWeight: 600 }}
        >
          2nd Largest Call Walls
        </Card.Title>
        <Row className="g-3">
          <Col md={6}>
            <CW1WallChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <CW1NetOIChart
              lookback={25}
              selectedRange={null}
              setSelectedRange={() => {}}
              activeIndex={null}
              setActiveIndex={() => {}}
            />
          </Col>
          <Col md={6}>
            <CW1NetGammaChart lookback={25} />
          </Col>
          <Col md={6}>
            <CW1DurationChart lookback={25} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default CW2AppReady;
