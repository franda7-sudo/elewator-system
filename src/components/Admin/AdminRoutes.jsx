import React from "react";
import { Routes, Route } from "react-router-dom";

// LAYOUT I GŁÓWNE PANELE
import AdminDashboard from "./AdminDashboard"; 
import AdminMap from "./AdminMap";
import AdminCells from "./AdminCells";
import AdminQuality from "./AdminQuality";
import AdminHistory from "./AdminHistory";
import AdminCorrections from "./AdminCorrections";
import OperatorsPanel from "./OperatorsPanel";
import OperatorLive from "../Operator/OperatorLive"; 
import SuperUserPanel from "./SuperUserPanel"; 
import AdminReleasePrograms from "./AdminReleasePrograms";

// UŻYTKOWNICY & NOWY MANAGER UPRAWNIEŃ
import UsersAdmin from "./UsersAdmin";
import AdminUserCreate from "./Users/AdminUserCreate";
import AdminUserLogs from "./Users/AdminUserLogs";
import AdminUsersList from "./Users/AdminUsersList";
import PermissionsManager from "./PermissionsManager";

// CENTRUM RAPORTOWE — STARE
import ReportsDashboard from "../../Reports/ReportsDashboard";
import AlarmsReport from "../../Reports/AlarmsReport";
import ElevatorReport from "../../Reports/ElevatorReport";
import FifoReport from "../../Reports/FifoReport";
import FillHistoryReport from "../../Reports/FillHistoryReport";
import MovementsReport from "../../Reports/MovementsReport";
import PdfFillMapReport from "../../Reports/PdfFillMapReport";
import SiloReport from "../../Reports/SiloReport";
import SnapshotReport from "../../Reports/SnapshotReport";
import TemperatureReport from "../../Reports/TemperatureReport";
import MapReport from "./Map/MapReport";

// CENTRUM RAPORTOWE — NOWE PZZ
import IntakeReport from "../../Reports/IntakeReport";
import ReleaseReport from "../../Reports/ReleaseReport";
import QualityReport from "../../Reports/QualityReport";
import CellsReport from "../../Reports/CellsReport";
import OperatorsReport from "../../Reports/OperatorsReport";
import GrainReport from "../../Reports/GrainReport";
import TonnageReport from "../../Reports/TonnageReport";

// USTAWIENIA I DIAGNOSTYKA
import SystemSettings from "./SystemSettings";
import AdminSettings from "./Settings/AdminSettings";
import UserPermissions from "./Settings/UserPermissions";
import TransfersPanel from "./TransfersPanel";
import DiagnosticsPanel from "./DiagnosticsPanel";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />}>
        
        {/* STRONA STARTOWA ADMINA */}
        <Route index element={<AdminMap />} />

        {/* ELEWATOR & MONITORING */}
        <Route path="map" element={<AdminMap />} />
        <Route path="cells" element={<AdminCells />} />
        <Route path="quality" element={<AdminQuality />} />
        
        {/* OPERACYJNE LIVE */}
        <Route path="operator-live" element={<OperatorLive />} />
        <Route path="live" element={<DiagnosticsPanel />} /> 

        {/* UŻYTKOWNICY, KADRY I UPRAWNIENIA */}
        <Route path="users" element={<UsersAdmin />} />
        <Route path="users/create" element={<AdminUserCreate />} />
        <Route path="users/logs" element={<AdminUserLogs />} />
        <Route path="users/list" element={<AdminUsersList />} />
        
        {/* ZARZĄDZANIE PINAMI I ROLAMI */}
        <Route path="permissions" element={<PermissionsManager />} />
        <Route path="operators" element={<OperatorsPanel />} />

        {/* SUPERUSER */}
        <Route path="superuser" element={<SuperUserPanel />} />

        {/* LOGISTYKA */}
        <Route path="transfers" element={<TransfersPanel />} />
        <Route path="corrections" element={<AdminCorrections />} />
        <Route path="history" element={<AdminHistory />} />
        <Route path="release-programs" element={<AdminReleasePrograms />} />

        {/* CENTRUM RAPORTOWE */}
        <Route path="reports">
          <Route index element={<ReportsDashboard />} />

          {/* RAPORTY OPERACYJNE */}
          <Route path="intake" element={<IntakeReport />} />
          <Route path="release" element={<ReleaseReport />} />
          <Route path="movements" element={<MovementsReport />} />
          <Route path="fill-history" element={<FillHistoryReport />} />

          {/* RAPORTY STANÓW */}
          <Route path="cells" element={<CellsReport />} />
          <Route path="grain" element={<GrainReport />} />
          <Route path="tonnage" element={<TonnageReport />} />

          {/* RAPORTY JAKOŚCI */}
          <Route path="quality" element={<QualityReport />} />

          {/* RAPORTY MAPY */}
          <Route path="fill-map" element={<PdfFillMapReport />} />
          <Route path="map" element={<MapReport />} />

          {/* RAPORTY SYSTEMOWE */}
          <Route path="silo" element={<SiloReport />} />
          <Route path="alarms" element={<AlarmsReport />} />
          <Route path="fifo" element={<FifoReport />} />
          <Route path="snapshot" element={<SnapshotReport />} />
          <Route path="temperature" element={<TemperatureReport />} />
          <Route path="elevator" element={<ElevatorReport />} />
        </Route>

        {/* USTAWIENIA */}
        <Route path="settings" element={<SystemSettings />} />
        <Route path="settings/admin" element={<AdminSettings />} />
        <Route path="settings/user-permissions" element={<UserPermissions />} />
        <Route path="diagnostics" element={<DiagnosticsPanel />} />
        
      </Route>
    </Routes>
  );
}
