import { useElevator } from "../../context/ElevatorContext";
import { useNavigate } from "react-router-dom";
import CellBox from "./CellBox";
import "./ElevatorMap.css";

export default function ElevatorMap() {
  const { cells, getAlarms } = useElevator();
  const navigate = useNavigate();
  const alarms = getAlarms();

  const openCell = (id) => navigate(`/admin/korekta/${id}`);

  const Row = ({ ids }) => (
    <div className="row">
      {ids.map((id) => (
        <CellBox
          key={id}
          id={id}
          data={cells[id]}
          onClick={() => openCell(id)}
        />
      ))}
    </div>
  );

  return (
    <div className="map-wrapper">
      <h2>Mapa elewatora</h2>

      {/* Sekcja S: 1S–40S, 4 rzędy po 10 */}
      <div className="section">
        <h3>Sekcja S (1S–40S)</h3>
        <Row ids={["1S","2S","3S","4S","5S","6S","7S","8S","9S","10S"]} />
        <Row ids={["11S","12S","13S","14S","15S","16S","17S","18S","19S","20S"]} />
        <Row ids={["21S","22S","23S","24S","25S","26S","27S","28S","29S","30S"]} />
        <Row ids={["31S","32S","33S","34S","35S","36S","37S","38S","39S","40S"]} />
      </div>

      {/* Sekcja N */}
      <div className="section">
        <h3>Sekcja N (1N–20N)</h3>
        <Row ids={["2N","4N","6N","8N","10N","12N","14N","16N","18N","20N"]} />
        <Row ids={["1N","3N","5N","7N","9N","11N","13N","15N","17N","19N"]} />
      </div>

      {/* Sekcja G */}
      <div className="section">
        <h3>Sekcja G (21G–25G)</h3>
        <Row ids={["21G","22G","23G","24G","25G"]} />
      </div>

      {/* Sekcja 43–52 */}
      <div className="section">
        <h3>Komory 43–52</h3>
        <Row ids={["43","44","45","46","47","48","49","50","51","52"]} />
      </div>

      {/* Alarmy */}
      <div className="section">
        <h3>Alarmy jakości</h3>
        {alarms.length === 0 && <p>Brak alarmów.</p>}
        {alarms.map((a, idx) => (
          <div key={idx} className={`alarm alarm-${a.type}`}>
            <strong>{a.cellId}</strong>: {a.message}
          </div>
        ))}
      </div>
    </div>
  );
}
