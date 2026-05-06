import React from "react";
import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function AdminMenu() {
  const baseStyle = {
    color: "#bbb",
    textDecoration: "none",
    padding: "8px 14px",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    gap: "6px",
  };

  const activeStyle = {
    ...baseStyle,
    color: "#4caf50",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  };

  return (
    <Box
      component="nav"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 1,
        p: "10px 20px",
        bgcolor: "#1e1e1e",
        borderBottom: "1px solid #333",
        overflowX: "auto",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        "&::-webkit-scrollbar": { height: "4px" },
        "&::-webkit-scrollbar-thumb": { bgcolor: "#333", borderRadius: "10px" },
        scrollbarWidth: "thin",
      }}
    >
      <Box
        sx={{
          color: "#4caf50",
          fontWeight: "bold",
          mr: 3,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        ELEVATOR PRO
      </Box>

      <NavLink to="/admin/map" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        🗺️ Mapa
      </NavLink>

      {/* KLUCZOWY PRZYCISK - ZARZĄDZANIE KADRAMI I PINAMI */}
      <NavLink to="/admin/permissions" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        🔐 Uprawnienia / PIN
      </NavLink>

      <NavLink to="/admin/operators" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        👥 Operatorzy
      </NavLink>

      <NavLink to="/admin/operator-live" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        📡 Operator LIVE
      </NavLink>

      <NavLink to="/admin/live" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        🔥 System LIVE
      </NavLink>

      <NavLink to="/admin/cells" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        🏗️ Komory
      </NavLink>

      <NavLink to="/admin/quality" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        🧪 Jakość
      </NavLink>

      <NavLink to="/admin/history" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        📜 Historia
      </NavLink>

      <NavLink to="/admin/reports" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        📊 Raporty
      </NavLink>

      <NavLink to="/admin/superuser" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        ⚡ Superuser
      </NavLink>

      <NavLink to="/admin/transfers" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        🔄 Przerzuty
      </NavLink>

      <NavLink to="/admin/corrections" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        ⚖ Korekty
      </NavLink>

      <NavLink to="/admin/settings" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        ⚙️ Ustawienia
      </NavLink>

      <NavLink to="/admin/diagnostics" style={({ isActive }) => (isActive ? activeStyle : baseStyle)}>
        🧰 Diagnostyka
      </NavLink>
    </Box>
  );
}