import React from 'react'
import Button from '../components/Button'
import HaikyCharacter from '../components/HaikyCharacter'

export default function Result({ onRestart, scores }) {
  const totalScore = scores.andasibe + scores.baobabs + scores.tsingy
  const maxScore = 300 // 3 jeux * 100 points max

  return (
    <div style={{ textAlign: 'center' }}>
      <HaikyCharacter size={120} animated />
      <h1 style={{ fontSize: '3rem', color: '#D97A2B' }}>🎉 Victoire ! 🎉</h1>
      <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>
        Haiky a retrouvé tous ses amis !
      </p>
      <div style={{ fontSize: '2rem', margin: '1rem' }}>
        🌟 Ton score : {totalScore} / {maxScore} 🌟
      </div>
      <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        <div>Forêt d'Andasibe : {scores.andasibe} points</div>
        <div>Allée des baobabs : {scores.baobabs} points</div>
        <div>Tsingy : {scores.tsingy} points</div>
      </div>
      <Button onClick={onRestart}>Rejouer</Button>
    </div>
  )
}