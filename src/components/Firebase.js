// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCr-lVNDoeFNZ_b4RV4hwDnYgyt-l8vb5s",
  authDomain: "loginsignup-f2d3c.firebaseapp.com",
  projectId: "loginsignup-f2d3c",
  storageBucket: "loginsignup-f2d3c.appspot.com",
  messagingSenderId: "540874278015",
  appId: "1:540874278015:web:8c8050240c63c9c3ee2b4a",
  measurementId: "G-1TZBZ1BRLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth()
export const db = getFirestore(app)
export default app;