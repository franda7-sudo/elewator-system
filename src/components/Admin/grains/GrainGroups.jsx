import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import GroupEditor from "./GroupEditor";
import GroupCells from "./GroupCells";
import "./Grains.css";

export default function GrainGroups({ grainId }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `grains/${grainId}/groups`),
      (snap) => {
        setGroups(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );
    return () => unsub();
  }, [grainId]);

  return (
    <div className="grains-container">
      <button onClick={() => setSelectedGroup({ id: null })}>
        ➕ Dodaj grupę
      </button>

      <div className="grain-group-list">
        {groups.map((g) => (
          <div key={g.id}>
            <button onClick={() => setSelectedGroup(g)}>
              {g.label} — priorytet {g.priority}
            </button>
          </div>
        ))}
      </div>

      {selectedGroup && (
        <>
          <GroupEditor grainId={grainId} group={selectedGroup} />
          <GroupCells grainId={grainId} group={selectedGroup} />
        </>
      )}
    </div>
  );
}
