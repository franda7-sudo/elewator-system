import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import PzzLogo from "../components/Common/PzzLogo";
import "./Reports.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// 🔥 UNIWERSALNE FORMATOWANIE DATY
const formatDate = (ts) => {
  if (!ts) return "---";

  // Firestore Timestamp
  if (ts.toDate) return ts.toDate().toLocaleString();

  // ISO string
  if (typeof ts === "string") return new Date(ts).toLocaleString();

  // number (ms)
  if (typeof ts === "number") return new Date(ts).toLocaleString();

  return "---";
};

export default function IntakeReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportNumber, setReportNumber] = useState("");

  const tableRef = useRef(null);

  // 🔥 Numer raportu
  const generateReportNumber = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const counterRef = doc(db, "reportCounters", today);
    const snap = await getDoc(counterRef);

    let next = 1;
    if (snap.exists()) next = snap.data().count + 1;

    await setDoc(counterRef, { count: next }, { merge: true });

    const number = `${today}-INT-${String(next).padStart(3, "0")}`;
    setReportNumber(number);
  };

  useEffect(() => {
    generateReportNumber();
  }, []);

  // 🔥 Pobieranie przyjęć z kolekcji DELIVERIES
  useEffect(() => {
    const q = query(
      collection(db, "deliveries"),
      orderBy("timestamp", "desc"),
      limit(300)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRows(arr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 PDF
  const generatePDF = async () => {
    const pdf = new jsPDF("landscape", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    const tableCanvas = await html2canvas(tableRef.current, { scale: 2 });
    pdf.addImage(tableCanvas.toDataURL("image/png"), "PNG", 0, 0, width, height);

    pdf.save(`RAPORT_PRZYJĘĆ_${reportNumber}.pdf`);
  };

  return (
    <div className="report-box full-width">

      <div className="report-header">
        <PzzLogo width={150} />

        <div className="report-title">
          <h2>Raport Przyjęć</h2>
          <p>PZZ Białystok | {new Date().toLocaleDateString()}</p>
          <p>Raport nr: {reportNumber}</p>
        </div>

        <button className="action-btn" onClick={generatePDF}>
          Pobierz PDF
        </button>
      </div>

      <div ref={tableRef} className="pdf-table-wrapper">
        <h2>Lista przyjęć</h2>

        <table className="summary-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Zboże</th>
              <th>Ilość (t)</th>
              <th>Komora</th>
              <th>Operator</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="5">Ładowanie...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan="5">Brak danych</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{formatDate(r.timestamp)}</td>
                  <td>{r.grainType || "-"}</td>
                  <td>{r.weight || 0} t</td>
                  <td>{r.targetCell || "-"}</td>
                  <td>{r.operator || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
