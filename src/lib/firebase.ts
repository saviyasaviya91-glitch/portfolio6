// Firebase client init (browser-only). Web API keys are safe to ship.
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyDrtiz91cUOV9jIR3HUZlTNQR-seeC4sU0",
  authDomain: "pamo-ff-admin.firebaseapp.com",
  projectId: "pamo-ff-admin",
  storageBucket: "pamo-ff-admin.firebasestorage.app",
  messagingSenderId: "939638137823",
  appId: "1:939638137823:web:995d14cae19da66d359a6a",
  measurementId: "G-RVHZ1W8SGW",
};

// Only the user with this UID can access /admin.
export const ADMIN_UID = "SjQJd83a3Rhw2FdT1OraW5dYnZk2";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

function getApp(): FirebaseApp {
  if (_app) return _app;
  _app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (typeof window === "undefined") {
    throw new Error("getFirebaseAuth() called on the server");
  }
  if (!_auth) _auth = getAuth(getApp());
  return _auth;
}

export function getDb(): Firestore {
  if (typeof window === "undefined") {
    throw new Error("getDb() called on the server");
  }
  if (!_db) _db = getFirestore(getApp());
  return _db;
}
