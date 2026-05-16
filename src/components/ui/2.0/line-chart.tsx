'use client'

import { cn } from "../../../lib/utils"
import { useEffect, useRef, useState } from 'react'

/* =======================
   Types
======================= */

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

type LineStyle = 'straight' | 'curved'
type AnimationStyle = 'linear' | 'ease' | 'bounce'

type LineDataset = {
  id: string
  label: string
  color: string
  data: number[]
  showArea?: boolean
  showDots?: boolean
  valueFormat?: ValueFormat
}

type Props = {
  labels: string[]
  datasets: LineDataset[]
  height?: number
  animate?: boolean
  animationDuration?: number
  animationStyle?: AnimationStyle
  lineStyle?: LineStyle
  axisColors?: AxisColors
  yAxisFormat?: ValueFormat
  className?: string
}

/* =======================
   Helpers
======================= */

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

function easeOut(t: number) {
  // biome-ignore lint/style/useExponentiationOperator: <explanation>
  return 1 - Math.pow(1 - t, 3)
}

function bounceOut(t: number) {
  const n1 = 7.5625
  const d1 = 2.75
  let x = t

  if (x < 1 / d1) return n1 * x * x
  if (x < 2 / d1) {
    x -= 1.5 / d1
    return n1 * x * x + 0.75
  }
  if (x < 2.5 / d1) {
    x -= 2.25 / d1
    return n1 * x * x + 0.9375
  }
  x -= 2.625 / d1
  return n1 * x * x + 0.984375
}

/* ---- Smooth curve (Catmull–Rom → Bezier) ---- */
function drawSmoothLine(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[]
) {
  if (points.length < 2) return

  ctx.moveTo(points[0].x, points[0].y)

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6

    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
  }
}

/* =======================
   Component
======================= */

export function LineChart({
  labels,
  datasets,
  height = 320,
  animate = true,
  animationDuration = 700,
  animationStyle = 'ease',
  lineStyle = 'curved',
  axisColors = {
    grid: '#e5e7eb',
    labels: '#6b7280',
    axis: '#111827',
  },
  yAxisFormat = { type: 'number' },
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [width, setWidth] = useState(0)
  const [tooltip, setTooltip] = useState<{ index: number } | null>(null)

  const padding = { top: 20, right: 40, bottom: 50, left: 70 }
  const maxValue = Math.max(...datasets.flatMap(d => d.data))
  const gridLines = 5

  /* ---------- Resize ---------- */
  useEffect(() => {
    if (!wrapperRef.current) return
    const ro = new ResizeObserver(entries =>
      setWidth(entries[0].contentRect.width)
    )
    ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [])

  /* ---------- Draw ---------- */
  function draw(progress = 1) {
    const canvas = canvasRef.current
    if (!canvas || !width) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height
    ctx.clearRect(0, 0, width, height)

    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const stepX = chartWidth / Math.max(labels.length - 1, 1)

    const xProgress = progress
    let yProgress = progress
    if (animationStyle === 'ease') yProgress = easeOut(progress)
    if (animationStyle === 'bounce') yProgress = bounceOut(progress)

    /* ---- Grid + Y axis ---- */
    ctx.strokeStyle = axisColors.grid
    ctx.fillStyle = axisColors.labels
    ctx.font = '13px system-ui'

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

    labels.forEach((l, i) => {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = axisColors.labels
      ctx.fillText(l, padding.left + stepX * i, height - padding.bottom + 10)
    })

    /* ---- X reveal clip ---- */
    const revealX = padding.left + chartWidth * xProgress
    ctx.save()
    ctx.beginPath()
    ctx.rect(padding.left, 0, revealX - padding.left, height)
    ctx.clip()

    /* ---- Lines ---- */
    // biome-ignore lint/complexity/noForEach: <explanation>
    datasets.forEach(dataset => {
      const points = dataset.data.map((v, i) => ({
        x: padding.left + stepX * i,
        y: padding.top + chartHeight - (v / maxValue) * chartHeight * yProgress,
      }))

      ctx.beginPath()
      lineStyle === 'straight'
        ? points.forEach((p, i) =>
            i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
          )
        : drawSmoothLine(ctx, points)

      if (dataset.showArea) {
        ctx.save()
        ctx.lineTo(
          padding.left + stepX * (points.length - 1),
          padding.top + chartHeight
        )
        ctx.lineTo(padding.left, padding.top + chartHeight)
        ctx.closePath()

        const gradient = ctx.createLinearGradient(
          0,
          padding.top,
          0,
          padding.top + chartHeight
        )
        gradient.addColorStop(0, `${dataset.color}55`)
        gradient.addColorStop(1, `${dataset.color}00`)
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.restore()

        ctx.beginPath()
        lineStyle === 'straight'
          ? points.forEach((p, i) =>
              i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
            )
          : drawSmoothLine(ctx, points)
      }

      ctx.strokeStyle = dataset.color
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()

      if (dataset.showDots) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        points.forEach(p => {
          if (p.x <= revealX) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
            ctx.fillStyle = dataset.color
            ctx.fill()
          }
        })
      }
    })

    ctx.restore()

    /* ---- Tooltip vertical line ---- */
    if (tooltip) {
      const x = padding.left + stepX * tooltip.index
      ctx.strokeStyle = '#9ca3af'
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, height - padding.bottom)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  /* ---------- Animation ---------- */
  useEffect(() => {
    if (!width) return
    if (!animate) {
      draw(1)
      return
    }

    let start = 0
    const frame = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / animationDuration, 1)
      draw(p)
      if (p < 1) requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
  }, [width, datasets])

  /* ---------- Events ---------- */
  function handleMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const index = Math.round(
      (x - padding.left) /
        ((width - padding.left - padding.right) /
          Math.max(labels.length - 1, 1))
    )

    if (index >= 0 && index < labels.length) setTooltip({ index })
    else setTooltip(null)
  }

  return (
    <div ref={wrapperRef} className={cn('relative w-full', className)}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setTooltip(null)}
      />

      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-md bg-black/80 px-3 py-2 text-xs text-white"
          style={{
            left:
              padding.left +
              ((width - padding.left - padding.right) /
                Math.max(labels.length - 1, 1)) *
                tooltip.index,
            top: 8,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="mb-1 font-medium">{labels[tooltip.index]}</div>
          {datasets.map(d => (
            <div
              key={d.id}
              style={{ color: d.color, filter: 'brightness(1.55)' }}
            >
              {d.label}:{' '}
              {d.valueFormat
                ? formatValue(d.data[tooltip.index], d.valueFormat)
                : d.data[tooltip.index]}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// biome-ignore lint/complexity/noUselessLoneBlockStatements: <explanation>
{
  /* USAGE EXAMPLE*/
}
;<LineChart
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  height={360}
  animationDuration={900}
  animationStyle="ease"
  datasets={[
    {
      id: 'revenue',
      label: 'Revenue',
      color: '#3b82f6',
      data: [12000, 15000, 14000, 18000, 21000, 24000],
      showArea: true,
      showDots: true,
      valueFormat: { type: 'currency', currency: 'USD' },
    },
    {
      id: 'orders',
      label: 'Orders',
      color: '#22c55e',
      data: [300, 420, 380, 510, 610, 720],
      showDots: true,
      valueFormat: { type: 'compact' },
    },
  ]}
/>
