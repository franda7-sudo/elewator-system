// src/admin/utils/syncQuality.js

import { db } from "../../firebase";
import {
  collection,
  collectionGroup,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export async function syncQuality() {
  console.log("SYNC START");

  // 1. Pobierz wszystkie grupy jakości
  const groupsSnap = await getDocs(collectionGroup(db, "groups"));
  const groups = groupsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    ref: d.ref,
  }));

  // 2. Pobierz wszystkie komory
  const cellsSnap = await getDocs(collection(db, "cells"));
  const cells = cellsSnap.docs.map((d) => ({
    id: d.id,
    ref: d.ref,
    ...d.data(),
  }));

  // 3. Reset parametrów
  for (const c of cells) {
    await updateDoc(c.ref, {
      groupId: null,
      keyParam: null,
      min: null,
      max: null,
    });
  }

  // 4. Przypisz komory do grup
  for (const g of groups) {
    const assigned = g.assignedCells || [];

    for (const cellId of assigned) {
      const cell = cells.find((c) => c.id === cellId);
      if (!cell) continue;

      await updateDoc(cell.ref, {
        groupId: g.id,
        keyParam: g.keyParam,
        min: g.min,
        max: g.max,
      });
    }
  }

  console.log("SYNC DONE");
}
