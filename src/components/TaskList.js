// Task List Component
// This component displays all tasks and allows users to change their status
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks, updateTaskStatus } from '../features/tasks/taskSlice'
import './TaskList.css'

export default function TaskList() {
  // Redux hooks for dispatching actions and accessing state
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector(state => state.tasks)

  // Fetch tasks from Firestore when component mounts
  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  // Refresh task list manually
  const onRefresh = () => {
    dispatch(fetchTasks())
  }

  // Handle status change for a specific task
  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ taskId, newStatus }))
  }

  // Get color for status badge based on task status
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return '#ff9800' // Orange for todo
      case 'in-progress':
        return '#2196f3' // Blue for in progress
      case 'done':
        return '#4caf50' // Green for done
      default:
        return '#9e9e9e' // Gray for unknown status
    }
  }

  // Get display label for status
  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo':
        return 'To Do'
      case 'in-progress':
        return 'In Progress'
      case 'done':
        return 'Done'
      default:
        return status
    }
  }

  // Available status options for status dropdown
  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ]

  // Format date for display - handles various date formats
  const formatDate = (date) => {
    if (!date) return 'Just now'
    
    try {
      let dateObj
      
      // Handle Firestore timestamp objects
      if (date && typeof date.toDate === 'function') {
        dateObj = date.toDate()
      }
      // Handle Date objects
      else if (date instanceof Date) {
        dateObj = date
      }
      // Handle string or number dates
      else {
        dateObj = new Date(date)
      }
      
      // Validate date is not invalid
      if (isNaN(dateObj.getTime())) {
        return 'Just now'
      }
      
      // Format date for display
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Just now'
    }
  }

  // Show loading state when initially loading and no tasks exist
  if (loading && items.length === 0) {
    return (
      <div className="loading-container">
        <p className="loading-text">Loading tasks...</p>
      </div>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">Error: {error}</p>
        <button className="retry-button" onClick={onRefresh}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="task-list">
      {/* List header */}
      <h2 className="list-title">Task List</h2>
      
      {/* Conditional rendering based on task count */}
      {items.length === 0 ? (
        // Empty state when no tasks exist
        <div className="empty-container">
          <p className="empty-text">No tasks found</p>
          <p className="empty-subtext">Add a new task to get started!</p>
        </div>
      ) : (
        // Task grid when tasks exist
        <div className="tasks-container">
          {items.map(task => (
            // Individual task card
            <div key={task.id} className="task-card">
              {/* Task header with title and status */}
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                {/* Status dropdown for changing task status */}
                <select 
                  className="task-status-select"
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Task description if exists */}
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              
              {/* Task metadata - creation date and creator */}
              <div className="task-meta">
                <p className="meta-text">
                  Created: {formatDate(task.createdAt)}
                </p>
                <p className="meta-text">
                  By: {task.createdByName || task.createdBy || 'Unknown User'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Loading overlay when refreshing existing tasks */}
      {loading && items.length > 0 && (
        <div className="loading-overlay">
          <p>Refreshing...</p>
        </div>
      )}
    </div>
  )
}
