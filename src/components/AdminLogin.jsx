import React, { useState } from "react";
import { Paper, TextField, Button, Typography } from "@mui/material";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const uid = auth.currentUser.uid;
      const roleDoc = await getDoc(doc(db, "adminRoles", uid));

      if (!roleDoc.exists()) {
        setError("Brak przypisanej roli administratora");
        return;
      }

      const role = roleDoc.data().role;
      localStorage.setItem("adminRole", role);

      window.location.href = "/admin";
    } catch (err) {
      setError("Nieprawidłowy email lub hasło");
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        background: "#fff",
        color: "#000",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Logowanie administratora
      </Typography>

      <TextField
        label="Email"
        fullWidth
        sx={{ mb: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Hasło"
        fullWidth
        sx={{ mb: 2 }}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <Typography sx={{ color: "#d32f2f", mb: 2 }}>{error}</Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{
          background: "#1976d2",
          "&:hover": { background: "#125ea8" },
        }}
        onClick={handleLogin}
      >
        Zaloguj
      </Button>
    </Paper>
  );
}
