// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import "firebase/auth"; // Import additional Firebase modules as needed

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-66733.firebaseapp.com",
  projectId: "mern-auth-66733",
  storageBucket: "mern-auth-66733.appspot.com",
  messagingSenderId: "204522526175",
  appId: "1:204522526175:web:71b45735dee0fcc358206a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
