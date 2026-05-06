// scripts/importDallasToFirestore.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { parseDallasDat } from "./parseDallasDat.js";

const firebaseConfig = {
  // tu Twoja konfiguracja
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importDallas(path) {
  const data = parseDallasDat(path);

  for (const [cellId, sensors] of Object.entries(data)) {
    const dallasObj = {};

    sensors.forEach((s) => {
      dallasObj[s.id] = {
        temp: s.temp,
        fault: s.fault,
        timestamp: Date.now(),
      };
    });

    await updateDoc(doc(db, "cells", cellId), {
      dallas: dallasObj,
      dallasUpdated: Date.now(),
    });

    console.log(`✔ Zapisano Dallas dla komory ${cellId}`);
  }
}

importDallas("./temperatury.dat");
