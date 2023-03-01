import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import {doc, setDoc,getDoc,updateDoc, getFirestore} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyANjXg9ighDIyS7xgYEIUfg65Bcdzv396I",
    authDomain: "test-d075e.firebaseapp.com",
    databaseURL: "https://test-d075e-default-rtdb.firebaseio.com",
    projectId: "test-d075e",
    storageBucket: "test-d075e.appspot.com",
    messagingSenderId: "1003451507207",
    appId: "1:1003451507207:web:84804bcf5664fb189bc0a2",
    measurementId: "G-5FLQLC7CVY"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore();


const auth = getAuth(app);