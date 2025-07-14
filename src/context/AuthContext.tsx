// src/context/AuthContext.tsx
import { createContext, useState, useEffect } from "react";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const AuthContext = createContext({
  isLoggedIn: false,
  subscriptionStatus: null as string | null,
  login: async (token: string, email: string) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("access_token");
  });

  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null
  );

  const loadSubscriptionStatus = async (email: string) => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/subscription-status?email=${email}`
      );
      const data = await res.json();
      setSubscriptionStatus(data.status); // e.g., "active", "trialing", "canceled"
      console.log("Subscription status loaded:", data.status);
    } catch {
      setSubscriptionStatus("inactive");
      console.warn("Failed to load subscription status.");
    }
  };

  const login = async (token: string, email: string) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("email", email);
    setIsLoggedIn(true);
    await loadSubscriptionStatus(email);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setSubscriptionStatus(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("email");

    if (token) {
      setIsLoggedIn(true);
      if (email) loadSubscriptionStatus(email);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, subscriptionStatus, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
