import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, serverTimestamp } from "firebase/firestore";

// if (
//   !import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY ||
//   !import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN ||
//   !import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID ||
//   !import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET ||
//   !import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
//   !import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID ||
//   !import.meta.env.VITE_REACT_APP_FIREBASE_MEASUREMENT_ID
// ) {
//   console.error(
//     "Certaines variables d'environnement Firebase sont manquantes.",
//   );
// }

// const firebaseApp = initializeApp({
//   apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY||"",
//   authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN || "",
//   projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID || "",
//   storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET || "",
//   messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
//   appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID || "",
//   measurementId: import.meta.env.VITE_REACT_APP_FIREBASE_MEASUREMENT_ID || "",
// });

const firebaseApp = initializeApp({
  apiKey: "AIzaSyB_07JIN6bQi9_LCywQ22q2zcx5DcHcyvs",
  authDomain: "test-3ee84.firebaseapp.com",
  projectId: "test-3ee84",
  storageBucket: "test-3ee84.appspot.com",
  messagingSenderId: "663304868559",
  appId: "1:663304868559:web:b654a57d106461dcad5dba",
  measurementId: "G-8WB0TJL66M",
});

export const firestoreApp = getFirestore(firebaseApp);
export const storageApp = getStorage(firebaseApp);
export const authApp = getAuth(firebaseApp);
export const timestamp = serverTimestamp();
