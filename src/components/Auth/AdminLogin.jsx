import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Paper, Typography, TextField, Button,
  InputAdornment, IconButton, CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff, AccountCircle, Lock } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      setError("Błędny e-mail lub hasło.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.page}>
      <Paper elevation={24} sx={styles.panel}>
        <Typography variant="h4" sx={styles.title}>
          Logowanie Administratora
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={styles.input}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: "#aaa" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Hasło"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={styles.input}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#aaa" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton onClick={() => setShowPass(!showPass)}>
                  {showPass ? <VisibilityOff sx={{ color: "#aaa" }} /> : <Visibility sx={{ color: "#aaa" }} />}
                </IconButton>
              ),
            }}
          />

          {error && <Typography sx={styles.error}>{error}</Typography>}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={styles.loginBtn}
          >
            {loading ? <CircularProgress size={26} /> : "Zaloguj"}
          </Button>

          <Button sx={styles.backBtn} onClick={() => navigate("/login")}>
            Powrót
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#09090b",
    p: 3,
  },
  panel: {
    width: "100%",
    maxWidth: 480,
    p: 5,
    bgcolor: "rgba(24,24,27,0.9)",
    borderRadius: 4,
    border: "1px solid #27272a",
  },
  title: {
    textAlign: "center",
    mb: 4,
    color: "#fbbf24",
    fontWeight: 900,
  },
  input: {
    mb: 3,
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      fontSize: "1.2rem",
      padding: "4px",
      "& fieldset": { borderColor: "#3f3f46" },
      "&:hover fieldset": { borderColor: "#fbbf24" },
    },
    "& .MuiInputLabel-root": { color: "#a1a1aa", fontSize: "1.1rem" },
  },
  loginBtn: {
    py: 2,
    fontSize: "1.2rem",
    bgcolor: "#fbbf24",
    color: "#000",
    fontWeight: "bold",
    "&:hover": { bgcolor: "#f59e0b" },
  },
  backBtn: {
    mt: 2,
    color: "#a1a1aa",
    fontSize: "0.9rem",
  },
  error: {
    color: "#ef4444",
    mb: 2,
    fontWeight: "bold",
  },
};
