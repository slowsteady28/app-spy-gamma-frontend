// src/routes/ProtectedRoute.tsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, subscriptionStatus } = useContext(AuthContext);

  console.log("SUB STATUS:", subscriptionStatus);

  if (!isLoggedIn) {
    return <Navigate to="/subscription-page" replace />;
  }

  // 🚧 Guard while status is loading
  if (subscriptionStatus === null) {
    return <div>Loading...</div>; // or a spinner component
  }

  // ✅ Only allow trialing or active
  if (subscriptionStatus !== "active" && subscriptionStatus !== "trialing") {
    return <Navigate to="/subscription-page" replace />;
  }

  return children;
};

export default ProtectedRoute;
