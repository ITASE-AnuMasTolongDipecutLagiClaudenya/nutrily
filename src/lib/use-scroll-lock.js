import { useEffect } from "react"

let locks = 0

let release = null

export function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return

    if (locks++ === 0) {
      const scrollY = window.scrollY

      const body = document.body.style

      const previous = {
        overflow: body.overflow,

        position: body.position,

        top: body.top,

        left: body.left,

        right: body.right,

        width: body.width,

        overscrollBehavior: body.overscrollBehavior,
      }

      const previousHtmlOverflow = document.documentElement.style.overflow

      const previousHtmlOverscroll =
        document.documentElement.style.overscrollBehavior

      window.__lenis?.stop()

      body.overflow = "hidden"

      body.position = "fixed"

      body.top = `-${scrollY}px`

      body.left = "0"

      body.right = "0"

      body.width = "100%"

      body.overscrollBehavior = "none"

      document.documentElement.style.overflow = "hidden"

      document.documentElement.style.overscrollBehavior = "none"

      release = () => {
        Object.assign(body, previous)

        document.documentElement.style.overflow = previousHtmlOverflow

        document.documentElement.style.overscrollBehavior =
          previousHtmlOverscroll

        window.scrollTo(0, scrollY)

        window.__lenis?.start()
      }
    }

    return () => {
      if (--locks === 0) release?.()
    }
  }, [active])
}
