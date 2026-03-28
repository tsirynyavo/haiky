import React from 'react'
import Button from '../components/Button'
import HaikyCharacter from '../components/HaikyCharacter'

export default function Home({ onStart }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <HaikyCharacter size={100} animated />
      <h1 style={{ fontSize: '3rem', color: '#2D5A27', margin: '0.5rem 0' }}>
        Haiky 🐒
      </h1>
      <p style={{ fontSize: '1.3rem', maxWidth: '600px', margin: '1rem auto' }}>
        Haiky le petit lémurien a perdu ses amis dans les trois plus belles régions de Madagascar.
        Aide‑le à les retrouver et à gagner trois étoiles magiques !
      </p>
      <Button onClick={onStart} style={{ marginTop: '2rem' }}>
        Commencer l'aventure
      </Button>
    </div>
  )
}