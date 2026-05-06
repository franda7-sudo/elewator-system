import React, { useState } from "react";
import SidebarOwner from "./SidebarOwner";
import OwnerDashboard from "./OwnerDashboard";
import OwnerUsers from "./OwnerUsers";
import OwnerMap from "./OwnerMap";
import OwnerStats from "./OwnerStats";

export default function OwnerPanel() {
  const [view, setView] = useState("dashboard");

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <OwnerDashboard />;
      case "users":
        return <OwnerUsers />;
      case "map":
        return <OwnerMap />;
      case "stats":
        return <OwnerStats />;
      default:
        return <OwnerDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      <SidebarOwner setView={setView} view={view} />
      <div className="flex-1 p-8 overflow-auto">
        {renderView()}
      </div>
    </div>
  );
}
