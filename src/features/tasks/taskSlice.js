// Redux Toolkit slice for task management
// This file contains all task-related state management, async operations, and reducers
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { db } from '../../firebase'
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  orderBy,
  query,
  doc,
  updateDoc
} from 'firebase/firestore'

// Async thunk to fetch all tasks from Firestore
// Returns tasks sorted by creation date (newest first)
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks', 
  async (_, { rejectWithValue }) => {
    try {
      // Create query to get tasks ordered by creation date
      const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      // Map Firestore documents to task objects with proper date formatting
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      }))
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk to add a new task to Firestore
// Creates task with timestamp and user information
export const addTask = createAsyncThunk(
  'tasks/addTask', 
  async (task, { rejectWithValue }) => {
    try {
      // Add task document to Firestore with server timestamp
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...task,
        createdAt: serverTimestamp(),
        createdBy: 'meruyert' // Default user ID
      })
      
      // Return task object with generated ID and formatted date
      return { 
        id: docRef.id, 
        ...task,
        createdAt: new Date(),
        createdBy: 'meruyert'
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk to update task status in Firestore
// Updates both status and updatedAt timestamp
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, newStatus }, { rejectWithValue }) => {
    try {
      // Get reference to specific task document
      const taskRef = doc(db, 'tasks', taskId)
      
      // Update task with new status and timestamp
      await updateDoc(taskRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
      
      return { taskId, newStatus }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Redux slice definition with initial state and reducers
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [], // Array of task objects
    loading: false, // Loading state for async operations
    error: null // Error state for failed operations
  },
  reducers: {
    // Clear any error messages
    clearError: (state) => {
      state.error = null
    },
    // Update a specific task in the store (for optimistic updates)
    updateTaskInStore: (state, action) => {
      const { id, updates } = action.payload
      const taskIndex = state.items.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        state.items[taskIndex] = { ...state.items[taskIndex], ...updates }
      }
    }
  },
  // Extra reducers for handling async thunk states
  extraReducers: builder => {
    builder
      // Handle fetchTasks pending state
      .addCase(fetchTasks.pending, state => {
        state.loading = true
        state.error = null
      })
      // Handle fetchTasks success state
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
        state.error = null
      })
      // Handle fetchTasks error state
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Handle addTask pending state
      .addCase(addTask.pending, state => {
        state.error = null
      })
      // Handle addTask success state - add new task to beginning of list
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
        state.error = null
      })
      // Handle addTask error state
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload
      })
      // Handle updateTaskStatus pending state
      .addCase(updateTaskStatus.pending, state => {
        state.error = null
      })
      // Handle updateTaskStatus success state - update specific task
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { taskId, newStatus } = action.payload
        const taskIndex = state.items.findIndex(task => task.id === taskId)
        if (taskIndex !== -1) {
          state.items[taskIndex].status = newStatus
        }
        state.error = null
      })
      // Handle updateTaskStatus error state
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

// Export actions and reducer
export const { clearError, updateTaskInStore } = taskSlice.actions
export default taskSlice.reducer
