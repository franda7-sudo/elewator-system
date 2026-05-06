import React from "react";
import { initialGrains } from "./grainData";

export default function GrainList() {
  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2 style={{ marginBottom: "20px" }}>Lista Bazowych Zbóż</h2>
      <div style={{ display: "grid", gap: "10px" }}>
        {initialGrains.map((grain) => (
          <div 
            key={grain.id} 
            style={{ 
              padding: "15px", 
              background: "#333", 
              borderRadius: "8px",
              border: "1px solid #444" 
            }}
          >
            <strong>{grain.name}</strong> <span style={{ color: "#888", marginLeft: "10px" }}>(ID: {grain.id})</span>
          </div>
        ))}
      </div>
    </div>
  );
}