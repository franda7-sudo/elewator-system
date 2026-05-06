import React from "react";
import { Navigate } from "react-router-dom";
import { useElevator } from "../../context/ElevatorContext";

export default function RequireAnyRole({ children }) {
  const { user, loading } = useElevator();

  if (loading) return <div>Ładowanie...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
