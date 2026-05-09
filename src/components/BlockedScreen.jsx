import React from "react";
import "./BlockedScreen.css";

export default function BlockedScreen({ message }) {
  return (
    <div className="blocked-container">
      <div className="blocked-box">
        <h1 className="blocked-title">🔒 System zablokowany</h1>
        <p className="blocked-message">{message || "System jest obecnie niedostępny."}</p>
      </div>
    </div>
  );
}
