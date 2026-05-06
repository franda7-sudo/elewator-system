import React from "react";
import { useParams } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import AdminReports from "./AdminReports";
import AdminHistory from "./AdminHistory";
import AdminAlarms from "./AdminAlarms";
import AdminLab from "./AdminLab";
import AdminSettings from "./AdminSettings";

export default function AdminPanel() {
  const { view } = useParams();

  switch (view) {
    case "reports":
      return <AdminReports />;

    case "history":
      return <AdminHistory />;

    case "alarms":
      return <AdminAlarms />;

    case "lab":
      return <AdminLab />;

    case "settings":
      return <AdminSettings />;

    default:
      return <AdminDashboard />;
  }
}
