import { db } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkacduK3AmxKCI0t1-bfMqFkLx-4_sz3Y",
  authDomain: "elewator-testy.firebaseapp.com",
  projectId: "elewator-testy"
  
async function cleanCells() {
  const snap = await getDocs(collection(db, "cells"));

  for (const d of snap.docs) {
    const cell = { id: d.id, ...d.data() };

    const shouldClear =
      !cell.grain ||
      cell.waga === 0 ||
      !cell.qualityGroupId;

    if (shouldClear) {
      console.log("Czyszczę komorę:", cell.id);

      await updateDoc(doc(db, "cells", cell.id), {
        grain: null,
        qualityGroupId: null,
        firstFill: null,

        wilgotnosc: null,
        bialko: null,
        gluten: null,
        opadanie: null,
        gestosc: null,
      });
    }
  }

  console.log("✔ Wszystkie puste komory zostały wyczyszczone.");
}

cleanCells();
