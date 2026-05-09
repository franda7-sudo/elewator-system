import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ElevatorProvider } from "./context/ElevatorContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./firebase";

// 🔵 Layout globalny z przyciskiem Powrót
import PageLayout from "./layouts/PageLayout";

// 🔵 Strony ogólne
import StartPage from "./components/Start/StartPage";
import BlockedScreen from "./components/BlockedScreen";

// 🔵 Panel admina i zarządzanie
import AdminRoutes from "./components/Admin/AdminRoutes";
import SuperUserPanel from "./components/Admin/SuperUserPanel";

// 🟢 Panel operatora
import OperatorRoutes from "./Operator/OperatorRoutes";

// 🔵 Panel ownera
import OwnerPinGate from "./components/Owner/OwnerPinGate";
import OwnerPanel from "./components/Owner/OwnerPanel";

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
  const [systemLocked, setSystemLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState("");

  // 🔥 Pobieramy status blokady systemu
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "system"), (snap) => {
      if (snap.exists()) {
        setSystemLocked(snap.data().locked);
        setLockMessage(snap.data().message || "System zablokowany");
      }
    });
    return () => unsub();
  }, []);

  // 🔥 Sprawdzamy token w URL
  const urlParams = new URLSearchParams(window.location.search);
  const ownerToken = urlParams.get("key");
  const validToken = ownerToken === "PZZ-2026-SECRET";

  return (
    <ElevatorProvider>
      <Router>
        <div className="app-container" style={{ minHeight: "100vh", backgroundColor: "#020617" }}>
          <Routes>

            {/* PUBLICZNE */}
            <Route
              path="/"
              element={
                systemLocked ? (
                  <BlockedScreen message={lockMessage} />
                ) : (
                  <StartPage />
                )
              }
            />

            <Route
              path="/login"
              element={
                systemLocked ? (
                  <BlockedScreen message={lockMessage} />
                ) : (
                  <StartPage />
                )
              }
            />

            {/* PANEL ADMINA */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRole="admin">
                  <PageLayout>
                    <AdminRoutes />
                  </PageLayout>
                </ProtectedRoute>
              }
            />

            {/* PANEL SUPERUSER */}
            <Route
              path="/superuser"
              element={
                <ProtectedRoute allowedRole="superuser">
                  <PageLayout>
                    <SuperUserPanel />
                  </PageLayout>
                </ProtectedRoute>
              }
            />

            {/* PANEL OPERATORA */}
            <Route
              path="/operator/*"
              element={
                <ProtectedRoute allowedRole="operator">
                  <PageLayout>
                    <OperatorRoutes />
                  </PageLayout>
                </ProtectedRoute>
              }
            />

            {/* PANEL OWNERA */}
            <Route
              path="/owner"
              element={
                validToken ? (
                  <PageLayout>
                    <OwnerPanel />
                  </PageLayout>
                ) : (
                  <PageLayout>
                    <OwnerPinGate />
                  </PageLayout>
                )
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
