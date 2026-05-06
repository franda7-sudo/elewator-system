import React from "react";
import Cell from "../Cell/Cell";

export default function SegmentN({ cells, alarms, dallas }) {
  const getCellByLabel = (label) => cells.find((c) => c.label === label);

  const rows = [
    ["2N","4N","6N","8N","10N","12N","14N","16N","18N","20N"],
    ["1N","3N","5N","7N","9N","11N","13N","15N","17N","19N"],
  ];

  return (
    <div className="module-block">
      <h3>Nowy Elewator (N)</h3>
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
