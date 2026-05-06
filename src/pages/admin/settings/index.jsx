import React from "react";
import SettingsPanel from "../../../components/Admin/settings/SettingsPanel";
import "./Settings.css";

export default function SettingsPage() {
  return (
    <div className="settings-container">
      <h1>Ustawienia systemu</h1>
      <SettingsPanel />
    </div>
  );
}
