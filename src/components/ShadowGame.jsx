import React, { useState, useEffect } from 'react'
import animals from '../data/animals'
import Confetti from './Confetti'
import Button from './Button'

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function ShadowGame({ onComplete }) {
  const [matched, setMatched] = useState({})
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [shuffledShadows, setShuffledShadows] = useState([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const shuffleShadows = () => {
    const shadowIds = animals.map(animal => animal.id)
    setShuffledShadows(shuffleArray(shadowIds))
  }

  const resetGame = () => {
    setMatched({})
    setSelectedAnimal(null)
    setCompleted(false)
    setGameActive(true)
    setTimeLeft(30)
    setModalOpen(false)
    shuffleShadows()
  }

  useEffect(() => {
    shuffleShadows()
  }, [])

  useEffect(() => {
    if (!gameActive || completed) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameActive(false)
          setModalOpen(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameActive, completed])

  useEffect(() => {
    if (Object.keys(matched).length === animals.length && !completed && gameActive) {
      const score = Math.round((timeLeft / 30) * 100)
      setFinalScore(score)
      setCompleted(true)
      setGameActive(false)
    }
  }, [matched, completed, gameActive, timeLeft])

  const handleAnimalClick = (animalId) => {
    if (matched[animalId] || !gameActive) return
    setSelectedAnimal(animalId)
  }

  const handleShadowClick = (shadowAnimalId) => {
    if (!selectedAnimal || matched[shadowAnimalId] || !gameActive) return
    if (selectedAnimal === shadowAnimalId) {
      setMatched(prev => ({ ...prev, [shadowAnimalId]: true }))
    }
    setSelectedAnimal(null)
  }

  const handleReturn = () => {
    onComplete(finalScore)
  }

  if (completed) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Confetti active={true} />
        <h2>🎉 Bravo ! Tu as retrouvé Fano le caméléon ! 🎉</h2>
        <Button onClick={handleReturn}>Retour à la carte</Button>
      </div>
    )
  }

  return (
    <div>
      {modalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏰ Temps écoulé !</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              Il faut être plus rapide !<br />
              Veux‑tu recommencer ?
            </p>
            <Button onClick={resetGame}>Recommencer</Button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Associe chaque animal à son ombre 🌿</h2>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: timeLeft <= 5 ? 'red' : '#2D5A27' }}>
          ⏱️ {timeLeft}s
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
        <div>
          <h3>Les animaux</h3>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {animals.map(animal => (
              <div
                key={animal.id}
                onClick={() => handleAnimalClick(animal.id)}
                style={{
                  background: matched[animal.id] ? '#c8e6c9' : '#f0f0f0',
                  padding: '1rem',
                  borderRadius: '1rem',
                  cursor: (matched[animal.id] || !gameActive) ? 'default' : 'pointer',
                  border: selectedAnimal === animal.id ? '4px solid #ff9800' : 'none',
                  opacity: matched[animal.id] ? 0.6 : 1,
                  fontSize: '3rem',
                  textAlign: 'center'
                }}
              >
                {animal.emoji}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3>Les ombres</h3>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {shuffledShadows.map(shadowAnimalId => {
              const animal = animals.find(a => a.id === shadowAnimalId)
              return (
                <div
                  key={shadowAnimalId}
                  onClick={() => handleShadowClick(shadowAnimalId)}
                  style={{
                    background: '#ddd',
                    padding: '1rem',
                    borderRadius: '1rem',
                    cursor: (matched[shadowAnimalId] || !gameActive) ? 'default' : 'pointer',
                    fontSize: '3rem',
                    textAlign: 'center',
                    filter: 'grayscale(100%) brightness(0.6)',
                    opacity: matched[shadowAnimalId] ? 0.4 : 1
                  }}
                >
                  {animal.emoji}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Button onClick={resetGame}>Recommencer</Button>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
        {selectedAnimal ? 'Clique sur son ombre' : 'Clique d’abord sur un animal'}
      </p>
    </div>
  )
}

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
}

const modalContentStyle = {
  backgroundColor: 'white',
  borderRadius: '2rem',
  padding: '2rem',
  textAlign: 'center',
  maxWidth: '400px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
}