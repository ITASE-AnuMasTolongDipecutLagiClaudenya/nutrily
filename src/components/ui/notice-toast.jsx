import { useEffect, useRef } from "react"

import NoticeAlert from "./notice-alert"

export default function NoticeToast({
  message,
  onClose,
  timeout = 4500,
  className = "",
  variant,
}) {
  const closeRef = useRef(onClose)

  closeRef.current = onClose

  useEffect(() => {
    if (!message) return

    const timer = window.setTimeout(() => closeRef.current?.(), timeout)

    return () => window.clearTimeout(timer)
  }, [message, timeout])

  if (!message) return null

  return (
    <div className="pointer-events-none fixed inset-x-4 top-20 z-[70] mx-auto max-w-xl sm:top-24">
      <NoticeAlert
        className={`onboarding-toast pointer-events-auto ${className}`.trim()}
        message={message}
        onClose={onClose}
        variant={variant}
      />
    </div>
  )
}
