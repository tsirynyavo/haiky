import React from 'react'

export default function Button({ children, onClick, className = '', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className}`}
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {children}
    </button>
  )
}