import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

export default function Confetti({ active }) {
  const triggered = useRef(false)

  useEffect(() => {
    if (active && !triggered.current) {
      triggered.current = true
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        startVelocity: 15,
        colors: ['#2D5A27', '#D97A2B', '#3A6EA5', '#F4C542']
      })
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5, x: 0.3 },
          startVelocity: 20,
        })
      }, 150)
    }
  }, [active])

  return null
}