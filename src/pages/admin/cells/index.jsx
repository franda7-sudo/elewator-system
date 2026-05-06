import React from "react";
import CellsTable from "../../../components/Admin/cells/CellsTable";
import "./Cells.css";

export default function CellsPage() {
  return (
    <div className="cells-container">
      <h1>Komory</h1>
      <CellsTable />
    </div>
  );
}
