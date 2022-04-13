import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBb8lNDk2zdev3rzkiJunJ6KEHEQfI6k9Y",

  authDomain: "qwitter-688fd.firebaseapp.com",

  projectId: "qwitter-688fd",

  storageBucket: "qwitter-688fd.appspot.com",

  messagingSenderId: "1033878025723",

  appId: "1:1033878025723:web:0171b966c20bcc2c3b475e"

};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

export default db