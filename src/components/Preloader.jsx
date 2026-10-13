import { useEffect, useRef, useState } from "react"
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
    const tl = gsap.timeline({ delay: 0.4 })
    tl.to([spinRef.current, textRef.current], {
      scale: 0.5,
      y: -24,
      opacity: 0,
      duration: 0.35,
      ease: "power3.in",
      stagger: 0.08,
    })
      .to(
        panelRef.current,
        {
          yPercent: -100,
          borderBottomLeftRadius: "50% 8%",
          borderBottomRightRadius: "50% 8%",
          duration: 0.65,
          ease: "power4.inOut",
        },
        "-=0.05",
      )
      .to(
        curtainRef.current,
        {
          yPercent: -100,
          duration: 0.65,
          ease: "power4.inOut",
        },
        "-=0.92",
      )
      .add(() => onDone?.(), "-=0.35")
    return () => {
      tl.kill()
    }
  }, [onDone])

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
          <div className="relative grid size-24 place-items-center rounded-full bg-white/70 shadow-lg shadow-sky-200">
            <div aria-hidden="true" className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-sky-600" />
            <div aria-hidden="true" className="absolute inset-2 animate-[spin_3s_linear_infinite_reverse] rounded-full border-4 border-dashed border-sky-600 bg-white" />
            <img
              alt=""
              aria-hidden="true"
              className="relative size-12 object-contain"
              src={`${import.meta.env.BASE_URL}logo-biru.png`}
            />
          </div>
        </div>

        <div ref={textRef} className="flex flex-col items-center">
          <p className="mt-4 text-center text-sm font-bold uppercase tracking-widest text-sky-950">
            {loadText}
            <span className="ml-1 text-sky-600">{state}</span>
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
