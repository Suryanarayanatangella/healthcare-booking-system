import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({ 
  size = 'default', 
  showText = true, 
  className = '',
  linkTo = '/',
  variant = 'default',
  theme = 'default'
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      container: 'h-8',
      icon: 'h-8 w-8',
      text: 'text-lg',
      subtext: 'text-xs'
    },
    default: {
      container: 'h-10',
      icon: 'h-10 w-10',
      text: 'text-xl',
      subtext: 'text-sm'
    },
    large: {
      container: 'h-12',
      icon: 'h-12 w-12',
      text: 'text-2xl',
      subtext: 'text-base'
    }
  }

  const config = sizeConfig[size] || sizeConfig.default

  // Theme configurations
  const isWhiteTheme = theme === 'white'
  const gradientId = `logoGradient-${Math.random().toString(36).substr(2, 9)}`

  // Logo Icon Component
  const LogoIcon = ({ className: iconClassName }) => (
    <div className={`${iconClassName} relative`}>
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {isWhiteTheme ? (
              <>
                <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#f8fafc', stopOpacity: 1}} />
              </>
            ) : (
              <>
                <stop offset="0%" style={{stopColor: '#4F46E5', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#7C3AED', stopOpacity: 1}} />
              </>
            )}
          </linearGradient>
        </defs>
        
        {/* Medical Cross Background */}
        <circle 
          cx="20" 
          cy="20" 
          r="18" 
          fill={`url(#${gradientId})`} 
          stroke={isWhiteTheme ? '#e2e8f0' : '#ffffff'} 
          strokeWidth="1"
        />
        
        {/* Medical Cross */}
        <rect 
          x="17" 
          y="10" 
          width="6" 
          height="20" 
          fill={isWhiteTheme ? '#4F46E5' : '#ffffff'} 
          rx="1"
        />
        <rect 
          x="10" 
          y="17" 
          width="20" 
          height="6" 
          fill={isWhiteTheme ? '#4F46E5' : '#ffffff'} 
          rx="1"
        />
        
        {/* Small highlight for depth */}
        <circle 
          cx="16" 
          cy="16" 
          r="1.5" 
          fill={isWhiteTheme ? '#7C3AED' : '#ffffff'} 
          opacity="0.4"
        />
      </svg>
    </div>
  )

  // Logo content
  const logoContent = (
    <div className={`flex items-center space-x-3 ${className}`}>
      <LogoIcon className={config.icon} />
      
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className={`font-heading font-bold ${config.text} ${isWhiteTheme ? 'text-white' : 'text-text-primary'}`}>
              Healthcare
            </span>
            {variant === 'default' && (
              <span className={`font-heading font-bold ${config.text} ${isWhiteTheme ? 'text-white/90' : 'text-primary-500'} ml-1`}>
                Booking
              </span>
            )}
          </div>
          {variant === 'full' && (
            <span className={`font-medium ${config.subtext} ${isWhiteTheme ? 'text-white/80' : 'text-text-secondary'} -mt-1`}>
              Booking System
            </span>
          )}
        </div>
      )}
    </div>
  )

  // Return as link or plain div
  if (linkTo) {
    return (
      <Link 
        to={linkTo} 
        className="hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
      >
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

export default Logo