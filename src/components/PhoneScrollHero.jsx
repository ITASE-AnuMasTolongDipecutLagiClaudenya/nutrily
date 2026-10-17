import { useLayoutEffect, useEffect, useRef } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion"

const cn = (...classes) => classes.filter(Boolean).join(" ")

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

function PhoneFrame({ children }) {
  return (
    <div className="relative mx-auto w-52 sm:w-60 md:w-68">
      <span
        aria-hidden
        className="absolute -left-[2px] top-[16%] h-7 w-[3px] rounded-l-sm bg-slate-400/50"
      />
      <span
        aria-hidden
        className="absolute -left-[2px] top-[24%] h-11 w-[3px] rounded-l-sm bg-slate-400/50"
      />
      <span
        aria-hidden
        className="absolute -right-[2px] top-[22%] h-14 w-[3px] rounded-r-sm bg-slate-400/50"
      />
      <div className="aspect-[9/19.5] rounded-[2.5rem] border border-slate-900 bg-slate-900 p-[0.35rem] shadow-[0_10px_25px_-10px_rgba(255,255,255,.8)]">
        <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-white ring-1 ring-inset ring-slate-900/20">
          <div
            aria-hidden
            className="absolute left-1/2 top-2 z-10 h-[1.1rem] w-17 -translate-x-1/2 rounded-full bg-black"
          />
          {children ?? (
            <div className="flex h-full w-full items-center justify-center bg-slate-100">
              <span className="text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                Replace screen
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PhoneScrollHero({
  titleComponent,
  children,
  overlap = 20,
  tilt = 22,
  className,
}) {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const progress = useMotionValue(0)

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return
    const el = sectionRef.current
    if (!el) return
    const win = el.ownerDocument.defaultView ?? window
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const travel = Math.max(1, rect.height - win.innerHeight)
      progress.set(Math.min(1, Math.max(0, -rect.top / travel)))
    }
    const onScroll = () => {
      if (!raf) raf = win.requestAnimationFrame(update)
    }
    update()
    win.addEventListener("scroll", onScroll, { passive: true })
    win.addEventListener("resize", onScroll)
    return () => {
      win.removeEventListener("scroll", onScroll)
      win.removeEventListener("resize", onScroll)
      if (raf) win.cancelAnimationFrame(raf)
    }
  }, [prefersReducedMotion, progress])

  const rotateX = useTransform(progress, [0, 1], [tilt, 0])
  const scale = useTransform(progress, [0, 1], [0.94, 1])
  const titleY = useTransform(progress, [0, 1], [0, -24])
  const phoneY = useTransform(progress, [0, 1], ["0%", `-${overlap}%`])
  const still = Boolean(prefersReducedMotion)

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      className={cn(
        "relative flex h-[80rem] w-full items-center justify-center overflow-hidden bg-white p-2 md:p-8",
        className,
      )}
    >
      <div className="w-full" style={{ perspective: "1200px" }}>
        <motion.div
          style={{ y: still ? 0 : titleY }}
          className="relative z-0 mx-auto max-w-5xl px-4 text-center"
        >
          {titleComponent}
        </motion.div>
        <motion.div
          style={{
            y: still ? 0 : phoneY,
            rotateX: still ? 0 : rotateX,
            scale: still ? 1 : scale,
          }}
          className="relative z-10 -mt-6 md:-mt-12"
        >
          <PhoneFrame>{children}</PhoneFrame>
        </motion.div>
      </div>
    </section>
  )
}
