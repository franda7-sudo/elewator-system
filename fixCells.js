import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

// POPRAWKA: Usunięto podwójny przecinek i sprawdzono dane
const firebaseConfig = {
  apiKey: "AIzaSyCkacduK3AmxKCI0t1-bfMqFkLx-4_sz3Y", 
  authDomain: "elewator-testy.firebaseapp.com", 
  projectId: "elewator-testy" // Upewnij się, że to jest poprawne ID (bez spacji)
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixCells() {
  try {
    console.log("Pobieranie dokumentów...");
    const snap = await getDocs(collection(db, "cells"));
    console.log(`Znaleziono ${snap.docs.length} dokumentów.`);

    for (const d of snap.docs) {
      const c = d.data();
      const patch = {};

      if (c.ziarno && !c.grain) patch.grain = c.ziarno;
      if (c.parametr && !c.param) patch.param = c.parametr;
      if (c.parametrDo && !c.paramTo) patch.paramTo = c.parametrDo;
      if (c["grupa jakości"] && !c.groupId) patch.groupId = c["grupa jakości"];
      if (c.parametrFrom && !c.paramFrom) patch.paramFrom = c.parametrFrom;

      if (c.kolor) {
        patch.color = (c.kolor === "#cccccc") ? null : c.kolor;
      }

      if (Object.keys(patch).length > 0) {
        await updateDoc(doc(db, "cells", d.id), patch);
        console.log(`✅ Naprawiono dokument ${d.id}:`, patch);
      }
    }
    console.log("Operacja zakończona sukcesem!");
  } catch (error) {
    console.error("Błąd podczas aktualizacji:", error);
  }
}

fixCells();