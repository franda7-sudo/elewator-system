import { useElevator } from "../../context/ElevatorContext";

export default function GlobalAlarms() {
  const { getAlarms } = useElevator();
  const alarms = getAlarms();

  return (
    <div className="global-alarms-box">
      <h3>Alarmy jakości</h3>

      {alarms.length === 0 && <p>Brak alarmów.</p>}

      {alarms.map((a) => (
        <div key={a.cellId + a.metric} className={`alarm alarm-${a.type}`}>
          <strong>{a.cellId}</strong>: {a.message}
        </div>
      ))}
    </div>
  );
}
