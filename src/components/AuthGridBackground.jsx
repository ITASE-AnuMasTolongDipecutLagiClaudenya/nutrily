import { useEffect, useRef, useState } from "react"

export function useGridCount(cell = 44) {
  const ref = useRef(null)
  const [count, setCount] = useState({ cols: 24, rows: 16 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      const w = rect.width || window.innerWidth
      const h = rect.height || window.innerHeight
      setCount({
        cols: Math.min(64, Math.max(10, Math.ceil(w / cell))),
        rows: Math.min(32, Math.max(10, Math.ceil(h / cell))),
      })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [cell])

  return [ref, count]
}

export default function AuthGridBackground({ className = "" }) {
  const [wrapRef, { cols, rows }] = useGridCount(44)
  const total = cols * rows

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`absolute inset-0 overflow-hidden bg-sky-50 ${className}`}
    >
      <div
        className="absolute inset-0 grid [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_95%)]"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="border border-white/60 bg-sky-500 transition-colors duration-150 ease-out hover:bg-white"
          />
        ))}
      </div>
    </div>
  )
}
