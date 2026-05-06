import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { Link } from "react-router-dom";
import "./Grains.css";

export default function GrainsIndex() {
  const [grains, setGrains] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "grains"), (snap) => {
      setGrains(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="grains-container">
      <h1>Zboża</h1>
      <ul>
        {grains.map((g) => (
          <li key={g.id}>
            <Link to={`/admin/grains/${g.id}`}>{g.name || g.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
