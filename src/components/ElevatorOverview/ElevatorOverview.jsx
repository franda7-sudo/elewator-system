import React, { useEffect, useState } from "react";
import "./ElevatorOverview.css";
import { useElevator } from "../../context/ElevatorContext";

export default function ElevatorOverview() {
  const [theme, setTheme] = useState("dark");

  // 🔥 POBIERAMY PRAWDZIWE DANE Z PROVIDERA
  const { cells, alarms, dallas } = useElevator();

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(theme === "dark" ? "dark-mode" : "light-mode");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // 🔥 FUNKCJE POMOCNICZE
  const getCell = (label) => cells.find((c) => c.label === label);

  const getCellColor = (cell) => {
    if (!cell) return "transparent";
    if (cell.status === "fault") return "#ff0000";

    switch (cell.grain) {
      case "pszenica": return "var(--grain-wheat)";
      case "żyto": return "var(--grain-rye)";
      case "owies": return "var(--grain-oats)";
      case "jęczmień": return "var(--grain-barley)";
      case "pellet": return "var(--grain-pellet)";
      default: return "transparent";
    }
  };

  const renderParams = (cell) => {
    if (!cell?.params) return "";
    const p = cell.params;

    return [
      p.bialko ? `Białko: ${p.bialko}%` : null,
      p.wilg ? `Wilg.: ${p.wilg}%` : null,
      p.opad ? `Opad: ${p.opad}` : null,
      p.gest ? `Gęst.: ${p.gest}` : null,
    ]
      .filter(Boolean)
      .join("  ");
  };

  const getDallasTemp = (cellId) => {
    const sensor = dallas?.find((d) => d.cellId === cellId);
    return sensor ? `${sensor.temp}°C` : "—";
  };

  const getAlarmClass = (cell) => {
    if (!cell) return "";
    if (cell.status === "fault") return "alarm-red";
    if (cell.fill > 95) return "alarm-yellow";

    const hasDallasAlarm = alarms?.some(
      (a) => a.type === "temp" && a.cellId === cell.id
    );

    return hasDallasAlarm ? "alarm-blue" : "";
  };

  // 🔥 RENDER POJEDYNCZEJ KOMÓRKI
  const renderCell = (label) => {
    const cell = getCell(label);
    if (!cell) return <div key={label} className="cell empty">{label}</div>;

    return (
      <div
        key={cell.id}
        className={`cell ${getAlarmClass(cell)}`}
        style={{ backgroundColor: getCellColor(cell) }}
      >
        <div className="fill-level" style={{ height: `${cell.fill || 0}%` }} />

        <div className="cell-line symbol">{cell.label}</div>
        <div className="cell-line params">{renderParams(cell)}</div>
        <div className="cell-line date">
          {cell.firstFill
            ? new Date(cell.firstFill).toLocaleDateString("pl-PL")
            : "—"}
        </div>
        <div className="cell-line temp">Temp: {getDallasTemp(cell.id)}</div>

        <div className="tooltip">
          <strong>Komora:</strong> {cell.label}<br />
          <strong>Zboże:</strong> {cell.grain || "—"}<br />
          <strong>Status:</strong> {cell.status || "—"}<br />
          <strong>Parametry:</strong> {renderParams(cell) || "—"}<br />
          <strong>Pierwszy zasyp:</strong>{" "}
          {cell.firstFill
            ? new Date(cell.firstFill).toLocaleDateString("pl-PL")
            : "—"}
          <br />
          <strong>Napełnienie:</strong> {cell.fill || 0}%<br />
          <strong>Temperatura:</strong> {getDallasTemp(cell.id)}<br />
          <strong>Pojemność:</strong> {cell.capacity || "—"} t<br />
          <strong>Wys. zasypu:</strong> {cell.height || "—"} m
        </div>
      </div>
    );
  };

  // 🔥 UKŁAD FIZYCZNY ELEWATORA
  const S_rows = [
    ["1S","2S","3S","4S","5S","6S","7S","8S","9S","10S"],
    ["11S","12S","13S","14S","15S","16S","17S","18S","19S","20S"],
    ["21S","22S","23S","24S","25S","26S","27S","28S","29S","30S"],
    ["31S","32S","33S","34S","35S","36S","37S","38S","39S","40S"],
  ];

  const N_rows = [
    ["2N","4N","6N","8N","10N","12N","14N","16N","18N","20N"],
    ["1N","3N","5N","7N","9N","11N","13N","15N","17N","19N"],
  ];

  const G_row = ["21G","22G","23G","24G","25G"];

  const W_row = ["43","44","45","46","47","48","49","50","51","52"];

  return (
    <div className="elevator-root">
      <button className="theme-toggle" onClick={toggleTheme}>
        Tryb {theme === "dark" ? "dzienny" : "nocny"}
      </button>

      <div className="elevator-layout">

        {/* MODUŁ S */}
        <div className="module-block">
          <h3>Stary Elewator (S)</h3>
          {S_rows.map((row, i) => (
            <div key={i} className="row">
              {row.map((label) => renderCell(label))}
            </div>
          ))}
        </div>

        {/* MODUŁ N */}
        <div className="module-block">
          <h3>Nowy Elewator (N)</h3>
          {N_rows.map((row, i) => (
            <div key={i} className="row">
              {row.map((label) => renderCell(label))}
            </div>
          ))}
        </div>

        {/* MODUŁ G */}
        <div className="module-block">
          <h3>Komory G</h3>
          <div className="row">
            {G_row.map((label) => renderCell(label))}
          </div>
        </div>

        {/* KOMORY WYDAWCZE */}
        <div className="module-block">
          <h3>Komory Wydawcze</h3>
          <div className="row">
            {W_row.map((label) => renderCell(label))}
          </div>
        </div>

      </div>
    </div>
  );
}
