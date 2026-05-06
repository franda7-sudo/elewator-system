import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Paper, Container, 
  TextField, InputAdornment, IconButton, Fade, CircularProgress 
} from "@mui/material";
import { Visibility, VisibilityOff, AccountCircle, Lock } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function LoginPage() {
  const navigate = useNavigate();
  const [view, setView] = useState("choice"); // choice | admin | operator
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Formularze
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [opName, setOpName] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    document.body.style.background = "#09090b";
  }, []);

  // --- LOGOWANIE ADMINISTRACYJNE (E-mail) ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Obiekt sesji dla ProtectedRoute
        const sessionData = {
          uid: userCredential.user.uid,
          name: userData.name || "Administrator",
          role: userData.role, // 'superuser', 'admin' lub 'owner'
          logged: true
        };

        localStorage.setItem("operatorSession", JSON.stringify(sessionData));

        // Kierowanie na podstawie roli
        if (userData.role === "superuser") {
          navigate("/superuser");
        } else if (userData.role === "admin" || userData.role === "owner") {
          navigate("/admin");
        } else {
          setError("Brak uprawnień administracyjnych.");
          await auth.signOut();
          localStorage.removeItem("operatorSession");
        }
      } else {
        setError("Użytkownik nie istnieje w bazie danych.");
        await auth.signOut();
      }
    } catch (err) {
      setError("Błędny e-mail lub hasło.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGOWANIE OPERATORA (PIN) ---
  const handleOperatorLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fullEmail = `${opName.trim().toLowerCase()}@elewator.pl`;
      const fullPassword = `11${pin.trim()}`;

      const userCredential = await signInWithEmailAndPassword(auth, fullEmail, fullPassword);
      
      const sessionData = {
        uid: userCredential.user.uid,
        name: opName,
        role: "operator",
        logged: true
      };

      localStorage.setItem("operatorSession", JSON.stringify(sessionData));
      navigate("/operator");
    } catch (err) {
      setError("Nieprawidłowe imię lub PIN (min. 6 cyfr).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.background}>
      <Container maxWidth="xs">
        <Typography variant="h3" sx={styles.logo}>SYSTEM ELEWATOR</Typography>
        <Typography variant="body2" sx={styles.subtitle}>PZZ S.A. | PANEL DOSTĘPU</Typography>

        <Fade in={true} timeout={800}>
          <Paper elevation={24} sx={styles.glassPanel}>
            
            {/* WIDOK WYBORU */}
            {view === "choice" && (
              <Box sx={styles.stack}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => setView("admin")}
                  sx={styles.btnPrimary}
                >
                  Logowanie E-mail (Zarząd)
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => setView("operator")}
                  sx={styles.btnSecondary}
                >
                  Logowanie PIN (Operator)
                </Button>
              </Box>
            )}

            {/* FORMULARZ ADMIN / SUPERUSER */}
            {view === "admin" && (
              <form onSubmit={handleAdminLogin}>
                <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>Panel Zarządzania</Typography>
                <TextField
                  fullWidth label="E-mail" variant="outlined" sx={styles.input}
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><AccountCircle sx={{color: '#aaa'}} /></InputAdornment> }}
                />
                <TextField
                  fullWidth label="Hasło" type={showPassword ? "text" : "password"} sx={styles.input}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock sx={{color: '#aaa'}} /></InputAdornment>,
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff sx={{color: '#aaa'}} /> : <Visibility sx={{color: '#aaa'}} />}
                      </IconButton>
                    )
                  }}
                />
                <Button type="submit" fullWidth variant="contained" disabled={loading} sx={styles.btnPrimary}>
                  {loading ? <CircularProgress size={24} /> : "Zaloguj"}
                </Button>
                <Button onClick={() => setView("choice")} sx={styles.btnBack}>Powrót</Button>
              </form>
            )}

            {/* FORMULARZ OPERATORA */}
            {view === "operator" && (
              <form onSubmit={handleOperatorLogin}>
                <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>Strefa Operatora</Typography>
                <TextField
                  fullWidth label="Imię / Identyfikator" sx={styles.input}
                  value={opName} onChange={(e) => setOpName(e.target.value)}
                />
                <TextField
                  fullWidth label="PIN" type="password" sx={styles.input}
                  value={pin} onChange={(e) => setPin(e.target.value)}
                />
                <Button type="submit" fullWidth variant="contained" disabled={loading} sx={styles.btnPrimary}>
                  {loading ? <CircularProgress size={24} /> : "Zaloguj PIN"}
                </Button>
                <Button onClick={() => setView("choice")} sx={styles.btnBack}>Powrót</Button>
              </form>
            )}

            {error && <Typography sx={styles.error}>{error}</Typography>}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

const styles = {
  background: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "radial-gradient(circle at center, #18181b 0%, #09090b 100%)",
    color: "#fff", textAlign: "center",
  },
  logo: { fontWeight: 900, color: "#fbbf24", textShadow: "0 0 20px rgba(251,191,36,0.3)", mb: 1 },
  subtitle: { color: "#52525b", letterSpacing: 4, mb: 4, fontWeight: "bold" },
  glassPanel: {
    p: 4, bgcolor: "rgba(24, 24, 27, 0.8)", backdropFilter: "blur(12px)",
    borderRadius: 8, border: "1px solid #27272a", position: "relative"
  },
  stack: { display: "flex", flexDirection: "column", gap: 2 },
  input: {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": { borderColor: "#3f3f46" },
      "&:hover fieldset": { borderColor: "#fbbf24" },
    },
    "& .MuiInputLabel-root": { color: "#a1a1aa" },
  },
  btnPrimary: {
    py: 1.5, bgcolor: "#fbbf24", color: "#000", fontWeight: "bold",
    "&:hover": { bgcolor: "#f59e0b" }
  },
  btnSecondary: {
    py: 1.5, borderColor: "#3f3f46", color: "#fff", fontWeight: "bold",
    "&:hover": { borderColor: "#fbbf24", bgcolor: "rgba(251,191,36,0.05)" }
  },
  btnBack: { mt: 2, color: "#71717a", fontSize: "0.8rem" },
  error: { color: "#ef4444", mt: 2, fontSize: "0.9rem", fontWeight: "bold" }
};