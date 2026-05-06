import { collectionGroup, getDocs, writeBatch, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function syncAllGrainGroups() {
  console.log("SYNC START");

  const snap = await getDocs(collectionGroup(db, "groups"));
  const batch = writeBatch(db);

  for (const groupDoc of snap.docs) {
    // Pobieramy świeże dane grupy
    const fresh = await getDoc(groupDoc.ref);
    const data = fresh.data();
    if (!data) continue;

    // Pobieramy wszystkie parametry, które chcemy synchronizować
    const payload = {
      grain: data.grain || null,
      protein: data.protein || null,
      wilgotnosc: data.wilgotnosc || data.humidity || null, // wsparcie obu nazw
      param: data.param || null,
      paramFrom: data.paramFrom || null,
      paramTo: data.paramTo || null,
      groupId: groupDoc.id,
      updatedAt: Date.now()
    };

    const assignedCells = Array.isArray(data.assignedCells)
      ? data.assignedCells
      : [];

    for (const cellId of assignedCells) {
      const cellRef = doc(db, "cells", cellId);

      // Teraz batch.update zapisze pełny obiekt payload do komory
      batch.set(cellRef, payload, { merge: true }); 
    }
  }

  await batch.commit();
  console.log("SYNC DONE");
}