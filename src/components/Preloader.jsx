import { useEffect, useRef, useState } from "react"
import { Plus } from "lucide-react"
import gsap from "gsap"

export default function Preloader({ onDone }) {
  const [state, setState] = useState("_")
  const [loadText, setLoadText] = useState("Fetching")
  const rootRef = useRef(null)
  const panelRef = useRef(null)
  const curtainRef = useRef(null)
  const spinRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (state === "_") {
        setState("__")
        setLoadText("Fetching")
      } else if (state === "__") {
        setState(".")
        setLoadText("Loading")
      } else if (state === ".") {
        setState("..")
        setLoadText("Updating")
      } else if (state === "..") {
        setState("...")
        setLoadText("Fixing")
      } else {
        setState("_")
        setLoadText("Fetching")
      }
    }, 400)

    return () => clearInterval(interval)
  }, [state])

  useEffect(() => {
    gsap.set(curtainRef.current, { yPercent: 100 })
    const tl = gsap.timeline({ delay: 2.2 })
    tl.to([spinRef.current, textRef.current], {
      scale: 0.5,
      y: -24,
      opacity: 0,
      duration: 0.55,
      ease: "power3.in",
      stagger: 0.08,
    })
      .to(
        panelRef.current,
        {
          yPercent: -100,
          borderBottomLeftRadius: "50% 8%",
          borderBottomRightRadius: "50% 8%",
          duration: 1.1,
          ease: "power4.inOut",
        },
        "-=0.05",
      )
      .to(
        curtainRef.current,
        {
          yPercent: -100,
          duration: 1.1,
          ease: "power4.inOut",
        },
        "-=0.92",
      )
      .add(() => onDone?.(), "-=0.55")
    return () => {
      tl.kill()
    }
  }, [onDone])

  const getBorderColor = (text) => {
    switch (text) {
      case "Fetching":
        return "border-lime-500 text-lime-600"
      case "Loading":
        return "border-sky-600 text-sky-700"
      case "Updating":
        return "border-amber-500 text-amber-600"
      case "Fixing":
        return "border-orange-500 text-orange-600"
      default:
        return "border-lime-500 text-lime-600"
    }
  }

  const colorClass = getBorderColor(loadText)

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100] bg-sky-300">
      <div ref={curtainRef} aria-hidden className="absolute inset-0 bg-white" />
      <div
        ref={panelRef}
        className="absolute inset-0 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-300 via-sky-200 to-sky-100"
      >
        <div
          ref={spinRef}
          className="flex flex-col items-center justify-center"
        >
          <div
            className={`animate-spin rounded-full border border-dashed bg-white/70 p-1 shadow-lg shadow-sky-200 ${colorClass}`}
          >
            <div
              className={`flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-dashed bg-white ${colorClass}`}
            >
              <Plus />
            </div>
          </div>
        </div>

        <div ref={textRef} className="flex flex-col items-center">
          <p className="mt-4 text-center text-sm font-bold uppercase tracking-widest text-sky-950">
            {loadText}
            <span className={`ml-1 ${colorClass}`}>{state}</span>
          </p>
          <div className="mt-4 h-1 w-44 overflow-hidden rounded-full bg-sky-950/10">
            <div className="h-full w-1/2 animate-[preload-bar_1s_ease-in-out_infinite] rounded-full bg-sky-600" />
          </div>
        </div>
      </div>
      <style>{`@keyframes preload-bar{0%{transform:translateX(-110%)}100%{transform:translateX(320%)}}`}</style>
    </div>
  )
}
