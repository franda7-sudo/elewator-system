// seedParameters.js
// -----------------------------------------
// Dodawanie parametrów jakości do zbóż
// -----------------------------------------

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// -----------------------------------------
// KONFIGURACJA FIREBASE (wklej swoją)
// -----------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCkacduK3AmxKCI0t1-bfMqFkLx-4_sz3Y",
  authDomain: "elewator-testy.firebaseapp.com", 
  projectId:  "elewator-testy",
  storageBucket: "elewator-testy.firebasestorage.app" , 
  messagingSenderId: "177757651086",
  appId: "1:177757651086:web:2311a0105c498abf6f89df" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -----------------------------------------
// PARAMETRY JAKOŚCI (dla wszystkich zbóż)
// -----------------------------------------
const PARAMETERS = {
  bialko: {
    name: "Białko",
    short: "Białko",
    unit: "%",
    isKey: true
  },
  wilgotnosc: {
    name: "Wilgotność",
    short: "Wilg.",
    unit: "%",
    isExtra: true
  },
  opadanie: {
    name: "Liczba opadania",
    short: "L.op.",
    unit: "s"
  },
  gestosc: {
    name: "Gęstość",
    short: "kg/hl",
    unit: "kg/hl"
  }
};

// -----------------------------------------
// LISTA ZBÓŻ (zgodna z Twoim Firestore)
// -----------------------------------------
const GRAINS = ["pszenica", "zyto", "jeczmien", "owies", "pellet"];

// -----------------------------------------
// IMPORT PARAMETRÓW
// -----------------------------------------
async function seedParameters() {
  console.log("⏳ Dodawanie parametrów do zbóż...");

  for (const grainId of GRAINS) {
    for (const [paramId, paramData] of Object.entries(PARAMETERS)) {
      await setDoc(
        doc(db, "grains", grainId, "parameters", paramId),
        paramData
      );
    }
  }

  console.log("✅ Parametry dodane pomyślnie.");
}

seedParameters();
