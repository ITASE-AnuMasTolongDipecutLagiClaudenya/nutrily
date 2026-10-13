import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

function useGridCount(cell = 44) {
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

export default function CtaSection() {
  const navigate = useNavigate()
  const [wrapRef, { cols, rows }] = useGridCount(44)
  const total = cols * rows

  return (
    <section
      ref={wrapRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-sky-50"
    >
      <div
        aria-hidden
        className="absolute inset-0 grid [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_95%)]"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="border border-sky-200/50 transition-colors duration-500 ease-out hover:bg-sky-400"
          />
        ))}
      </div>
      <div className="relative z-10 mx-auto w-full max-w-2xl px-5 py-16 text-center sm:px-8">
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Beri tubuhmu gizi terbaik.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Mulai gratis, pindai makanan pertamamu, dan biarkan AI menyusun
          panduan gizimu.
        </p>
        <div className="mx-auto mt-8 flex max-w-md justify-center">
          <button
            onClick={() => navigate("/login")}
            type="button"
            className="landing-cta"
          >
            Mulai Sekarang <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
