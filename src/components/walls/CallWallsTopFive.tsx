import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

// Import CW1–CW5 charts
import CW1WallChart from "./CW1/CW1WallChart";
import CW1NetOIChart from "./CW1/CW1NetOIChart";
import CW1NetGammaChart from "./CW1/CW1NetGammaChart";
import CW1DurationChart from "./CW1/CW1DurationChart";

import CW2WallChart from "./CW2/CW2WallChart";
import CW2NetOIChart from "./CW2/CW2NetOIChart";
import CW2NetGammaChart from "./CW2/CW2NetGammaChart";
import CW2DurationChart from "./CW2/CW2DurationChart";

import CW3WallChart from "./CW3/CW3WallChart";
import CW3NetOIChart from "./CW3/CW3NetOIChart";
import CW3NetGammaChart from "./CW3/CW3NetGammaChart";
import CW3DurationChart from "./CW3/CW3DurationChart";

import CW4WallChart from "./CW4/CW4WallChart";
import CW4NetOIChart from "./CW4/CW4NetOIChart";
import CW4NetGammaChart from "./CW4/CW4NetGammaChart";
import CW4DurationChart from "./CW4/CW4DurationChart";

import CW5WallChart from "./CW5/CW5WallChart";
import CW5NetOIChart from "./CW5/CW5NetOIChart";
import CW5NetGammaChart from "./CW5/CW5NetGammaChart";
import CW5DurationChart from "./CW5/CW5DurationChart";

const CallWallsTopFive = () => {
  const walls = [
    {
      title: "CW1 - Largest Wall",
      WallChart: CW1WallChart,
      NetOIChart: CW1NetOIChart,
      NetGammaChart: CW1NetGammaChart,
      DurationChart: CW1DurationChart,
    },
    {
      title: "CW2 - 2nd Largest Wall",
      WallChart: CW2WallChart,
      NetOIChart: CW2NetOIChart,
      NetGammaChart: CW2NetGammaChart,
      DurationChart: CW2DurationChart,
    },
    {
      title: "CW3 - 3rd Largest Wall",
      WallChart: CW3WallChart,
      NetOIChart: CW3NetOIChart,
      NetGammaChart: CW3NetGammaChart,
      DurationChart: CW3DurationChart,
    },
    {
      title: "CW4 - 4th Largest Wall",
      WallChart: CW4WallChart,
      NetOIChart: CW4NetOIChart,
      NetGammaChart: CW4NetGammaChart,
      DurationChart: CW4DurationChart,
    },
    {
      title: "CW5 - 5th Largest Wall",
      WallChart: CW5WallChart,
      NetOIChart: CW5NetOIChart,
      NetGammaChart: CW5NetGammaChart,
      DurationChart: CW5DurationChart,
    },
  ];

  return (
    <Container fluid className="mt-4">
      {walls.map((wall, index) => {
        const { title, WallChart, NetOIChart, NetGammaChart, DurationChart } =
          wall;
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
                <WallChart
                  lookback={25}
                  selectedRange={null}
                  setSelectedRange={() => {}}
                  activeIndex={null}
                  setActiveIndex={() => {}}
                />
              </Col>
              <Col md={6}>
                <NetOIChart
                  lookback={25}
                  selectedRange={null}
                  setSelectedRange={() => {}}
                  activeIndex={null}
                  setActiveIndex={() => {}}
                />
              </Col>
              <Col md={6}>
                <NetGammaChart lookback={25} />
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

export default CallWallsTopFive;
