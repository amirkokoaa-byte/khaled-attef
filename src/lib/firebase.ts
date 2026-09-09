import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, increment, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if config exists to prevent crashing in preview without env vars
const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
import { initializeFirestore } from 'firebase/firestore';
export const db = app ? initializeFirestore(app, { experimentalForceLongPolling: true }) : null;

// Helper to save to Firestore
export const saveToFirebase = async (collectionName: string, id: string, data: any) => {
  if (!db) return; // Fallback gracefully if Firebase isn't set up yet
  try {
    await setDoc(doc(db, collectionName, id), data);
  } catch (error: any) {
    if (error.message?.includes('offline')) {
      console.warn("Firebase is offline. Data saved only to local storage.");
    } else {
      console.error("Error saving to Firebase:", error);
    }
  }
};
