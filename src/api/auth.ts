import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const registerUser = async (email: string, password: string) => {
  return axios.post(`${API_URL}/auth/register`, { email, password });
};

export const loginUser = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  return axios.post(`${API_URL}/auth/jwt/login`, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};