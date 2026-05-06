import React, { useState } from "react";
import { Paper, TextField, Button, Typography } from "@mui/material";
import { db } from "../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAdminUsers } from "./AdminUserContext";

export default function AdminOperatorTools() {
  const { operators, reload } = useAdminUsers();
  const [login, setLogin] = useState("");

  const generatePin = () => Math.floor(1000 + Math.random() * 9000).toString();

  const resetPin = async () => {
    const op = operators.find((o) => o.login === login);
    if (!op) return;

    const newPin = generatePin();

    await updateDoc(doc(db, "users", op.id), {
      pin: newPin,
    });

    alert(`Nowy PIN: ${newPin}`);
    reload();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Narzędzia operatorów
      </Typography>

      <TextField
        label="Login operatora"
        fullWidth
        sx={{ mb: 2 }}
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />

      <Button variant="contained" onClick={resetPin}>
        Resetuj PIN
      </Button>
    </Paper>
  );
}
