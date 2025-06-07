import { Container, Row, Col, Card } from "react-bootstrap";

import CW1WallChart from "./CW4WallChart";
import CW1NetOIChart from "./CW4NetOIChart";
import CW1NetGammaChart from "./CW4NetGammaChart";
import CW1DurationChart from "./CW4DurationChart";

const CW4AppReady = () => {
  return (
    <Container fluid className="mt-4">
      <Card className="mb-4 shadow-sm rounded-4 p-3">
        <Card.Title
          className="mb-3"
          style={{ fontSize: "1.2rem", fontWeight: 600 }}
        >
          4th Largest Wall
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

export default CW4AppReady;
