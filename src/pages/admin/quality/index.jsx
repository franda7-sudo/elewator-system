import React from "react";
import QualityTable from "../../../components/Admin/quality/QualityTable";
import "./Quality.css";

export default function QualityPage() {
  return (
    <div className="quality-container">
      <h1>Parametry jakości</h1>
      <QualityTable />
    </div>
  );
}
