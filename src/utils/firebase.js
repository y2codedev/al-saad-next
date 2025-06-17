"use client";

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAz7h8PF0tmXSlXGYQ85Xj8byIstNV-aWA",
  authDomain: "alsaad-93f0e.firebaseapp.com",
  projectId: "alsaad-93f0e",
  storageBucket: "alsaad-93f0e.firebasestorage.app",
  messagingSenderId: "177591430885",
  appId: "1:177591430885:web:8f0c8f197fa5d8a8edae0c",
  measurementId: "G-YXNL9G560K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const supportedLng = ["en", "ar"];
const defaultLng = "en";
const allCountries = [
  {
    id: 1,
    currency_code: "OMR",
  },
  {
    id: 2,
    currency_code: "AED",
  },
  {
    id: 5,
    currency_code: "SAR",
  },
];

export {
  auth,
  provider,
  facebookProvider,
  supportedLng,
  defaultLng,
  allCountries,
};
