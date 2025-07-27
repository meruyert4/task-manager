// Main App component - Root component of the application
// Wraps the entire app with Redux Provider and sets up the main layout
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './app/store'
import TaskList from './components/TaskList'
import AddTaskForm from './components/AddTaskForm'
import './App.css'

export default function App() {
  return (
    // Redux Provider wraps the entire app to provide state management
    <Provider store={store}>
      {/* Main app container with background styling */}
      <div className="app">
        {/* Content container with two horizontal sections */}
        <div className="content">
          {/* Left section: Add Task Form */}
          <div className="add-task-container">
            <AddTaskForm />
          </div>
          {/* Right section: Task List */}
          <div className="task-list-container">
            <TaskList />
          </div>
        </div>
      </div>
    </Provider>
  )
}
