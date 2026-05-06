import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function OperatorLive() {
  const [pending, setPending] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [cells, setCells] = useState([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "pendingDeliveries"), (snap) => {
      setPending(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.timestamp - a.timestamp)
      );
    });

    const unsub2 = onSnapshot(collection(db, "transfers"), (snap) => {
      setTransfers(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.timestamp - a.timestamp)
      );
    });

    const unsub3 = onSnapshot(collection(db, "corrections"), (snap) => {
      setCorrections(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.timestamp - a.timestamp)
      );
    });

    const unsub4 = onSnapshot(collection(db, "cells"), (snap) => {
      setCells(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, []);

  const getFill = (cellId) => {
    const c = cells.find((x) => x.id === cellId);
    if (!c) return null;

    const waga = Number(c.waga || 0);
    const cap = Number(c.capacity || 0);
    if (!cap) return 0;

    return Math.round((waga / cap) * 100);
  };

  const fillColor = (percent) => {
    if (percent >= 95) return "#dc2626"; // czerwony
    if (percent >= 85) return "#f59e0b"; // pomarańczowy
    return "#16a34a"; // zielony
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📡 LIVE – Operatorzy</h2>

      {/* PENDING */}
      <section style={section}>
        <h3>🚚 Przyjęcia / Rozładunki</h3>
        {pending.length === 0 && <div>Brak wpisów.</div>}

        {pending.map((p) => {
          const fill = getFill(p.cell);

          return (
            <div key={p.id} style={item}>
              <div style={{ fontSize: 16 }}>
                <strong>{p.grain}</strong> — {p.amount} t — komora {p.cell}
              </div>

              {fill !== null && (
                <div style={{ marginTop: 4 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 8,
                      background: "#eee",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${fill}%`,
                        height: "100%",
                        background: fillColor(fill),
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 12, color: "#555" }}>
                    Zapełnienie: {fill}%
                  </div>
                </div>
              )}

              <div style={meta}>
                operator: {p.operator || "—"}  
                <span style={badge(p.status || "pending")}>
                  {p.status || "pending"}
                </span>
              </div>

              <div style={meta}>
                {new Date(p.timestamp).toLocaleString()}
              </div>
            </div>
          );
        })}
      </section>

      {/* TRANSFERS */}
      <section style={section}>
        <h3>🔄 Przerzuty</h3>
        {transfers.length === 0 && <div>Brak wpisów.</div>}

        {transfers.map((t) => (
          <div key={t.id} style={item}>
            <div style={{ fontSize: 16 }}>
              {t.fromCell} → {t.toCell} — {t.amount} t
            </div>

            <div style={meta}>
              operator: {t.operator || "—"}
            </div>

            <div style={meta}>
              {new Date(t.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </section>

      {/* CORRECTIONS */}
      <section style={section}>
        <h3>⚖ Korekty wagowe</h3>
        {corrections.length === 0 && <div>Brak wpisów.</div>}

        {corrections.map((c) => (
          <div key={c.id} style={item}>
            <div style={{ fontSize: 16 }}>
              {c.cellId} — luz {c.luz} m → {c.waga} t
            </div>

            <div style={meta}>
              operator: {c.operator || "—"}
            </div>

            <div style={meta}>
              {new Date(c.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

const section = { marginTop: 20 };

const item = {
  marginTop: 8,
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fafafa",
};

const meta = {
  fontSize: 12,
  color: "#555",
  marginTop: 4,
};

const badge = (status) => {
  const map = {
    pending: "#facc15",
    approved: "#4ade80",
    done: "#22c55e",
    error: "#ef4444",
  };
  return {
    background: map[status] || "#ddd",
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 8,
  };
};
