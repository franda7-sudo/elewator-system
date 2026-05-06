import React, { useState } from "react";
import { Paper, TextField, Button, Typography } from "@mui/material";
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAdminUsers } from "./AdminUserContext";

export default function AdminUserCreate() {
  const [uid, setUid] = useState("");
  const [role, setRole] = useState("admin");
  const { reload } = useAdminUsers();

  const createAdmin = async () => {
    if (!uid.trim()) return;

    await setDoc(doc(db, "adminRoles", uid.trim()), {
      role,
    });

    setUid("");
    reload();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Dodaj administratora
      </Typography>

      <TextField
        label="UID"
        fullWidth
        sx={{ mb: 2 }}
        value={uid}
        onChange={(e) => setUid(e.target.value)}
      />

      <TextField
        label="Rola"
        fullWidth
        sx={{ mb: 2 }}
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <Button variant="contained" onClick={createAdmin}>
        Dodaj admina
      </Button>
    </Paper>
  );
}
