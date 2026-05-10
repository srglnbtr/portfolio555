import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCurhAeb5NMk0bl2Pr-EVJDxxyp2fymQBQ",
  authDomain: "portoo-fb150.firebaseapp.com",
  projectId: "portoo-fb150",
  storageBucket: "portoo-fb150.firebasestorage.app",
  messagingSenderId: "57632191248",
  appId: "1:57632191248:web:b1b3ac265f27122165eb95",
  measurementId: "G-3HQQ4CYPHR"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
