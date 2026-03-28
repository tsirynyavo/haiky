import React, { useState, useEffect } from 'react'
import GameMap from '../components/GameMap'
import ShadowGame from '../components/ShadowGame'
import CountingGame from '../components/CountingGame'
import LabyrinthGame from '../components/LabyrinthGame'
import HaikyCharacter from '../components/HaikyCharacter'

export default function Game({ stars, completeGame, onFinish, onScoreUpdate, scores }) {
  const [currentGame, setCurrentGame] = useState(null)

  const allComplete = () => Object.values(stars).every(v => v === true)

  useEffect(() => {
    if (allComplete()) {
      onFinish()
    }
  }, [stars, onFinish])

  const handleSelectRegion = (regionId) => {
    if (stars[regionId]) return
    setCurrentGame(regionId)
  }

  const handleGameComplete = (regionId, score) => {
    completeGame(regionId)
    if (onScoreUpdate) {
      onScoreUpdate(regionId, score)
    }
    setCurrentGame(null)
  }

  const renderGame = () => {
    switch (currentGame) {
      case 'andasibe':
        return <ShadowGame onComplete={(score) => handleGameComplete('andasibe', score)} />
      case 'baobabs':
        return <CountingGame onComplete={(score) => handleGameComplete('baobabs', score)} />
      case 'tsingy':
        return <LabyrinthGame onComplete={(score) => handleGameComplete('tsingy', score)} />
      default:
        return null
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <HaikyCharacter size={60} />
        <h2 style={{ color: '#2D5A27' }}>Aventure à Madagascar</h2>
        <div />
      </div>
      {currentGame ? (
        <div className="game-container">
          <button
            onClick={() => setCurrentGame(null)}
            style={{ background: '#aaa', marginBottom: '1rem' }}
          >
            ← Retour à la carte
          </button>
          {renderGame()}
        </div>
      ) : (
        <div className="game-container">
          <GameMap stars={stars} onSelectRegion={handleSelectRegion} />
        </div>
      )}
    </div>
  )
}