import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export async function loadGroupsForMap(grainId) {
  const groupsSnap = await getDocs(collection(db, "grains", grainId, "groups"));
  const result = {};

  for (const g of groupsSnap.docs) {
    const groupId = g.id;
    const groupData = g.data();

    const cellsSnap = await getDoc(
      doc(db, "grains", grainId, "groups", groupId, "cells")
    );

    if (cellsSnap.exists()) {
      const cells = cellsSnap.data().cells;
      for (const c of cells) {
        result[c] = {
          group: groupData.label,
          priority: groupData.priority,
          color: groupData.color || "#cccccc"
        };
      }
    }
  }

  return result;
}
