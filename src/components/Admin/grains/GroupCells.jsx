import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { db } from "../../../firebase";
import { GRAIN_COLORS } from "./GrainColors";
import "./Grains.css";

export default function GroupCells({ grainId, group }) {
  const groupId = group.id;

  const [allCells, setAllCells] = useState([]);
  const [groupCells, setGroupCells] = useState(group.cells || []);

  // 1. Pobierz wszystkie komory (globalnie)
  useEffect(() => {
    const ref = collection(db, "cells");
    const unsub = onSnapshot(ref, (snap) => {
      setAllCells(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 2. Aktualizuj stan komór przypisanych do grupy
  useEffect(() => {
    setGroupCells(group.cells || []);
  }, [group.cells]);

  // 3. Funkcja: czy komora jest wolna (nieprzydzielona)
  const isFreeCell = (cell) =>
    !cell.grainId && !cell.groupId && (cell.weight ?? 0) === 0;

  // 4. Funkcja: kolor komory (kolor zboża lub szary)
  const getCellColor = (cell) => {
    if (!cell.grainId) return "#d9d9d9"; // wolna komora = szara
    return GRAIN_COLORS[cell.grainId] || "#cccccc";
  };

  // 5. Przypisywanie / odpinanie komór z uwzględnieniem Twoich zasad
  const toggleCell = async (cell) => {
    const cellId = cell.id;

    // BLOKADA: nie można odpiąć komory, jeśli nie jest pusta
    if (groupCells.includes(cellId) && (cell.weight ?? 0) > 0) {
      alert(
        "Nie można odłączyć komory, dopóki nie zostanie całkowicie opróżniona."
      );
      return;
    }

    // BLOKADA: nie można przypisać komory, jeśli jest zajęta przez inne zboże
    if (!groupCells.includes(cellId) && cell.grainId && cell.grainId !== grainId) {
      alert(
        "Komora jest zajęta przez inne zboże. Najpierw musi zostać opróżniona i wyzerowana."
      );
      return;
    }

    // BLOKADA: nie można przypisać/odpiąć, jeśli trwa zasyp
    if (cell.isFilling) {
      alert("Komora jest w trakcie zasypu. Poczekaj na zakończenie procesu.");
      return;
    }

    let newCells;

    if (groupCells.includes(cellId)) {
      // Odpinamy komorę od grupy (tylko jeśli pusta)
      newCells = groupCells.filter((id) => id !== cellId);

      await updateDoc(doc(db, "cells", cellId), {
        groupId: null,
        grainId: null
      });
    } else {
      // Przypisujemy komorę do grupy i zboża
      newCells = [...groupCells, cellId];

      await updateDoc(doc(db, "cells", cellId), {
        groupId,
        grainId
      });
    }

    // Zapis listy komór w dokumencie grupy
    await updateDoc(doc(db, "grains", grainId, "groups", groupId), {
      cells: newCells
    });
  };

  // 6. Podział komór na:
  // - wolne (szare)
  // - przypisane do tej grupy
  // - przypisane do innych grup/zboża
  const freeCells = allCells.filter((c) => isFreeCell(c));
  const assignedCells = allCells.filter(
    (c) => c.groupId === groupId && c.grainId === grainId
  );
  const foreignCells = allCells.filter(
    (c) =>
      c.grainId &&
      (c.grainId !== grainId || (c.groupId && c.groupId !== groupId))
  );

  return (
    <div className="group-cells">
      <h3>Komory przypisane do grupy {group.label}</h3>

      {/* KOMORY PRZYPISANE DO TEJ GRUPY */}
      <div className="cells-section">
        <h4>Komory tej grupy ({grainId})</h4>
        <div className="cells-list">
          {assignedCells.map((c) => (
            <button
              key={c.id}
              className="cell-btn cell-assigned"
              style={{ background: getCellColor(c) }}
              onClick={() => toggleCell(c)}
            >
              {c.id}
            </button>
          ))}

          {assignedCells.length === 0 && (
            <div className="empty-info">
              Brak komór przypisanych do tej grupy.
            </div>
          )}
        </div>
      </div>

      {/* KOMORY WOLNE (SZARE) */}
      <div className="cells-section">
        <h4>Komory wolne (nieprzydzielone)</h4>
        <div className="cells-list">
          {freeCells.map((c) => (
            <button
              key={c.id}
              className="cell-btn cell-free"
              style={{ background: getCellColor(c) }}
              onClick={() => toggleCell(c)}
            >
              {c.id}
            </button>
          ))}

          {freeCells.length === 0 && (
            <div className="empty-info">Brak wolnych komór.</div>
          )}
        </div>
      </div>

      {/* KOMORY ZAJĘTE PRZEZ INNE ZBOŻE / GRUPĘ */}
      <div className="cells-section">
        <h4>Komory zajęte przez inne zboże / grupę</h4>
        <div className="cells-list">
          {foreignCells.map((c) => (
            <button
              key={c.id}
              className="cell-btn cell-blocked"
              style={{ background: getCellColor(c) }}
              disabled
            >
              {c.id}
            </button>
          ))}

          {foreignCells.length === 0 && (
            <div className="empty-info">
              Brak komór zajętych przez inne zboże / grupę.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
