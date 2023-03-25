import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {doc, setDoc,getDocs,collection, getFirestore} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { 
    getAuth
}from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Refer to how to integrate and use firebase:
// https://firebase.google.com/docs/web/setup
// https://www.geeksforgeeks.org/firebase-integration-with-web/
// https://www.freecodecamp.org/news/the-firestore-tutorial-for-2020-learn-by-example/
// https://firebase.google.com/docs/firestore/quickstart
// https://firebase.google.com/docs/firestore/manage-data/add-data
// https://firebase.google.com/docs/firestore/query-data/get-data


//CONFIG PROVIDE BY FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyCSG9SszuMHiH5GkEvP7B8if294FFKnaXE",
    authDomain: "brick-breaker-27350.firebaseapp.com",
    projectId: "brick-breaker-27350",
    storageBucket: "brick-breaker-27350.appspot.com",
    messagingSenderId: "608182419003",
    appId: "1:608182419003:web:6372fad03ecabdf8db661e",
    measurementId: "G-57NQ0NMRQZ"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore();


const auth = getAuth(app);


//https://www.youtube.com/watch?v=zSGFGQgDKIo - Refer to how to use firestore
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
    const querySnapshot = await getDocs(collection(database, "scores")); //GET ALL DOCUMENT FORM COLLECTION "scores"
    var listScore = document.querySelector('.list-score')
    querySnapshot.forEach((doc) => { //THROUGH EACH RECORD
        //APPEND A HTML STRING TO LIST LIST SCORE
        listScore.insertAdjacentHTML('afterbegin',`
            <div class="score">
                <span>${doc.data().username}</span>
                <span>${doc.data().score}</span>
            </div>
        `)
    });
}