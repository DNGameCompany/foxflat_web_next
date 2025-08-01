// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA0pEOXR9Uno1VPcY6VlQGi9q6mfgEYgMY",
    authDomain: "flatfox-78e1d.firebaseapp.com",
    projectId: "flatfox-78e1d",
    storageBucket: "flatfox-78e1d.firebasestorage.app",
    messagingSenderId: "917300778982",
    appId: "1:917300778982:web:a6073fa53d48c11855e827",
    measurementId: "G-Q0P6Y748W1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const  db = getFirestore(app);