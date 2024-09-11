// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyCr-lVNDoeFNZ_b4RV4hwDnYgyt-l8vb5s",
  authDomain: "loginsignup-f2d3c.firebaseapp.com",
  projectId: "loginsignup-f2d3c",
  storageBucket: "loginsignup-f2d3c.appspot.com",
  messagingSenderId: "540874278015",
  appId: "1:540874278015:web:8c8050240c63c9c3ee2b4a",
  measurementId: "G-1TZBZ1BRLJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 
export default app;
