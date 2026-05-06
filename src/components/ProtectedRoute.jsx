// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useElevator } from "../context/ElevatorContext";

/**
 * RequireRole — pozwala wejść TYLKO jednej roli
 * np. <RequireRole role="admin">...</RequireRole>
 */
export function RequireRole({ role, children }) {
  const { role: userRole } = useElevator();

  // Czekamy aż ElevatorContext pobierze rolę
  if (!userRole) return null;

  if (userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * AllowRoles — pozwala wejść wielu rolom
 * np. <AllowRoles roles={["admin","owner"]}>...</AllowRoles>
 */
export function AllowRoles({ roles, children }) {
  const { role: userRole } = useElevator();

  if (!userRole) return null;

  if (!roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
