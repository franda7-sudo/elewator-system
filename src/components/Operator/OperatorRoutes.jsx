import React from "react";
import { Routes, Route } from "react-router-dom";

import OperatorLayout from "./OperatorLayout";
import OperatorPanel from "./OperatorPanel";        // MENU OPERATORA
import OperatorIntake from "./OperatorIntake";
import OperatorUnload from "./OperatorUnload";
import OperatorRelease from "./OperatorRelease";    // NOWY PANEL WYDAŃ
import OperatorCorrection from "./OperatorCorrection";
import OperatorTransfer from "./OperatorTransfer";
import Map from "../Map/Map";

export default function OperatorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OperatorLayout />}>

        {/* MENU OPERATORA */}
        <Route index element={<OperatorPanel />} />

        {/* MODUŁY */}
        <Route path="intake" element={<OperatorIntake />} />
        <Route path="unload" element={<OperatorUnload />} />
        <Route path="issue" element={<OperatorRelease />} />
        <Route path="correction" element={<OperatorCorrection />} />
        <Route path="transfer" element={<OperatorTransfer />} />
        <Route path="map" element={<Map />} />

      </Route>
    </Routes>
  );
}
