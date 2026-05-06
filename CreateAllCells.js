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

// --- POPRAWNY MODEL KOMÓR ---
function defaultCell(id) {
  return {
    id,
    grain: null,          // pszenica / zyto / owies / jeczmien / pellet

    // aktualne wartości jakości
    protein: null,
    wilgotnosc: null,
    opadanie: null,
    gluten: null,
    gestosc: null,

    // zakresy min–max (ustawiane przez QualityEditor)
    protein_min: null,
    protein_max: null,
    wilgotnosc_min: null,
    wilgotnosc_max: null,
    opadanie_min: null,
    opadanie_max: null,
    gluten_min: null,
    gluten_max: null,
    gestosc_min: null,
    gestosc_max: null,

    // pozostałe pola mapy
    weight: 0,
    capacity: 0,
    full: false,
    closed: false,
    firstFill: null,
    color: null,
    groupId: null,

    updatedAt: Date.now()
  };
}

async function createAllCells() {
  console.log("🚀 Tworzę wszystkie komory od zera...");

  try {
    for (const id of ALL) {
      await setDoc(doc(db, "cells", id), defaultCell(id));
      console.log(`✅ Utworzono komorę: ${id}`);
    }

    console.log("✨ Zakończono! Wszystkie komory zostały poprawnie wygenerowane.");
  } catch (error) {
    console.error("❌ Błąd podczas tworzenia:", error.message);
  }
}

createAllCells();
