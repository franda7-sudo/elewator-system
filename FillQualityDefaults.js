import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  updateDoc 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkacduK3AmxKCI0t1-bfMqFkLx-4_sz3Y", 
  authDomain: "elewator-testy.firebaseapp.com", 
  projectId: "elewator-testy"
};

// 1. Inicjalizacja aplikacji
const app = initializeApp(firebaseConfig);

// 2. Pobranie instancji bazy danych
const db = getFirestore(app);

async function fillDefaults() {
  console.log("🚀 Rozpoczynam sprawdzanie dokumentów...");

  try {
    const snap = await getDocs(collection(db, "cells"));
    console.log(`🔍 Znaleziono ${snap.docs.length} komór.`);

    for (const d of snap.docs) {
      const c = d.data();
      const patch = {};

      // Sprawdzanie czy pole istnieje (używamy hasOwnProperty lub check in)
      if (c.grain === undefined) patch.grain = null;
      if (c.białko === undefined) patch.białko = null;
      if (c.wilgotność === undefined) patch.wilgotność = null;
      if (c.gęstość === undefined) patch.gęstość = null;
      if (c.groupId === undefined) patch.groupId = null;
      if (c.paramFrom === undefined) patch.paramFrom = null;
      if (c.paramTo === undefined) patch.paramTo = null;
      if (c.color === undefined) patch.color = null;

      if (Object.keys(patch).length > 0) {
        await updateDoc(doc(db, "cells", d.id), patch);
        console.log(`✅ Uzupełniono brakujące pola w: ${d.id}`, patch);
      }
    }

    console.log("✨ Gotowe — wszystkie dokumenty są kompletne.");
  } catch (error) {
    console.error("❌ Błąd podczas uzupełniania danych:", error.message);
    
    if (error.message.includes("permission-denied")) {
      console.log("👉 WSKAZÓWKA: Sprawdź reguły (Rules) w konsoli Firebase Firestore. Muszą pozwalać na zapis.");
    }
  }
}

// Uruchomienie funkcji
fillDefaults();