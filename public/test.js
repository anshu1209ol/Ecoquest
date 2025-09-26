// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  import { initializeApp } from "firebase/app";
  import { getAuth } from "firebase/auth";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDMqWeoTT9_S2nb9kFWOPOSF9gniZWYCig",
    authDomain: "ecoquest-1a1b2.firebaseapp.com",
    projectId: "ecoquest-1a1b2",
    storageBucket: "ecoquest-1a1b2.firebasestorage.app",
    messagingSenderId: "333811831698",
    appId: "1:333811831698:web:05bfc1ab6d565a7afc674b",
    measurementId: "G-QMZR7L4VCH"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  //inputs
  const email = document.getElementById('email').value;
  const password = document.getElementByID('password').value;

  //submit button
  const submit=document.getElementById('submit');
  submit.addEventListener("click", function(event){
    event.preventDefault()
    alert(5)
  })