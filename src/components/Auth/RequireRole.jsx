// src/components/Auth/RequireRole.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useElevator } from "../../context/ElevatorContext";

export default function RequireRole({ allowed, children }) {
  const { user, role, loading } = useElevator();

  // Czekamy na załadowanie kontekstu
  if (loading) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
        Ładowanie...
      </div>
    );
  }

  // Brak użytkownika → przekierowanie do logowania
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Brak wymaganej roli → blokada
  if (!allowed.includes(role)) {
    return <Navigate to="/no-access" replace />;
  }

  // Wszystko OK → wpuszczamy
  return children;
}
