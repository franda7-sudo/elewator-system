import React from "react";
import { Outlet } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import "./AdminTheme.css";
import "./ReportsTheme.css";

export default function AdminDashboard() {
  return (
    <div className="admin-layout">
      <AdminMenu />
      <Outlet />
    </div>
  );
}
