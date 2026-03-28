import React, { useState, useEffect } from 'react'
import Confetti from './Confetti'
import Button from './Button'

const SIZE = 5
const START = { row: 0, col: 0 }
const END = { row: SIZE - 1, col: SIZE - 1 }
const OBSTACLE_COUNT = 5

const generateObstacles = () => {
  const obstacles = []
  while (obstacles.length < OBSTACLE_COUNT) {
    const row = Math.floor(Math.random() * SIZE)
    const col = Math.floor(Math.random() * SIZE)
    if ((row === START.row && col === START.col) || (row === END.row && col === END.col)) continue
    if (!obstacles.some(obs => obs.row === row && obs.col === col)) {
      obstacles.push({ row, col })
    }
  }
  return obstacles
}

export default function LabyrinthGame({ onComplete }) {
  const [path, setPath] = useState([START])
  const [completed, setCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [gameActive, setGameActive] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [errorModal, setErrorModal] = useState({ open: false, message: '' })
  const [obstacles, setObstacles] = useState([])
  const [undoAvailable, setUndoAvailable] = useState(true)
  const [finalScore, setFinalScore] = useState(0)

  useEffect(() => {
    setObstacles(generateObstacles())
  }, [])

  useEffect(() => {
    const last = path[path.length - 1]
    if (last.row === END.row && last.col === END.col && !completed && gameActive) {
      const score = Math.round((timeLeft / 20) * 100)
      setFinalScore(score)
      setCompleted(true)
      setGameActive(false)
    }
  }, [path, completed, gameActive, timeLeft])

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

  const isAdjacent = (cell1, cell2) => {
    const dr = Math.abs(cell1.row - cell2.row)
    const dc = Math.abs(cell1.col - cell2.col)
    return (dr === 1 && dc === 0) || (dr === 0 && dc === 1)
  }

  const isObstacle = (row, col) => {
    return obstacles.some(obs => obs.row === row && obs.col === col)
  }

  const handleCellClick = (row, col) => {
    if (!gameActive || completed || modalOpen) return
    const last = path[path.length - 1]
    const clicked = { row, col }

    if (isObstacle(row, col)) {
      setErrorModal({ open: true, message: '⛰️ Un rocher bloque le passage !' })
      return
    }
    if (path.some(p => p.row === row && p.col === col)) return
    if (isAdjacent(last, clicked)) {
      setPath([...path, clicked])
      setUndoAvailable(true)
    } else {
      setErrorModal({ open: true, message: 'On avance case par case, tout droit ou à côté !' })
    }
  }

  const handleUndo = () => {
    if (!undoAvailable) {
      setErrorModal({ open: true, message: 'Tu ne peux revenir qu’une seule fois !' })
      return
    }
    if (path.length <= 1) {
      setErrorModal({ open: true, message: 'Tu es déjà au départ !' })
      return
    }
    const newPath = path.slice(0, -1)
    setPath(newPath)
    setUndoAvailable(false)
  }

  const resetGame = () => {
    setPath([START])
    setCompleted(false)
    setGameActive(true)
    setTimeLeft(20)
    setModalOpen(false)
    setErrorModal({ open: false, message: '' })
    setUndoAvailable(true)
    setObstacles(generateObstacles())
  }

  const handleReturn = () => {
    onComplete(finalScore)
  }

  if (completed) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Confetti active={true} />
        <h2>🎉 Bravo ! Ravo le gecko t'attend ! 🎉</h2>
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

      {errorModal.open && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{errorModal.message}</h2>
            <Button onClick={() => setErrorModal({ open: false, message: '' })}>Fermer</Button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Aide Haiky à rejoindre sa maison 🏠</h2>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: timeLeft <= 5 ? 'red' : '#2D5A27' }}>
          ⏱️ {timeLeft}s
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${SIZE}, 70px)`,
        gap: '5px',
        justifyContent: 'center',
        margin: '2rem auto',
        background: '#d9c8a9',
        padding: '1rem',
        borderRadius: '1rem'
      }}>
        {[...Array(SIZE)].map((_, row) =>
          [...Array(SIZE)].map((_, col) => {
            const isStart = row === START.row && col === START.col
            const isEnd = row === END.row && col === END.col
            const isPath = path.some(p => p.row === row && p.col === col)
            const obstacle = isObstacle(row, col)

            let bgColor = '#f2e8cf'
            if (obstacle) bgColor = '#b87c4f'
            else if (isPath) bgColor = '#6fbf4c'
            else if (isStart) bgColor = '#f4c542'
            else if (isEnd) bgColor = '#e8a735'

            let content = ''
            if (isStart) content = '🐒'
            else if (isEnd) content = '🏠'
            else if (obstacle) content = '⛰️'
            else if (isPath) content = '⭐'

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => handleCellClick(row, col)}
                style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: bgColor,
                  border: '2px solid #b46f2e',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  cursor: (obstacle || !gameActive || modalOpen) ? 'default' : 'pointer',
                  transition: '0.1s',
                  opacity: (obstacle || (!gameActive && !modalOpen)) ? 0.6 : 1
                }}
              >
                {content}
              </div>
            )
          })
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <Button onClick={resetGame}>Recommencer le chemin</Button>
        <Button onClick={handleUndo} disabled={!gameActive || completed || modalOpen}>
          ⬅️ Reculer {undoAvailable ? '(1 fois)' : '(0 fois)'}
        </Button>
      </div>
      <p style={{ marginTop: '1rem' }}>
        Clique sur les cases pour tracer le chemin jusqu'à la maison.<br />
        Évite les rochers ⛰️, avance case par case. Tu peux revenir en arrière une seule fois !
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