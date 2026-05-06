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

export default function TonnageReport() {
  const [deliveries, setDeliveries] = useState([]);
  const [releases, setReleases] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    const q1 = query(collection(db, "deliveries"), orderBy("timestamp", "desc"));
    const q2 = query(collection(db, "releases"), orderBy("timestamp", "desc"));

    const unsub1 = onSnapshot(q1, (snap) => {
      setDeliveries(snap.docs.map((d) => d.data()));
    });

    const unsub2 = onSnapshot(q2, (snap) => {
      setReleases(snap.docs.map((d) => d.data()));
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const sum = (arr) => arr.reduce((a, b) => a + Number(b.weight || 0), 0);

  const totalIn = sum(deliveries);
  const totalOut = sum(releases);
  const net = totalIn - totalOut;

  const generatePDF = async () => {
    const pdf = new jsPDF("landscape", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, height);
    pdf.save("RAPORT_TONAŻU.pdf");
  };

  return (
    <div className="report-box full-width">
      <div className="report-header">
        <PzzLogo width={150} />
        <div className="report-title">
          <h2>Raport Tonażu</h2>
          <p>PZZ Białystok</p>
        </div>
        <button className="action-btn" onClick={generatePDF}>PDF</button>
      </div>

      <div ref={tableRef} className="pdf-table-wrapper">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Przyjęcia (t)</th>
              <th>Wydania (t)</th>
              <th>Bilans (t)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="total-row">
              <td>{totalIn.toFixed(2)}</td>
              <td>{totalOut.toFixed(2)}</td>
              <td>{net.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
