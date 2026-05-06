import React, { useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { db } from "../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAdminUsers } from "./AdminUserContext";

export default function AdminUsersList() {
  const { admins, operators, reload } = useAdminUsers();
  const [search, setSearch] = useState("");

  const filteredAdmins = admins.filter((a) =>
    a.id.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOperators = operators.filter((o) =>
    o.login.toLowerCase().includes(search.toLowerCase())
  );

  const changeAdminRole = async (id, role) => {
    await updateDoc(doc(db, "adminRoles", id), { role });
    reload();
  };

  const toggleBlocked = async (id, blocked) => {
    await updateDoc(doc(db, "users", id), { blocked: !blocked });
    reload();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Lista użytkowników
      </Typography>

      <TextField
        label="Szukaj"
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Administratorzy
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>UID</TableCell>
            <TableCell>Rola</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAdmins.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.id}</TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={a.role}
                  onChange={(e) => changeAdminRole(a.id, e.target.value)}
                >
                  <MenuItem value="admin">admin</MenuItem>
                  <MenuItem value="superuser">superuser</MenuItem>
                  <MenuItem value="owner">owner</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="subtitle1" sx={{ mt: 4 }}>
        Operatorzy
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Login</TableCell>
            <TableCell>PIN</TableCell>
            <TableCell>Rola</TableCell>
            <TableCell>Blokada</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredOperators.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{o.login}</TableCell>
              <TableCell>{o.pin}</TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={o.role}
                  onChange={(e) =>
                    updateDoc(doc(db, "users", o.id), {
                      role: e.target.value,
                    }).then(reload)
                  }
                >
                  <MenuItem value="operator">operator</MenuItem>
                  <MenuItem value="superuser">superuser</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  color={o.blocked ? "success" : "error"}
                  onClick={() => toggleBlocked(o.id, o.blocked)}
                >
                  {o.blocked ? "Odblokuj" : "Zablokuj"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
