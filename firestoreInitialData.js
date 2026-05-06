// 📂 src/seed/firestoreInitialData.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

console.log("🔥 START SKRYPTU");

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCkacduK3AmxKCI0t1-bfMqFkLx-4_sz3Y",
  authDomain: "elewator-testy.firebaseapp.com",
  projectId: "elewator-testy"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================
// CELLS
// ============================

const INITIAL_CELLS = {
  "1S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },
  "2S": { grainId: null, groupId: null, weight: 0, capacity: 30000 },
  // 👉 skrócone — możesz wkleić całość
  "52": { grainId: null, groupId: null, weight: 0, capacity: 8000 }
};

// ============================
// GRAINS
// ============================

const INITIAL_GRAINS = {
  pszenica: {
    name: "Pszenica",
    color: "#f4a742",
    parameters: {},
    groups: {}
  },
  zyto: {
    name: "Żyto",
    color: "#c2a84a",
    parameters: {},
    groups: {}
  },
  pellet: {
    name: "Pellet",
    color: "#8b6f47",
    parameters: {},
    groups: {}
  }
};

// ============================
// MAIN
// ============================

async function run() {
  console.log("🚀 zapis do Firestore...");

  // CELLS
  for (const [id, data] of Object.entries(INITIAL_CELLS)) {
    await setDoc(doc(db, "cells", id), { id, ...data });
    console.log("✅ cell:", id);
  }

  // GRAINS
  for (const [id, data] of Object.entries(INITIAL_GRAINS)) {
    await setDoc(doc(db, "grains", id), { id, ...data });
    console.log("🌾 grain:", id);
  }

  console.log("🎉 GOTOWE");
}

run();