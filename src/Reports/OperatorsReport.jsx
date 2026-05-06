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

export default function OperatorsReport() {
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

  // 🔥 Pobieranie wszystkich operacji z movements
  useEffect(() => {
    const q = query(
      collection(db, "movements"),
      orderBy("date", "desc"),
      limit(500)
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

  // 🔥 Grupowanie wg operatora
  const operators = (() => {
    const map = {};

    rows.forEach((r) => {
      const op = r.operator || "Nieznany";
      if (!map[op]) {
        map[op] = {
          count: 0,
          totalWeight: 0,
          lastActivity: null,
        };
      }

      map[op].count++;
      map[op].totalWeight += parseFloat(r.weight) || 0;

      if (r.date?.toDate) {
        const d = r.date.toDate();
        if (!map[op].lastActivity || d > map[op].lastActivity) {
          map[op].lastActivity = d;
        }
      }
    });

    return map;
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

    pdf.save(`RAPORT_OPERATORÓW_${reportNumber}.pdf`);
  };

  return (
    <div className="report-box full-width">

      {/* 🔥 Nagłówek A1 */}
      <div className="report-header">
        <div className="report-logo">
          <PzzLogo width={150} />
        </div>

        <div className="report-title">
          <h2>Raport Operatorów</h2>
          <p>PZZ Białystok | {new Date().toLocaleDateString()}</p>
          <p>Raport nr: {reportNumber}</p>
        </div>

        <button className="action-btn" onClick={generatePDF}>
          Pobierz PDF
        </button>
      </div>

      {/* STRONA 1 — tabela */}
      <div ref={tableRef} className="pdf-table-wrapper">
        <h2>Aktywność operatorów</h2>

        <table className="summary-table">
          <thead>
            <tr>
              <th>Operator</th>
              <th>Liczba operacji</th>
              <th>Łączny tonaż</th>
              <th>Średni tonaż</th>
              <th>Ostatnia aktywność</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="5">Ładowanie...</td></tr>
            ) : Object.keys(operators).length === 0 ? (
              <tr><td colSpan="5">Brak danych</td></tr>
            ) : (
              Object.keys(operators).map((op) => {
                const o = operators[op];
                return (
                  <tr key={op}>
                    <td>{op}</td>
                    <td>{o.count}</td>
                    <td>{o.totalWeight.toFixed(2)} t</td>
                    <td>{(o.totalWeight / o.count).toFixed(2)} t</td>
                    <td>
                      {o.lastActivity
                        ? o.lastActivity.toLocaleString()
                        : "---"}
                    </td>
                  </tr>
                );
              })
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
              <td>Liczba operatorów</td>
              <td>{Object.keys(operators).length}</td>
            </tr>

            <tr className="total-row">
              <td>Łączna liczba operacji</td>
              <td>{rows.length}</td>
            </tr>

            <tr className="total-row">
              <td>Łączny tonaż</td>
              <td>
                {rows
                  .reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0)
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
