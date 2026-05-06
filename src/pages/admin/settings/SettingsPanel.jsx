import React, { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "./Settings.css";

export default function SettingsPanel() {
  const [settings, setSettings] = useState({ alarmTemp: 35, alarmWeight: 0.9 });

  useEffect(() => {
    const ref = doc(db, "config", "global");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setSettings(snap.data());
    });
    return () => unsub();
  }, []);

  async function save() {
    await setDoc(doc(db, "config", "global"), settings, { merge: true });
    alert("Zapisano ustawienia");
  }

  return (
    <div className="settings-panel">
      <h3>Alarmy</h3>

      <label>Temperatura alarmowa (°C):</label>
      <input
        type="number"
        value={settings.alarmTemp}
        onChange={(e) =>
          setSettings({ ...settings, alarmTemp: Number(e.target.value) })
        }
      />

      <label>Procent pojemności dla alarmu wagi (0–1):</label>
      <input
        type="number"
        step="0.01"
        value={settings.alarmWeight}
        onChange={(e) =>
          setSettings({ ...settings, alarmWeight: Number(e.target.value) })
        }
      />

      <button onClick={save}>💾 Zapisz</button>
    </div>
  );
}
