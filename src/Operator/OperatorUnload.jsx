import React, { useMemo } from "react";
import { useElevator } from "../context/ElevatorContext";

export default function OperatorUnload() {
  const {
    pendingDeliveries,
    confirmUnload,
    loading,
  } = useElevator();

  // 🔥 Filtrujemy tylko zatwierdzone dostawy
  const toUnload = useMemo(() => {
    return (pendingDeliveries || []).filter((d) => d.approved === true);
  }, [pendingDeliveries]);

  const handleUnload = async (delivery) => {
    try {
      // 🔥 MUSIMY przekazać firestoreId
      await confirmUnload({
        firestoreId: delivery.firestoreId,
        id: delivery.id,          // numer kwitu
        cell: delivery.cell,
        amount: delivery.amount,
      });

      alert(`Rozładowano dostawę ${delivery.id}.`);
    } catch (error) {
      console.error("Błąd rozładunku:", error);
      alert("Nie udało się rozładować: " + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        Pobieranie danych...
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Kolejka do rozładunku</h2>
        <span style={{ fontSize: 14, color: "#6b7280" }}>
          Oczekujące: {toUnload.length}
        </span>
      </div>

      {toUnload.length === 0 ? (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            border: "2px dashed #ccc",
            borderRadius: 12,
            color: "#666",
          }}
        >
          Brak zatwierdzonych dostaw gotowych do wjazdu na wagę.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {toUnload.map((d) => (
            <div
              key={d.firestoreId} // 🔥 poprawione
              style={{
                padding: 16,
                borderRadius: 12,
                background: "#1f2937",
                color: "#f3f4f6",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderLeft: "6px solid #16a34a",
              }}
            >
              <div style={{ lineHeight: "1.6" }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Kwit: {d.id}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginTop: 8,
                  }}
                >
                  <span>
                    <strong>Zboże:</strong> {d.grain}
                  </span>
                  <span>
                    <strong>Komora:</strong>{" "}
                    <mark
                      style={{
                        background: "#374151",
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {d.cell}
                    </mark>
                  </span>
                  <span>
                    <strong>Waga:</strong> {d.amount} t
                  </span>
                  <span>
                    <strong>Grupa:</strong> {d.qualityGroupId}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => handleUnload(d)}
                  style={btnStyle("#16a34a")}
                >
                  ROZŁADUJ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const btnStyle = (bg) => ({
  padding: "12px 20px",
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
  transition: "opacity 0.2s",
  fontSize: 14,
});
