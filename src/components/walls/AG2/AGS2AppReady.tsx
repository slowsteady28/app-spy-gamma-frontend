import { Container, Row, Col, Card } from "react-bootstrap";

import AGS2StrikeChart from "./AGS2HisGammaChart";
import AGS2NetOIChart from "./AGS2NetOIChart";
import AGS2NetGammaChart from "./AGS2CallPutGammaChart";
import AGS2DurationChart from "./AGS2DurationChart";

const AGS2AppReady = () => {
  return (
    <Container fluid className="mt-4">
      <Card className="mb-4 shadow-sm rounded-4 p-3">
        <Card.Title
          className="mb-3"
          style={{ fontSize: "1.2rem", fontWeight: 600 }}
        >
          Largest Call Wall
        </Card.Title>
        <Row className="g-3">
          <Col md={6}>
            <AGS2StrikeChart lookback={25} />
          </Col>
          <Col md={6}>
            <AGS2NetOIChart lookback={25} />
          </Col>
          <Col md={6}>
            <AGS2NetGammaChart lookback={25} />
          </Col>
          <Col md={6}>
            <AGS2DurationChart lookback={25} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default AGS2AppReady;
