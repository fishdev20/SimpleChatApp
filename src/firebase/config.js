import firebase from 'firebase/compat/app';

import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgv_ycSMTSoSlSQGdLWoZ6Tg4xWw7VXLM",
  authDomain: "chat-app-lite.firebaseapp.com",
  projectId: "chat-app-lite",
  storageBucket: "chat-app-lite.appspot.com",
  messagingSenderId: "883407611033",
  appId: "1:883407611033:web:d988f6b3eaa0575b8fc408",
  measurementId: "G-0J43GR64B6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === 'localhost') {
  auth.useEmulator('http://localhost:9099');
  db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;
