// src/firebase.js
import { initializeApp }    from "firebase/app";
import { getFirestore }     from "firebase/firestore";
import { getStorage }       from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLQ7qY_C0uoDE6klRKorbbyAutcY9w03E",
  authDomain: "b2portifolio.firebaseapp.com",
  projectId: "b2portifolio",
  storageBucket: "b2portifolio.appspot.com",    // ← corrige aqui
  messagingSenderId: "37098713136",
  appId: "1:37098713136:web:27ea6a9a1efd7a23f97df5",
  measurementId: "G-QEXYY8F5M2"
};

const app     = initializeApp(firebaseConfig);
export const db      = getFirestore(app);
export const storage = getStorage(app);
