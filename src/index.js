// React application entry point
// This file initializes the React application and renders it to the DOM
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Get the root DOM element where the React app will be mounted
const root = createRoot(document.getElementById('root'))

// Render the main App component to the DOM
root.render(<App />) 