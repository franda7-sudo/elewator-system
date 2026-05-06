// src/components/Admin/AdminPanel.jsx
import React from "react";
import { Box, Fade, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PzzLogo from "../Common/PzzLogo";
import AdminRoutes from "./AdminRoutes";
import { auth } from "../../firebase";

export default function AdminPanel() {
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    navigate("/admin-login");
  };

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#020617",
          color: "#e5e7eb",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* GÓRNY PASEK */}
        <Box
          sx={{
            height: 80,
            borderBottom: "1px solid #111827",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            bgcolor: "#020617",
          }}
        >
          <PzzLogo width={240} />
          <Button
            onClick={logout}
            sx={{
              color: "#fbbf24",
              border: "1px solid #fbbf24",
              px: 3,
              py: 1,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#fbbf24",
                color: "#000",
              },
            }}
          >
            WYLOGUJ
          </Button>
        </Box>

        {/* TREŚĆ PANELU */}
        <Box sx={{ flex: 1, p: 0, overflow: "hidden" }}>
          <AdminRoutes />
        </Box>
      </Box>
    </Fade>
  );
}
