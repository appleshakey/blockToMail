import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: "AIzaSyD8ns1z_5qTHwRzAOvAtZuG-DwUrOEh2Tc",
  authDomain: "blocktomail.firebaseapp.com",
  projectId: "blocktomail",
  storageBucket: "blocktomail.appspot.com",
  messagingSenderId: "2406106380",
  appId: "1:2406106380:web:b5a1e53b7feabc80337529",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
export const db = getFirestore(app);
