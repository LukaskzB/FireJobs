import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDjtKdYpacfS32i6cmy6ETWmBGwM5kVn5Q",
  authDomain: "firejobs-171c9.firebaseapp.com",
  projectId: "firejobs-171c9",
  storageBucket: "firejobs-171c9.appspot.com",
  messagingSenderId: "289875509285",
  appId: "1:289875509285:web:4a9ddbc04f9c755b4d3fcc",
  measurementId: "G-VNMKLWCWS2",
};

if (!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
