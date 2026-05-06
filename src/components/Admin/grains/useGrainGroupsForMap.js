// src/components/Admin/grains/useGroupsForMap.js
import { db } from "../../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

/**
 * Ładuje grupy komórek dla mapy SCADA na podstawie identyfikatora ziarna.
 * Zwraca obiekt, w którym kluczem jest ID komórki, a wartością dane grupy.
 */
export async function loadGroupsForMap(grainId) {
  const result = {};

  try {
    // Pobierz wszystkie grupy dla danego ziarna
    const groupsSnap = await getDocs(collection(db, "grains", grainId, "groups"));

    for (const g of groupsSnap.docs) {
      const groupId = g.id;
      const groupData = g.data();

      // Pobierz dokument z komórkami przypisanymi do grupy
      const cellsSnap = await getDoc(doc(db, "grains", grainId, "groups", groupId, "cells"));

      if (cellsSnap.exists()) {
        const cells = cellsSnap.data().cells || [];

        for (const c of cells) {
          result[c] = {
            group: groupData.label || "Nieznana grupa",
            priority: groupData.priority || 0,
            color: groupData.color || "#cccccc"
          };
        }
      }
    }
  } catch (error) {
    console.error("❌ Błąd podczas ładowania grup dla mapy:", error);
  }

  return result;
}
