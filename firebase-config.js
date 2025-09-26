// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAij1wrh51C4ocgmrAdd0WYkVi0ktaKPfc",
  authDomain: "ecoquest-2-3ef73.firebaseapp.com",
  projectId: "ecoquest-2-3ef73",
  storageBucket: "ecoquest-2-3ef73.firebasestorage.app",
  messagingSenderId: "715702452094",
  appId: "1:715702452094:web:5fb651aaa399b6cafabd2f",
  measurementId: "G-G1WSZ6K7SY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
