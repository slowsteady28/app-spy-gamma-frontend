// src/pages/Logout.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  }, [navigate]);

  return <p>Logging out...</p>; // You can replace with a spinner or message
};

export default Logout;
// This component handles user logout by clearing the token and redirecting to the login page.
// It uses the `useEffect` hook to perform the logout action when the component mounts.
