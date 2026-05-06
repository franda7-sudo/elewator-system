import React from "react";
import { useElevator } from "../context/ElevatorContext";
import "./AdminPending.css";

export default function AdminPendingDeliveries() {
  const { pendingDeliveries, confirmUnload } = useElevator();

  const requiresAdmin = pendingDeliveries.filter(
    (d) => d.status === "requires_admin"
  );

  return (
    <div className="admin-pending">
      <h2>Dostawy wymagające decyzji</h2>

      {requiresAdmin.length === 0 && (
        <div className="empty">Brak dostaw wymagających zatwierdzenia.</div>
      )}

      {requiresAdmin.map((d) => (
        <div
          key={d.firestoreId}
          className={`delivery-card ${
            d.qualityStatus === "nienormatywna" ? "danger" : ""
          }`}
        >
          <h3>Dostawa {d.id}</h3>

          <p><b>Zboże:</b> {d.grain}</p>
          <p><b>Waga:</b> {d.amount} t</p>
          <p><b>Komora:</b> {d.cell}</p>
          <p><b>Powód:</b> {d.reason}</p>
          <p><b>Operator:</b> {d.operator}</p>

          <button
            className="approve"
            onClick={() => confirmUnload(d)}
          >
            ✔ Zatwierdź i rozładuj
          </button>
        </div>
      ))}
    </div>
  );
}
