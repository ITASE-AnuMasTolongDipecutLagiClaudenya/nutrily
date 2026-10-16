import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

export default function ProfilePreviewDialog({ avatar, name, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.__lenis?.stop()
    const closeOnEscape = (event) => event.key === "Escape" && onClose()
    window.addEventListener("keydown", closeOnEscape)
    return () => {
      window.removeEventListener("keydown", closeOnEscape)
      document.body.style.overflow = previousOverflow
      window.__lenis?.start()
    }
  }, [onClose])

  const initials = (name || "N").trim().slice(0, 1).toUpperCase()

  return createPortal(
    <div
      aria-label={`Foto profil ${name || "pengguna"}`}
      aria-modal="true"
      className="fixed inset-0 z-[100] grid touch-none place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      role="dialog"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="grid size-48 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500 to-violet-500 p-1 shadow-2xl sm:size-56">
          <div className="grid size-full place-items-center overflow-hidden rounded-full bg-white">
            {avatar ? (
              <img
                alt={`Foto profil ${name || "pengguna"}`}
                className="size-full object-cover"
                referrerPolicy="no-referrer"
                src={avatar}
              />
            ) : (
              <span className="text-5xl font-bold text-sky-700">
                {initials}
              </span>
            )}
          </div>
        </div>
        <button
          aria-label="Tutup foto profil"
          autoFocus
          className="grid size-10 place-items-center rounded-full bg-white text-slate-700 shadow-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>,
    document.body,
  )
}
