import React from "react";
import { Container } from "react-bootstrap";

const mainColor = "#0096b4";
const bgGradient = "linear-gradient(120deg, #e0f7fa 0%, #fff 100%)";

const TermsOfService: React.FC = () => {
  return (
    <Container
      fluid
      style={{
        minHeight: "100vh",
        paddingTop: 200,
      }}
    >
      <div
        className="shadow"
        style={{
          background: bgGradient,
          borderRadius: "1.5rem",
          padding: "2.5rem 2rem",
          boxShadow: "0 4px 32px rgba(0,150,180,0.08)",
        }}
      >
        <h1 className="fw-bold mb-4" style={{ color: mainColor }}>
          Terms of Service
        </h1>
        <p className="mb-4" style={{ color: "#495057" }}>
          Effective Date: [Insert Date]
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          1. Acceptance of Terms
        </h2>
        <p className="mb-4" style={{ color: "#495057" }}>
          By using SPY Gamma, you agree to be bound by these Terms. If you do
          not agree, do not use the site.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          2. No Investment Advice
        </h2>
        <p className="mb-4" style={{ color: "#495057" }}>
          SPY Gamma provides financial data and analysis tools. We do not offer
          investment advice. Trading involves risk.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          3. User Accounts
        </h2>
        <p className="mb-4" style={{ color: "#495057" }}>
          You are responsible for your account credentials. Do not share access.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          4. Payments
        </h2>
        <p className="mb-4" style={{ color: "#495057" }}>
          Paid features require a subscription via Stripe. Subscriptions
          auto-renew unless canceled.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          5. Intellectual Property
        </h2>
        <p className="mb-4" style={{ color: "#495057" }}>
          All content and code are the property of SPY Gamma. Do not resell or
          redistribute.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          6. Limitations
        </h2>
        <p className="mb-4" style={{ color: "#495057" }}>
          We make no guarantees about data accuracy or profitability. Use at
          your own risk.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          7. Governing Law
        </h2>
        <p className="mb-4" style={{ color: "#495057" }}>
          These Terms are governed by the laws of Florida. Disputes will be
          resolved in Orange County, FL.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          8. Contact
        </h2>
        <p className="mb-4" style={{ color: "#495057" }}>
          Contact us at support@spygamma.com for any questions.
        </p>
      </div>
    </Container>
  );
};

export default TermsOfService;
