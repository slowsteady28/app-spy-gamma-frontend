import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

// Import AGS1–ABS3 charts
import AGS1StrikeChart from "./AG1/AGS1HisGammaChart";
import AGS1NetOIChart from "./AG1/AGS1NetOIChart";
import AGS1CallPutGammaChart from "./AG1/AGS1CallPutGammaChart";
import AGS1DurationChart from "./AG1/AGS1DurationChart";

import AGS2StrikeChart from "./AG2/AGS2HisGammaChart";
import AGS2NetOIChart from "./AG2/AGS2NetOIChart";
import AGS2CallPutGammaChart from "./AG2/AGS2CallPutGammaChart";
import AGS2DurationChart from "./AG2/AGS2DurationChart";

import AGS3StrikeChart from "./AG3/AGS3HisGammaChart";
import AGS3NetOIChart from "./AG3/AGS3NetOIChart";
import AGS3CallPutGammaChart from "./AG3/AGS3CallPutGammaChart";
import AGS3DurationChart from "./AG3/AGS3DurationChart";

const AbsGammaTopThree = () => {
  const walls = [
    {
      title: "AGS1 - Largest Wall",
      WallChart: AGS1StrikeChart,
      NetOIChart: AGS1NetOIChart,
      CallPutGammaChart: AGS1CallPutGammaChart,
      DurationChart: AGS1DurationChart,
    },
    {
      title: "AGS2 - 2nd Largest Wall",
      WallChart: AGS2StrikeChart,
      NetOIChart: AGS2NetOIChart,
      CallPutGammaChart: AGS2CallPutGammaChart,
      DurationChart: AGS2DurationChart,
    },
    {
      title: "AGS3 - 3rd Largest Wall",
      WallChart: AGS3StrikeChart,
      NetOIChart: AGS3NetOIChart,
      CallPutGammaChart: AGS3CallPutGammaChart,
      DurationChart: AGS3DurationChart,
    },
  ];

  return (
    <Container fluid className="mt-4">
      {walls.map((wall, index) => {
        const {
          title,
          WallChart,
          NetOIChart,
          CallPutGammaChart,
          DurationChart,
        } = wall;
        return (
          <Card key={index} className="mb-4 shadow-sm rounded-4 p-3">
            <Card.Title
              className="mb-3"
              style={{ fontSize: "1.2rem", fontWeight: 600 }}
            >
              {title}
            </Card.Title>
            <Row className="g-3">
              <Col md={6}>
                <WallChart lookback={25} />
              </Col>
              <Col md={6}>
                <NetOIChart lookback={25} />
              </Col>
              <Col md={6}>
                <AGS1CallPutGammaChart lookback={25} />
              </Col>
              <Col md={6}>
                <DurationChart lookback={25} />
              </Col>
            </Row>
          </Card>
        );
      })}
    </Container>
  );
};

export default AbsGammaTopThree;
