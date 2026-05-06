import React, { useEffect, useState } from "react";
import "./ElevatorOverview.css";
import "./Segments/Segments.css";
import { useElevator } from "../../context/ElevatorContext";
import SegmentS from "./Segments/SegmentS";
import SegmentN from "./Segments/SegmentN";
import SegmentG from "./Segments/SegmentG";
import SegmentW from "./Segments/SegmentW";

export default function ElevatorOverview() {
  const [theme, setTheme] = useState("dark");
  const { cells, alarms, dallas } = useElevator(); // 🔥 tylko JEDEN kontekst, żadnych dodatkowych odczytów Firestore

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(theme === "dark" ? "dark-mode" : "light-mode");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="elevator-root">
      <button className="theme-toggle" onClick={toggleTheme}>
        Tryb {theme === "dark" ? "dzienny" : "nocny"}
      </button>

      <div className="elevator-layout">
        <SegmentS cells={cells} alarms={alarms} dallas={dallas} />
        <SegmentN cells={cells} alarms={alarms} dallas={dallas} />
        <SegmentG cells={cells} alarms={alarms} dallas={dallas} />
        <SegmentW cells={cells} alarms={alarms} dallas={dallas} />
      </div>
    </div>
  );
}
