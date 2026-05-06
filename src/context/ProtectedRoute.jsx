import { Navigate } from "react-router-dom";
import { useElevator } from "../context/ElevatorContext";

export function RequireRole({ role, children }) {
  const { user } = useElevator();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
