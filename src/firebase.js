// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your Firebase app configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1Z56z7A02MTOksvkvlI3zIcEOROHHXQU",
  authDomain: "healthy-progress-215b1.firebaseapp.com",
  projectId: "healthy-progress-215b1",
  storageBucket: "healthy-progress-215b1.appspot.com",
  messagingSenderId: "812698593065",
  appId: "1:812698593065:web:e0693861ae4e9d80a9f938",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
