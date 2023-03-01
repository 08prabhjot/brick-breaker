import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {doc, setDoc,getDoc,getDocs,collection, getFirestore} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { 
    getAuth
}from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

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
const querySnapshot = await getDocs(collection(database, "scores")); //GET ALL DOCUMENT FORM COLLECTION "scores"

export async function storeScore(username, score) {
    let scoreData = {
        username: username,
        score: score
    }
    let ref = doc(database, "scores", username) //SET A REF ID IS 'username' IN COLLECTION 'score' OF DATABASE
    await setDoc(ref, scoreData).then(() => { // MAP DATA WITH REF AND STORE IN DATABASE
        console.log('store score')
    }).catch(err => {
        console.log(err)
    })
}

export async function getScore() {
    var listScore = document.querySelector('.list-score')
    querySnapshot.forEach((doc) => { //THROUGH EACH RECORD
        listScore.insertAdjacentHTML('afterbegin',`
            <div class="score">
                <span>${doc.data().username}</span>
                <span>${doc.data().score}</span>
            </div>
        `)
    });
}