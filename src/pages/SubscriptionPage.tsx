// src/pages/SubscriptionPage.tsx
import React, { useState } from "react";
import { Container, Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const mainColor = "#0096b4";

const SubscriptionPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (tier: string) => {
    const priceId =
      tier === "Monthly"
        ? "price_1ReDqkCZcIMUk0bKwgKh7BGw"
        : "price_1ReDt9CZcIMUk0bKhxCin1ia";

    if (!email) {
      alert("Please enter your email before continuing.");
      return;
    }

    localStorage.setItem("email", email); // ✅ Save email before redirect

    try {
      const response = await fetch(`${apiBaseUrl}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price_id: priceId, email }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else if (data?.error && data?.tier) {
        alert(
          `You're already subscribed to the ${data.tier} plan. No need to purchase again.`
        );
      } else if (data?.error) {
        alert(data.error);
      } else {
        alert("Unexpected error. Please try again or contact support.");
        console.error("Response data:", data);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to redirect to checkout.");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "60vh" }}
    >
      <Card
        className="shadow-lg text-center"
        style={{
          maxWidth: 600,
          width: "100%",
          borderRadius: "1.5rem",
          padding: "2.5rem 2rem",
          border: "none",
        }}
      >
        <h2
          className="fw-bold mb-3"
          style={{ color: mainColor, fontSize: "2.2rem" }}
        >
          Unlock the Gamma Terminal
        </h2>
        <p style={{ color: "#495057", fontSize: "1.05rem" }}>
          Start your free 7-day trial. Cancel anytime.
        </p>

        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: 8, padding: "0.75rem" }}
            />
          </Form.Group>
        </Form>

        {error && (
          <Alert variant="danger" className="py-2 text-center">
            {error}
          </Alert>
        )}

        <div className="d-grid gap-3 mt-4">
          <Button
            onClick={() => handleSubscribe("Monthly")}
            style={{
              background: mainColor,
              border: "none",
              borderRadius: 10,
              padding: "0.75rem 0",
              fontWeight: 600,
              fontSize: "1.1rem",
              boxShadow: "0 0 10px rgba(0,150,180,0.4)",
            }}
            disabled={loading}
          >
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Start Monthly – $100/mo"
            )}
          </Button>

          <Button
            onClick={() => handleSubscribe("Annual")}
            style={{
              background: "#198754",
              border: "none",
              borderRadius: 10,
              padding: "0.75rem 0",
              fontWeight: 600,
              fontSize: "1.1rem",
              boxShadow: "0 0 10px rgba(25,135,84,0.4)",
            }}
            disabled={loading}
          >
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Save with Annual – $1,000/yr"
            )}
          </Button>

          <Button
            onClick={handleLoginRedirect}
            variant="outline-secondary"
            style={{
              borderRadius: 10,
              padding: "0.75rem 0",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Already Subscribed? Log In
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default SubscriptionPage;
