import { initializeApp,getApp,getApps} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCyRo6yXcGdTAVR6M5CKlwRPFDnbNogrbg",
  authDomain: "blueconnect-47909.firebaseapp.com",
  projectId: "blueconnect-47909",
  storageBucket: "blueconnect-47909.appspot.com", 
  messagingSenderId: "585057120917",
  appId: "1:585057120917:web:3906c4e4f2ed106b78e19c"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { db,app,auth };