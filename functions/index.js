// Firebase Cloud Functions
// This file contains serverless functions that run on Firebase infrastructure
const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Initialize Firebase Admin SDK for server-side operations
admin.initializeApp()

/**
 * Cloud Function that triggers when a new task is created
 * Automatically adds the createdByName field by looking up the user document
 * This ensures consistency between createdBy (user ID) and createdByName (user display name)
 */
exports.addCreatedByName = functions.firestore
  .document('tasks/{taskId}')
  .onCreate(async (snap, context) => {
    try {
      const task = snap.data()
      const taskId = context.params.taskId
      
      console.log(`Processing new task: ${taskId}`)
      
      // Check if createdBy field exists in the task
      if (!task.createdBy) {
        console.warn(`Task ${taskId} has no createdBy field`)
        return null
      }
      
      // Get user document from users collection using the createdBy ID
      const userRef = admin.firestore().doc(`users/${task.createdBy}`)
      const userSnap = await userRef.get()
      
      let userName = 'Unknown User' // Default fallback name
      
      if (userSnap.exists) {
        const userData = userSnap.data()
        userName = userData.name
        console.log(`Found user: ${userName} for task: ${taskId}`)
      } else {
        console.warn(`User document not found for userId: ${task.createdBy}, using default name`)
      }
      
      // Update the task document with createdByName field
      await snap.ref.update({ 
        createdByName: userName,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
      
      console.log(`Successfully updated task ${taskId} with createdByName: ${userName}`)
      return null
      
    } catch (error) {
      console.error(`Error processing task ${context.params.taskId}:`, error)
      throw error
    }
  })

/**
 * HTTP Cloud Function to create test users
 * Useful for development and testing purposes
 * Accepts POST requests with userId and name in the body
 */
exports.createTestUser = functions.https.onRequest(async (req, res) => {
  try {
    // Only allow POST requests for security
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed')
      return
    }
    
    const { userId, name } = req.body
    
    // Validate required fields
    if (!userId || !name) {
      res.status(400).send('Missing userId or name')
      return
    }
    
    // Create user document in Firestore
    await admin.firestore().collection('users').doc(userId).set({
      name: name,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })
    
    res.status(200).json({ 
      success: true, 
      message: `User ${name} created with ID: ${userId}` 
    })
    
  } catch (error) {
    console.error('Error creating test user:', error)
    res.status(500).send('Internal Server Error')
  }
})