// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";  // นำเข้าฟังก์ชันจาก firebase/auth
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBbzISrCgYWmmnvOD1B9t9MI1QP_1ys3_A",
  authDomain: "authentication-5a4f2.firebaseapp.com",
  projectId: "authentication-5a4f2",
  storageBucket: "authentication-5a4f2.firebasestorage.app",
  messagingSenderId: "652066315803",
  appId: "1:652066315803:web:cf6d5a01f93c8eec9ee2be",
  measurementId: "G-8VD7XMTTSW"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase services
export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };
