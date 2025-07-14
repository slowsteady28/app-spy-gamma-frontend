import React from "react";
import { Container } from "react-bootstrap";

const mainColor = "#0096b4";
const bgGradient = "linear-gradient(120deg, #e0f7fa 0%, #fff 100%)";

const About: React.FC = () => (
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
          fontSize: "2.1rem",
          letterSpacing: "0.01em",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span role="img" aria-label="wave">
          👋
        </span>
        About Me
      </h1>
      <p className="lead mb-4" style={{ color: "#212529", fontWeight: 500 }}>
        Hi, I’m Eliezer Nunez—the builder behind{" "}
        <span style={{ color: mainColor, fontWeight: 700 }}>SPYgamma.com</span>.
      </p>
      <p style={{ color: "#495057", fontSize: "1.1rem" }}>
        This platform is the product of countless early mornings, late nights,
        and a relentless drive to understand how options positioning shapes the
        market. I didn’t come from a traditional trading background. I learned
        everything you see here the hard way—through self-study, trial and
        error, and diving deep into the insights shared by some of the best
        educators in the field.
      </p>
      <p style={{ color: "#495057", fontSize: "1.1rem" }}>
        Two of those educators—
        <span style={{ color: mainColor, fontWeight: 600 }}>
          SpotGamma
        </span> and{" "}
        <span style={{ color: mainColor, fontWeight: 600 }}>
          Options Insight
        </span>
        —played a pivotal role in my development. Their platforms helped me
        connect the dots between options flows, dealer behavior, and market
        structure. What began as a curiosity evolved into a full-on obsession:
        decoding the invisible forces that drive price action.
      </p>
      <h3
        className="mt-4 mb-3"
        style={{
          color: mainColor,
          fontWeight: 700,
          fontSize: "1.25rem",
          letterSpacing: "0.01em",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span role="img" aria-label="books">
          📚
        </span>
        The Process Over the Shortcut
      </h3>
      <p style={{ color: "#495057", fontSize: "1.1rem" }}>
        I’m not here to promise magic indicators or effortless success. The
        reality is, trading is hard. Understanding the options market is even
        harder. That’s why I ground myself in a few key principles:
      </p>
      <ul
        style={{
          color: "#495057",
          fontSize: "1.08rem",
          marginBottom: "1.5rem",
        }}
      >
        <li>
          <strong style={{ color: mainColor }}>Hard Work:</strong> There are no
          shortcuts. Every chart, every model, every backtest on this site was
          built one piece at a time.
        </li>
        <li>
          <strong style={{ color: mainColor }}>Ethics:</strong> I believe in
          transparency, humility, and sharing what I learn.
        </li>
        <li>
          <strong style={{ color: mainColor }}>Sacrifice:</strong> Real learning
          costs time, energy, and discipline. I’ve put in the hours because I
          love the process.
        </li>
        <li>
          <strong style={{ color: mainColor }}>Process:</strong> I’m more
          focused on building a repeatable approach than chasing one-off wins.
        </li>
      </ul>
      <h3
        className="mt-4 mb-3"
        style={{
          color: mainColor,
          fontWeight: 700,
          fontSize: "1.25rem",
          letterSpacing: "0.01em",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span role="img" aria-label="handshake">
          🤝
        </span>
        Let’s Connect
      </h3>
      <p style={{ color: "#495057", fontSize: "1.1rem" }}>
        I’m always open to collaboration, learning from others, and giving back
        where I can. If you’re a trader, educator, or just someone who shares
        this passion for decoding markets—I’d love to connect.
      </p>
      <p className="mt-4 mb-0" style={{ color: "#212529", fontWeight: 500 }}>
        Thanks for stopping by.
        <br />— Eliezer
      </p>
      <div className="mt-3">
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
          Connect on LinkedIn
        </a>
      </div>
    </div>
  </Container>
);

export default About;
