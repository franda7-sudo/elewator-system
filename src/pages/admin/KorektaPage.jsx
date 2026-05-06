// /src/pages/admin/KorektaPage.jsx
import { useParams } from "react-router-dom";
import SiloCorrection from "../../corrections/SiloCorrection.jsx";
import { useElevator } from "../../context/ElevatorContext";

export default function KorektaPage() {
  const { id } = useParams();
  const { history } = useElevator();

  const filteredHistory = history.filter((h) => h.cellId === id);

  return (
    <div className="korekta-page">
      <h2>Korekta komory {id}</h2>

      <SiloCorrection siloId={id} />

      <h3>Historia korekt</h3>
      <div className="history-box">
        {filteredHistory.length === 0 && <p>Brak korekt.</p>}

        {filteredHistory.map((entry) => (
          <div key={entry.id} className="history-entry">
            <strong>{entry.timestamp}</strong>
            <div>Typ: {entry.type}</div>
            <div>Ilość: {entry.values.amount ?? "—"} t</div>
            <div>Wilgotność: {entry.values.humidity ?? "—"} %</div>
            <div>Białko: {entry.values.protein ?? "—"} %</div>
            <div>Opadanie: {entry.values.fallingNumber ?? "—"} s</div>
            <div>Gęstość: {entry.values.density ?? "—"} kg/hl</div>
          </div>
        ))}
      </div>
    </div>
  );
}
