import React from 'react'
import StarRating from './StarRating'
import regions from '../data/regions'

export default function GameMap({ stars, onSelectRegion }) {
  const starCount = (regionId) => stars[regionId] ? 1 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ textAlign: 'center', color: '#2D5A27' }}>
        Choisis une région pour aider Haiky 🐒
      </h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '2rem'
      }}>
        {regions.map(region => (
          <div
            key={region.id}
            onClick={() => onSelectRegion(region.id)}
            style={{
              background: '#fdf8e7',
              borderRadius: '2rem',
              padding: '1rem',
              width: '200px',
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              textAlign: 'center',
              border: stars[region.id] ? '3px solid gold' : 'none'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '3rem' }}>{region.icon}</div>
            <h3>{region.name}</h3>
            <StarRating stars={starCount(region.id)} maxStars={1} />
          </div>
        ))}
      </div>
    </div>
  )
}