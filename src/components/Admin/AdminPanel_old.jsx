import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import AdminHome from "./AdminHome";
import AdminMap from "./AdminMap";
import AdminCells from "./AdminCells";
import AdminPriorities from "./AdminPriorities";
import AdminQuality from "./AdminQuality";
import AdminAlarms from "./AdminAlarms";
import AdminDallas from "./AdminDallas";
import AdminHistory from "./AdminHistory";
import AdminCorrections from "./AdminCorrections";
import AdminLogs from "./AdminLogs";
import AdminParams from "./AdminParams";
import AdminPanelParameters from "./AdminPanelParameters";
import SystemSettings from "./SystemSettings";
import UnloadConfigs from "./UnloadConfigs";

import OperatorsPanel from "./OperatorsPanel";
import OperatorPanel from "./OperatorPanel";
import OperatorLive from "./OperatorLive";
import OperatorPinManager from "./OperatorPinManager";

import UsersAdmin from "./UsersAdmin";
import AdminUserCreate from "./Users/AdminUserCreate";
import AdminUserLogs from "./Users/AdminUserLogs";
import AdminUsersList from "./Users/AdminUsersList";

import GrainList from "./grains/GrainList";
import GrainGroups from "./grains/GrainGroups";
import GrainEditor from "./GrainEditor";
import GrainsPage from "./grains/GrainsPage";
import GroupEditor from "./grains/GroupEditor";
import GroupCells from "./grains/GroupCells";
import FixCells from "./grains/FixCells";

export default function AdminRoutes() {
  return (
    <Routes>

      <Route path="/" element={<AdminDashboard />} />
      <Route path="home" element={<AdminHome />} />

      <Route path="map" element={<AdminMap />} />
      <Route path="cells" element={<AdminCells />} />
      <Route path="priorities" element={<AdminPriorities />} />
      <Route path="quality" element={<AdminQuality />} />
      <Route path="alarms" element={<AdminAlarms />} />
      <Route path="dallas" element={<AdminDallas />} />
      <Route path="history" element={<AdminHistory />} />
      <Route path="corrections" element={<AdminCorrections />} />
      <Route path="logs" element={<AdminLogs />} />
      <Route path="params" element={<AdminParams />} />
      <Route path="panel-params" element={<AdminPanelParameters />} />
      <Route path="settings" element={<SystemSettings />} />
      <Route path="unload" element={<UnloadConfigs />} />

      <Route path="operators" element={<OperatorsPanel />} />
      <Route path="operators/live" element={<OperatorLive />} />
      <Route path="operators/panel" element={<OperatorPanel />} />
      <Route path="operators/pin" element={<OperatorPinManager />} />

      <Route path="users" element={<UsersAdmin />} />
      <Route path="users/create" element={<AdminUserCreate />} />
      <Route path="users/logs" element={<AdminUserLogs />} />
      <Route path="users/list" element={<AdminUsersList />} />

      <Route path="grains" element={<GrainsPage />} />
      <Route path="grains/list" element={<GrainList />} />
      <Route path="grains/editor" element={<GrainEditor />} />
      <Route path="grains/groups" element={<GrainGroups />} />
      <Route path="grains/groups/editor" element={<GroupEditor />} />
      <Route path="grains/groups/cells" element={<GroupCells />} />
      <Route path="grains/fix" element={<FixCells />} />

    </Routes>
  );
}
