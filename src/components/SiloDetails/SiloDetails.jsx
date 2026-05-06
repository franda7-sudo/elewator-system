// /src/components/SiloDetails/SiloDetails.jsx
import { useEffect, useState } from "react";
import { subscribeSiloState } from "../../firebase/db";
import MassSection from "./MassSection";
import TemperatureSection from "./TemperatureSection";
import TransfersSection from "./TransfersSection";
import AlarmsSection from "./AlarmsSection";
import "./SiloDetails.css";

export default function SiloDetails({ komora }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const unsub = subscribeSiloState(komora, (d) => setData(d));
    return () => unsub && unsub();
  }, [komora]);

  if (!data) return <div>Ładowanie...</div>;

  return (
    <div className="silo-details-container">
      <h2>Komora {komora}</h2>

      <AlarmsSection data={data} />

      <MassSection data={data} komora={komora} />
      <TemperatureSection data={data} komora={komora} />
      <TransfersSection data={data} komora={komora} />
    </div>
  );
}
