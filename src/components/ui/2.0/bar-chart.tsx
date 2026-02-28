'use client'

import { useEffect, useRef, useState } from 'react'

type ChartDataset = {
  id: string
  label: string
  color: string
  data: number[]
  valueFormat?: ValueFormat
}

type Bar = {
  x: number
  y: number
  width: number
  height: number
  value: number
  label: string
  dataset: ChartDataset
}

type ValueFormat =
  | { type: 'number' }
  | { type: 'compact' }
  | { type: 'currency'; currency: string; locale?: string }
  | { type: 'custom'; formatter: (v: number) => string }

type AxisColors = {
  grid: string
  labels: string
  axis: string
}

type Props = {
  labels: string[]
  datasets: ChartDataset[]

  animate?: boolean
  animationDuration?: number

  onSelect?: (
    bar: {
      label: string
      value: number
      dataset: ChartDataset
    } | null
  ) => void

  yAxisFormat?: ValueFormat
  axisColors?: AxisColors

  showDatasetMaxLines?: boolean

  showTrendLine?: boolean
  trendLineColor?: string
  trendLineWidth?: number
  trendLineOpacity?: number
  height?: number
  className?: string
}

export function BarChart({
  labels,
  datasets,
  animate = true,
  animationDuration = 700,
  onSelect,
  yAxisFormat = { type: 'number' },
  axisColors = {
    grid: '#e5e7eb',
    labels: '#6b7280',
    axis: '#111827',
  },
  showDatasetMaxLines = true,
  showTrendLine = false,
  trendLineColor = '#111827',
  trendLineWidth = 2,
  trendLineOpacity = 0.8,
  height = 360,
  className,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barsRef = useRef<Bar[]>([])
  const animationRef = useRef<number | null>(null)
  const animatedOnceRef = useRef(false)

  const selectable = typeof onSelect === 'function'

  const [width, setWidth] = useState(0)
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    bar: Bar
  } | null>(null)

  const padding = {
    top: 20,
    right: 40,
    bottom: 50,
    left: 70,
  }

  const gridLines = 5
  const maxValue = Math.max(...datasets.flatMap(d => d.data))

  function formatValue(value: number, format: ValueFormat) {
    switch (format.type) {
      case 'currency':
        return new Intl.NumberFormat(format.locale ?? 'en-US', {
          style: 'currency',
          currency: format.currency,
          maximumFractionDigits: 0,
        }).format(value)
      case 'compact':
        return new Intl.NumberFormat('en', {
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(value)
      case 'custom':
        return format.formatter(value)
      default:
        return String(Math.round(value))
    }
  }

  /* ---------------- Resize ---------------- */
  useEffect(() => {
    if (!wrapperRef.current) return

    const ro = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width)
    })

    ro.observe(wrapperRef.current)
    setWidth(wrapperRef.current.clientWidth)

    return () => ro.disconnect()
  }, [])

  /* ---------------- Draw ---------------- */
  function draw(progress = 1) {
    const canvas = canvasRef.current
    if (!canvas || !width) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    ctx.clearRect(0, 0, width, height)
    barsRef.current = []

    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    /* ---- Grid + Y axis ---- */
    ctx.strokeStyle = axisColors.grid
    ctx.fillStyle = axisColors.labels
    ctx.font = '14px sans-serif'

    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i
      const value = maxValue * (1 - i / gridLines)

      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillText(formatValue(value, yAxisFormat), padding.left - 10, y)
    }

    /* ---- X axis ---- */
    ctx.strokeStyle = axisColors.axis
    ctx.beginPath()
    ctx.moveTo(padding.left, height - padding.bottom)
    ctx.lineTo(width - padding.right, height - padding.bottom)
    ctx.stroke()

    const groupWidth = chartWidth / labels.length
    const barWidth = (groupWidth / datasets.length) * 0.7

    const barGap = (groupWidth - barWidth * datasets.length) / 2

    labels.forEach((label, i) => {
      const xCenter = padding.left + groupWidth * i + groupWidth / 2

      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = axisColors.labels
      ctx.fillText(label, xCenter, height - padding.bottom + 10)

      datasets.forEach((dataset, j) => {
        const value = dataset.data[i]
        const barHeight = (value / maxValue) * chartHeight * progress
        const x = padding.left + i * groupWidth + barGap + j * barWidth
        const y = padding.top + chartHeight - barHeight

        const dimmed =
          selectable &&
          selectedBar &&
          (selectedBar.label !== label || selectedBar.dataset.id !== dataset.id)

        ctx.globalAlpha = dimmed ? 0.35 : 1
        ctx.fillStyle = dataset.color
        ctx.fillRect(x, y, barWidth, barHeight)
        ctx.globalAlpha = 1

        barsRef.current.push({
          x,
          y,
          width: barWidth,
          height: barHeight,
          value,
          label,
          dataset,
        })
      })
    })

    /* ---- Dataset max dashed lines ---- */
    if (showDatasetMaxLines) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      datasets.forEach(dataset => {
        const max = Math.max(...dataset.data)
        const y = padding.top + chartHeight - (max / maxValue) * chartHeight

        ctx.strokeStyle = dataset.color
        ctx.lineWidth = 4
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(width - padding.right, y)

        ctx.stroke()
        ctx.setLineDash([])
      })
    }

    /* ---- Trend line (AVG) ---- */
    if (showTrendLine) {
      const avgPerIndex = labels.map((_, i) => {
        const sum = datasets.reduce((acc, d) => acc + (d.data[i] ?? 0), 0)
        return sum / datasets.length
      })

      ctx.save()
      ctx.globalAlpha = trendLineOpacity
      ctx.strokeStyle = trendLineColor
      ctx.lineWidth = trendLineWidth
      ctx.beginPath()

      // start at zero Y
      ctx.moveTo(padding.left, padding.top + chartHeight)

      avgPerIndex.forEach((v, i) => {
        const x = padding.left + groupWidth * i + groupWidth / 2
        const y = padding.top + chartHeight - (v / maxValue) * chartHeight

        ctx.quadraticCurveTo(x, y, x, y)
      })

      ctx.stroke()

      // circles
      avgPerIndex.forEach((v, i) => {
        const x = padding.left + groupWidth * i + groupWidth / 2
        const y = padding.top + chartHeight - (v / maxValue) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = trendLineColor
        ctx.fill()
      })

      ctx.restore()
    }
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
      animationRef.current && cancelAnimationFrame(animationRef.current)
    }
  }, [width, datasets, animate])

  /* ---------------- Selection redraw ---------------- */
  useEffect(() => {
    if (animatedOnceRef.current) draw(1)
  }, [selectedBar])

  /* ---------------- Hit test ---------------- */
  function getBar(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    return barsRef.current.find(
      b => x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height
    )
  }

  /* ---------------- Events ---------------- */
  function handleMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const bar = getBar(e)
    if (!bar) return setTooltip(null)
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      bar,
    })
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!selectable) return
    e.stopPropagation()
    const bar = getBar(e)
    if (!bar) return
    setSelectedBar(bar)
    onSelect?.({
      label: bar.label,
      value: bar.value,
      dataset: bar.dataset,
    })
  }

  useEffect(() => {
    if (!selectable) return

    function clear(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setSelectedBar(null)
        setTooltip(null)
        onSelect?.(null)
      }
    }

    document.addEventListener('mousedown', clear)
    return () => document.removeEventListener('mousedown', clear)
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
        onMouseMove={handleMove}
        onMouseLeave={() => setTooltip(null)}
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
          <p className="font-medium">{tooltip.bar.dataset.label}</p>
          <p className="text-muted-foreground">
            {tooltip.bar.label}:{' '}
            {tooltip.bar.dataset.valueFormat
              ? formatValue(tooltip.bar.value, tooltip.bar.dataset.valueFormat)
              : tooltip.bar.value}
          </p>
        </div>
      )}
    </div>
  )
}

// biome-ignore lint/complexity/noUselessLoneBlockStatements: <explanation>
{
  /* USAGE EXAMPLE */
}
;<BarChart
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  datasets={[
    {
      id: 'revenue',
      label: 'Revenue',
      color: '#22c55e',
      data: [120000, 165000, 142000, 190000, 210000, 245000],
    },
    {
      id: 'sales',
      label: 'Sales',
      color: '#3b82f6',
      data: [40020, 51000, 48000, 56000, 61000, 60090],
    },
  ]}
  /* ---- Axis formatting ---- */
  yAxisFormat={{
    type: 'currency',
    currency: 'USD',
    locale: 'en-US',
  }}
  axisColors={{
    grid: '#7e7f80',
    labels: '#ac942a',
    axis: '#111827',
  }}
  /* ---- Visual helpers ---- */
  showDatasetMaxLines={true}
  showTrendLine={true}
  trendLineColor="#cc434a"
  trendLineWidth={2.5}
  trendLineOpacity={0.8}
  /* ---- Interaction ---- */
  onSelect={bar => {
    if (!bar) return
    console.log(`${bar.dataset.label} • ${bar.label}: ${bar.value}`)
  }}
  animate
  animationDuration={800}
/>
