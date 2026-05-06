import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import PzzLogo from "../components/Common/PzzLogo";
import "./Reports.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const formatDate = (ts) => {
  if (!ts) return "---";
  if (ts.toDate) return ts.toDate().toLocaleString();
  if (typeof ts === "string") return new Date(ts).toLocaleString();
  if (typeof ts === "number") return new Date(ts).toLocaleString();
  return "---";
};

export default function MovementsReport() {
  const [rows, setRows] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    const q1 = query(collection(db, "deliveries"), orderBy("timestamp", "desc"));
    const q2 = query(collection(db, "releases"), orderBy("timestamp", "desc"));

    const unsub1 = onSnapshot(q1, (snap) => {
      const arr = snap.docs.map((d) => ({
        type: "przyjęcie",
        timestamp: d.data().timestamp,
        grain: d.data().grain,
        weight: d.data().weight,
        cell: d.data().cell,
        operator: d.data().operator,
      }));
      setRows((prev) => [...prev, ...arr]);
    });

    const unsub2 = onSnapshot(q2, (snap) => {
      const arr = snap.docs.map((d) => ({
        type: "wydanie",
        timestamp: d.data().timestamp,
        grain: d.data().grain,
        weight: d.data().weight,
        cell: d.data().sourceCell,
        operator: d.data().operator,
      }));
      setRows((prev) => [...prev, ...arr]);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const generatePDF = async () => {
    const pdf = new jsPDF("landscape", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, height);
    pdf.save("RAPORT_RUCHÓW.pdf");
  };

  return (
    <div className="report-box full-width">
      <div className="report-header">
        <PzzLogo width={150} />
        <div className="report-title">
          <h2>Raport Ruchów Magazynowych</h2>
          <p>PZZ Białystok</p>
        </div>
        <button className="action-btn" onClick={generatePDF}>PDF</button>
      </div>

      <div ref={tableRef} className="pdf-table-wrapper">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Typ</th>
              <th>Zboże</th>
              <th>Ilość (t)</th>
              <th>Komora</th>
              <th>Operator</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
              .map((r, i) => (
                <tr key={i}>
                  <td>{formatDate(r.timestamp)}</td>
                  <td>{r.type}</td>
                  <td>{r.grain}</td>
                  <td>{r.weight}</td>
                  <td>{r.cell}</td>
                  <td>{r.operator}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
