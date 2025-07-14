import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const mainColor = "#0096b4";

const CustomerPage: React.FC = () => {
  const email = localStorage.getItem("email") || "Not available";
  const [subscriptionTier, setSubscriptionTier] = useState("Loading...");
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState("Loading...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/subscription-status`, {
          params: { email },
        });
        setSubscriptionTier(response.data.tier);
        setSubscriptionStatus(response.data.status); // ✅ add this line
        setSubscriptionId(response.data.subscription_id);
      } catch (err) {
        setError("Unable to fetch subscription.");
        setSubscriptionTier("None");
        setSubscriptionStatus("inactive");
      }
    };

    fetchSubscription();
  }, [email]);

  const handleCancel = async () => {
    if (!subscriptionId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${apiBaseUrl}/cancel-subscription`, {
        subscription_id: subscriptionId,
      });
      if (response.data.status === "canceled") {
        setSubscriptionTier("Canceled");
      } else {
        setError("Failed to cancel subscription.");
      }
    } catch (err) {
      setError("Error cancelling subscription.");
    }
    setLoading(false);
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "60vh" }}
    >
      <Card
        className="shadow-lg"
        style={{
          maxWidth: 480,
          width: "100%",
          borderRadius: "1.5rem",
          padding: "2.5rem 2rem",
          border: "none",
        }}
      >
        <div className="text-center mb-4">
          <h2
            className="fw-bold"
            style={{
              color: mainColor,
              fontSize: "2rem",
              letterSpacing: "0.01em",
              marginBottom: 8,
            }}
          >
            My Profile
          </h2>
          <div style={{ fontSize: "1.05rem", color: "#495057" }}>
            Thank you for being a valued subscriber!
          </div>
        </div>

        <div
          style={{ fontSize: "1rem", color: "#212529", marginBottom: "1.5rem" }}
        >
          <strong>Email:</strong> <br />
          {email}
        </div>

        <div
          style={{ fontSize: "1rem", color: "#212529", marginBottom: "2rem" }}
        >
          <strong>Subscription Tier:</strong> <br />
          <span
            style={{
              backgroundColor: "#e6f4ea",
              color: "#34a853",
              fontWeight: 600,
              borderRadius: "6px",
              padding: "4px 12px",
              display: "inline-block",
              fontSize: "0.95rem",
            }}
          >
            {subscriptionTier}
          </span>
          <div
            style={{ fontSize: "1rem", color: "#212529", marginTop: "1rem" }}
          >
            <strong>Status:</strong> <br />
            <span
              style={{
                backgroundColor:
                  subscriptionStatus === "active"
                    ? "#e6f4ea"
                    : subscriptionStatus === "trialing"
                    ? "#fff4e5"
                    : "#f8d7da",
                color:
                  subscriptionStatus === "active"
                    ? "#34a853"
                    : subscriptionStatus === "trialing"
                    ? "#e6a200"
                    : "#d9534f",
                fontWeight: 600,
                borderRadius: "6px",
                padding: "4px 12px",
                display: "inline-block",
                fontSize: "0.95rem",
              }}
            >
              {subscriptionStatus.charAt(0).toUpperCase() +
                subscriptionStatus.slice(1)}
            </span>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-grid gap-2">
          <Button
            variant="outline-danger"
            onClick={handleCancel}
            disabled={loading || !subscriptionId}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Cancel Subscription"
            )}
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default CustomerPage;
