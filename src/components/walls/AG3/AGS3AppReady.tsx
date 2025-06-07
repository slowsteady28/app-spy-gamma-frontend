import { Container, Row, Col, Card } from "react-bootstrap";

import AGS3StrikeChart from "./AGS3HisGammaChart";
import AGS3NetOIChart from "./AGS3NetOIChart";
import AGS3NetGammaChart from "./AGS3CallPutGammaChart";
import AGS3DurationChart from "./AGS3DurationChart";

const AGS3AppReady = () => {
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
            <AGS3StrikeChart lookback={25} />
          </Col>
          <Col md={6}>
            <AGS3NetOIChart lookback={25} />
          </Col>
          <Col md={6}>
            <AGS3NetGammaChart lookback={25} />
          </Col>
          <Col md={6}>
            <AGS3DurationChart lookback={25} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default AGS3AppReady;
