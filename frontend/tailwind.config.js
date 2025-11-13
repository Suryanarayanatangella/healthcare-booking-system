/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Healthcare theme colors
        primary: {
          50: '#f0f9fa',
          100: '#d9f1f4',
          200: '#b7e3ea',
          300: '#87cedb',
          400: '#4fb0c4',
          500: '#007C91', // Primary teal blue
          600: '#006b7d',
          700: '#005a68',
          800: '#004a54',
          900: '#003d46',
        },
        secondary: {
          50: '#f0fcff',
          100: '#d9f7ff',
          200: '#b7f0ff',
          300: '#87e6ff',
          400: '#4fd7ff',
          500: '#00B8D4', // Accent sky blue
          600: '#00a3bd',
          700: '#008ca3',
          800: '#007485',
          900: '#005f6e',
        },
        background: {
          light: '#F5F7FA', // Off-white/Cool gray
        },
        text: {
          primary: '#0f172a', // Deep slate for high contrast
          secondary: '#475569', // Medium slate for good readability
          muted: '#64748b', // Light slate for subtle text
          accent: '#007C91', // Primary color for emphasis
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.7', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.025em' }],
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.025em' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}