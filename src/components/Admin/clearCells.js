import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

async function clearCells() {
  const snap = await getDocs(collection(db, "cells"));
  for (const d of snap.docs) {
    await updateDoc(doc(db, "cells", d.id), {
      grain: null,
      groupId: null,
      param: null,
      paramFrom: null,
      paramTo: null,
      protein: null,
      humidity: null,
    });
  }
}

clearCells();
