import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// El apiKey de Firebase es público por diseño: la seguridad real
// está en las reglas de Firestore/Storage (ver firestore.rules).
const firebaseConfig = {
  apiKey: 'AIzaSyC-Vugn6OZcEOZuRhwO4DcX6jQ1UrPgADM',
  authDomain: 'hosteria-roblesur.firebaseapp.com',
  projectId: 'hosteria-roblesur',
  storageBucket: 'hosteria-roblesur.appspot.com',
  messagingSenderId: '587587113540',
  appId: '1:587587113540:web:98f34cdf522d748b9ce211',
  measurementId: 'G-H0SWB98NYL',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
