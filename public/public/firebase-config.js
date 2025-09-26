// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPynZAgsva7Vn1uQY7JZAKQfpI-bsOckY",
  authDomain: "ecoquest-learning.firebaseapp.com",
  projectId: "ecoquest-learning",
  storageBucket: "ecoquest-learning.firebasestorage.app",
  messagingSenderId: "698873803294",
  appId: "1:698873803294:web:6a1c8cce9a9a5311bb740f",
  measurementId: "G-7N6JG852WG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
