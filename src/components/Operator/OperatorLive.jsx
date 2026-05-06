import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function OperatorLive() {
  const [intake, setIntake] = useState([]);
  const [unload, setUnload] = useState([]);
  const [transfer, setTransfer] = useState([]);
  const [corrections, setCorrections] = useState([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "intakeQueue"), (snap) => {
      setIntake(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.timestamp - a.timestamp)
      );
    });
    const unsub2 = onSnapshot(collection(db, "unloadQueue"), (snap) => {
      setUnload(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.timestamp - a.timestamp)
      );
    });
    const unsub3 = onSnapshot(collection(db, "transferQueue"), (snap) => {
      setTransfer(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.timestamp - a.timestamp)
      );
    });
    const unsub4 = onSnapshot(collection(db, "corrections"), (snap) => {
      setCorrections(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.timestamp - a.timestamp)
      );
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, []);

  const forceDone = async (collectionName, id) => {
    await updateDoc(doc(db, collectionName, id), {
      status: "done",
      forcedByAdmin: true,
      forcedAt: Date.now(),
    });
  };

  const removeItem = async (collectionName, id) => {
    if (!window.confirm("Usunąć wpis?")) return;
    await deleteDoc(doc(db, collectionName, id));
  };

  return (
    <div style={styles.container}>
      <h2>LIVE – Operatorzy</h2>

      <section style={styles.section}>
        <h3>Przyjęcia (intakeQueue)</h3>
        {intake.length === 0 && <div>Brak wpisów.</div>}
        {intake.map((i) => (
          <div key={i.id} style={styles.item}>
            <div>
              <strong>{i.deliveryNumber}</strong> — {i.grain} — komora{" "}
              {i.cellId} — {i.amount} t
            </div>
            <div style={styles.meta}>
              status: {i.status} — operator: {i.operator}
            </div>
            <div style={styles.actions}>
              <button
                style={styles.btnSmall}
                onClick={() => forceDone("intakeQueue", i.id)}
              >
                Oznacz jako rozładowane
              </button>
              <button
                style={styles.btnSmallDanger}
                onClick={() => removeItem("intakeQueue", i.id)}
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h3>Wydania (unloadQueue)</h3>
        {unload.length === 0 && <div>Brak wpisów.</div>}
        {unload.map((i) => (
          <div key={i.id} style={styles.item}>
            <div>
              {i.grain} — {i.configName} — {i.amount} t
            </div>
            <div style={styles.meta}>
              {i.cells
                ?.map((c) => `${c.cellId} (${c.percent}%)`)
                .join(", ")}
            </div>
            <div style={styles.meta}>
              status: {i.status} — operator: {i.operator}
            </div>
            <div style={styles.actions}>
              <button
                style={styles.btnSmall}
                onClick={() => forceDone("unloadQueue", i.id)}
              >
                Oznacz jako zrealizowane
              </button>
              <button
                style={styles.btnSmallDanger}
                onClick={() => removeItem("unloadQueue", i.id)}
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h3>Przerzuty (transferQueue)</h3>
        {transfer.length === 0 && <div>Brak wpisów.</div>}
        {transfer.map((i) => (
          <div key={i.id} style={styles.item}>
            <div>
              {i.fromCell} → {i.toCell} — {i.amount} t
            </div>
            <div style={styles.meta}>
              status: {i.status} — operator: {i.operator}
            </div>
            <div style={styles.actions}>
              <button
                style={styles.btnSmall}
                onClick={() => forceDone("transferQueue", i.id)}
              >
                Oznacz jako zrealizowane
              </button>
              <button
                style={styles.btnSmallDanger}
                onClick={() => removeItem("transferQueue", i.id)}
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h3>Korekty wagowe (corrections)</h3>
        {corrections.length === 0 && <div>Brak wpisów.</div>}
        {corrections.map((i) => (
          <div key={i.id} style={styles.item}>
            <div>
              {i.cellId} — luz {i.luz} m → {i.waga} t
            </div>
            <div style={styles.meta}>
              operator: {i.operator} —{" "}
              {new Date(i.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    fontFamily: "sans-serif",
  },
  section: {
    marginTop: 20,
  },
  item: {
    marginTop: 8,
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  meta: {
    fontSize: 12,
    color: "#555",
  },
  actions: {
    marginTop: 6,
    display: "flex",
    gap: 6,
  },
  btnSmall: {
    padding: "4px 8px",
    fontSize: 12,
    borderRadius: 4,
    border: "none",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  btnSmallDanger: {
    padding: "4px 8px",
    fontSize: 12,
    borderRadius: 4,
    border: "none",
    background: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  },
};
