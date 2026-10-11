import { useEffect, useRef } from "react"

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

let scriptPromise = null

function loadScript() {
  if (typeof document === "undefined") return Promise.resolve()
  if (window.turnstile) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
      if (existing) {
        if (window.turnstile) return resolve()
        existing.addEventListener("load", resolve, { once: true })
        existing.addEventListener(
          "error",
          () => {
            scriptPromise = null
            reject(new Error("Gagal memuat Cloudflare Turnstile."))
          },
          { once: true },
        )
        return
      }
      const script = document.createElement("script")
      script.src = SCRIPT_SRC
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => {
        scriptPromise = null
        reject(new Error("Gagal memuat Cloudflare Turnstile."))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

export default function Turnstile({
  onVerify,
  onExpired,
  onError,
  theme = "light",
  size = "flexible",
}) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  useEffect(() => {
    const callbacks = { onVerify, onExpired, onError }
    if (containerRef.current) containerRef.current.callbacks = callbacks
  }, [onVerify, onExpired, onError])

  useEffect(() => {
    if (!siteKey || !containerRef.current) return
    let cancelled = false

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return
        if (widgetIdRef.current !== null) {
          window.turnstile.reset(widgetIdRef.current)
          return
        }
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size,
          action: "login",
          callback: (token) =>
            containerRef.current?.callbacks?.onVerify?.(token),
          "expired-callback": () =>
            containerRef.current?.callbacks?.onExpired?.(),
          "error-callback": () => containerRef.current?.callbacks?.onError?.(),
        })
      })
      .catch(() => containerRef.current?.callbacks?.onError?.())

    return () => {
      cancelled = true
    }
  }, [siteKey, theme, size])

  useEffect(
    () => () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // abaikan saat unmount cepat
        }
        widgetIdRef.current = null
      }
    },
    [],
  )

  if (!siteKey)
    return (
      <p className="mt-6 text-center text-sm text-rose-600">
        Turnstile belum dikonfigurasi.
      </p>
    )

  return <div ref={containerRef} className="mt-6 w-full" />
}
