import { type ReactNode, useEffect, useRef, useState } from 'react'

type ChartDataItem = {
  id: string
  label: string
  value: number
}

type Slice = {
  start: number
  end: number
  item: ChartDataItem
  color: string
}

type BowPieChartProps = {
  data: ChartDataItem[]
  colors: string[]
  size?: number
  thickness?: number
  animate?: boolean
  animationDuration?: number
  onSelect?: (item: ChartDataItem | null) => void
  children?: ReactNode
}

export function BowPieChart({
  data,
  colors,
  size = 240,
  thickness = 26,
  animate = true,
  animationDuration = 800,
  onSelect,
  children,
}: BowPieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const slicesRef = useRef<Slice[]>([])
  const animationRef = useRef<number | null>(null)
  const animatedOnceRef = useRef(false)

  const selectable = typeof onSelect === 'function'

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    item: ChartDataItem
  } | null>(null)

  const total = data.reduce((acc, d) => acc + d.value, 0)

  // Bottom cut (bow)
  const cutAngle = Math.PI * 0.4
  const startAngle = Math.PI / 2 + cutAngle
  const endAngle = Math.PI * 2 + Math.PI / 2 - cutAngle
  const totalAngle = endAngle - startAngle

  /**
   * DRAW (no animation)
   */
  function drawChart(progress = 1) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const center = size / 2
    const radius = center - thickness

    ctx.clearRect(0, 0, size, size)
    slicesRef.current = []

    let currentAngle = startAngle

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * totalAngle * progress

      const sliceStart = currentAngle
      const sliceEnd = currentAngle + sliceAngle

      const isDimmed = selectable && selectedId && selectedId !== item.id

      ctx.beginPath()
      ctx.strokeStyle = colors[index]
      ctx.globalAlpha = isDimmed ? 0.3 : 1
      ctx.lineWidth = thickness
      ctx.lineCap = 'round'

      ctx.arc(center, center, radius, sliceStart, sliceEnd)
      ctx.stroke()

      ctx.globalAlpha = 1

      slicesRef.current.push({
        start: sliceStart,
        end: sliceEnd,
        item,
        color: colors[index],
      })

      currentAngle += sliceAngle
    })
  }

  /**
   * INITIAL DRAW / ANIMATION
   */
  useEffect(() => {
    animatedOnceRef.current = false

    if (!animate) {
      drawChart(1)
      animatedOnceRef.current = true
      return
    }

    const startTimeRef = { current: 0 }

    function animateChart(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp

      const progress = Math.min(
        (timestamp - startTimeRef.current) / animationDuration,
        1
      )

      drawChart(progress)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateChart)
      } else {
        animatedOnceRef.current = true
      }
    }

    animationRef.current = requestAnimationFrame(animateChart)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [data, colors, size, thickness, animate, totalAngle])

  /**
   * Redraw on selection change (NO animation)
   */
  useEffect(() => {
    if (animatedOnceRef.current) {
      drawChart(1)
    }
  }, [selectedId])

  /**
   * Hit testing
   */
  function getSliceFromEvent(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const center = size / 2
    const dx = x - center
    const dy = y - center
    const distance = Math.sqrt(dx * dx + dy * dy)

    const outerRadius = center
    const innerRadius = outerRadius - thickness - 8

    if (distance < innerRadius || distance > outerRadius) {
      return { slice: null, x, y }
    }

    let angle = Math.atan2(dy, dx)
    if (angle < 0) angle += Math.PI * 2

    const slice = slicesRef.current.find(
      s => angle >= s.start && angle <= s.end
    )

    return { slice: slice ?? null, x, y }
  }

  /**
   * Hover → tooltip
   */
  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const { slice, x, y } = getSliceFromEvent(e)

    if (!slice) {
      setTooltip(null)
      return
    }

    setTooltip({
      x,
      y,
      item: slice.item,
    })
  }

  function handleMouseLeave() {
    setTooltip(null)
  }

  /**
   * Click slice (only if selectable)
   */
  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!selectable) return

    e.stopPropagation()

    const { slice } = getSliceFromEvent(e)
    if (!slice) return

    setSelectedId(slice.item.id)
    onSelect?.(slice.item)
  }

  /**
   * Click outside → clear selection
   */
  useEffect(() => {
    if (!selectable) return

    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setSelectedId(null)
        setTooltip(null)
        onSelect?.(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectable, onSelect])

  return (
    <div
      ref={wrapperRef}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={selectable ? 'cursor-pointer' : 'cursor-default'}
      />

      {/* Center content */}
      <div className="absolute pointer-events-none">{children}</div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 rounded-md bg-popover px-3 py-1 text-sm shadow-md pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="font-medium">{tooltip.item.label}</p>
          <p className="text-muted-foreground">{tooltip.item.value}</p>
        </div>
      )}
    </div>
  )
}
