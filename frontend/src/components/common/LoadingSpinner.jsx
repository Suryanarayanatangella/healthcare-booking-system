/**
 * Loading Spinner Component
 * 
 * A reusable loading spinner component with different sizes
 * and customizable styling for the healthcare booking system.
 */

import React from 'react'
import { clsx } from 'clsx'

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  className = '',
  text = '',
  centered = false 
}) => {
  // Size variants
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16',
  }

  // Color variants
  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    white: 'border-white',
    gray: 'border-gray-500',
  }

  const spinnerClasses = clsx(
    'spinner',
    sizeClasses[size],
    colorClasses[color],
    className
  )

  const containerClasses = clsx(
    'flex items-center gap-3',
    {
      'justify-center min-h-[200px]': centered,
      'flex-col': text && centered,
    }
  )

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses} />
      {text && (
        <span className="text-sm text-text-secondary animate-pulse">
          {text}
        </span>
      )}
    </div>
  )
}

// Preset loading components for common use cases
export const PageLoader = ({ text = 'Loading...' }) => (
  <LoadingSpinner 
    size="large" 
    text={text} 
    centered 
    className="mx-auto" 
  />
)

export const ButtonLoader = ({ size = 'small' }) => (
  <LoadingSpinner 
    size={size} 
    color="white" 
    className="mr-2" 
  />
)

export const CardLoader = ({ text = 'Loading...' }) => (
  <div className="card p-8">
    <LoadingSpinner 
      size="medium" 
      text={text} 
      centered 
    />
  </div>
)

export const InlineLoader = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center py-4">
    <LoadingSpinner 
      size="small" 
      text={text} 
    />
  </div>
)

export default LoadingSpinner