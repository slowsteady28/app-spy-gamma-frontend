// src/routes/ProtectedRoute.tsx
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  // ✅ Now always returns the child route without any checks
  return <>{children}</>;
};

export default ProtectedRoute;
