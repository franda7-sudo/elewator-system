import React from "react";
import OperatorsPanel from "../../../components/Admin/operators/OperatorsPanel";
import "./Operators.css";

export default function OperatorsPage() {
  return (
    <div className="operators-container">
      <h1>Operatorzy</h1>
      <OperatorsPanel />
    </div>
  );
}
