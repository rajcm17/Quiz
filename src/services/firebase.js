import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasConfig = !!import.meta.env.VITE_FIREBASE_API_KEY && !!import.meta.env.VITE_FIREBASE_PROJECT_ID;

let app = null;
let auth = null;
let db = null;

if (hasConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // When running without Firebase config (e.g., local dev without env vars),
  // avoid throwing during module import — warn and export null placeholders.
  // Actual auth calls will fail later if used; AuthContext now guards subscription.
  // eslint-disable-next-line no-console
  console.warn('Firebase not configured. Set VITE_FIREBASE_* env vars to enable Firebase.');
}

export { auth, db };
export default app;