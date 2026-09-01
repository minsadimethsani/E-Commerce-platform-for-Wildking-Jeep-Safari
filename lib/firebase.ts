import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBK5pUK4ht9DBC77K7kPN_X0ldglMVizAw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "wildking-d0d2e.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "wildking-d0d2e",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "wildking-d0d2e.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "425629997949",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:425629997949:web:c6731a3e2d2a5626e98a14",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-8JVZXJ25YN",
};

// Initialize Firebase App (singleton pattern)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Analytics support check (runs client-side only)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, storage, analytics };
