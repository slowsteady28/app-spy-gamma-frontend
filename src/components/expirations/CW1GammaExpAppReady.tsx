import { useState } from "react";
import { Card, Form, Row, Col, Container } from "react-bootstrap";
import CW1LongTermExpChart from "./CW1LongTermExpChart";
import CW1MidTermExpChart from "./CW1MidTermExpChart";
import CW1NearTermExpChart from "./CW1NearTermExpChart";

const mainColor = "#0096b4";

const CW1LongTermExp = () => {
  const [lookback, setLookback] = useState<number>(100);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLookback(Number(e.target.value));
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "75vh",
        paddingTop: "9vh", // ⬅️ Pushes background and charts down by 20% of viewport height
        background: `
          transparent
        `,
        backgroundAttachment: "fixed",
        paddingBottom: "225px",
        transition: "background 0.5s ease-in-out",
      }}
    >
      <Container
        fluid
        className="px-4"
        style={{
          background: "transparent",
          maxWidth: "100%",
        }}
      >
        <Row className="justify-content-center" style={{ margin: 0 }}>
          <Col xs={12} style={{ padding: 0 }}>
            <Card
              className="border-0 d-flex flex-column h-100 w-100"
              style={{
                background: "rgba(24, 28, 32, 0.88)",
                backdropFilter: "blur(6px)",
                borderRadius: "16px",
                boxShadow: "0 0 30px rgba(0, 150, 180, 0.12)",
                animation: "fadeIn 1s ease",
              }}
            >
              <Card.Header className="bg-transparent border-0 pb-2">
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
                        border: `1px solid ${mainColor}`,
                        borderRadius: "6px",
                        boxShadow: `0 1px 4px ${mainColor}40`,
                        fontFamily: "'Segoe UI', 'Arial', 'sans-serif'",
                      }}
                    >
                      <option value={50}>50 Days</option>
                      <option value={100}>100 Days</option>
                      <option value={200}>200 Days</option>
                      <option value={400}>400 Days</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </Card.Header>

              <Card.Body
                style={{ background: "transparent", padding: "0 1rem" }}
              >
                <Row className="g-0" style={{ margin: "0 0 64px 0" }}>
                  <Col xs={12} style={{ padding: 0 }}>
                    <CW1LongTermExpChart lookback={lookback} />
                  </Col>
                </Row>

                <Row className="g-0" style={{ margin: 0 }}>
                  <Col xs={12} style={{ padding: 0 }}>
                    <CW1MidTermExpChart lookback={lookback} />
                  </Col>
                </Row>
                <Row className="g-0" style={{ margin: 0 }}>
                  <Col xs={12} style={{ padding: 0 }}>
                    <CW1NearTermExpChart lookback={lookback} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CW1LongTermExp;
