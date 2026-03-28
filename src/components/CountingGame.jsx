import React, { useState, useEffect } from 'react'
import Confetti from './Confetti'
import Button from './Button'

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

function getRandomBaobabs() {
  return randomBetween(5, 10)
}

export default function CountingGame({ onComplete }) {
  const [count, setCount] = useState(getRandomBaobabs())
  const [options, setOptions] = useState([])
  const [completed, setCompleted] = useState(false)
  const [message, setMessage] = useState('')
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameActive, setGameActive] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const generateOptions = (correct) => {
    let opts = new Set()
    opts.add(correct)
    while (opts.size < 4) {
      let rand = randomBetween(5, 10)
      opts.add(rand)
    }
    return Array.from(opts).sort(() => Math.random() - 0.5)
  }

  useEffect(() => {
    setOptions(generateOptions(count))
  }, [count])

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

  const handleAnswer = (selected) => {
    if (!gameActive || completed || modalOpen) return
    if (selected === count) {
      // Calcul du score
      const score = Math.round((timeLeft / 15) * 100)
      setFinalScore(score)
      setCompleted(true)
      setGameActive(false)
    } else {
      setMessage('❌ Essaie encore !')
      setTimeout(() => setMessage(''), 1000)
      const newCount = getRandomBaobabs()
      setCount(newCount)
    }
  }

  const resetGame = () => {
    setCount(getRandomBaobabs())
    setCompleted(false)
    setMessage('')
    setGameActive(true)
    setTimeLeft(15)
    setModalOpen(false)
  }

  const handleReturn = () => {
    onComplete(finalScore)
  }

  if (completed) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Confetti active={true} />
        <h2>🌟 Super ! Bao le petit baobab est content ! 🌟</h2>
        <Button onClick={handleReturn}>Retour à la carte</Button>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center' }}>
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
        <h2>Compte les baobabs 🌳</h2>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: timeLeft <= 5 ? 'red' : '#2D5A27' }}>
          ⏱️ {timeLeft}s
        </div>
      </div>

      <div style={{ fontSize: '3rem', display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0', flexWrap: 'wrap' }}>
        {[...Array(count)].map((_, i) => (
          <span key={i}>🌳</span>  // ← retour à l'emoji pour éviter les images manquantes
        ))}
      </div>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {options.map(opt => (
          <Button key={opt} onClick={() => handleAnswer(opt)} disabled={!gameActive || modalOpen}>
            {opt}
          </Button>
        ))}
      </div>

      {message && <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{message}</p>}
      <Button onClick={resetGame}>Nouvel essai</Button>
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