import { useEffect, useId, useRef } from "react"
import { createPortal } from "react-dom"
import { useScrollLock } from "../../lib/use-scroll-lock"

export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Batal",
  destructive = false,
  onCancel,
  onConfirm,
}) {
  const titleId = useId()
  const descriptionId = useId()
  const cancelButton = useRef(null)

  useScrollLock()

  useEffect(() => {
    cancelButton.current?.focus()
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [onCancel])

  return createPortal(
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-5 font-poppins shadow-2xl sm:p-6"
        role="alertdialog"
      >
        <h2 className="text-lg font-semibold text-slate-900" id={titleId}>
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600" id={descriptionId}>
          {description}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            className="h-10 rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            onClick={onCancel}
            ref={cancelButton}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={`h-10 rounded-lg px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 ${
              destructive
                ? "bg-rose-600 hover:bg-rose-700 focus-visible:outline-rose-500"
                : "bg-sky-600 hover:bg-sky-700 focus-visible:outline-sky-500"
            }`}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}
