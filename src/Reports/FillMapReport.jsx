import React, { useMemo, useRef } from "react";
import { useElevator } from "../context/ElevatorContext";
import Map from "../components/Admin/Map/Map";
import PzzLogo from "../components/Common/PzzLogo";
import "../components/Admin/Map/Map.css";
import "./Reports.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PdfFillMapReport() {
  const { cells } = useElevator();
  const mapRef = useRef(null);
  const tableRef = useRef(null);

  // Podsumowanie tonażu
  const summary = useMemo(() => {
    const sum = {};
    cells.forEach((c) => {
      if (!c?.grainType) return;
      const tons = typeof c.amount === "number" ? c.amount : 0;
      if (!sum[c.grainType]) sum[c.grainType] = 0;
      sum[c.grainType] += tons;
    });
    return sum;
  }, [cells]);

  const grainOrder = ["pszenica", "żyto", "jęczmień", "owies", "kukurydza", "pszenżyto"];
  const totalTons = Object.values(summary).reduce((a, b) => a + b, 0);

  // PDF: mapa + tabela
  const generatePDF = async () => {
    const pdf = new jsPDF("landscape", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    // STRONA 1 — MAPA
    const mapCanvas = await html2canvas(mapRef.current, { scale: 2 });
    pdf.addImage(mapCanvas.toDataURL("image/png"), "PNG", 0, 0, width, height);

    // STRONA 2 — TABELA
    pdf.addPage();
    const tableCanvas = await html2canvas(tableRef.current, { scale: 2 });
    pdf.addImage(tableCanvas.toDataURL("image/png"), "PNG", 0, 0, width, height);

    pdf.save(`MAPA_ZASYPÓW_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="report-box full-width">

      {/* Nagłówek */}
      <div className="report-header">
        <div className="report-logo">
          <PzzLogo width={150} />
        </div>

        <div className="report-title">
          <h2>Mapa Zasypów</h2>
          <p>PZZ Białystok | {new Date().toLocaleDateString()}</p>
        </div>

        <button className="action-btn" onClick={generatePDF}>
          Pobierz PDF
        </button>
      </div>

      {/* STRONA 1 — MAPA */}
      <div ref={mapRef} className="pdf-map-wrapper pastel-map">
        <Map fontSize={18} pastel />
      </div>

      {/* STRONA 2 — PODSUMOWANIE */}
      <div ref={tableRef} className="pdf-table-wrapper">
        <h2>Podsumowanie Tonażu</h2>

        <table className="summary-table">
          <tbody>
            {grainOrder
              .filter((g) => summary[g])
              .map((grain) => (
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
