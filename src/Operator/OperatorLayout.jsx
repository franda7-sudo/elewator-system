import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./OperatorLayout.css"; 

export default function OperatorLayout() {
  return (
    <div className="operator-layout">
      
      <div className="operator-content">
        <Outlet />
      </div>

      <nav className="operator-nav">
        <NavLink to="intake" className="nav-btn">➕ Przyjęcia</NavLink>
        <NavLink to="unload" className="nav-btn">📥 Rozładunek</NavLink>
        <NavLink to="issue" className="nav-btn">📤 Wydania</NavLink>
        <NavLink to="correction" className="nav-btn">⚖ Korekty</NavLink>
        <NavLink to="transfer" className="nav-btn">🔄 Przerzuty</NavLink>
      </nav>

    </div>
  );
}
