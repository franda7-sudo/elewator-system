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

export default function FillHistoryReport() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const summaryRef = useRef(null);
  const [reportNumber, setReportNumber] = useState("");

  // 🔥 Automatyczne numerowanie raportów
  const generateReportNumber = async () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const counterRef = doc(db, "reportCounters", today);
    const snap = await getDoc(counterRef);

    let next = 1;
    if (snap.exists()) {
      next = snap.data().count + 1;
    }

    await setDoc(counterRef, { count: next }, { merge: true });

    const number = `${today}-${String(next).padStart(3, "0")}`;
    setReportNumber(number);
  };

  useEffect(() => {
    generateReportNumber();
  }, []);

  // 🔥 Pobieranie historii zasypów i korekt z Firestore
  useEffect(() => {
    const q = query(
      collection(db, "fillHistory"),
      orderBy("timestamp", "desc"),
      limit(200)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(arr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Generowanie PDF
  const generatePDF = async () => {
    const pdf = new jsPDF("landscape", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    // STRONA 1 — tabela
    const tableCanvas = await html2canvas(tableRef.current, { scale: 2 });
    pdf.addImage(tableCanvas.toDataURL("image/png"), "PNG", 0, 0, width, height);

    // STRONA 2 — podsumowanie
    pdf.addPage();
    const summaryCanvas = await html2canvas(summaryRef.current, { scale: 2 });
    pdf.addImage(summaryCanvas.toDataURL("image/png"), "PNG", 0, 0, width, height);

    pdf.save(`RAPORT_ZASYPÓW_${reportNumber}.pdf`);
  };

  return (
    <div className="report-box full-width">

      {/* 🔥 Nagłówek A1 */}
      <div className="report-header">
        <div className="report-logo">
          <PzzLogo width={150} />
        </div>

        <div className="report-title">
          <h2>Historia Zasypów i Korekt</h2>
          <p>PZZ Białystok | {new Date().toLocaleDateString()}</p>
          <p>Raport nr: {reportNumber}</p>
        </div>

        <button className="action-btn" onClick={generatePDF}>
          Pobierz PDF
        </button>
      </div>

      {/* STRONA 1 — tabela */}
      <div ref={tableRef} className="pdf-table-wrapper">
        <h2>Ostatnie operacje</h2>

        <table className="summary-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Komora</th>
              <th>Operacja</th>
              <th>Tonaż</th>
              <th>Towar</th>
              <th>Parametry</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="6">Ładowanie...</td></tr>
            ) : history.length === 0 ? (
              <tr><td colSpan="6">Brak danych</td></tr>
            ) : (
              history.map((h) => (
                <tr key={h.id}>
                  <td>
                    {h.timestamp?.toDate
                      ? h.timestamp.toDate().toLocaleString()
                      : "---"}
                  </td>
                  <td>{h.siloId}</td>
                  <td>{h.type}</td>
                  <td>{h.amount} t</td>
                  <td>{h.grainType}</td>
                  <td>{h.qualityParam || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* STRONA 2 — podsumowanie */}
      <div ref={summaryRef} className="pdf-table-wrapper">
        <h2>Podsumowanie</h2>

        <table className="summary-table">
          <tbody>
            <tr>
              <td>Liczba operacji</td>
              <td>{history.length}</td>
            </tr>

            <tr className="total-row">
              <td>Łączny tonaż</td>
              <td>
                {history
                  .reduce((sum, h) => sum + (parseFloat(h.amount) || 0), 0)
                  .toFixed(2)}{" "}
                t
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
