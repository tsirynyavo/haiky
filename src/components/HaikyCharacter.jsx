import React from 'react'

export default function HaikyCharacter({ size = 80, animated = true }) {
  return (
    <div
      style={{
        fontSize: `${size}px`,
        textAlign: 'center',
        filter: 'drop-shadow(4px 8px 12px rgba(0,0,0,0.2))',
        animation: animated ? 'bounce 1.5s infinite' : 'none'
      }}
    >
      🐒
    </div>
  )
}