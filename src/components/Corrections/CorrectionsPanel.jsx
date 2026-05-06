// /src/components/Corrections/CorrectionsPanel.jsx
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";
import "./Corrections.css";

export default function CorrectionsPanel() {
  const [korekty, setKorekty] = useState([]);

  useEffect(() => {
    const path = ref(db, "elewator/komory");
    return onValue(path, (snap) => {
      const data = snap.val() || {};
      const arr = [];

      Object.entries(data).forEach(([komora, info]) => {
        if (info.masa?.korekty) {
          Object.entries(info.masa.korekty).forEach(([id, k]) => {
            arr.push({
              id,
              komora,
              ...k
            });
          });
        }
      });

      arr.sort((a, b) => b.timestamp - a.timestamp);
      setKorekty(arr);
    });
  }, []);

  return (
    <div className="corrections-box">
      <h3>Korekty masy</h3>

      <table className="corrections-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Komora</th>
            <th>Nowa masa [t]</th>
            <th>Powód</th>
          </tr>
        </thead>

        <tbody>
          {korekty.map((k) => (
            <tr key={k.id}>
              <td>{new Date(k.timestamp).toLocaleString()}</td>
              <td>{k.komora}</td>
              <td>{k.nowa_masa}</td>
              <td>{k.powod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
