import {getFirestore} from "firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAJTtWCbL5Hb3-P7LmeG2B_OkfVJ9J0W7c",
  authDomain: "ahmad-kabha.firebaseapp.com",
  projectId: "ahmad-kabha",
  storageBucket: "ahmad-kabha.appspot.com",
  messagingSenderId: "440883414568",
  appId: "1:440883414568:web:5825c8adf2dfe97169171d"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const firestore = getFirestore(app);
export const authh = getAuth(app);
export const storagee = getStorage(app);