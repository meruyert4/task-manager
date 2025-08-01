const { initializeApp } = require('firebase/app')
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function createUser() {
  try {
    await setDoc(doc(db, 'users', 'meruyert'), {
      name: 'meruyert',
      createdAt: serverTimestamp()
    })
    console.log('User "meruyert" created successfully!')
  } catch (error) {
    console.error('Error creating user:', error)
  }
}

createUser() 