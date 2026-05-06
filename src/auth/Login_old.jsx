import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import "./login.css";

export default function Login() {
  const [mode, setMode] = useState("admin"); // admin | operator
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pin, setPin] = useState("");

  const loginAdmin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      const uid = userCred.user.uid;

      const snap = await getDoc(doc(db, "users", uid));
      const role = snap.data()?.role || "admin";

      localStorage.setItem("role", role);
      localStorage.setItem("sessionStart", Date.now());

      window.location.href = "/admin/map";
    } catch {
      alert("Błędny email lub hasło");
    }
  };

  const loginOperator = async () => {
    const q = query(collection(db, "operators"), where("pin", "==", pin));
    const snap = await getDocs(q);

    if (snap.empty) {
      alert("Nieprawidłowy PIN");
      return;
    }

    const data = snap.docs[0].data();
    localStorage.setItem("role", data.role);
    localStorage.setItem("sessionStart", Date.now());

    window.location.href = "/operator";
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>System Elewator</h2>

        <div className="login-switch">
          <button onClick={() => setMode("admin")} className={mode==="admin" ? "active" : ""}>Admin</button>
          <button onClick={() => setMode("operator")} className={mode==="operator" ? "active" : ""}>Operator</button>
        </div>

        {mode === "admin" && (
          <>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Hasło" value={pass} onChange={e => setPass(e.target.value)} />
            <button onClick={loginAdmin}>Zaloguj jako admin</button>
          </>
        )}

        {mode === "operator" && (
          <>
            <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} />
            <button onClick={loginOperator}>Zaloguj jako operator</button>
          </>
        )}
      </div>
    </div>
  );
}
