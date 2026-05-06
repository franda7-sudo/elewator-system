import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ElevatorProvider } from "./context/ElevatorContext";

// 🔵 Strony ogólne
import StartPage from "./components/Start/StartPage";

// 🔵 Panel admina i zarządzanie
import AdminRoutes from "./components/Admin/AdminRoutes";
import SuperUserPanel from "./components/Admin/SuperUserPanel"; 

// 🟢 Panel operatora
import OperatorRoutes from "./Operator/OperatorRoutes";

// 🔒 Ochrona tras
const ProtectedRoute = ({ children, allowedRole }) => {
  const session = JSON.parse(localStorage.getItem("operatorSession") || "{}");
  
  if (!session.logged) {
    return <Navigate to="/" replace />;
  }

  const userRole = session.role ? session.role.toLowerCase() : "";
  const isOwnerOrAdmin = userRole === "owner" || userRole === "admin";
  const hasAccess = isOwnerOrAdmin || userRole === allowedRole.toLowerCase();

  if (!hasAccess) {
    console.warn(`Brak uprawnień. Twoja rola: ${userRole}, wymagana: ${allowedRole}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    // 🔥 KLUCZOWE: ElevatorProvider OBEJMUJE CAŁY SYSTEM
    <ElevatorProvider>
      <Router>
        <div className="app-container" style={{ minHeight: "100vh", backgroundColor: "#020617" }}>
          <Routes>

            {/* PUBLICZNE */}
            <Route path="/" element={<StartPage />} />
            <Route path="/login" element={<StartPage />} />

            {/* PANEL ADMINA */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminRoutes />
                </ProtectedRoute>
              } 
            />

            {/* PANEL SUPERUSER */}
            <Route 
              path="/superuser" 
              element={
                <ProtectedRoute allowedRole="superuser">
                  <SuperUserPanel />
                </ProtectedRoute>
              } 
            />

            {/* PANEL OPERATORA */}
            <Route
              path="/operator/*"
              element={
                <ProtectedRoute allowedRole="operator">
                  <OperatorRoutes />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </div>
      </Router>
    </ElevatorProvider>
  );
}

export default App;
