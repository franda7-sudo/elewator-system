const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  addDoc
} = require("firebase/firestore");

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
  console.log("Pobieram operatorów z kolekcji 'operators'...");

  const snap = await getDocs(collection(db, "operators"));

  for (const docSnap of snap.docs) {
    const data = docSnap.data();

    const userData = {
      login: data.login || docSnap.id,
      pin: data.pin || "",
      role: data.role || "operator",
      blocked: data.blocked || false,
    };

    await addDoc(collection(db, "users"), userData);

    console.log("Przeniesiono:", userData.login);
  }

  console.log("GOTOWE — wszyscy operatorzy przeniesieni do 'users/'");
}

migrate();
