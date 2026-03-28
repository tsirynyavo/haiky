import { useState, useEffect } from 'react'
import regions from '../data/regions'

const STORAGE_KEY = 'haiky_progress'

export default function useGameProgress() {
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
    const initial = {}
    regions.forEach(r => { initial[r.id] = false })
    return initial
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stars))
  }, [stars])

  const completeGame = (regionId) => {
    if (stars[regionId]) return
    setStars(prev => ({ ...prev, [regionId]: true }))
  }

  const isComplete = () => {
    return Object.values(stars).every(v => v === true)
  }

  const resetProgress = () => {
    const initial = {}
    regions.forEach(r => { initial[r.id] = false })
    setStars(initial)
  }

  return { stars, completeGame, isComplete, resetProgress }
}