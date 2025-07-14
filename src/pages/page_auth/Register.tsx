// src/pages/Register.tsx
import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { registerUser, loginUser } from "../../api/auth";

const mainColor = "#0096b4";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerUser(email, password);

      const { data } = await loginUser(email, password);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("email", email);
      setMessage("✅ Registration and login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "60vh", background: "#f8f9fa" }}
    >
      <Card
        className="shadow-lg border-0"
        style={{
          maxWidth: 500,
          width: "100%",
          borderRadius: "1.5rem",
          padding: "2.5rem 2rem",
          background: "white",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/TransparentLogo.png"
            alt="SPY Gamma Logo"
            style={{ width: 78, height: 78, marginBottom: 8, marginTop: 50 }}
          />
          <h2
            className="fw-bold"
            style={{ color: mainColor, fontSize: "2rem" }}
          >
            Complete Your Registration
          </h2>
          <div style={{ color: "#495057", fontSize: "1.05rem" }}>
            Almost done! Just set a password to complete your account setup.
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="py-2 text-center">
            {error}
          </Alert>
        )}
        {message && (
          <Alert variant="success" className="py-2 text-center">
            {message}
          </Alert>
        )}

        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label className="fw-semibold" style={{ color: "#212529" }}>
              Email
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              autoComplete="username"
              value={email}
              readOnly
              required
              style={{
                borderRadius: 8,
                fontSize: "1rem",
                padding: "0.75rem 1rem",
                border: `1px solid ${mainColor}33`,
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label className="fw-semibold" style={{ color: "#212529" }}>
              Password
            </Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  borderRadius: 8,
                  fontSize: "1rem",
                  padding: "0.75rem 1rem",
                  border: `1px solid ${mainColor}33`,
                }}
              />
              <Button
                variant="link"
                size="sm"
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: mainColor,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                type="button"
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
          </Form.Group>

          <div className="d-grid mb-3">
            <Button
              type="submit"
              variant="primary"
              style={{
                background: mainColor,
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "1.08rem",
                padding: "0.75rem 0",
                letterSpacing: "0.01em",
                boxShadow: "0 2px 8px rgba(0,150,180,0.08)",
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
