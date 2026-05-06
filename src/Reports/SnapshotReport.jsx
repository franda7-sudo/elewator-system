// /src/reports/SnapshotReport.jsx

import { useEffect, useState } from "react";
import localDB from "../db/pouchdb";
import { parseQuality } from "./reportUtils";
import { getGrainColor } from "./reportColors";
import "./Reports.css";

export default function SnapshotReport() {
  const [cells, setCells] = useState([]);

  useEffect(() => {
    const load = async () => {
      const result = await localDB.allDocs({
        include_docs: true,
        startkey: "silo_",
        endkey: "silo_\uffff"
      });

      const arr = result.rows.map(r => {
        const silo = r.doc;
        const layers = silo.layers || [];
        const weight = layers.reduce((s, l) => s + l.amount, 0);
        const quality = layers.length ? parseQuality(silo.grainType, layers[layers.length - 1].qualityParam) : {};

        return {
          komora: silo._id.replace("silo_", ""),
          grain: silo.grainType || "PUSTE",
          weight,
          quality,
          color: getGrainColor(silo.grainType, quality)
        };
      });

      setCells(arr);
    };

    load();
  }, []);

  return (
    <div className="report-box full-width">
      <div className="report-header">
        <h3>Snapshot Elewatora</h3>
      </div>

      <div className="snapshot-grid">
        {cells.map(c => (
          <div
            key={c.komora}
            className="snapshot-card"
            style={{ background: c.color }}
          >
            <div className="snap-title">{c.komora}</div>
            <div className="snap-weight">{c.weight} t</div>
            <div className="snap-grain">{c.grain}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
