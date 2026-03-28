import React from 'react'

export default function StarRating({ stars, maxStars = 3 }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '2rem' }}>
      {[...Array(maxStars)].map((_, i) => (
        <span key={i} style={{ color: i < stars ? '#ffc107' : '#e4e5e9' }}>
          {i < stars ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}