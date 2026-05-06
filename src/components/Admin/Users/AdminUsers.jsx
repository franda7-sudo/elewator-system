import React from "react";
import { Paper, Tabs, Tab, Box } from "@mui/material";
import { AdminUserProvider } from "./AdminUserContext";

import AdminUsersList from "./AdminUsersList";
import AdminUserCreate from "./AdminUserCreate";
import AdminOperatorTools from "./AdminOperatorTools";
import AdminUserLogs from "./AdminUserLogs";
import AdminRoleGuard from "./AdminRoleGuard";

export default function AdminUsers() {
  const [tab, setTab] = React.useState(0);

  return (
    <AdminUserProvider>
      <Paper sx={{ m: 2, p: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Użytkownicy" />
          <Tab label="Dodaj admina" />
          <Tab label="Narzędzia operatorów" />
          <Tab label="Logi zmian" />
          <Tab label="Uprawnienia" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tab === 0 && <AdminUsersList />}
          {tab === 1 && <AdminUserCreate />}
          {tab === 2 && <AdminOperatorTools />}
          {tab === 3 && <AdminUserLogs />}
          {tab === 4 && <AdminRoleGuard />}
        </Box>
      </Paper>
    </AdminUserProvider>
  );
}
