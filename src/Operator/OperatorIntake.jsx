import React, { useState } from "react";
import { useElevator } from "../context/ElevatorContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import "./OperatorView.css";

export default function OperatorIntake() {
  const {
    grainDefinitions,
    qualityConfig,
    cells,
    getSpecialCells,
    addPendingDelivery,
    operator,
    confirmUnload,
  } = useElevator();

  const [grain, setGrain] = useState("");
  const [deliveryId, setDeliveryId] = useState("");
  const [amount, setAmount] = useState("");
  const [sample, setSample] = useState({});
  const [groupResult, setGroupResult] = useState(null);
  const [proposedCells, setProposedCells] = useState([]);
  const [chosenCell, setChosenCell] = useState(null);
  const [requiresApproval, setRequiresApproval] = useState(false);

  const grainList = Object.keys(grainDefinitions || {});

  const POLISH_LABELS = {
    bialko: "Białko",
    gluten: "Gluten",
    wilgotnosc: "Wilgotność",
    gestosc: "Gęstość",
    opadanie: "Liczba opadania",
  };

  const paramMap = grain
    ? Object.values(grainDefinitions[grain]).map((key) => ({
        key,
        label: POLISH_LABELS[key] || key,
      }))
    : [];

  const finalWeight = amount.trim() === "" ? 26 : Number(amount);

  const requiredKeys = paramMap.map((p) => p.key);

  const allParamsFilled = requiredKeys.every((key) => {
    const v = sample[key];
    return v !== "" && v !== undefined && !isNaN(v);
  });

  const canMatch =
    grain && deliveryId.trim() !== "" && allParamsFilled;

  // 🔥 DYNAMICZNE dopasowanie grupy jakości
  const matchQualityGroup = () => {
    const q = qualityConfig[grain];
    if (!q || !q.groups) {
      alert("Brak skonfigurowanych grup jakości.");
      return;
    }

    let matched = null;

    for (const [groupId, group] of Object.entries(q.groups)) {
      if (!group.keyParam || !group.params) continue;

      const key = group.keyParam;
      const range = group.params[key];
      if (!range) continue;

      const v = sample[key];
      if (v === undefined || v === "" || isNaN(v)) continue;

      if (
        Number(v) >= Number(range.min) &&
        Number(v) <= Number(range.max)
      ) {
        matched = { groupId, ...group, keyParam: key };
        break;
      }
    }

    if (!matched) {
      const special = getSpecialCells(grain);

      if (special.length === 0) {
        alert(
          "Próbka nie pasuje do żadnej grupy jakościowej i brak komór specjalnych."
        );
        setGroupResult(null);
        setProposedCells([]);
        setRequiresApproval(true);
        return;
      }

      alert(
        "Próbka nie pasuje do żadnej grupy jakościowej.\n" +
          "Możliwe przyjęcie tylko do komory specjalnej."
      );

      setGroupResult(null);
      setProposedCells(
        special.map((c) => ({
          id: c.id,
          fill: Number(c.waga || 0) / Number(c.capacity || 1),
        }))
      );
      setRequiresApproval(true);
      return;
    }

    const warnings = [];
    for (const [paramKey, range] of Object.entries(matched.params)) {
      const v = sample[paramKey];
      if (v === undefined || v === "" || isNaN(v)) continue;

      if (
        Number(v) < Number(range.min) ||
        Number(v) > Number(range.max)
      ) {
        warnings.push(
          `${POLISH_LABELS[paramKey] || paramKey}: ${v} poza zakresem ${
            range.min
          }–${range.max}`
        );
      }
    }

    let needsApproval = warnings.length > 0;

    if (needsApproval) {
      alert(
        "Uwaga! Parametry poza zakresem:\n" +
          warnings.join("\n") +
          "\n\nDostawa wymaga zatwierdzenia."
      );
    }

    setGroupResult(matched);
    setRequiresApproval(needsApproval);

    const available = cells
      .filter((c) => {
        const groupField = c.groupId || c.group;
        if (groupField !== matched.groupId) return false;
        if (c.blocked) return false;

        const fill =
          Number(c.waga || 0) / Number(c.capacity || 1);

        return fill < 0.95;
      })
      .map((c) => ({
        id: c.id,
        fill: Number(c.waga || 0) / Number(c.capacity || 1),
      }))
      .sort((a, b) => b.fill - a.fill)
      .slice(0, 2);

    if (available.length === 0) {
      const special = getSpecialCells(grain);

      if (special.length === 0) {
        alert("Brak wolnych komór i brak komór specjalnych.");
        setProposedCells([]);
        setRequiresApproval(true);
        return;
      }

      alert("Brak wolnych komór. Dostępne tylko komory specjalne.");

      setProposedCells(
        special.map((c) => ({
          id: c.id,
          fill: Number(c.waga || 0) / Number(c.capacity || 1),
        }))
      );
      setRequiresApproval(true);
      return;
    }

    setProposedCells(available);
  };

  // 🔥 Zatwierdzenie dostawy — TERAZ ZAPISUJE DO FIRESTORE
  const confirm = async () => {
    if (!chosenCell) return alert("Wybierz komorę.");

    let reason = "ok";

    if (!groupResult) {
      reason = "no_quality_group_match";
    } else if (proposedCells.length === 0) {
      reason = "no_free_cells";
    } else if (requiresApproval) {
      reason = "param_out_of_range";
    }

    const delivery = {
      id: deliveryId,
      grain,
      amount: finalWeight,
      qualityGroupId: groupResult ? groupResult.groupId : "poza_parametrami",
      cell: chosenCell,
      sample,
      operator: operator?.name || "operator",
      createdAt: Date.now(),
      requiresApproval,
      approved: !requiresApproval,
      status: requiresApproval ? "requires_admin" : "auto_approved",
      qualityStatus: requiresApproval ? "nienormatywna" : "normatywna",
      reason,
    };

    // 🔥 1) ZAPIS PRZYJĘCIA DO FIRESTORE
    await addDoc(collection(db, "deliveries"), {
      deliveryId,
      grain,
      weight: finalWeight,
      cell: chosenCell,
      sample,
      operator: operator?.name || "operator",
      qualityGroupId: delivery.qualityGroupId,
      requiresApproval,
      approved: !requiresApproval,
      status: delivery.status,
      reason,
      timestamp: serverTimestamp(),
    });

    // 🔥 2) ZAPIS RUCHU DO FIRESTORE (movements)
    await addDoc(collection(db, "movements"), {
      type: "przyjęcie",
      grainType: grain,
      weight: finalWeight,
      cell: chosenCell,
      operator: operator?.name || "operator",
      timestamp: serverTimestamp(),
    });

    // 🔥 3) STARA LOGIKA — zostaje
    await addPendingDelivery(delivery);

    if (!requiresApproval) {
      await confirmUnload(delivery);
    } else {
      alert("Dostawa zgłoszona do zatwierdzenia.");
    }

    // reset
    setDeliveryId("");
    setAmount("");
    setSample({});
    setGroupResult(null);
    setProposedCells([]);
    setChosenCell(null);
    setRequiresApproval(false);
  };

  return (
    <div className="operator-view">
      <h2>Przyjęcie zboża</h2>

      <input
        placeholder="Numer dostawy"
        value={deliveryId}
        onChange={(e) => setDeliveryId(e.target.value)}
      />

      <select
        value={grain}
        onChange={(e) => {
          setGrain(e.target.value);
          setSample({});
          setGroupResult(null);
          setProposedCells([]);
          setChosenCell(null);
          setRequiresApproval(false);
        }}
      >
        <option value="">Wybierz zboże</option>
        {grainList.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      {grain &&
        paramMap.map(({ key, label }) => (
          <input
            key={key}
            placeholder={label}
            type="number"
            value={sample[key] ?? ""}
            onChange={(e) =>
              setSample((prev) => ({
                ...prev,
                [key]: Number(e.target.value),
              }))
            }
          />
        ))}

      <input
        placeholder="Waga (t)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button disabled={!canMatch} onClick={matchQualityGroup}>
        Dopasuj grupę jakości
      </button>

      {proposedCells.length > 0 && (
        <>
          <h3>Proponowane komory</h3>

          {proposedCells.map((c) => (
            <div
              key={c.id}
              onClick={() => setChosenCell(c.id)}
              className={
                chosenCell === c.id ? "cell selected" : "cell"
              }
            >
              {c.id} — {(c.fill * 100).toFixed(0)}%
            </div>
          ))}

          <button onClick={confirm}>
            {requiresApproval
              ? "➜ Zgłoś do zatwierdzenia"
              : "✔ Zatwierdź dostawę"}
          </button>
        </>
      )}
    </div>
  );
}
