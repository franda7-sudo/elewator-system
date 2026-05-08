import React, { useState, useEffect, useMemo } from "react";
import { useElevator } from "../context/ElevatorContext";
import {
  updateDoc,
  doc,
  onSnapshot,
  addDoc,
  deleteDoc,
  collection
} from "firebase/firestore";
import { db } from "../firebase";

const OBJECTS = ["Młyn", "Płatkarnia", "Kaszarnia", "Zewnętrzne"];

export default function OperatorIssue() {
  const { cells, operator, confirmUnload } = useElevator();

  const [selectedObject, setSelectedObject] = useState("Młyn");
  const [programs, setPrograms] = useState([]);
  const [pendingIssues, setPendingIssues] = useState([]);

  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [amount, setAmount] = useState("");
  const [docNumber, setDocNumber] = useState("");

  // Programy wydań (wszystkie)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "releasePrograms"), (snap) => {
      setPrograms(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Trwające wydania (wszystkie)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pendingIssues"), (snap) => {
      setPendingIssues(
        snap.docs.map((d) => ({ firestoreId: d.id, ...d.data() }))
      );
    });
    return () => unsub();
  }, []);

  // Programy dla wybranego obiektu
  const objectPrograms = useMemo(
    () => programs.filter((p) => p.object === selectedObject),
    [programs, selectedObject]
  );

  // Wybrany program
  const selectedProgram = useMemo(
    () => objectPrograms.find((p) => p.id === selectedProgramId) || null,
    [objectPrograms, selectedProgramId]
  );

  // Komory z programu + aktualna waga
  const programCells = useMemo(() => {
    if (!selectedProgram) return [];
    return selectedProgram.cells.map((pc) => {
      const cell = cells.find((c) => c.id === pc.id);
      return {
        id: pc.id,
        percent: pc.percent,
        waga: cell?.waga ?? 0
      };
    });
  }, [selectedProgram, cells]);

  // Wyliczenie ile pobrać z każdej komory
  const calculated = useMemo(() => {
    if (!selectedProgram) return [];
    if (!amount) return programCells.map((c) => ({ ...c, toTake: 0 }));
    return programCells.map((c) => ({
      ...c,
      toTake: (Number(amount) * c.percent) / 100
    }));
  }, [amount, selectedProgram, programCells]);

  const totalIssued = calculated.reduce((s, c) => s + c.toTake, 0);
  const canStart =
    !!selectedObject &&
    !!selectedProgram &&
    Number(amount) > 0 &&
    totalIssued > 0;

  // Rozpoczęcie wydania
  const startIssue = async () => {
    if (!canStart) return alert("Uzupełnij dane wydania i wybierz program.");

    await addDoc(collection(db, "pendingIssues"), {
      object: selectedObject,
      programId: selectedProgram.id,
      grain: selectedProgram.grain,
      totalAmount: Number(amount),
      program: calculated,
      operator: operator?.name || "operator",
      docNumber: docNumber || null,
      startedAt: Date.now(),
      status: "in-progress"
    });

    alert("Wydanie rozpoczęte.");
    setAmount("");
    setDocNumber("");
  };

  // Zakończenie wydania
  const finishIssue = async (issue) => {
    if (!window.confirm("Zakończyć wydanie?")) return;

    for (const c of issue.program) {
      const cellRef = doc(db, "cells", c.id);
      const cell = cells.find((x) => x.id === c.id);

      const finalVal = Math.max(0, (cell?.waga || 0) - c.toTake);

      const updatePayload = {
        waga: Number(finalVal.toFixed(2)),
        updatedAt: Date.now()
      };

      if (finalVal <= 0) {
        updatePayload.grain = null;
        updatePayload.groupId = null;
        updatePayload.firstFill = null;
        updatePayload.firstFillDate = null;
      }

      await updateDoc(cellRef, updatePayload);

      await confirmUnload({
        id: `WZ-${Date.now()}-${c.id}`,
        grain: issue.grain,
        amount: c.toTake,
        cell: c.id,
        operator: issue.operator,
        docNumber: issue.docNumber || null
      });
    }

    await deleteDoc(doc(db, "pendingIssues", issue.firestoreId));

    alert("Wydanie zakończone.");
  };

  const pendingForObject = pendingIssues.filter(
    (i) => i.object === selectedObject
  );

  return (
    <div style={{ padding: 20, color: "white", maxWidth: 1000, margin: "auto" }}>
      <h2 style={{ color: "#3b82f6" }}>Wydania — {selectedObject}</h2>

      {/* WYBÓR OBIEKTU */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {OBJECTS.map((obj) => (
          <button
            key={obj}
            onClick={() => {
              setSelectedObject(obj);
              setSelectedProgramId("");
              setAmount("");
            }}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background:
                selectedObject === obj ? "#3b82f6" : "#1e293b",
              color: "white",
              fontWeight: selectedObject === obj ? "bold" : "normal"
            }}
          >
            {obj}
          </button>
        ))}
      </div>

      {/* LISTA PROGRAMÓW DLA OBIEKTU */}
      <div
        style={{
          marginBottom: 30,
          padding: 20,
          background: "#020617",
          borderRadius: 12
        }}
      >
        <h3>Programy wydań dla: {selectedObject}</h3>

        {objectPrograms.length === 0 && (
          <p style={{ opacity: 0.7 }}>Brak zdefiniowanych programów wydań.</p>
        )}

        {objectPrograms.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProgramId(p.id)}
            style={{
              padding: 10,
              marginBottom: 8,
              borderRadius: 8,
              cursor: "pointer",
              background:
                selectedProgramId === p.id ? "#1d4ed8" : "#1e293b",
              border:
                selectedProgramId === p.id
                  ? "1px solid #ffffff"
                  : "1px solid #334155"
            }}
          >
            <div>
              <b>{p.grain}</b>
            </div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              {p.cells.map((c) => (
                <span key={c.id} style={{ marginRight: 8 }}>
                  {c.id}: {c.percent}%
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ROZPOCZĘCIE NOWEGO WYDANIA */}
      {selectedProgram && (
        <div
          style={{
            marginBottom: 30,
            padding: 20,
            background: "#1e293b",
            borderRadius: 12
          }}
        >
          <h3>Rozpocznij nowe wydanie ({selectedProgram.grain})</h3>

          <label>Ilość do wydania (t):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginTop: 10,
              background: "#0f172a",
              color: "white",
              borderRadius: 8,
              border: "1px solid #334155"
            }}
          />

          <label style={{ marginTop: 15, display: "block" }}>
            Numer dokumentu WZ (opcjonalnie):
          </label>
          <input
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginTop: 10,
              background: "#0f172a",
              color: "white",
              borderRadius: 8,
              border: "1px solid #334155"
            }}
          />

          <h4 style={{ marginTop: 20 }}>Rozdział na komory:</h4>
          {calculated.map((c) => (
            <div key={c.id} style={{ fontSize: 14 }}>
              {c.id}: {c.toTake.toFixed(2)} t ({c.percent}%) — dostępne:{" "}
              {c.waga} t
            </div>
          ))}

          <button
            onClick={startIssue}
            disabled={!canStart}
            style={{
              width: "100%",
              padding: 18,
              marginTop: 20,
              background: canStart ? "#10b981" : "#475569",
              borderRadius: 10,
              fontSize: 18,
              fontWeight: "bold",
              color: "white",
              border: "none",
              cursor: canStart ? "pointer" : "not-allowed"
            }}
          >
            ROZPOCZNIJ WYDANIE ({totalIssued.toFixed(2)} t)
          </button>
        </div>
      )}

      {/* LISTA TRWAJĄCYCH WYDAŃ DLA OBIEKTU */}
      <h3>Trwające wydania — {selectedObject}</h3>

      {pendingForObject.length === 0 && (
        <p style={{ opacity: 0.7 }}>Brak aktywnych wydań.</p>
      )}

      {pendingForObject.map((issue) => (
        <div
          key={issue.firestoreId}
          style={{
            background: "#1e293b",
            padding: 20,
            borderRadius: 12,
            marginBottom: 15
          }}
        >
          <div>
            <b>Zboże:</b> {issue.grain}
          </div>
          <div>
            <b>Ilość:</b> {issue.totalAmount} t
          </div>
          <div>
            <b>Operator:</b> {issue.operator}
          </div>
          <div>
            <b>Dokument:</b> {issue.docNumber || "-"}
          </div>

          <h4 style={{ marginTop: 10 }}>Rozdział:</h4>
          {issue.program.map((c) => (
            <div key={c.id}>
              {c.id}: {c.toTake.toFixed(2)} t ({c.percent}%)
            </div>
          ))}

          <button
            onClick={() => finishIssue(issue)}
            style={{
              marginTop: 15,
              width: "100%",
              padding: 14,
              background: "#ef4444",
              borderRadius: 10,
              color: "white",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer"
            }}
          >
            ZAKOŃCZ WYDANIE
          </button>
        </div>
      ))}
    </div>
  );
}
