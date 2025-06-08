import { Container, Row, Col, Card } from "react-bootstrap";

import AGS1StrikeChart from "./AGS1HisGammaChart";
import AGS1NetOIChart from "./AGS1NetOIChart";
import AGS1CallPutGammaChart from "./AGS1CallPutGammaChart";
import AGS1DurationChart from "./AGS1DurationChart";

const AGS1AppReady = () => {
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
            <AGS1StrikeChart lookback={25} />
          </Col>
          <Col md={6}>
            <AGS1NetOIChart lookback={25} />
          </Col>
          <Col md={6}>
            <AGS1CallPutGammaChart lookback={25} />
          </Col>
          <Col md={6}>
            <AGS1DurationChart lookback={25} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default AGS1AppReady;
