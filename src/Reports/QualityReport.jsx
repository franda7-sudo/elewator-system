import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
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

export default function QualityReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportNumber, setReportNumber] = useState("");

  const tableRef = useRef(null);
  const summaryRef = useRef(null);

  // 🔥 Numerowanie raportów
  const generateReportNumber = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const counterRef = doc(db, "reportCounters", today);
    const snap = await getDoc(counterRef);

    let next = 1;
    if (snap.exists()) next = snap.data().count + 1;

    await setDoc(counterRef, { count: next }, { merge: true });

    const number = `${today}-${String(next).padStart(3, "0")}`;
    setReportNumber(number);
  };

  useEffect(() => {
    generateReportNumber();
  }, []);

  // 🔥 Pobieranie jakości z fillHistory
  useEffect(() => {
    const q = query(
      collection(db, "fillHistory"),
      where("qualityParam", "!=", null),
      orderBy("timestamp", "desc"),
      limit(200)
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

  // 🔥 Podsumowanie jakości
  const summary = (() => {
    const groups = {};
    rows.forEach((r) => {
      if (!r.qualityParam) return;
      const val = parseFloat(r.qualityParam);
      if (isNaN(val)) return;

      if (!groups[r.grainType]) groups[r.grainType] = [];
      groups[r.grainType].push(val);
    });

    const result = {};
    Object.keys(groups).forEach((grain) => {
      const arr = groups[grain];
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      result[grain] = avg;
    });

    return result;
  })();

  // 🔥 PDF
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

    pdf.save(`RAPORT_JAKOŚCI_${reportNumber}.pdf`);
  };

  return (
    <div className="report-box full-width">

      {/* 🔥 Nagłówek A1 */}
      <div className="report-header">
        <div className="report-logo">
          <PzzLogo width={150} />
        </div>

        <div className="report-title">
          <h2>Raport Jakości</h2>
          <p>PZZ Białystok | {new Date().toLocaleDateString()}</p>
          <p>Raport nr: {reportNumber}</p>
        </div>

        <button className="action-btn" onClick={generatePDF}>
          Pobierz PDF
        </button>
      </div>

      {/* STRONA 1 — tabela */}
      <div ref={tableRef} className="pdf-table-wrapper">
        <h2>Ostatnie pomiary jakości</h2>

        <table className="summary-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Komora</th>
              <th>Towar</th>
              <th>Parametr</th>
              <th>Wartość</th>
              <th>Operator</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="6">Ładowanie...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan="6">Brak danych</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.timestamp?.toDate ? r.timestamp.toDate().toLocaleString() : "---"}</td>
                  <td>{r.siloId}</td>
                  <td>{r.grainType}</td>
                  <td>{r.keyParam || "parametr"}</td>
                  <td>{r.qualityParam}</td>
                  <td>{r.operator}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* STRONA 2 — podsumowanie */}
      <div ref={summaryRef} className="pdf-table-wrapper">
        <h2>Podsumowanie jakości</h2>

        <table className="summary-table">
          <tbody>
            {Object.keys(summary).map((grain) => (
              <tr key={grain}>
                <td>{grain}</td>
                <td>{summary[grain].toFixed(2)}</td>
              </tr>
            ))}

            <tr className="total-row">
              <td>Łączna liczba pomiarów</td>
              <td>{rows.length}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
