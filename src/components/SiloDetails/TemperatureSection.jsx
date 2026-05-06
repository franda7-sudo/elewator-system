// /src/components/SiloDetails/TemperatureSection.jsx
import "./TemperatureSection.css";

export default function TemperatureSection({ data }) {
  const temp = data.temperatura || {};

  return (
    <div className="section-box">
      <h3>Temperatura</h3>

      <div className="section-row">
        <div>Średnia:</div>
        <div>{temp.avg}°C</div>
      </div>

      <div className="section-row">
        <div>Min / Max:</div>
        <div>{temp.min}°C / {temp.max}°C</div>
      </div>

      <div className="section-row">
        <div>ΔT:</div>
        <div>{temp.deltaT}</div>
      </div>

      <div className={`status ${temp.status}`}>
        Status: {temp.status}
      </div>

      <button className="action-btn">Dodaj pomiar temperatury</button>
    </div>
  );
}
