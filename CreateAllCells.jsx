import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "elewator-testy.firebaseapp.com",
  projectId: "elewator-testy"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- LISTA KOMÓR ---
const S = Array.from({ length: 40 }, (_, i) => `${i + 1}S`);
const N = Array.from({ length: 20 }, (_, i) => `${i + 1}N`);
const G = ["21G","22G","23G","24G","25G"];
const W = ["43W","44W","45W","46W","47W","48W","49W","50W","51W","52W"];

const ALL = [...S, ...N, ...G, ...W];

function defaultCell(id) {
  return {
    id,
    grain: null,
    protein: null,
    humidity: null,
    density: null,
    groupId: null,
    weight: 0,
    capacity: 0,
    full: false,
    closed: false,
    firstFill: null
  };
}

async function resetCells() {
  console.log("🧹 Czyszczenie kolekcji...");

  const snap = await getDocs(collection(db, "cells"));

  for (const d of snap.docs) {
    await deleteDoc(doc(db, "cells", d.id));
    console.log("🗑️ Usunięto:", d.id);
  }

  console.log("🚀 Tworzenie 75 komór...");

  for (const id of ALL) {
    await setDoc(doc(db, "cells", id), defaultCell(id));
    console.log("✅", id);
  }

  console.log("✨ GOTOWE — masz dokładnie 75 komór");
}

resetCells();