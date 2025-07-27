// Redux store configuration
// This file sets up the Redux store with all reducers for state management
import { configureStore } from '@reduxjs/toolkit'
import taskReducer from '../features/tasks/taskSlice'

// Configure the Redux store with all application reducers
export const store = configureStore({
  reducer: {
    tasks: taskReducer // Register the tasks reducer for task-related state
  }
})
