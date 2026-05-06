import React from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

const SetAdminButton = () => {
  const makeAdmin = async () => {
    try {
      const setRole = httpsCallable(functions, "setUserRoleManual"); // 🔥 POPRAWIONE
      await setRole({
        email: "franda7@gmail.com",
        role: "admin"
      });
      alert("Rola admin ustawiona! Wyloguj się i zaloguj ponownie.");
    } catch (err) {
      console.error(err);
      alert("Błąd ustawiania roli");
    }
  };

  return (
    <button onClick={makeAdmin} style={{ padding: 20, fontSize: 20 }}>
      USTAW ADMINA
    </button>
  );
};

export default SetAdminButton;
