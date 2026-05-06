import React, { useState } from "react";
import "./TooltipCell.css";

export default function TooltipCell({ cell, role, onSave }) {
  const [form, setForm] = useState({
    grain: cell.grain || "",
    waga: cell.waga || "",
    bialko: cell.bialko || "",
    wilgotnosc: cell.wilgotnosc || "",
    gluten: cell.gluten || "",
    opadanie: cell.opadanie || "",
    gestosc: cell.gestosc || "",
    keyParam: cell.keyParam || "",
    firstFill: cell.firstFill || "",
  });

  // admin = edycja
  // superuser / operator = tylko podgląd
  const readOnly = role !== "admin";

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      ...cell,
      ...form,
    });
  };

  return (
    <div className="tooltipcell">
      <h4>Komora {cell.id}</h4>

      <div className="tooltip-row">
        <label>Zboże:</label>
        <input
          disabled={readOnly}
          value={form.grain}
          onChange={(e) => handleChange("grain", e.target.value)}
        />
      </div>

      <div className="tooltip-row">
        <label>Waga (t):</label>
        <input
          disabled={readOnly}
          type="number"
          value={form.waga}
          onChange={(e) => handleChange("waga", e.target.value)}
        />
      </div>

      <div className="tooltip-row">
        <label>Białko:</label>
        <input
          disabled={readOnly}
          type="number"
          value={form.bialko}
          onChange={(e) => handleChange("bialko", e.target.value)}
        />
      </div>

      <div className="tooltip-row">
        <label>Wilgotność:</label>
        <input
          disabled={readOnly}
          type="number"
          value={form.wilgotnosc}
          onChange={(e) => handleChange("wilgotnosc", e.target.value)}
        />
      </div>

      <div className="tooltip-row">
        <label>Gluten:</label>
        <input
          disabled={readOnly}
          type="number"
          value={form.gluten}
          onChange={(e) => handleChange("gluten", e.target.value)}
        />
      </div>

      <div className="tooltip-row">
        <label>Opadanie:</label>
        <input
          disabled={readOnly}
          type="number"
          value={form.opadanie}
          onChange={(e) => handleChange("opadanie", e.target.value)}
        />
      </div>

      <div className="tooltip-row">
        <label>Gęstość:</label>
        <input
          disabled={readOnly}
          type="number"
          value={form.gestosc}
          onChange={(e) => handleChange("gestosc", e.target.value)}
        />
      </div>

      <div className="tooltip-row">
        <label>Parametr główny:</label>
        <input
          disabled={readOnly}
          value={form.keyParam}
          onChange={(e) => handleChange("keyParam", e.target.value)}
        />
      </div>

      <div className="tooltip-row">
        <label>Data pierwszego zasypu:</label>
        <input
          disabled={readOnly}
          value={form.firstFill}
          onChange={(e) => handleChange("firstFill", e.target.value)}
        />
      </div>

      {role === "admin" && (
        <button className="tooltip-save-btn" onClick={handleSave}>
          Zapisz
        </button>
      )}
    </div>
  );
}
