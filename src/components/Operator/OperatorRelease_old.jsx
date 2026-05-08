import React from "react";
import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import OperatorRelease from "./OperatorRelease";

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

  const getNavLinkStyle = ({ isActive }) => (isActive ? activeStyle : baseStyle);

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
        // Stylowanie scrollbara, żeby nie szpecił czarnego menu
        "&::-webkit-scrollbar": { height: "4px" },
        "&::-webkit-scrollbar-thumb": { bgcolor: "#333", borderRadius: "10px" },
        scrollbarWidth: "thin",
        scrollbarColor: "#333 #1e1e1e",
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
          userSelect: "none"
        }}
      >
        ELEVATOR PRO
      </Box>

      {/* Lista linków - dodano 'end', aby uniknąć błędnego podświetlania wielu linków naraz */}
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