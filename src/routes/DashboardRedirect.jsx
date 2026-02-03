import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardRedirect() {
  const { user } = useAuth();

  const role = (() => {
    if (!user) return null;
    if (typeof user.role === "string") return user.role.toUpperCase();
    if (Array.isArray(user.role) && user.role.length) return String(user.role[0]).toUpperCase();
    if (user.role?.name) return String(user.role.name).toUpperCase();
    return null;
  })();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role.includes("PACIENTE")) {
    return <Navigate to="/dashboard-paciente" replace />;
  }

  return <Navigate to="/dashboard-dentista" replace />;
}
