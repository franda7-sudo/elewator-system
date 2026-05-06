import React from "react";
import "./ReportLayout.css";

export default function ReportLayout({ children }) {
  return (
    <div className="report-layout">
      <div className="report-box">
        {children}
      </div>
    </div>
  );
}
