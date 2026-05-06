// src/components/Admin/QualityPanel.jsx
import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./QualityPanel.css";

export default function QualityPanel() {
  const [grain, setGrain] = useState("pszenica");
  const [groups, setGroups] = useState([]);
  const [cells, setCells] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCells = async () => {
    const snap = await getDocs(collection(db, "cells"));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setCells(list);
    setLoading(false);
  };

  const loadGroups = async () => {
    const snap = await getDocs(collection(db, `grains/${grain}/groups`));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setGroups(list);
  };

  useEffect(() => {
    loadCells();
  }, []);

  useEffect(() => {
    loadGroups();
  }, [grain]);

  const emergencyGroup = useMemo(
    () => groups.find((g) => g.type === "emergency") || null,
    [groups]
  );

  const usedCellsNormal = useMemo(() => {
    const set = new Set();
    groups
      .filter((g) => g.type !== "emergency")
      .forEach((g) => g.assignedCells?.forEach((c) => set.add(c)));
    return set;
  }, [groups]);

  const emergencyCells = useMemo(() => {
    const set = new Set();
    if (emergencyGroup?.assignedCells) {
      emergencyGroup.assignedCells.forEach((c) => set.add(c));
    }
    return set;
  }, [emergencyGroup]);

  const newNormalGroup = () => {
    setCurrentGroup({
      name: "",
      type: "normal",
      keyParam: "",
      params: {},
      assignedCells: [],
    });
  };

  const newEmergencyGroup = () => {
    if (emergencyGroup) {
      alert("Grupa awaryjna już istnieje dla tego zboża.");
      return;
    }
    setCurrentGroup({
      name: "Awaryjna",
      type: "emergency",
      assignedCells: [],
      reason: "przekroczone parametry",
    });
  };

  const saveGroup = async () => {
    if (!currentGroup.name) {
      alert("Podaj nazwę grupy");
      return;
    }

    if (currentGroup.type === "normal" && !currentGroup.keyParam) {
      alert("Podaj parametr kluczowy");
      return;
    }

    if (currentGroup.id) {
      await updateDoc(
        doc(db, `grains/${grain}/groups/${currentGroup.id}`),
        currentGroup
      );
    } else {
      await addDoc(collection(db, `grains/${grain}/groups`), currentGroup);
    }

    setCurrentGroup(null);
    loadGroups();
  };

  const removeGroup = async (id) => {
    if (!window.confirm("Usunąć grupę?")) return;
    await deleteDoc(doc(db, `grains/${grain}/groups/${id}`));
    setCurrentGroup(null);
    loadGroups();
  };

  const toggleCell = (cellId) => {
    const assigned = currentGroup.assignedCells || [];

    if (assigned.includes(cellId)) {
      setCurrentGroup({
        ...currentGroup,
        assignedCells: assigned.filter((c) => c !== cellId),
      });
    } else {
      setCurrentGroup({
        ...currentGroup,
        assignedCells: [...assigned, cellId],
      });
    }
  };

  if (loading) return <div className="quality-wrapper">Ładowanie...</div>;

  return (
    <div className="quality-wrapper">
      <h2>Grupy jakościowe</h2>

      <div className="grain-select">
        <label>Zboże:</label>
        <select value={grain} onChange={(e) => setGrain(e.target.value)}>
          <option value="pszenica">Pszenica</option>
          <option value="zyto">Żyto</option>
          <option value="jeczmien">Jęczmień</option>
          <option value="owies">Owies</option>
          <option value="rzepak">Rzepak</option>
        </select>

        <button className="btn-add" onClick={newNormalGroup}>
          + Nowa grupa
        </button>
        <button className="btn-emergency" onClick={newEmergencyGroup}>
          + Grupa awaryjna
        </button>
      </div>

      <div className="groups-list">
        {groups.map((g) => (
          <div key={g.id} className="group-row">
            <div className="group-grain">{grain}</div>

            <div className="group-param">
              {g.type === "emergency"
                ? "AWARYJNA (przekroczone parametry)"
                : `${g.keyParam}: ${g.params[g.keyParam]?.min} – ${g.params[g.keyParam]?.max}`}
            </div>

            <div className="group-cells">
              {g.assignedCells?.length ? g.assignedCells.join(", ") : "—"}
            </div>

            <div className="group-actions">
              <button onClick={() => setCurrentGroup(g)}>Edytuj</button>
              <button className="btn-del" onClick={() => removeGroup(g.id)}>
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>

      {currentGroup && (
        <div className="editor">
          <h3>
            {currentGroup.type === "emergency"
              ? "Grupa awaryjna"
              : "Grupa jakościowa"}
          </h3>

          <label>Nazwa grupy</label>
          <input
            value={currentGroup.name}
            onChange={(e) =>
              setCurrentGroup({ ...currentGroup, name: e.target.value })
            }
          />

          {currentGroup.type === "normal" && (
            <>
              <label>Parametr kluczowy</label>
              <input
                value={currentGroup.keyParam}
                onChange={(e) =>
                  setCurrentGroup({
                    ...currentGroup,
                    keyParam: e.target.value,
                  })
                }
              />

              <label>Zakres (min – max)</label>
              <div className="range-row">
                <input
                  placeholder="min"
                  value={
                    currentGroup.params[currentGroup.keyParam]?.min || ""
                  }
                  onChange={(e) =>
                    setCurrentGroup({
                      ...currentGroup,
                      params: {
                        ...currentGroup.params,
                        [currentGroup.keyParam]: {
                          ...currentGroup.params[currentGroup.keyParam],
                          min: e.target.value,
                        },
                      },
                    })
                  }
                />
                <input
                  placeholder="max"
                  value={
                    currentGroup.params[currentGroup.keyParam]?.max || ""
                  }
                  onChange={(e) =>
                    setCurrentGroup({
                      ...currentGroup,
                      params: {
                        ...currentGroup.params,
                        [currentGroup.keyParam]: {
                          ...currentGroup.params[currentGroup.keyParam],
                          max: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </>
          )}

          {currentGroup.type === "emergency" && (
            <>
              <label>Opis / powód</label>
              <input
                value={currentGroup.reason || ""}
                onChange={(e) =>
                  setCurrentGroup({
                    ...currentGroup,
                    reason: e.target.value,
                  })
                }
              />
            </>
          )}

          <h4>Komory</h4>
          <div className="cells-grid">
            {cells.map((c) => {
              const inCurrent =
                currentGroup.assignedCells?.includes(c.id) || false;

              const disabled =
                (
                  usedCellsNormal.has(c.id) &&
                  !inCurrent &&
                  currentGroup.type !== "emergency"
                ) ||
                (
                  emergencyCells.has(c.id) &&
                  !inCurrent &&
                  currentGroup.type !== "emergency"
                );

              const isEmergency =
                emergencyCells.has(c.id) &&
                (currentGroup.type === "emergency" || inCurrent);

              return (
                <button
                  key={c.id}
                  disabled={disabled}
                  className={
                    inCurrent
                      ? isEmergency
                        ? "cell-active cell-emergency"
                        : "cell-active"
                      : disabled
                      ? "cell-disabled"
                      : isEmergency
                      ? "cell-emergency"
                      : ""
                  }
                  onClick={() => toggleCell(c.id)}
                >
                  {c.id}
                </button>
              );
            })}
          </div>

          <div className="editor-actions">
            <button className="btn-save" onClick={saveGroup}>
              Zapisz
            </button>
            <button
              className="btn-cancel"
              onClick={() => setCurrentGroup(null)}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
