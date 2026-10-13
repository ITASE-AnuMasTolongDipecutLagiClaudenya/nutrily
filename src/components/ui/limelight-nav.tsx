import { cloneElement, useLayoutEffect, useRef, useState } from "react"
import type { ReactElement } from "react"
import { cn } from "@/lib/utils"

export type NavItem = {
  id: string | number
  icon: ReactElement<{ className?: string }>
  label: string
  onClick?: () => void
}

type LimelightNavProps = {
  items: NavItem[]
  activeIndex?: number
  defaultActiveIndex?: number
  onTabChange?: (index: number) => void
  className?: string
  limelightClassName?: string
  iconContainerClassName?: string
  iconClassName?: string
}

export function LimelightNav({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
}: LimelightNavProps) {
  const [selectedIndex, setSelectedIndex] = useState(defaultActiveIndex)
  const [isReady, setIsReady] = useState(false)
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const limelightRef = useRef<HTMLDivElement | null>(null)
  const currentIndex = activeIndex ?? selectedIndex

  useLayoutEffect(() => {
    const updateLimelight = () => {
      const activeItem = navItemRefs.current[currentIndex]
      const limelight = limelightRef.current
      if (!activeItem || !limelight) return
      limelight.style.left = `${activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2}px`
      setIsReady(true)
    }

    updateLimelight()
    window.addEventListener("resize", updateLimelight)
    return () => window.removeEventListener("resize", updateLimelight)
  }, [currentIndex, items.length])

  if (!items.length) return null

  return (
    <nav
      aria-label="Navigasi utama"
      className={cn(
        "inline-flex items-center border bg-white text-slate-700",
        className,
      )}
    >
      {items.map(({ id, icon, label, onClick }, index) => (
        <button
          aria-current={currentIndex === index ? "page" : undefined}
          aria-label={label}
          className={cn(
            "group relative z-20 flex h-full items-center justify-center rounded-xl text-slate-600 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 motion-reduce:transition-none",
            currentIndex === index
              ? "cursor-default"
              : "cursor-pointer hover:text-sky-700",
            iconContainerClassName,
          )}
          key={id}
          onClick={() => {
            setSelectedIndex(index)
            onTabChange?.(index)
            onClick?.()
          }}
          ref={(element) => {
            navItemRefs.current[index] = element
          }}
          type="button"
        >
          {currentIndex !== index && (
            <span className="pointer-events-none absolute inset-x-3 bottom-1 h-3 rounded-full bg-sky-400/60 opacity-0 blur-md transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none" />
          )}
          {cloneElement(icon, {
            className: cn(
              "relative z-10 size-6 transition-colors duration-300",
              currentIndex === index
                ? "text-sky-600"
                : "text-slate-500 group-hover:text-sky-700",
              icon.props.className,
              iconClassName,
            ),
          })}
        </button>
      ))}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-0 z-10 h-[3px] w-11 rounded-full bg-sky-500 shadow-[0_18px_20px_rgba(14,165,233,0.75)] transition-[left] duration-300 ease-in-out",
          !isReady && "opacity-0",
          limelightClassName,
        )}
        ref={limelightRef}
      >
        <div className="absolute left-[-30%] top-[3px] h-14 w-[160%] bg-gradient-to-b from-sky-400/30 to-transparent [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)]" />
      </div>
    </nav>
  )
}
