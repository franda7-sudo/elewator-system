import React from "react";
import Cell from "../Cell/Cell";

export default function SegmentS({ cells, alarms, dallas }) {
  const getCellByLabel = (label) => cells.find((c) => c.label === label);

  const rows = [
    ["1S","2S","3S","4S","5S","6S","7S","8S","9S","10S"],
    ["11S","12S","13S","14S","15S","16S","17S","18S","19S","20S"],
    ["21S","22S","23S","24S","25S","26S","27S","28S","29S","30S"],
    ["31S","32S","33S","34S","35S","36S","37S","38S","39S","40S"],
  ];

  return (
    <div className="module-block">
      <h3>Stary Elewator (S)</h3>
      {rows.map((row, i) => (
        <div key={i} className="row">
          {row.map((label) => (
            <Cell
              key={label}
              cell={getCellByLabel(label)}
              alarms={alarms}
              dallas={dallas}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
