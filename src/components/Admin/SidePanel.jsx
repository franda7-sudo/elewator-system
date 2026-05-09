import React, { useState, useMemo, useEffect } from "react";
import "./SidePanel.css";

export default function SidePanel({
  cell,
  onClose,
  onSave,
  grainDefinitions,
  qualityConfig
}) {
  const [grain, setGrain] = useState(cell.grain || "");
  const [waga, setWaga] = useState(cell.waga || 0);
  const [capacity, setCapacity] = useState(cell.capacity || 0);
  const [firstFill, setFirstFill] = useState(cell.firstFill || "");
  const [qualityGroupId, setQualityGroupId] = useState(cell.qualityGroupId || "");
  const [special, setSpecial] = useState(!!cell.special);
  const [blocked, setBlocked] = useState(!!cell.blocked);

  // Automatyczne ustawianie pojemności przy ładowaniu jeśli brak
  useEffect(() => {
    if (!cell.capacity || cell.capacity === 0) {
      const id = String(cell.id);
      if (id.endsWith('N')) setCapacity(1060);
      else if (id.endsWith('S') || id.endsWith('G')) setCapacity(250);
      else setCapacity(180);
    }
  }, [cell.id, cell.capacity]);

  // Lista grup jakości dla wybranego ziarna
  const availableGroups = useMemo(() => {
    if (!grain || !qualityConfig[grain]) return [];
    return Object.values(qualityConfig[grain].groups || {});
  }, [grain, qualityConfig]);

  const handleSaveClick = () => {
    const newWaga = Number(waga);
    const maxCap = Number(capacity);
    const freeSpace = maxCap - newWaga;

    // Jeśli komora ma ziarno, musi mieć datę pierwszego zasypu
    if (grain && !firstFill.trim()) {
      alert("Data pierwszego zasypu jest obowiązkowa.");
      return;
    }

    // Walidacja: Blokada jeśli mało miejsca (poniżej 26t)
    if (newWaga > cell.waga && freeSpace < 26) {
      alert(`BRAK MIEJSCA! Wolne miejsce (${freeSpace.toFixed(1)}t) jest mniejsze niż standardowa dostawa (26t).`);
      return;
    }

    // Walidacja: Ostrzeżenie 90%
    if (newWaga >= maxCap * 0.9) {
      const ok = window.confirm(`UWAGA: Komora zapełniona w ${((newWaga/maxCap)*100).toFixed(0)}%. Kontynuować?`);
      if (!ok) return;
    }

    onSave({
      ...cell,
      grain: grain || null,
      waga: newWaga,
      capacity: maxCap,
      firstFill: grain ? firstFill : null,
      qualityGroupId: qualityGroupId || null,
      special,
      blocked,
      updatedAt: Date.now()
    });

    onClose();
  };

  return (
    <div className="sidepanel">
      <h3>Komora {cell.id}</h3>

      <label>Zboże:
        <select value={grain} onChange={(e) => {
          setGrain(e.target.value);
          setQualityGroupId(""); // reset grupy przy zmianie ziarna
        }}>
          <option value="">— wybierz —</option>
          {Object.keys(grainDefinitions).map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </label>

      {grain && (
        <label>Grupa jakości:
          <select
            value={qualityGroupId}
            onChange={(e) => setQualityGroupId(e.target.value)}
          >
            <option value="">— brak —</option>
            {availableGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.id}
              </option>
            ))}
          </select>
        </label>
      )}

      <label>Waga (t):
        <input type="number" value={waga} onChange={(e) => setWaga(e.target.value)} />
      </label>

      <label>Pojemność Max (t):
        <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
      </label>

      <label>Pierwszy zasyp:
        <input type="text" value={firstFill} onChange={(e) => setFirstFill(e.target.value)} />
      </label>

      <label className="checkbox-row">
        <input type="checkbox" checked={special} onChange={(e) => setSpecial(e.target.checked)} />
        Specjalna
      </label>

      <label className="checkbox-row">
        <input type="checkbox" checked={blocked} onChange={(e) => setBlocked(e.target.checked)} />
        Zablokowana
      </label>

      <div className="sidepanel-buttons">
        <button className="save-btn" onClick={handleSaveClick}>Zapisz</button>
        <button className="close-btn" onClick={onClose}>Zamknij</button>
      </div>
    </div>
  );
}
