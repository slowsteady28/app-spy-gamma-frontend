import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const mainColor = "#0096b4";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prefillEmail = params.get("email");
    if (prefillEmail) setEmail(prefillEmail);
  }, [location]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        new_password: newPassword,
      });
      setMessage("✅ Password reset successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
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
          maxWidth: 400,
          width: "100%",
          borderRadius: "1.5rem",
          padding: "2.5rem 2rem",
          border: "none",
        }}
      >
        <h2
          className="fw-bold text-center mb-3"
          style={{ color: mainColor, fontSize: "2rem" }}
        >
          Reset Your Password
        </h2>
        <p
          className="text-center"
          style={{ color: "#6c757d", fontSize: "0.95rem" }}
        >
          We'll update your password and redirect you to sign in.
        </p>

        {error && (
          <Alert variant="danger" className="py-2 mt-3 text-center">
            {error}
          </Alert>
        )}
        {message && (
          <Alert variant="success" className="py-2 mt-3 text-center">
            {message}
          </Alert>
        )}

        <Form onSubmit={handleReset} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>New Password</Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ borderRadius: 8 }}
              />
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  textDecoration: "none",
                  fontWeight: 600,
                  color: mainColor,
                }}
                type="button"
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
          </Form.Group>

          <div className="d-grid">
            <Button
              type="submit"
              disabled={loading}
              style={{ background: mainColor, border: "none", borderRadius: 8 }}
            >
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default ResetPassword;
