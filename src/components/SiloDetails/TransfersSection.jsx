// /src/components/SiloDetails/TransfersSection.jsx
import "./TransfersSection.css";

export default function TransfersSection({ data }) {
  const przerzuty = data.przerzuty || {};

  return (
    <div className="section-box">
      <h3>Przerzuty</h3>

      <div className="section-row">
        <div>Ostatni przerzut:</div>
        <div>{przerzuty.ostatni || "brak danych"}</div>
      </div>

      <div className="section-row">
        <div>Dni od przerzutu:</div>
        <div>{przerzuty.dni || "-"}</div>
      </div>

      <div className={`status ${przerzuty.status}`}>
        Status: {przerzuty.status}
      </div>

      <button className="action-btn">Wykonaj przerzut</button>
    </div>
  );
}
