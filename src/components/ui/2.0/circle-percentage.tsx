'use client'

import { useEffect, useRef } from 'react'
import { cn } from "../../../lib/utils"

type Props = {
  percentage: number // 0–100
  size?: number
  borderWidth?: number
  gap?: number
  fillThickness?: number
  className?: string
}

export default function CirclePercentage({
  percentage,
  size = 220,
  borderWidth = 14,
  gap = 10,
  fillThickness = 24,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2

    const outerRadius = cx - borderWidth / 2
    const fillRadius = outerRadius - borderWidth / 2 - gap - fillThickness / 2

    const startAngle = -Math.PI / 2
    const targetAngle =
      (Math.PI * 2 * Math.min(Math.max(percentage, 0), 100)) / 100

    /* ---------- Gradient ---------- */
    const grad = ctx.createLinearGradient(0, 0, size, 0)
    grad.addColorStop(0.0, 'rgb(170,232,238)')
    grad.addColorStop(0.15, 'rgb(81,185,203)')
    grad.addColorStop(0.27, 'rgb(57,172,194)')
    grad.addColorStop(0.5, 'rgb(170,232,238)')
    grad.addColorStop(0.79, 'rgb(156,141,238)')
    grad.addColorStop(0.94, 'rgb(190,131,253)')

    /* ---------- Static Base ---------- */
    ctx.clearRect(0, 0, size, size)

    // Inner skeleton ring (instant)
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = fillThickness
    ctx.lineCap = 'butt'
    ctx.arc(cx, cy, fillRadius, 0, Math.PI * 2)
    ctx.stroke()

    /* ---------- Animated Fill ---------- */
    let currentAngle = 0

    const animate = () => {
      ctx.clearRect(0, 0, size, size)

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = fillThickness
      ctx.arc(cx, cy, fillRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Filled percentage (squared edges)
      ctx.beginPath()
      ctx.strokeStyle = grad
      ctx.lineWidth = fillThickness
      ctx.lineCap = 'butt'
      ctx.arc(cx, cy, fillRadius, startAngle, startAngle + currentAngle)
      ctx.stroke()

      currentAngle += (targetAngle - currentAngle) * 0.12

      if (Math.abs(targetAngle - currentAngle) > 0.002) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [percentage, size, borderWidth, gap, fillThickness])

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <canvas ref={canvasRef} />
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-semibold text-white">
          {Math.round(percentage)}%
        </span>
        <span className="text-xs text-[#A3A3A3]">match</span>
      </div>
    </div>
  )
}
