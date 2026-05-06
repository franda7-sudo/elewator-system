import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

// 🔥 Twoja konfiguracja Firebase:
const firebaseConfig = {
  apiKey: "AIzaSyCkacduK3AmxKCI0t1-bfMqFkLx-4_sz3Y",
  authDomain: "elewator-testy.firebaseapp.com",
  databaseURL: "https://elewator-testy-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "elewator-testy",
  storageBucket: "elewator-testy.firebasestorage.app",
  messagingSenderId: "177757651086",
  appId: "1:177757651086:web:2311a0105c498abf6f89df"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  const snap = await getDocs(collection(db, "cells"));

  for (const d of snap.docs) {
    await updateDoc(doc(db, "cells", d.id), {
      grain: "pszenica",
      groupId: "g_default",
      qualityGroup: "A",
    });
    console.log("Updated:", d.id);
  }
}

migrate();
