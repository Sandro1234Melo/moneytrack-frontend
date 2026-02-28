'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from "../../../lib/utils"

export type HeatMapNode = {
  id: string
  value: number
}

type Props = {
  data: HeatMapNode[]
  width?: number // if undefined → responsive
  height?: number
  className?: string

  /** Color range */
  fromColor?: string
  toColor?: string

  animate?: boolean

  format?: 'number' | 'currency'
  currency?: string
  locale?: string
}

type Cell = {
  x: number
  y: number
  w: number
  h: number
  node: HeatMapNode
}

/* ---------- Color utils ---------- */
const hexToRgb = (hex: string) => {
  const n = hex.replace('#', '')
  const bigint = Number.parseInt(n, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export default function HeatMap({
  data,
  width,
  height = 240,
  className,
  animate = true,
  fromColor = '#fecaca',
  toColor = '#86efac',
  format = 'number',
  currency = 'USD',
  locale = 'en-US',
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cellsRef = useRef<Cell[]>([])
  const [measuredWidth, setMeasuredWidth] = useState<number>(width ?? 0)

  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    node: HeatMapNode
  } | null>(null)

  /* ---------- Responsive width ---------- */
  useEffect(() => {
    if (width) {
      setMeasuredWidth(width)
      return
    }

    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width
      setMeasuredWidth(Math.floor(w))
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [width])

  /* ---------- Formatter ---------- */
  const formatter = new Intl.NumberFormat(locale, {
    style: format === 'currency' ? 'currency' : 'decimal',
    currency,
    maximumFractionDigits: 0,
  })

  useEffect(() => {
    if (!measuredWidth || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = measuredWidth * dpr
    canvas.height = height * dpr
    canvas.style.width = `${measuredWidth}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const total = data.reduce((s, d) => s + d.value, 0)
    const max = Math.max(...data.map(d => d.value))

    /* ---------- Color interpolation ---------- */
    const c1 = hexToRgb(fromColor)
    const c2 = hexToRgb(toColor)

    const colorFor = (v: number) => {
      const t = max === 0 ? 0 : v / max
      return `rgb(
        ${Math.round(lerp(c1.r, c2.r, t))},
        ${Math.round(lerp(c1.g, c2.g, t))},
        ${Math.round(lerp(c1.b, c2.b, t))}
      )`
    }

    /* ---------- Compute target areas ---------- */
    const nodes = [...data]
      .sort((a, b) => b.value - a.value)
      .map(d => ({
        ...d,
        area: (d.value / total) * measuredWidth * height,
      }))

    /* ---------- Square packing ---------- */
    const cells: Cell[] = []

    const x = 0
    let y = 0
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let row: any[] = []
    let rowArea = 0

    const targetRowHeight = Math.sqrt((measuredWidth * height) / nodes.length)

    const flushRow = (isLast = false) => {
      if (!row.length) return

      const rowHeight = isLast ? height - y : rowArea / measuredWidth

      let cx = 0
      // biome-ignore lint/complexity/noForEach: <explanation>
      row.forEach(n => {
        const w = n.area / rowHeight
        cells.push({
          x: cx,
          y,
          w,
          h: rowHeight,
          node: n,
        })
        cx += w
      })

      y += rowHeight
      row = []
      rowArea = 0
    }

    // biome-ignore lint/complexity/noForEach: <explanation>
    nodes.forEach(n => {
      row.push(n)
      rowArea += n.area

      if (rowArea / measuredWidth >= targetRowHeight) {
        flushRow(false)
      }
    })

    flushRow(true)
    cellsRef.current = cells

    /* ---------- Render / animate ---------- */
    let t = animate ? 0 : 1

    const draw = () => {
      ctx.clearRect(0, 0, measuredWidth, height)
      const ease = animate ? t * t * (3 - 2 * t) : 1

      // biome-ignore lint/complexity/noForEach: <explanation>
      cells.forEach(c => {
        const cx = c.x + c.w / 2
        const cy = c.y + c.h / 2

        ctx.fillStyle = colorFor(c.node.value)
        ctx.fillRect(
          cx - (c.w * ease) / 2,
          cy - (c.h * ease) / 2,
          c.w * ease,
          c.h * ease
        )

        if (!animate || ease > 0.6) {
          ctx.fillStyle = '#FFF'
          ctx.font = '600 12px system-ui'
          ctx.textBaseline = 'top'

          const pad = 6
          ctx.fillText(c.node.id, c.x + pad, c.y + pad)
          ctx.font = '11px system-ui'
          ctx.fillText(
            formatter.format(c.node.value),
            c.x + pad,
            c.y + pad + 16
          )
        }
      })

      if (animate && t < 0.995) {
        t += (1 - t) * 0.12
        requestAnimationFrame(draw)
      }
    }

    draw()
  }, [
    data,
    measuredWidth,
    height,
    fromColor,
    toColor,
    animate,
    format,
    currency,
    locale,
  ])

  /* ---------- Tooltip ---------- */
  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const b = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - b.left
    const y = e.clientY - b.top

    const hit = cellsRef.current.find(
      c => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h
    )

    setTooltip(hit ? { x: x + 12, y: y + 12, node: hit.node } : null)
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      style={{ height }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setTooltip(null)}
        style={{ borderRadius: 10 }}
      />

      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-md bg-[#111827] px-2 py-1 text-xs text-white shadow"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-medium">{tooltip.node.id}</div>
          <div className="text-[#A3A3A3]">
            {formatter.format(tooltip.node.value)}
          </div>
        </div>
      )}
    </div>
  )
}
