import { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

// Import PW1–PW5 charts
import PW1WallChart from "./PW1/PW1WallChart";
import PW1NetOIChart from "./PW1/PW1NetOIChart";
import PW1NetGammaChart from "./PW1/PW1NetGammaChart";
import PW1DurationChart from "./PW1/PW1DurationChart";

import PW2WallChart from "./PW2/PW2WallChart";
import PW2NetOIChart from "./PW2/PW2NetOIChart";
import PW2NetGammaChart from "./PW2/PW2NetGammaChart";
import PW2DurationChart from "./PW2/PW2DurationChart";

import PW3WallChart from "./PW3/PW3WallChart";
import PW3NetOIChart from "./PW3/PW3NetOIChart";
import PW3NetGammaChart from "./PW3/PW3NetGammaChart";
import PW3DurationChart from "./PW3/PW3DurationChart";

import PW4WallChart from "./PW4/PW4WallChart";
import PW4NetOIChart from "./PW4/PW4NetOIChart";
import PW4NetGammaChart from "./PW4/PW4NetGammaChart";
import PW4DurationChart from "./PW4/PW4DurationChart";

import PW5WallChart from "./PW5/PW5WallChart";
import PW5NetOIChart from "./PW5/PW5NetOIChart";
import PW5NetGammaChart from "./PW5/PW5NetGammaChart";
import PW5DurationChart from "./PW5/PW5DurationChart";

const PutWallsTopFive = () => {
  const [lookback, setLookback] = useState<number>(400);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  const walls = [
    {
      title: "PW1 - Largest Wall",
      WallChart: PW1WallChart,
      NetOIChart: PW1NetOIChart,
      NetGammaChart: PW1NetGammaChart,
      DurationChart: PW1DurationChart,
    },
    {
      title: "PW2 - 2nd Largest Wall",
      WallChart: PW2WallChart,
      NetOIChart: PW2NetOIChart,
      NetGammaChart: PW2NetGammaChart,
      DurationChart: PW2DurationChart,
    },
    {
      title: "PW3 - 3rd Largest Wall",
      WallChart: PW3WallChart,
      NetOIChart: PW3NetOIChart,
      NetGammaChart: PW3NetGammaChart,
      DurationChart: PW3DurationChart,
    },
    {
      title: "PW4 - 4th Largest Wall",
      WallChart: PW4WallChart,
      NetOIChart: PW4NetOIChart,
      NetGammaChart: PW4NetGammaChart,
      DurationChart: PW4DurationChart,
    },
    {
      title: "PW5 - 5th Largest Wall",
      WallChart: PW5WallChart,
      NetOIChart: PW5NetOIChart,
      NetGammaChart: PW5NetGammaChart,
      DurationChart: PW5DurationChart,
    },
  ];

  return (
    <Container fluid className="mt-4">
      <Row className="g-4">
        {walls.map((wall, index) => {
          const { title, WallChart, NetOIChart, NetGammaChart, DurationChart } =
            wall;
          return (
            <Col xs={12} key={index} className="d-flex">
              <Card
                className="border-0 shadow-sm bg-body-emphasis d-flex flex-column h-100 w-100"
                style={{ background: "transparent" }}
              >
                <Card.Header className="bg-transparent border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-end w-100">
                    <Form.Group className="mb-0" style={{ maxWidth: 220 }}>
                      <Form.Select
                        value={lookback}
                        onChange={handleChange}
                        aria-label="Select lookback period"
                        size="sm"
                        style={{
                          color: "#fff",
                          fontWeight: 700,
                          background: "#111",
                          border: "1px solid #b39ddb",
                          borderRadius: "6px",
                          boxShadow: "0 1px 4px rgba(111,66,193,0.08)",
                          fontFamily: "'Segoe UI', 'Arial', 'sans-serif'",
                        }}
                      >
                        <option value={25}>25 Days</option>
                        <option value={50}>50 Days</option>
                        <option value={100}>100 Days</option>
                        <option value={200}>200 Days</option>
                        <option value={400}>400 Days</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </Card.Header>
                <Card.Body style={{ background: "transparent" }}>
                  <Row className="g-0" style={{ background: "transparent" }}>
                    <Col xs={12}>
                      <WallChart
                        lookback={lookback}
                        selectedRange={null}
                        setSelectedRange={() => {}}
                        activeIndex={null}
                        setActiveIndex={() => {}}
                      />
                    </Col>
                    <Col xs={12}>
                      <NetOIChart
                        lookback={lookback}
                        selectedRange={null}
                        setSelectedRange={() => {}}
                        activeIndex={null}
                        setActiveIndex={() => {}}
                      />
                    </Col>
                    <Col xs={12}>
                      <NetGammaChart lookback={lookback} />
                    </Col>
                    <Col xs={12}>
                      <DurationChart lookback={lookback} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default PutWallsTopFive;
