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

export default function GrainReport() {
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

  const grains = {};

  deliveries.forEach((d) => {
    if (!grains[d.grain]) grains[d.grain] = { in: 0, out: 0 };
    grains[d.grain].in += Number(d.weight || 0);
  });

  releases.forEach((r) => {
    if (!grains[r.grain]) grains[r.grain] = { in: 0, out: 0 };
    grains[r.grain].out += Number(r.weight || 0);
  });

  const generatePDF = async () => {
    const pdf = new jsPDF("landscape", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, height);
    pdf.save("RAPORT_ZBOŻA.pdf");
  };

  return (
    <div className="report-box full-width">
      <div className="report-header">
        <PzzLogo width={150} />
        <div className="report-title">
          <h2>Raport Zboża</h2>
          <p>PZZ Białystok</p>
        </div>
        <button className="action-btn" onClick={generatePDF}>PDF</button>
      </div>

      <div ref={tableRef} className="pdf-table-wrapper">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Zboże</th>
              <th>Przyjęcia (t)</th>
              <th>Wydania (t)</th>
              <th>Bilans (t)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grains).map(([grain, v]) => (
              <tr key={grain}>
                <td>{grain}</td>
                <td>{v.in.toFixed(2)}</td>
                <td>{v.out.toFixed(2)}</td>
                <td>{(v.in - v.out).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
