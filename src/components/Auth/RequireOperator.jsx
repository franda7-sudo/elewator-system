// src/components/Auth/RequireOperator.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useOperatorSession } from "../../useOperatorSession";

export default function RequireOperator({ children }) {
  const { operator, loading } = useOperatorSession();

  // Czekamy na odczyt sesji z localStorage
  if (loading) {
    return (
      <div style={styles.loading}>
        Sprawdzanie sesji operatora...
      </div>
    );
  }

  // Brak operatora → przekierowanie do logowania PIN
  if (!operator) {
    return <Navigate to="/admin/operator/login" replace />;
  }

  // Operator zalogowany → wpuszczamy
  return children;
}

const styles = {
  loading: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    fontFamily: "sans-serif",
  },
};
