import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  collection,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  deleteDoc,
  addDoc
} from "firebase/firestore";
import { onIdTokenChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import { useOperatorSession } from "../hooks/useOperatorSession";

const ElevatorContext = createContext();
export const useElevator = () => useContext(ElevatorContext);

export function ElevatorProvider({ children }) {
  const { operator } = useOperatorSession();

  const [role, setRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const [grainDefinitions, setGrainDefinitions] = useState({});
  const [qualityConfig, setQualityConfig] = useState({});
  const [cells, setCells] = useState([]);
  const [pendingDeliveries, setPendingDeliveries] = useState([]);

  // ============================
  // AUTH + ROLE
  // ============================
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdTokenResult(true);
        setRole(token.claims.role || "operator");
      } else {
        setRole(null);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // ============================
  // grainDefinitions
  // ============================
  useEffect(() => {
    if (authLoading) return;

    const loadDefs = async () => {
      try {
        const snap = await getDocs(collection(db, "grainDefinitions"));
        const defs = {};
        snap.forEach((d) => {
          defs[d.id] = d.data();
        });
        setGrainDefinitions(defs);
      } catch (err) {
        console.error("Błąd grainDefinitions:", err);
      }
    };

    loadDefs();
  }, [authLoading]);

  // ============================
  // qualityConfig
  // ============================
  useEffect(() => {
    if (authLoading || Object.keys(grainDefinitions).length === 0) return;

    const loadQuality = async () => {
      const cfg = {};

      for (const grainId of Object.keys(grainDefinitions)) {
        try {
          const groupsSnap = await getDocs(
            collection(db, "quality", grainId, "groups")
          );
          const groups = {};
          groupsSnap.forEach((g) => {
            groups[g.id] = { id: g.id, ...g.data() };
          });
          cfg[grainId] = { groups };
        } catch (e) {
          cfg[grainId] = { groups: {} };
        }
      }

      setQualityConfig(cfg);
    };

    loadQuality();
  }, [authLoading, grainDefinitions]);

  // ============================
  // Komory
  // ============================
  useEffect(() => {
    if (authLoading) return;

    const unsub = onSnapshot(collection(db, "cells"), (snap) => {
      const loadedCells = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCells(loadedCells);
      setLoading(false);
    });

    return () => unsub();
  }, [authLoading]);

  // ============================
  // pendingDeliveries
  // ============================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pendingDeliveries"), (snap) => {
      setPendingDeliveries(
        snap.docs.map((d) => ({
          firestoreId: d.id,
          ...d.data(),
        }))
      );
    });
    return () => unsub();
  }, []);

  // ============================
  // Komory specjalne
  // ============================
  const getSpecialCells = (grain) => {
    return cells.filter((c) => {
      const isSpecial =
        c.special === true ||
        c.specialFlag === true ||
        c.type === "special" ||
        c.isSpecial === true;

      const sameGrain = !c.grain || c.grain === grain;
      const notBlocked = !c.blocked;

      return isSpecial && sameGrain && notBlocked;
    });
  };

  // ============================
  // Dodawanie pendingDelivery
  // ============================
  const addPendingDelivery = async (delivery) => {
    try {
      await addDoc(collection(db, "pendingDeliveries"), delivery);
    } catch (err) {
      console.error("Błąd addPendingDelivery:", err);
    }
  };

  // ============================
  // Prosta aktualizacja wagi
  // ============================
  const updateCellWeight = async (cellId, addedWeight) => {
    try {
      const cellRef = doc(db, "cells", cellId);
      const cell = cells.find((c) => c.id === cellId);

      if (!cell) return;

      const newWeight = Number(cell.waga || 0) + Number(addedWeight);

      await updateDoc(cellRef, { waga: newWeight });
    } catch (err) {
      console.error("Błąd updateCellWeight:", err);
    }
  };

  // ============================
  // confirmUnload
  // ============================
  const confirmUnload = async (delivery) => {
    try {
      if (delivery.firestoreId) {
        const docRef = doc(db, "pendingDeliveries", delivery.firestoreId);
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.error("Błąd confirmUnload (delete pending):", err);
    }

    if (delivery.cell && delivery.amount) {
      try {
        const cell = cells.find((c) => c.id === delivery.cell);
        if (!cell) return;

        const cellRef = doc(db, "cells", delivery.cell);

        const currentWeight = Number(cell.waga || 0);
        const currentPending = Number(cell.pending || 0);
        const delta = Number(delivery.amount);
        const capacity = Number(cell.capacity || 1);

        const newWeight = currentWeight + delta;
        const newPending = Math.max(0, currentPending - delta);

        if (newWeight > capacity) {
          console.error(
            `PRÓBA PRZEPEŁNIENIA KOMORY ${cell.id}: ${newWeight} > ${capacity}`
          );
          return;
        }

        await updateDoc(cellRef, {
          waga: newWeight,
          pending: newPending,
        });
      } catch (err) {
        console.error("Błąd confirmUnload (update cell):", err);
      }
    }
  };

  // ============================
  // 🔥 updateCell — AUTO-CLEAN SCADA LOGIC
  // ============================
  const updateCell = async (cellId, data) => {
    try {
      const cellRef = doc(db, "cells", cellId);

      const shouldClear =
        !data.grain ||
        data.waga === 0 ||
        !data.qualityGroupId;

      if (shouldClear) {
        data.grain = null;
        data.qualityGroupId = null;

        data.wilgotnosc = null;
        data.bialko = null;
        data.gluten = null;
        data.opadanie = null;
        data.gestosc = null;

        data.firstFill = null;
      }

      await updateDoc(cellRef, data);
    } catch (err) {
      console.error("Błąd updateCell:", err);
    }
  };

  // ============================
  // RETURN PROVIDER
  // ============================
  return (
    <ElevatorContext.Provider
      value={{
        loading,
        role,
        operator,
        grainDefinitions,
        qualityConfig,
        cells,
        pendingDeliveries,

        addPendingDelivery,
        confirmUnload,
        updateCell,
        updateCellWeight,
        getSpecialCells,
      }}
    >
      {children}
    </ElevatorContext.Provider>
  );
}
