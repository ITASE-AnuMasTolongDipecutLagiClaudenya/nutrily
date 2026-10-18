"use client"

import * as React from "react"

type DivProps = React.ComponentProps<"div">
type Tone = 1 | 2 | 3 | 4 | 5

export type BarRaceDatum = {
  id: string
  label: string
  value: number
  color?: Tone
  icon?: React.ReactNode
}

export type BarRaceChartProps = {
  data: BarRaceDatum[]
  topN?: number
  duration?: number
  rowHeight?: number
  sort?: "desc" | "asc"
  max?: number
  formatValue?: (value: number) => string
  caption?: React.ReactNode
  period?: React.ReactNode
  showRankChange?: boolean
  className?: string
  onItemClick?: (datum: BarRaceDatum) => void
  ref?: DivProps["ref"]
}

const BAR = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
} as const
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const defaultFormat = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value)

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(true)
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])
  return reduced
}

function useRollingNumber(target: number, duration: number, reduced: boolean) {
  const [shown, setShown] = React.useState(target)
  const current = React.useRef(target)
  React.useEffect(() => {
    if (reduced || duration <= 0) {
      current.current = target
      setShown(target)
      return
    }
    const start = performance.now()
    const begin = current.current
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      current.current = begin + (target - begin) * eased
      setShown(current.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [target, duration, reduced])
  return shown
}

type RowProps = {
  datum: BarRaceDatum
  rank: number
  previousRank: number | null
  width: number
  previousWidth: number | null
  topN: number
  rowHeight: number
  duration: number
  reduced: boolean
  tone: Tone
  format: (value: number) => string
  showRankChange: boolean
  onClick?: () => void
}

function Row({
  datum,
  rank,
  previousRank,
  width,
  previousWidth,
  topN,
  rowHeight,
  duration,
  reduced,
  tone,
  format,
  showRankChange,
  onClick,
}: RowProps) {
  const rowRef = React.useRef<HTMLDivElement | null>(null)
  const barRef = React.useRef<HTMLDivElement | null>(null)
  const visible = rank < topN
  const wasVisible = previousRank !== null && previousRank < topN
  const shown = useRollingNumber(datum.value, visible ? duration : 0, reduced)
  const [chip, setChip] = React.useState<{
    kind: "up" | "down" | "new"
    places: number
  } | null>(null)
  const y = (visible ? rank : topN) * rowHeight

  React.useLayoutEffect(() => {
    const row = rowRef.current
    const bar = barRef.current
    if (!row || !bar || reduced || typeof row.animate !== "function") return
    const fromY =
      previousRank === null
        ? topN * rowHeight
        : (previousRank < topN ? previousRank : topN) * rowHeight
    const entering = visible && !wasVisible
    const leaving = !visible && wasVisible
    if (fromY !== y || entering || leaving) {
      row.animate(
        [
          { transform: `translateY(${fromY}px)`, opacity: entering ? 0 : 1 },
          { transform: `translateY(${y}px)`, opacity: visible ? 1 : 0 },
        ],
        { duration, easing: EASE },
      )
    }
    if (
      previousWidth !== null &&
      previousWidth !== width &&
      (visible || leaving)
    ) {
      bar.animate([{ width: `${previousWidth}%` }, { width: `${width}%` }], {
        duration,
        easing: EASE,
      })
    }
  }, [
    rank,
    width,
    visible,
    previousRank,
    previousWidth,
    reduced,
    topN,
    rowHeight,
    y,
    wasVisible,
    duration,
  ])

  React.useEffect(() => {
    if (!showRankChange || previousRank === null || !visible) return
    const kind = !wasVisible
      ? "new"
      : previousRank > rank
        ? "up"
        : previousRank < rank
          ? "down"
          : null
    if (!kind) return
    setChip({ kind, places: Math.abs(previousRank - rank) })
    const timer = window.setTimeout(
      () => setChip(null),
      Math.max(900, duration * 2),
    )
    return () => window.clearTimeout(timer)
  }, [rank, visible, showRankChange, previousRank, wasVisible, duration])

  return (
    <div
      ref={rowRef}
      data-row={datum.id}
      data-rank={rank}
      data-visible={visible ? "true" : "false"}
      aria-hidden={!visible}
      style={{
        height: rowHeight,
        transform: `translateY(${y}px)`,
        opacity: visible ? 1 : 0,
      }}
      className="group/row absolute inset-x-0 top-0 flex items-center gap-3 rounded-xl px-1 will-change-transform"
    >
      <span className="w-5 shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground">
        {rank + 1}
      </span>
      <span className="flex w-32 shrink-0 items-center gap-2 text-sm">
        {datum.icon}
        <span className="truncate font-medium">{datum.label}</span>
      </span>
      <div className="relative mr-16 h-7 min-w-0 flex-1">
        <div
          ref={barRef}
          data-bar
          style={{ width: `${width}%` }}
          className="group/bar relative h-full"
          title={`${datum.label}: ${format(shown)}`}
        >
          <div
            className={`h-full rounded-md ${BAR[tone]} opacity-90 transition-[filter,opacity] duration-200 group-hover/row:brightness-110 group-hover/row:shadow-md`}
          />
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-[calc(100%+8px)] left-0 z-30 hidden min-w-max rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg group-hover:block group-focus-within:block"
          >
            {datum.label} · {format(shown)}
          </span>
          <span className="absolute left-full top-1/2 ml-2 flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap font-mono text-xs tabular-nums">
            {format(shown)}
            {chip && (
              <span
                data-rank-chip={chip.kind}
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none ${
                  chip.kind === "down"
                    ? "bg-chart-5/15 text-foreground"
                    : "bg-chart-2/15 text-foreground"
                }`}
              >
                {chip.kind === "new"
                  ? "baru"
                  : `${chip.kind === "up" ? "▲" : "▼"}${chip.places}`}
              </span>
            )}
          </span>
        </div>
      </div>
      {onClick && (
        <button
          aria-label={`Buka ${datum.label}`}
          className="absolute inset-0 rounded-xl outline-none transition-colors hover:bg-violet-500/[0.06] focus-visible:ring-2 focus-visible:ring-violet-500"
          onClick={onClick}
          tabIndex={visible ? 0 : -1}
          type="button"
        />
      )}
    </div>
  )
}

function PeriodLabel({
  period,
  reduced,
}: {
  period: React.ReactNode
  reduced: boolean
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const text =
    typeof period === "string" || typeof period === "number"
      ? String(period)
      : null
  React.useLayoutEffect(() => {
    const node = ref.current
    if (!node || reduced || typeof node.animate !== "function") return
    node.animate(
      [
        { opacity: 0, transform: "translateY(3px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 300, easing: "ease-out" },
    )
  }, [text, reduced])
  return (
    <span
      ref={ref}
      data-period
      className="font-mono text-xs tabular-nums text-muted-foreground"
    >
      {period}
    </span>
  )
}

export function BarRaceChart({
  data,
  topN = 6,
  duration = 600,
  rowHeight = 44,
  sort = "desc",
  max,
  formatValue = defaultFormat,
  caption,
  period,
  showRankChange = true,
  className = "",
  onItemClick,
  ref,
}: BarRaceChartProps) {
  const reduced = useReducedMotion()
  const previous = React.useRef<Record<string, [number, number]>>({})
  const tones = React.useRef({} as { [id: string]: Tone })
  const sorted = [...data].sort(
    (a, b) =>
      (sort === "desc" ? b.value - a.value : a.value - b.value) ||
      a.id.localeCompare(b.id),
  )
  const visible = sorted.slice(0, topN)
  const scale = max ?? Math.max(1, ...visible.map((datum) => datum.value))
  const rows = sorted.map((datum, rank) => {
    if (!tones.current[datum.id]) {
      tones.current[datum.id] =
        datum.color ?? ((Object.keys(tones.current).length % 5) + 1) as Tone
    }
    return {
      datum,
      rank,
      width: Math.max(0, Math.min(100, (datum.value / scale) * 100)),
      tone: datum.color ?? tones.current[datum.id]!,
    }
  })
  const snapshot = previous.current

  React.useLayoutEffect(() => {
    const next: Record<string, [number, number]> = {}
    for (const row of rows) next[row.datum.id] = [row.rank, row.width]
    previous.current = next
  })

  return (
    <figure
      ref={ref}
      data-slot="bar-race-chart"
      data-rows={visible.length}
      className={`relative w-full ${className}`}
    >
      {(caption || period) && (
        <figcaption className="mb-3 flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium">{caption}</span>
          {period !== undefined && (
            <PeriodLabel period={period} reduced={reduced} />
          )}
        </figcaption>
      )}
      <div className="relative" style={{ height: topN * rowHeight }}>
        {rows.map((row) => (
          <Row
            key={row.datum.id}
            datum={row.datum}
            rank={row.rank}
            previousRank={snapshot[row.datum.id]?.[0] ?? null}
            width={row.width}
            previousWidth={snapshot[row.datum.id]?.[1] ?? null}
            topN={topN}
            rowHeight={rowHeight}
            duration={duration}
            reduced={reduced}
            tone={row.tone}
            format={formatValue}
            showRankChange={showRankChange}
            onClick={onItemClick ? () => onItemClick(row.datum) : undefined}
          />
        ))}
      </div>
      <div className="sr-only">
        <table>
          <caption>
            {typeof caption === "string"
              ? caption
              : "Fitur yang sering dipakai"}
            {typeof period === "string" ? ` · ${period}` : ""}
          </caption>
          <thead>
            <tr>
              <th scope="col">Peringkat</th>
              <th scope="col">Fitur</th>
              <th scope="col">Pemakaian</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((datum, index) => (
              <tr key={datum.id}>
                <td>{index + 1}</td>
                <td>{datum.label}</td>
                <td>{formatValue(datum.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

export default BarRaceChart
