import React from "react";
import { Box } from "@mui/material";
import AdminMenu from "./AdminMenu";
import { Outlet } from "react-router-dom";

import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <h2>Panel administratora</h2>

      <button onClick={handleLogout} className="logout-btn">
        Wyloguj
      </button>
    </header>
  );
}

export default function AdminLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#111"
      }}
    >
      {/* MENU NA GÓRZE */}
      <Box sx={{ flexShrink: 0 }}>
        <AdminMenu />
      </Box>

      {/* TREŚĆ STRONY */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 2
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
