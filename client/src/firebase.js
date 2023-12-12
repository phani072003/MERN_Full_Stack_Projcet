// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-d6cd4.firebaseapp.com",
  projectId: "mern-estate-d6cd4",
  storageBucket: "mern-estate-d6cd4.appspot.com",
  messagingSenderId: "63903000781",
  appId: "1:63903000781:web:a7bb1884acc027dae62184",
  measurementId: "G-YD9ZNENYZ6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
