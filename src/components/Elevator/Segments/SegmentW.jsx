import React from "react";
import Cell from "../Cell/Cell";

export default function SegmentW({ cells, alarms, dallas }) {
  const getCellByLabel = (label) => cells.find((c) => c.label === label);

  const row = ["43","44","45","46","47","48","49","50","51","52"];

  return (
    <div className="module-block">
      <h3>Komory wydawcze</h3>
      <div className="row">
        {row.map((label) => (
          <Cell
            key={label}
            cell={getCellByLabel(label)}
            alarms={alarms}
            dallas={dallas}
          />
        ))}
      </div>
    </div>
  );
}
