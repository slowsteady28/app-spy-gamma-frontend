import React from "react";
import { Container } from "react-bootstrap";

const mainColor = "#0096b4";
const bgGradient = "linear-gradient(120deg, #e0f7fa 0%, #fff 100%)";

const PrivacyPolicy: React.FC = () => {
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
          Privacy Policy
        </h1>
        <p className="mb-4 text-dark">Effective Date: 01/01/2025</p>
        <p className="mb-4 text-dark">
          SPY Gamma respects your privacy. This Privacy Policy explains how we
          collect, use, and protect your information when you use our platform
          at https://spygamma.com.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          1. Information We Collect
        </h2>
        <p className="mb-4 text-dark">
          We collect basic account data (email, login method) and anonymous
          usage analytics.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          2. Use of Information
        </h2>
        <p className="mb-4 text-dark">
          Your data helps us personalize your experience and ensure account
          security.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          3. Sharing of Information
        </h2>
        <p className="mb-4 text-dark">
          We do not sell your information. Third-party tools (e.g., Stripe,
          LinkedIn) may receive limited data necessary for functionality.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          4. Cookies
        </h2>
        <p className="mb-4 text-dark">
          Cookies are used to maintain sessions and analyze usage anonymously.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          5. Financial Data
        </h2>
        <p className="mb-4 text-dark">
          Payments are handled securely through Stripe. We do not store your
          payment details.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          6. Disclaimer
        </h2>
        <p className="mb-4 text-dark">
          SPY Gamma does not provide financial advice. Always consult a licensed
          professional before trading.
        </p>
        <h2 className="h5 fw-semibold mt-5 mb-3" style={{ color: mainColor }}>
          7. Contact
        </h2>
        <p className="text-dark">
          Email us at support@spygamma.com for privacy-related inquiries.
        </p>
      </div>
    </Container>
  );
};

export default PrivacyPolicy;
