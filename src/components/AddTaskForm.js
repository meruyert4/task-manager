// Add Task Form Component
// This component provides a form for creating new tasks with title, description, and status
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTask, clearError } from '../features/tasks/taskSlice'
import './AddTaskForm.css'

export default function AddTaskForm() {
  // Redux hooks for dispatching actions and accessing state
  const dispatch = useDispatch()
  const { error } = useSelector(state => state.tasks)
  
  // Local state for form inputs
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')

  // Available status options for task creation
  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ]

  // Handle form submission - creates new task and resets form
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate that title is not empty
    if (!title.trim()) {
      return
    }
    
    // Dispatch action to add new task to Firestore
    dispatch(addTask({ 
      title: title.trim(), 
      description: description.trim(), 
      status 
    }))
    
    // Reset form fields to initial state
    setTitle('')
    setDescription('')
    setStatus('todo')
  }

  // Clear error message from Redux state
  const clearErrorMessage = () => {
    dispatch(clearError())
  }

  return (
    <div className="add-task-form">
      {/* Form header */}
      <h2 className="form-title">Add New Task</h2>
      
      {/* Error display - shows if there's an error from Redux state */}
      {error && (
        <div className="error-container">
          <span className="error-text">{error}</span>
          <button className="clear-error-btn" onClick={clearErrorMessage}>
            ✕
          </button>
        </div>
      )}

      {/* Task creation form */}
      <form onSubmit={handleSubmit}>
        {/* Task title input */}
        <input 
          className="form-input"
          type="text"
          value={title} 
          placeholder="Task Title" 
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          required
        />
        
        {/* Task description textarea */}
        <textarea 
          className="form-textarea"
          value={description} 
          placeholder="Task Description" 
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={3}
        />
        
        {/* Task status selection */}
        <div className="status-container">
          <label className="status-label">Status:</label>
          <select 
            className="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Submit button - disabled when title is empty */}
        <button 
          type="submit"
          className="submit-button"
          disabled={!title.trim()}
        >
          Add Task
        </button>
      </form>
    </div>
  )
}
