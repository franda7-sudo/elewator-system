import React from "react";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useAdminUsers } from "./AdminUserContext";

export default function AdminUserLogs() {
  const { logs } = useAdminUsers();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Logi zmian
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Czas</TableCell>
            <TableCell>Akcja</TableCell>
            <TableCell>Wykonane przez</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((l) => (
            <TableRow key={l.id}>
              <TableCell>{l.time}</TableCell>
              <TableCell>{l.action}</TableCell>
              <TableCell>{l.by}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
