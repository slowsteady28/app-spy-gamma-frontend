import React, { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CustomerName from "./CustomerName";

const MainNavbar: React.FC = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <Navbar
      expand="lg"
      bg="light"
      variant="light"
      fixed="top"
      className="shadow-sm"
      style={{
        borderBottom: "1px solid #e6e9f4",
        zIndex: 1050,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
      }}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/TransparentLogo.png"
            alt="Logo"
            style={{ width: 32, height: 32, marginRight: "0.5rem" }}
          />
          <span
            style={{ fontWeight: 700, fontSize: "1.2rem", color: "#212529" }}
          >
            SPY Gamma
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto">
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => (window.location.href = "/login")}
                  style={buttonStyle}
                >
                  Sign In
                </button>
                <button
                  onClick={() => (window.location.href = "/subscription-page")}
                  style={buttonStyle}
                >
                  Sign Up
                </button>
              </>
            )}
            {isLoggedIn && (
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={logout}
                  style={{
                    background: "none",
                    border: "1px solid #adb5bd",
                    color: "#4e5d78",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    padding: "0.5rem 1.2rem",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8f9fa")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  Log Out
                </button>

                <button
                  onClick={() => (window.location.href = "/customer-profile")}
                  style={{
                    background: "#0096b4",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    padding: "0.5rem 1.2rem",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: `
      0 0 8px rgba(0, 150, 180, 0.6), 
      0 0 12px rgba(0, 255, 127, 0.4),
      0 0 16px rgba(255, 100, 100, 0.4)
    `,
                    transition: "box-shadow 0.3s ease, transform 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = `
      0 0 12px rgba(0, 150, 180, 0.8), 
      0 0 18px rgba(0, 255, 127, 0.6),
      0 0 22px rgba(255, 100, 100, 0.6)
    `;
                    e.currentTarget.style.transform = "scale(1.03)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = `
      0 0 8px rgba(0, 150, 180, 0.6), 
      0 0 12px rgba(0, 255, 127, 0.4),
      0 0 16px rgba(255, 100, 100, 0.4)
    `;
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <CustomerName />
                </button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const buttonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#4e5d78",
  fontWeight: 500,
  fontSize: "1rem",
  padding: "0.5rem 1rem",
  cursor: "pointer",
};

export default MainNavbar;
