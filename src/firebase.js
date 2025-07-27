// Root Firebase configuration file
// This file provides Firebase services for server-side operations (like Cloud Functions)
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase configuration object for the todolistreact-4708b project
// Contains all necessary API keys and project settings
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig)

// Export Firebase services for use in server-side operations
export const db = getFirestore(app) // Firestore database instance
export const auth = getAuth(app) // Firebase Authentication instance
