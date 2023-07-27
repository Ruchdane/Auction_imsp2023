import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, serverTimestamp } from "firebase/firestore";

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
