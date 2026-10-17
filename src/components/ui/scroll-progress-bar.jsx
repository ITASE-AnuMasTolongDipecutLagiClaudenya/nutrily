import { useEffect, useRef } from "react"

export default function ScrollProgressBar({
  className = "absolute inset-x-0 bottom-0 hidden h-[5px] overflow-hidden bg-sky-100/70 max-lg:block",
}) {
  const progressRef = useRef(null)

  useEffect(() => {
    let frame = 0

    const updateProgress = () => {
      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(() => {
        const root = document.documentElement

        const scrollHeight = Math.max(
          root.scrollHeight,
          document.body.scrollHeight,
        )

        const viewportHeight = root.clientHeight

        const maxScroll = Math.max(0, scrollHeight - viewportHeight)

        const scrollTop = Math.max(
          window.scrollY,
          window.__lenis?.animatedScroll || 0,
        )

        const progress =
          scrollTop + viewportHeight >= scrollHeight - 2
            ? 1
            : maxScroll > 0
              ? scrollTop / maxScroll
              : 0

        const percentage = Math.min(1, Math.max(0, progress)) * 100

        const bar = progressRef.current

        if (!bar) return

        bar.style.width = `${percentage}%`

        bar.setAttribute("aria-valuenow", String(Math.round(percentage)))
      })
    }

    updateProgress()

    window.addEventListener("scroll", updateProgress, { passive: true })

    window.addEventListener("resize", updateProgress)

    const observer = new ResizeObserver(updateProgress)

    observer.observe(document.documentElement)

    observer.observe(document.body)

    return () => {
      cancelAnimationFrame(frame)

      window.removeEventListener("scroll", updateProgress)

      window.removeEventListener("resize", updateProgress)

      observer.disconnect()
    }
  }, [])

  return (
    <div className={className}>
      <div
        aria-label="Progres scroll halaman"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={0}
        className="h-full w-0 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 shadow-[0_0_10px_rgba(14,165,233,0.6)] transition-[width] duration-75 motion-reduce:transition-none"
        ref={progressRef}
        role="progressbar"
      />
    </div>
  )
}
