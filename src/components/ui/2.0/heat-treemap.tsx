'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from "../../../lib/utils"

export type HeatTreemapNode = {
  id: string
  value: number
}

type Props = {
  data: HeatTreemapNode[]
  width?: number // if undefined → responsive
  height?: number
  className?: string

  /** Color range */
  fromColor?: string
  toColor?: string

  /** Value formatting */
  format?: 'number' | 'currency'
  currency?: string
  locale?: string

  /** Mount animation */
  animate?: boolean
}

type Rect = {
  x: number
  y: number
  w: number
  h: number
  node: HeatTreemapNode
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

export default function HeatTreemap({
  data,
  width,
  height = 240,
  className,
  fromColor = '#fecaca',
  toColor = '#86efac',
  format = 'number',
  currency = 'USD',
  locale = 'en-US',
  animate = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rectsRef = useRef<Rect[]>([])
  const [measuredWidth, setMeasuredWidth] = useState<number>(width ?? 0)

  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    node: HeatTreemapNode
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

    /* ---------- Normalize areas ---------- */
    const total = data.reduce((s, d) => s + d.value, 0)
    const max = Math.max(...data.map(d => d.value))

    const nodes = [...data]
      .sort((a, b) => b.value - a.value)
      .map(d => ({
        ...d,
        area: (d.value / total) * measuredWidth * height,
      }))

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

    /* ---------- Squarified treemap ---------- */
    const rects: Rect[] = []

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const worst = (row: any[], w: number) => {
      const areas = row.map(r => r.area)
      const sum = areas.reduce((a, b) => a + b, 0)
      const maxA = Math.max(...areas)
      const minA = Math.min(...areas)
      return Math.max(
        (w * w * maxA) / (sum * sum),
        (sum * sum) / (w * w * minA)
      )
    }

    const layoutRow = (
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      row: any[],
      x: number,
      y: number,
      w: number,
      h: number
    ) => {
      const rowArea = row.reduce((s, r) => s + r.area, 0)

      if (w < h) {
        let cy = y
        // biome-ignore lint/complexity/noForEach: <explanation>
        row.forEach(r => {
          const rh = r.area / w
          rects.push({ x, y: cy, w, h: rh, node: r })
          cy += rh
        })
      } else {
        let cx = x
        // biome-ignore lint/complexity/noForEach: <explanation>
        row.forEach(r => {
          const rw = r.area / h
          rects.push({ x: cx, y, w: rw, h, node: r })
          cx += rw
        })
      }
    }

    const squarify = (
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      nodes: any[],
      x: number,
      y: number,
      w: number,
      h: number
    ) => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let row: any[] = []
      const rest = [...nodes]
      let side = Math.min(w, h)
      let cx = x
      let cy = y
      let cw = w
      let ch = h

      while (rest.length) {
        const node = rest[0]
        const next = [...row, node]

        if (!row.length || worst(next, side) <= worst(row, side)) {
          row = next
          rest.shift()
        } else {
          layoutRow(row, cx, cy, cw, ch)
          const area = row.reduce((s, r) => s + r.area, 0)

          if (cw < ch) {
            cy += area / cw
            ch -= area / cw
          } else {
            cx += area / ch
            cw -= area / ch
          }

          row = []
          side = Math.min(cw, ch)
        }
      }

      if (row.length) layoutRow(row, cx, cy, cw, ch)
    }

    squarify(nodes, 0, 0, measuredWidth, height)
    rectsRef.current = rects

    /* ---------- Render ---------- */
    let t = animate ? 0 : 1

    const draw = () => {
      ctx.clearRect(0, 0, measuredWidth, height)
      const ease = animate ? t * t * (3 - 2 * t) : 1

      // biome-ignore lint/complexity/noForEach: <explanation>
      rects.forEach(r => {
        const cx = r.x + r.w / 2
        const cy = r.y + r.h / 2

        ctx.fillStyle = colorFor(r.node.value)
        ctx.fillRect(
          cx - (r.w * ease) / 2,
          cy - (r.h * ease) / 2,
          r.w * ease,
          r.h * ease
        )

        if (!animate || ease > 0.7) {
          ctx.fillStyle = '#1F2937'
          ctx.font = '600 13px system-ui'
          ctx.fillText(r.node.id, r.x + 8, r.y + 14)
          ctx.font = '12px system-ui'
          ctx.fillText(formatter.format(r.node.value), r.x + 8, r.y + 30)
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
    format,
    currency,
    locale,
    animate,
  ])

  /* ---------- Tooltip ---------- */
  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const b = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - b.left
    const y = e.clientY - b.top

    const hit = rectsRef.current.find(
      r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h
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
