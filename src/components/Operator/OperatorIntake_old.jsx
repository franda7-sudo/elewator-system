import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./OperatorView.css";

export default function OperatorIntake() {
  const [delivery, setDelivery] = useState("");
  const [weight, setWeight] = useState("");
  const [grain, setGrain] = useState("");
  const [error, setError] = useState("");
  const [grains, setGrains] = useState([]);

  // 🔥 Pobieranie zbóż z Firestore
  useEffect(() => {
    const fetchGrains = async () => {
      const snap = await getDocs(collection(db, "grains"));
      const list = snap.docs.map((d) => d.id);
      setGrains(list);
    };

    fetchGrains();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!delivery || !weight || !grain) {
      setError("Wszystkie pola są wymagane.");
      return;
    }

    if (isNaN(weight) || Number(weight) <= 0) {
      setError("Waga musi być liczbą większą od 0.");
      return;
    }

    setError("");
    alert("✔ Przyjęcie zapisane (tu będzie Firestore)");
  };

  return (
    <div className="operator-view">
      <h2>Przyjęcia</h2>

      <form className="operator-form" onSubmit={handleSubmit}>
        <input
          placeholder="Numer dostawy"
          value={delivery}
          onChange={(e) => setDelivery(e.target.value)}
        />

        <input
          placeholder="Waga (t)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <select value={grain} onChange={(e) => setGrain(e.target.value)}>
          <option value="">Wybierz zboże</option>

          {/* 🔥 Prawdziwe zboża z Firestore */}
          {grains.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {error && <div className="error-msg">{error}</div>}

        <button type="submit">➕ Dodaj dostawę</button>
      </form>
    </div>
  );
}
