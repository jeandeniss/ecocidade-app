import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCoa4h3i6wpffN2GJ7gjTwmvfmQyHfRj4o",
  authDomain: "ecocidade-bd.firebaseapp.com",
  databaseURL: "https://ecocidade-bd-default-rtdb.firebaseio.com",
  projectId: "ecocidade-bd",
  storageBucket: "ecocidade-bd.firebasestorage.app",
  messagingSenderId: "799887395392",
  appId: "1:799887395392:web:1c23e2eaa70311ff6f2da5",
  measurementId: "G-7WL5L824E8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export a function to check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};