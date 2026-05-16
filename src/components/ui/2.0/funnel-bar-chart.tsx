'use client'

import { useEffect, useRef, useState } from 'react'

type ChartDataItem = {
  id: string
  label: string
  value: number
}

type Bar = {
  x: number
  y: number
  width: number
  height: number
  item: ChartDataItem
}

type ValueFormat =
  | { type: 'number' }
  | { type: 'compact' }
  | { type: 'currency'; currency: string; locale?: string }
  | { type: 'custom'; formatter: (v: number) => string }

type LabelColors = {
  label: string
  value: string
}

type FunnelBarChartProps = {
  data: ChartDataItem[]
  color: string

  barHeight?: number
  gap?: number
  animate?: boolean
  animationDuration?: number

  valueFormat?: ValueFormat
  labelColors?: LabelColors

  onSelect?: (item: ChartDataItem | null) => void
  className?: string
}

export function FunnelBarChart({
  data,
  color,
  barHeight = 28,
  gap = 14,
  animate = true,
  animationDuration = 700,
  valueFormat = { type: 'number' },
  labelColors = {
    label: '#111827',
    value: '#111827',
  },
  onSelect,
  className,
}: FunnelBarChartProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barsRef = useRef<Bar[]>([])
  const animationRef = useRef<number | null>(null)
  const animatedOnceRef = useRef(false)

  const selectable = typeof onSelect === 'function'

  const [width, setWidth] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    item: ChartDataItem
  } | null>(null)

  const maxValue = Math.max(...data.map(d => d.value))
  const leftPadding = 130
  const rightPadding = 60

  const height = data.length * barHeight + (data.length - 1) * gap + 20

  /* ---------------- Value formatter ---------------- */
  function formatValue(value: number) {
    switch (valueFormat.type) {
      case 'currency':
        return new Intl.NumberFormat(valueFormat.locale ?? 'en-US', {
          style: 'currency',
          currency: valueFormat.currency,
          maximumFractionDigits: 0,
        }).format(value)
      case 'compact':
        return new Intl.NumberFormat('en', {
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(value)
      case 'custom':
        return valueFormat.formatter(value)
      default:
        return String(value)
    }
  }

  /* ---------------- Resize ---------------- */
  useEffect(() => {
    if (!wrapperRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width)
    })

    resizeObserver.observe(wrapperRef.current)
    setWidth(wrapperRef.current.clientWidth)

    return () => resizeObserver.disconnect()
  }, [])

  /* ---------------- Draw ---------------- */
  function draw(progress = 1) {
    const canvas = canvasRef.current
    if (!canvas || width === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    ctx.clearRect(0, 0, width, height)
    barsRef.current = []

    ctx.font = '14px sans-serif'
    ctx.textBaseline = 'middle'

    data.forEach((item, index) => {
      const valueRatio = item.value / maxValue
      const baseWidth =
        (width - leftPadding - rightPadding) * valueRatio * progress

      const funnelScale = 1 - index * 0.06
      const barWidth = baseWidth * funnelScale

      const x = leftPadding
      const y = index * (barHeight + gap) + 10

      const isDimmed = selectable && selectedId && selectedId !== item.id
      const baseOpacity = Math.max(1 - index * 0.12, 0.25)

      ctx.globalAlpha = baseOpacity * (isDimmed ? 0.35 : 1)
      ctx.fillStyle = color

      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 6)
      ctx.fill()
      ctx.globalAlpha = 1

      // Label (left)
      ctx.fillStyle = labelColors.label
      ctx.textAlign = 'left'
      ctx.fillText(item.label, 10, y + barHeight / 2)

      // Value (right)
      ctx.fillStyle = labelColors.value
      ctx.textAlign = 'right'
      ctx.fillText(formatValue(item.value), width - 10, y + barHeight / 2)

      barsRef.current.push({
        x,
        y,
        width: barWidth,
        height: barHeight,
        item,
      })
    })
  }

  /* ---------------- Animation ---------------- */
  useEffect(() => {
    if (!width) return

    animatedOnceRef.current = false

    if (!animate) {
      draw(1)
      animatedOnceRef.current = true
      return
    }

    let start = 0
    function animateBars(ts: number) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / animationDuration, 1)
      draw(progress)
      if (progress < 1)
        animationRef.current = requestAnimationFrame(animateBars)
      else animatedOnceRef.current = true
    }

    animationRef.current = requestAnimationFrame(animateBars)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [data, width, animate])

  /* ---------------- Redraw on selection ---------------- */
  useEffect(() => {
    if (animatedOnceRef.current) draw(1)
  }, [selectedId])

  /* ---------------- Hit testing ---------------- */
  function getBarFromEvent(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const bar =
      barsRef.current.find(
        b => x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height
      ) ?? null

    return { bar, x, y }
  }

  /* ---------------- Events ---------------- */
  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const { bar, x, y } = getBarFromEvent(e)
    if (!bar) return setTooltip(null)
    setTooltip({ x, y, item: bar.item })
  }

  function handleMouseLeave() {
    setTooltip(null)
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!selectable) return
    e.stopPropagation()

    const { bar } = getBarFromEvent(e)
    if (!bar) return

    setSelectedId(bar.item.id)
    onSelect?.(bar.item)
  }

  /* ---------------- Click outside ---------------- */
  useEffect(() => {
    if (!selectable) return

    function handleOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setSelectedId(null)
        setTooltip(null)
        onSelect?.(null)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [selectable, onSelect])

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${className ?? ''}`}
      style={{ height }}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={selectable ? 'cursor-pointer' : 'cursor-default'}
      />

      {tooltip && (
        <div
          className="absolute z-10 rounded-md bg-popover bg-[#111827] px-2 py-1 text-xs text-white shadow-md pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="font-medium">{tooltip.item.label}</p>
          <p className="text-muted-foreground">
            {formatValue(tooltip.item.value)}
          </p>
        </div>
      )}
    </div>
  )
}
