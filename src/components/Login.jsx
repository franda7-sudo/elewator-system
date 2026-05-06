import React, { useState } from "react";
import { Paper, TextField, Button, Typography } from "@mui/material";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Login() {
  const [login, setLogin] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const q = query(
      collection(db, "users"),
      where("login", "==", login),
      where("pin", "==", pin)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      setError("Nieprawidłowy login lub PIN");
      return;
    }

    const user = snap.docs[0].data();

    if (user.blocked) {
      setError("Konto jest zablokowane");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "/operator";
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
        Logowanie PIN
      </Typography>

      <TextField
        label="Login"
        fullWidth
        sx={{ mb: 2 }}
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />

      <TextField
        label="PIN"
        fullWidth
        sx={{ mb: 2 }}
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
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
