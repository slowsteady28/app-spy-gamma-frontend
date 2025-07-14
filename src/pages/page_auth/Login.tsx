import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { loginUser } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";

const mainColor = "#0096b4";
const bgGradient = "linear-gradient(120deg, #e0f7fa 0%, #fff 100%)";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      const token = response.data.access_token;
      login(token, email);
      navigate("/commentary");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "60vh",
      }}
    >
      <Card
        className="shadow-lg"
        style={{
          maxWidth: 500,
          width: "100%",
          borderRadius: "1.5rem",
          padding: "2.5rem 2rem",
          border: "none",
          paddingTop: 20,
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
            style={{
              color: mainColor,
              fontSize: "2rem",
              letterSpacing: "0.01em",
              marginBottom: 0,
            }}
          >
            Welcome Back
          </h2>
          <div style={{ color: "#495057", fontSize: "1.05rem" }}>
            Sign in to your account
          </div>
        </div>
        {error && (
          <Alert variant="danger" className="py-2 text-center">
            {error}
          </Alert>
        )}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label className="fw-semibold" style={{ color: "#212529" }}>
              Email
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: 8,
                fontSize: "1rem",
                padding: "0.75rem 1rem",
                border: `1px solid ${mainColor}33`,
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label className="fw-semibold" style={{ color: "#212529" }}>
              Password
            </Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </Form>
        <div className="text-center mt-3" style={{ fontSize: "0.98rem" }}>
          <span style={{ color: "#495057" }}>Don't have an account?</span>{" "}
          <a
            href="/register"
            style={{
              color: mainColor,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Register
          </a>
        </div>
        <div
          className="text-center mt-2"
          style={{ fontSize: "0.95rem", marginBottom: 40 }}
        >
          <a
            href="/reset-password"
            style={{
              color: "#adb5bd",
              textDecoration: "underline",
              fontSize: "0.95rem",
            }}
          >
            Forgot password?
          </a>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
