import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth"; // ⭐ 1. Importujemy Auth

const firebaseConfig = {
  apiKey: "AIzaSyCkacduK3AmxKCI0t1-bfMqFkLx-4_sz3Y",
  authDomain: "elewator-testy.firebaseapp.com",
  databaseURL: "https://elewator-testy-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "elewator-testy",
  storageBucket: "elewator-testy.appspot.com",
  messagingSenderId: "177757651086",
  appId: "1:177757651086:web:2311a0105c498abf6f89df"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const functions = getFunctions(app);
export const auth = getAuth(app); // ⭐ 2. Eksportujemy stałą auth

export default app;