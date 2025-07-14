import React from "react";
import { Container } from "react-bootstrap";

const mainColor = "#0096b4";
const bgGradient = "linear-gradient(120deg, #e0f7fa 0%, #fff 100%)";

const Contact: React.FC = () => (
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
      <h1
        className="fw-bold mb-3"
        style={{
          color: mainColor,
          fontSize: "2rem",
          letterSpacing: "0.01em",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span role="img" aria-label="envelope">
          ✉️
        </span>
        Contact
      </h1>
      <p style={{ color: "#495057", fontSize: "1.13rem" }}>
        I’d love to connect, chat, or collaborate! The best way to reach me is
        through LinkedIn.
      </p>
      <div className="mt-4">
        <a
          href="https://www.linkedin.com/in/eli-nunez"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#0096b4",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "1.08rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <i className="bi bi-linkedin" style={{ fontSize: "1.3rem" }}></i>
          Connect &amp; Chat on LinkedIn
        </a>
      </div>
      <p
        className="mt-4 mb-0"
        style={{ color: "#adb5bd", fontSize: "0.98rem" }}
      >
        I respond to all genuine messages and enjoy meeting fellow traders,
        builders, and curious minds.
      </p>
    </div>
  </Container>
);

export default Contact;
