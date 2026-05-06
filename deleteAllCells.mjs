import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkacduK3AmxKCI0t1-bfMqFkLx-4_sz3Y",
  authDomain: "elewator-testy.firebaseapp.com",
  projectId: "elewator-testy"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteAllCells() {
  console.log("🧹 Pobieranie dokumentów...");

  const snapshot = await getDocs(collection(db, "cells"));

  if (snapshot.empty) {
    console.log("ℹ️ Kolekcja 'cells' jest już pusta.");
    return;
  }

  console.log(`🔥 Znaleziono ${snapshot.size} komór — usuwam...`);

  for (const d of snapshot.docs) {
    await deleteDoc(doc(db, "cells", d.id));
    console.log("🗑️ Usunięto:", d.id);
  }

  console.log("✅ Wszystkie komory zostały usunięte.");
}

deleteAllCells().catch((err) => {
  console.error("❌ Błąd:", err.message);
});