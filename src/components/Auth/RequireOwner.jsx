import React from "react";
import { Navigate } from "react-router-dom";
import { useElevator } from "../../context/ElevatorContext";

export default function RequireOwner({ children }) {
  const { user, role, loading } = useElevator();

  if (loading) return <div>Ładowanie...</div>;

  if (!user || role !== "owner") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
