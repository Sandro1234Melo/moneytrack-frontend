'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

type ChartDataItem = {
  id: string
  label: string
  value: number
  color: string
}

type PieChartProps = {
  data: ChartDataItem[]
  innerRadius?: number
  sliceGap?: number
  animate?: boolean
  animationDuration?: number
  showPercentage?: boolean
  percentageColor?: string
  percentageMinSlice?: number
  onSelect?: (item: ChartDataItem | null) => void
  className?: string
}

type PieSlice = {
  startAngle: number
  endAngle: number
  item: ChartDataItem
}

export function PieChart({
  data,
  innerRadius = 0,
  sliceGap = 0.02, // Reduzido para um gap mais elegante
  animate = true,
  animationDuration = 700,
  showPercentage = false,
  percentageColor = '#ffffff',
  percentageMinSlice = 4,
  onSelect,
  className,
}: PieChartProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const slicesRef = useRef<PieSlice[]>([])
  const animationRef = useRef<number | null>(null)
  
  const [size, setSize] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; item: ChartDataItem } | null>(null)

  const selectable = typeof onSelect === 'function'
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0)

  // Memoizando o draw para evitar recriações desnecessárias
  const draw = useCallback((progress = 1) => {
    const canvas = canvasRef.current
    if (!canvas || size === 0 || total === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ajuste para telas Retina (High DPI)
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`

    ctx.clearRect(0, 0, size, size)
    slicesRef.current = []

    const cx = size / 2
    const cy = size / 2
    const radius = size / 2 - 10

    let currentAngle = -Math.PI / 2

    data.forEach((item) => {
      const ratio = item.value / total
      const sliceAngle = ratio * Math.PI * 2 * progress

      const startAngle = currentAngle
      const endAngle = currentAngle + sliceAngle

      const isDimmed = selectable && selectedId && selectedId !== item.id

      // --- Desenho da Fatia ---
      ctx.save() // Salva o estado para garantir que a cor não vaze
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      
      // Aplicamos o gap apenas se houver mais de uma fatia
      const gap = data.length > 1 ? sliceGap : 0
      ctx.arc(cx, cy, radius, startAngle + gap, endAngle - gap)
      
      ctx.closePath()
      
      ctx.globalAlpha = isDimmed ? 0.3 : 1
      ctx.fillStyle = item.color
      ctx.fill()
      ctx.restore() // Restaura o estado original

      // --- Labels de Porcentagem ---
      if (showPercentage && ratio * 100 >= percentageMinSlice && progress === 1) {
        ctx.save()
        const midAngle = startAngle + sliceAngle / 2
        const textRadius = innerRadius > 0 ? (innerRadius + radius) / 2 : radius * 0.7
        const tx = cx + Math.cos(midAngle) * textRadius
        const ty = cy + Math.sin(midAngle) * textRadius

        ctx.fillStyle = percentageColor
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${Math.round(ratio * 100)}%`, tx, ty)
        ctx.restore()
      }

      slicesRef.current.push({ startAngle, endAngle, item })
      currentAngle = endAngle
    })

    // --- Corte do Donut (Executado uma vez ao final para limpeza perfeita) ---
    if (innerRadius > 0) {
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }, [data, size, total, innerRadius, selectedId, selectable, sliceGap, showPercentage, percentageColor, percentageMinSlice])

  useEffect(() => {
    if (!wrapperRef.current) return
    const ro = new ResizeObserver(entries => {
      if (entries[0]) setSize(entries[0].contentRect.width)
    })
    ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!size || total === 0) return

    if (!animate) {
      draw(1)
      return
    }

    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / animationDuration, 1)
      
      draw(progress)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step)
      }
    }

    animationRef.current = requestAnimationFrame(step)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [data, size, animate, draw, animationDuration, total])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const dx = x - size / 2
    const dy = y - size / 2
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > size / 2 || dist < innerRadius) {
      setTooltip(null)
      return
    }

    let angle = Math.atan2(dy, dx)
    if (angle < -Math.PI / 2) angle += Math.PI * 2

    const slice = slicesRef.current.find(s => angle >= s.startAngle && angle <= s.endAngle)
    
    if (slice) {
      setTooltip({ x, y, item: slice.item })
    } else {
      setTooltip(null)
    }
  }

  return (
    <div 
      ref={wrapperRef} 
      className={`relative w-full flex items-center justify-center ${className ?? ''}`}
      style={{ minHeight: '300px' }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        onClick={() => {
          if (selectable && tooltip) {
            const newId = selectedId === tooltip.item.id ? null : tooltip.item.id
            setSelectedId(newId)
            onSelect?.(tooltip.item)
          }
        }}
        className={selectable ? 'cursor-pointer' : 'cursor-default'}
      />

      {tooltip && (
        <div
          className="absolute z-10 rounded-md bg-[#111827] px-3 py-2 text-xs text-white shadow-xl pointer-events-none border border-gray-700"
          style={{
            left: tooltip.x,
            top: tooltip.y - 15,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="font-bold border-b border-gray-600 mb-1 pb-1">{tooltip.item.label}</p>
          <p className="text-gray-300">Valor: <span className="text-white">{tooltip.item.value}</span></p>
        </div>
      )}
    </div>
  )
}