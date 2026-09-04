import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const savedAccentColor = localStorage.getItem('moneytrack-accent-color')
if (savedAccentColor) {
  const presetAccents: Record<string, { solid: string; soft: string }> = {
    purple: { solid: '#7c3aed', soft: '#2563eb' },
    blue: { solid: '#2563eb', soft: '#0ea5e9' },
    green: { solid: '#16a34a', soft: '#22c55e' },
    orange: { solid: '#ea580c', soft: '#f97316' },
  }
  const customColor = /^#[0-9a-f]{6}$/i.test(savedAccentColor)
  const accent = customColor ? { solid: savedAccentColor, soft: savedAccentColor } : presetAccents[savedAccentColor] ?? presetAccents.purple
  document.documentElement.dataset.accentColor = customColor ? 'custom' : savedAccentColor
  document.documentElement.style.setProperty('--app-accent', accent.solid)
  document.documentElement.style.setProperty('--app-accent-soft', accent.soft)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
