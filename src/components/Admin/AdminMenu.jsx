import React from "react";
import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function AdminMenu() {
  const baseStyle = {
    padding: "10px 14px",
    borderRadius: "6px",
    color: "#d4d4d4",
    textDecoration: "none",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    borderLeft: "4px solid transparent",
    transition: "0.18s ease",
    whiteSpace: "nowrap",
  };

  const activeStyle = {
    ...baseStyle,
    backgroundColor: "#222",
    color: "#fff",
    borderLeft: "4px solid #4ade80", // zielony LED
    fontWeight: 600,
  };

  const getNavLinkStyle = ({ isActive }) =>
    isActive ? activeStyle : baseStyle;

  return (
    <Box
      component="nav"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 1,
        p: "10px 20px",
        bgcolor: "#0d0d0d",
        borderBottom: "1px solid #222",
        overflowX: "auto",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        "&::-webkit-scrollbar": { height: "4px" },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "#333",
          borderRadius: "10px",
        },
        scrollbarWidth: "thin",
      }}
    >
      {/* LOGO */}
      <Box
        sx={{
          color: "#4ade80",
          fontWeight: "bold",
          mr: 3,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          fontSize: "16px",
          letterSpacing: "0.5px",
        }}
      >
        ELEVATOR PRO
      </Box>

      {/* MENU */}
      <NavLink to="/admin/map" style={getNavLinkStyle}>🗺️ Mapa</NavLink>
      <NavLink to="/admin/permissions" style={getNavLinkStyle}>🔐 Uprawnienia / PIN</NavLink>
      <NavLink to="/admin/operators" style={getNavLinkStyle}>👥 Operatorzy</NavLink>
      <NavLink to="/admin/operator-live" style={getNavLinkStyle}>📡 Operator LIVE</NavLink>
      <NavLink to="/admin/live" style={getNavLinkStyle}>🔥 System LIVE</NavLink>
      <NavLink to="/admin/cells" style={getNavLinkStyle}>🏗️ Komory</NavLink>
      <NavLink to="/admin/quality" style={getNavLinkStyle}>🧪 Jakość</NavLink>
      <NavLink to="/admin/history" style={getNavLinkStyle}>📜 Historia</NavLink>
      <NavLink to="/admin/reports" style={getNavLinkStyle}>📊 Raporty</NavLink>
      <NavLink to="/admin/superuser" style={getNavLinkStyle}>⚡ Superuser</NavLink>
      <NavLink to="/admin/transfers" style={getNavLinkStyle}>🔄 Przerzuty</NavLink>
      <NavLink to="/admin/corrections" style={getNavLinkStyle}>⚖ Korekty</NavLink>
      <NavLink to="/admin/settings" style={getNavLinkStyle}>⚙️ Ustawienia</NavLink>
      <NavLink to="/admin/diagnostics" style={getNavLinkStyle}>🧰 Diagnostyka</NavLink>
      <NavLink to="/admin/release-programs" style={getNavLinkStyle}>⚙️ Programy Wydań</NavLink>
    </Box>
  );
}
