// src/utils/syncGrainsToCells.js

import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export async function syncGrainsToCells() {
  console.log("🔄 Synchronizacja grains → cells…");

  // 1. Pobierz wszystkie zboża
  const grainsSnap = await getDocs(collection(db, "grains"));

  for (const grainDoc of grainsSnap.docs) {
    const grainId = grainDoc.id;

    // 2. Pobierz grupy jakościowe
    const groupsSnap = await getDocs(
      collection(db, `grains/${grainId}/groups`)
    );

    for (const groupDoc of groupsSnap.docs) {
      const groupId = groupDoc.id;
      const groupData = groupDoc.data();

      const assignedCells = groupData.assignedCells || [];
      const params = groupData.params || {};
      const keyParam = groupData.keyParam || null;

      // Wyciągamy parametry jakościowe
      const protein = params.bialko?.min ?? null;
      const humidity = params.wilgotnosc?.min ?? null;
      const density = params.gestosc?.min ?? null;

      const paramFrom = keyParam ? params[keyParam]?.min ?? null : null;
      const paramTo = keyParam ? params[keyParam]?.max ?? null : null;

      // 3. Aktualizujemy każdą komorę przypisaną do grupy
      for (const cellId of assignedCells) {
        const cellRef = doc(db, "cells", cellId);

        await setDoc(
          cellRef,
          {
            grain: grainId,
            groupId: groupId,
            qualityGroup: groupData.name ?? groupId,

            // parametry jakościowe
            protein,
            humidity,
            density,

            param: keyParam,
            paramFrom,
            paramTo,

            // nie nadpisujemy temp i weight — to dane rzeczywiste
          },
          { merge: true }
        );

        console.log(`✔ Zaktualizowano komorę ${cellId}`);
      }
    }
  }

  console.log("✅ Synchronizacja zakończona.");
}
