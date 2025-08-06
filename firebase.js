import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "DUMMY_KEY",
  authDomain: "blueconnect-47909.firebaseapp.com",
  projectId: "blueconnect-47909",
  storageBucket: "blueconnect-47909.appspot.com",
  messagingSenderId: "585057120917",
  appId: "1:585057120917:web:3906c4e4f2ed106b78e19c"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
