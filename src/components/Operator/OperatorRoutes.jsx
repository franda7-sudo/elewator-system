import React from "react";
import { Routes, Route } from "react-router-dom";

import OperatorLayout from "./OperatorLayout";
import OperatorIntake from "./OperatorIntake";
import OperatorUnload from "./OperatorUnload";
import OperatorIssue from "./OperatorIssue";
import OperatorCorrection from "./OperatorCorrection";
import OperatorTransfer from "./OperatorTransfer";
import Map from "../Map/Map";

export default function OperatorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OperatorLayout />}>
        <Route index element={<OperatorIntake />} />
        <Route path="intake" element={<OperatorIntake />} />
        <Route path="unload" element={<OperatorUnload />} />
        <Route path="issue" element={<OperatorIssue />} />
        <Route path="correction" element={<OperatorCorrection />} />
        <Route path="transfer" element={<OperatorTransfer />} />
      </Route>
    </Routes>
  );
}
