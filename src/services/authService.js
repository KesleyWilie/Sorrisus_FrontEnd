import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};

export const setAuthData = (authData) => {
  localStorage.setItem("token", authData.accessToken);
  localStorage.setItem("user", JSON.stringify({
    email: authData.email,
    role: authData.role
  }));
  localStorage.setItem("role", authData.role);
  localStorage.setItem("userId", authData.userId);
};