import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import PzzLogo from "../components/Common/PzzLogo";
import "./Reports.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CellsReport() {
  const [cells, setCells] = useState([]);
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

  // 🔥 Pobieranie komór z Firestore
  useEffect(() => {
    const q = query(collection(db, "cells"), orderBy("id", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCells(arr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Podsumowanie tonażu wg zboża
  const summary = (() => {
    const sum = {};
    cells.forEach((c) => {
      if (!c.grainType) return;
      const tons = typeof c.amount === "number" ? c.amount : 0;
      if (!sum[c.grainType]) sum[c.grainType] = 0;
      sum[c.grainType] += tons;
    });
    return sum;
  })();

  const totalTons = Object.values(summary).reduce((a, b) => a + b, 0);

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

    pdf.save(`RAPORT_KOMÓR_${reportNumber}.pdf`);
  };

  return (
    <div className="report-box full-width">

      {/* 🔥 Nagłówek A1 */}
      <div className="report-header">
        <div className="report-logo">
          <PzzLogo width={150} />
        </div>

        <div className="report-title">
          <h2>Raport Komór</h2>
          <p>PZZ Białystok | {new Date().toLocaleDateString()}</p>
          <p>Raport nr: {reportNumber}</p>
        </div>

        <button className="action-btn" onClick={generatePDF}>
          Pobierz PDF
        </button>
      </div>

      {/* STRONA 1 — tabela */}
      <div ref={tableRef} className="pdf-table-wrapper">
        <h2>Stan komór</h2>

        <table className="summary-table">
          <thead>
            <tr>
              <th>Komora</th>
              <th>Towar</th>
              <th>Ilość (t)</th>
              <th>Pojemność (t)</th>
              <th>Zapełnienie (%)</th>
              <th>Grupa jakości</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="6">Ładowanie...</td></tr>
            ) : cells.length === 0 ? (
              <tr><td colSpan="6">Brak danych</td></tr>
            ) : (
              cells.map((c) => {
                const percent =
                  c.capacity && c.amount
                    ? ((c.amount / c.capacity) * 100).toFixed(1)
                    : "0";

                return (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.grainType || "-"}</td>
                    <td>{c.amount || 0} t</td>
                    <td>{c.capacity || "-"}</td>
                    <td>{percent}%</td>
                    <td>{c.groupId || "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* STRONA 2 — podsumowanie */}
      <div ref={summaryRef} className="pdf-table-wrapper">
        <h2>Podsumowanie zboża</h2>

        <table className="summary-table">
          <tbody>
            {Object.keys(summary).map((grain) => (
              <tr key={grain}>
                <td>{grain}</td>
                <td>{summary[grain].toFixed(1)} t</td>
              </tr>
            ))}

            <tr className="total-row">
              <td>RAZEM</td>
              <td>{totalTons.toFixed(1)} t</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
