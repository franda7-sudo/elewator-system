export { default as RequireRole } from "../Auth/RequireRole";
export { default as RequireAdmin } from "../Auth/RequireAdmin";
export { default as RequireOwner } from "../Auth/RequireOwner";
export { default as RequireAnyRole } from "../Auth/RequireAnyRole";
export { default as RequireLoggedOut } from "../Auth/RequireLoggedOut";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

const LoginPage = () => {
  const [mode, setMode] = useState("operator");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const db = getFirestore();
  const auth = getAuth();

  const handleLogin = async () => {
    setError("");

    try {
      // OPERATOR
      if (mode === "operator") {
        const q = query(collection(db, "users"), where("login", "==", email));
        const snap = await getDocs(q);

        if (snap.empty) {
          setError("Nie znaleziono operatora");
          return;
        }

        const userData = snap.docs[0].data();

        if (userData.pass !== pass) {
          setError("Błędne hasło operatora");
          return;
        }

        window.location.href = "/operator";
        return;
      }

      // ADMIN / OWNER
      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      const token = await userCred.user.getIdTokenResult();

      if (mode === "admin" && token.claims.role !== "admin") {
        setError("To konto nie jest adminem");
        return;
      }

      if (mode === "owner" && token.claims.role !== "owner") {
        setError("To konto nie jest ownerem");
        return;
      }

      window.location.href = `/${mode}`;
    } catch (err) {
      console.error(err);
      setError("Błąd logowania");
    }
  };

  return (
    <div>
      <h2>Logowanie</h2>

      <label>Tryb logowania:</label>
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="operator">Operator</option>
        <option value="admin">Admin</option>
        <option value="owner">Owner</option>
      </select>

      <label>Email / Login:</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Hasło:</label>
      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />

      <button onClick={handleLogin}>Zaloguj</button>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default LoginPage;
