/**
 * Main Entry Point for Healthcare Booking System
 * 
 * This file initializes the React application with Redux store,
 * routing, and global providers.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import App from './App.jsx'
import { store } from './store/store.js'
import './index.css'

// Toast configuration for notifications
const toastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#ffffff',
    color: '#2E3A59',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'Source Sans 3, system-ui, sans-serif',
  },
  success: {
    iconTheme: {
      primary: '#007C91',
      secondary: '#ffffff',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
        <Toaster toastOptions={toastOptions} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)