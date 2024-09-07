// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "teacher-22252.firebaseapp.com",
  projectId: "teacher-22252",
  storageBucket: "teacher-22252.appspot.com",
  messagingSenderId: "111483853970",
  appId: "1:111483853970:web:d2998a030826fbe78b1a4b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and export it
export const storage = getStorage(app);
