// Firebase configuration and initialization for Blueprint AI
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwZ0NUW27ECp7UP8_iJ4VFH5ydasy1TTQ",
  authDomain: "blueprint-ai-4bee9.firebaseapp.com",
  projectId: "blueprint-ai-4bee9",
  storageBucket: "blueprint-ai-4bee9.firebasestorage.app",
  messagingSenderId: "67500332929",
  appId: "1:67500332929:web:84b5292406d7683414ba80",
  measurementId: "G-Y34SPBVWSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
