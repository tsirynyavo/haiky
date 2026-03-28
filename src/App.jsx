import { useState } from 'react'
import Home from './pages/Home'
import Game from './pages/Game'
import Result from './pages/Result'
import useGameProgress from './hooks/useGameProgress'

function App() {
  const [screen, setScreen] = useState('home')
  const { stars, completeGame, resetProgress, isComplete } = useGameProgress()
  const [scores, setScores] = useState({ andasibe: 0, baobabs: 0, tsingy: 0 })

  const handleStart = () => {
    resetProgress()
    setScores({ andasibe: 0, baobabs: 0, tsingy: 0 })
    setScreen('game')
  }

  const handleFinish = () => {
    setScreen('result')
  }

  const handleRestart = () => {
    resetProgress()
    setScores({ andasibe: 0, baobabs: 0, tsingy: 0 })
    setScreen('home')
  }

  const handleScoreUpdate = (regionId, score) => {
    setScores(prev => ({ ...prev, [regionId]: score }))
  }

  return (
    <div className="app">
      {screen === 'home' && <Home onStart={handleStart} />}
      {screen === 'game' && (
        <Game
          stars={stars}
          completeGame={completeGame}
          onFinish={handleFinish}
          scores={scores}
          onScoreUpdate={handleScoreUpdate}
        />
      )}
      {screen === 'result' && (
        <Result
          onRestart={handleRestart}
          scores={scores}
        />
      )}
    </div>
  )
}

export default App