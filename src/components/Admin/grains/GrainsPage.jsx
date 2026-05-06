import React, { useState } from "react";
import { useElevator } from "../../../context/ElevatorContext";
import { Link } from "react-router-dom";
import grainList from "./GrainList";

export default function GrainsPage() {
  const { grains, addGrain, deleteGrain } = useElevator();
  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");

  const handleAdd = async () => {
    const id = newId.trim() || newName.toLowerCase().replace(/\s+/g, "-");
    if (!id || !newName) return;

    await addGrain({
      idOverride: id, // opcjonalnie, jeśli masz własne tworzenie ID
      name: newName,
      createdAt: Date.now(),
    });

    setNewName("");
    setNewId("");
  };

  return (
    <div>
      <h2>Zboża — konfiguracja</h2>

      <h3>Dodaj nowe zboże</h3>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="ID (np. pszenica)"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nazwa (np. Pszenica)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleAdd}>Dodaj</button>
      </div>

      <h3>Lista zbóż</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa</th>
            <th>Parametry</th>
            <th>Grupy jakości</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {grains.map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.name}</td>
              <td>
                <Link to={`/admin/grains/${g.id}/parameters`}>Parametry</Link>
              </td>
              <td>
                <Link to={`/admin/grains/${g.id}/groups`}>Grupy jakości</Link>
              </td>
              <td>
                <button onClick={() => deleteGrain(g.id)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Domyślne zboża (dla selektorów)</h4>
      <ul>
        {grainList.map((g) => (
          <li key={g.id}>
            {g.id} — {g.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
