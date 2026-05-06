import React from "react";
import Cell from "../Cell/Cell";

export default function SegmentG({ cells, alarms, dallas }) {
  const getCellByLabel = (label) => cells.find((c) => c.label === label);

  const row = ["21G","22G","23G","24G","25G"];

  return (
    <div className="module-block">
      <h3>Komory G</h3>
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
