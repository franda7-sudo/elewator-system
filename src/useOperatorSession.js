// src/useOperatorSession.js
import { useEffect, useState, useCallback } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const STORAGE_KEY = "operatorSession";

export function useOperatorSession() {
  const [operator, setOperator] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wczytanie sesji z localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setOperator(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Logowanie operatorem po PIN
  const loginWithPin = useCallback(async (pin) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "operator"),
        where("pin", "==", pin),
        where("active", "==", true)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        throw new Error("Nieprawidłowy PIN lub konto nieaktywne");
      }

      const docSnap = snap.docs[0];
      const op = { id: docSnap.id, ...docSnap.data() };

      setOperator(op);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(op));
      return op;
    } finally {
      setLoading(false);
    }
  }, []);

  const logoutOperator = useCallback(() => {
    setOperator(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    operator,
    loading,
    loginWithPin,
    logoutOperator,
    isLoggedIn: !!operator,
  };
}
