import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkacduK3AmxKCI0t1-bfMqFkLx-4_sz3Y",
  authDomain: "elewator-testy.firebaseapp.com",
  projectId: "elewator-testy"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- LISTA WSZYSTKICH KOMÓR ---
const S = Array.from({ length: 40 }, (_, i) => `${i + 1}S`);
const N = Array.from({ length: 20 }, (_, i) => `${i + 1}N`);
const G = ["21G", "22G", "23G", "24G", "25G"];
const O = ["43W","44W","45W","46W","47W","48W","49W","50W","51W","52W"];

const ALL = [...S, ...N, ...G, ...O];

// --- POLA DO INICJALIZACJI ---
const PARAMS = [
  "protein",
  "wilgotnosc",
  "opadanie",
  "gluten",
  "gestosc",
  "protein_min",
  "protein_max",
  "wilgotnosc_min",
  "wilgotnosc_max",
  "opadanie_min",
  "opadanie_max",
  "gluten_min",
  "gluten_max",
  "gestosc_min",
  "gestosc_max"
];

async function initCells() {
  console.log("🚀 Inicjalizacja pól w komorach...");

  for (const id of ALL) {
    const ref = doc(db, "cells", id);

    const data = { updatedAt: Date.now() };

    PARAMS.forEach((p) => {
      data[p] = 0; // ⭐ USTAWIAMY LICZBĘ
    });

    await setDoc(ref, data, { merge: true });
    console.log(`✅ Zainicjalizowano: ${id}`);
  }

  console.log("✨ Zakończono inicjalizację wszystkich komór.");
}

initCells();
