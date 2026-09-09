import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, increment, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAU26-T-2vSZoiN0F9zBNzYAbDT3PsswXE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0277638393.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0277638393',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0277638393.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '458430937460',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:458430937460:web:4e751de7f3af7f1d1c5421'
};

// Initialize Firebase only if config exists to prevent crashing in preview without env vars
const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
import { initializeFirestore } from 'firebase/firestore';
export const db = app ? initializeFirestore(app, { experimentalForceLongPolling: true }, 'ai-studio-khaledattef-b44cce33-cf35-4d06-acc4-9d33441d3513') : null;

// Helper to save to Firestore
export const saveToFirebase = async (collectionName: string, id: string, data: any) => {
  if (!db) return; // Fallback gracefully if Firebase isn't set up yet
  try {
    const cleanData = JSON.parse(JSON.stringify(data));
    await setDoc(doc(db, collectionName, id), cleanData);
  } catch (error: any) {
    if (error.message?.includes('offline')) {
      console.warn("Firebase is offline. Data saved only to local storage.");
    } else {
      console.error("Error saving to Firebase:", error);
    }
  }
};
