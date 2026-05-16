'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from "../../../lib/utils"

type Props = {
  percentage: number // 0–100
  size?: number
  borderWidth?: number
  padding?: number
  className?: string
}

export default function RadialPie({
  percentage,
  size = 220,
  borderWidth = 14,
  padding = 14,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

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
    const innerRadius = outerRadius - borderWidth - padding

    const startAngle = -Math.PI / 2
    const clamped = Math.min(Math.max(percentage, 0), 100)
    const targetAngle = (Math.PI * 2 * clamped) / 100

    /* ---------- Gradient ---------- */
    const grad = ctx.createLinearGradient(0, 0, size, 0)
    grad.addColorStop(0.0, 'rgb(170,232,238)')
    grad.addColorStop(0.15, 'rgb(81,185,203)')
    grad.addColorStop(0.27, 'rgb(57,172,194)')
    grad.addColorStop(0.5, 'rgb(170,232,238)')
    grad.addColorStop(0.79, 'rgb(156,141,238)')
    grad.addColorStop(0.94, 'rgb(190,131,253)')

    let currentAngle = 0

    const animate = () => {
      ctx.clearRect(0, 0, size, size)

      // Outer border
      ctx.beginPath()
      ctx.strokeStyle = grad
      ctx.lineWidth = borderWidth
      ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Inner skeleton
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2)
      ctx.fill()

      // Filled sector
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.fillStyle = grad
      ctx.arc(cx, cy, innerRadius, startAngle, startAngle + currentAngle, false)
      ctx.closePath()
      ctx.fill()

      currentAngle += (targetAngle - currentAngle) * 0.12

      if (Math.abs(targetAngle - currentAngle) > 0.002) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)

    /* ---------- Hover (Any Area) ---------- */
    wrapper.onmousemove = e => {
      const rect = wrapper.getBoundingClientRect()
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    wrapper.onmouseleave = () => setTooltip(null)
  }, [percentage, size, borderWidth, padding])

  return (
    <div
      ref={wrapperRef}
      className={cn('relative flex items-center justify-center', className)}
    >
      <canvas ref={canvasRef} />

      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-md bg-black/80 px-2 py-1 text-xs text-white"
          style={{
            left: tooltip.x,
            top: tooltip.y - 28,
            transform: 'translateX(-50%)',
          }}
        >
          {percentage}%
        </div>
      )}
    </div>
  )
}
