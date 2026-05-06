import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";

import AdminMap from "./map";
import GrainsIndex from "./grains";
import GrainDetails from "./grains/[grainId]";
import QualityPage from "./quality";
import CellsPage from "./cells";
import SettingsPage from "./settings";
import OperatorsPage from "./operators";

export default function AdminPanel() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="map" element={<AdminMap />} />
        <Route path="grains" element={<GrainsIndex />} />
        <Route path="grains/:grainId" element={<GrainDetails />} />
        <Route path="quality" element={<QualityPage />} />
        <Route path="cells" element={<CellsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="operators" element={<OperatorsPage />} />
      </Routes>
    </AdminLayout>
  );
}
