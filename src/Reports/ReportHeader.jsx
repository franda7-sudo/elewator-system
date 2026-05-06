import { Link } from "react-router-dom";
import "./ReportHeader.css";

export default function ReportHeader({ title }) {
  return (
    <div className="report-header">
      <div className="breadcrumbs">
        <Link to="/admin/reports">Raporty</Link> <span>/</span> {title}
      </div>

      <button className="back-button" onClick={() => window.history.back()}>
        ← Powrót do raportów
      </button>
    </div>
  );
}
