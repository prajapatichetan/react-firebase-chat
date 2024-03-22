import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FireBase_Api_Key,
  authDomain: process.env.REACT_APP_FireBase_Auth_Domain,
  projectId: process.env.REACT_APP_FireBase_Project_Id,
  storageBucket: process.env.REACT_APP_FireBase_Storage_Bucket,
  messagingSenderId: process.env.REACT_APP_FireBase_Messaging_Sender_Id,
  appId: process.env.REACT_APP_FireBase_App_Id,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Check Authentication

const auth = getAuth();

// Googel Auth Provider

const authProvider = new GoogleAuthProvider();
// Get Firebase Store
const db = getFirestore(app);
export { auth, authProvider, db };
