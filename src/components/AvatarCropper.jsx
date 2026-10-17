import { useEffect, useRef, useState } from "react"
import { Check, Move, X } from "lucide-react"
import { getAvatarCropRect } from "../lib/avatar-crop"
import { useScrollLock } from "../lib/use-scroll-lock"

const SIZE = 280

export default function AvatarCropper({ file, onCancel, onCrop }) {
  const [imageUrl, setImageUrl] = useState("")
  const [imageSize, setImageSize] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef(null)
  const imageRef = useRef(null)

  useScrollLock()

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const baseScale = imageSize
    ? Math.max(SIZE / imageSize.width, SIZE / imageSize.height)
    : 1
  const width = imageSize ? imageSize.width * baseScale * zoom : SIZE
  const height = imageSize ? imageSize.height * baseScale * zoom : SIZE

  const clampOffset = (x, y, scale = zoom) => {
    if (!imageSize) return { x: 0, y: 0 }
    const maxX = Math.max(0, (imageSize.width * baseScale * scale - SIZE) / 2)
    const maxY = Math.max(0, (imageSize.height * baseScale * scale - SIZE) / 2)
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    }
  }

  const crop = () => {
    const image = imageRef.current
    if (!image || !imageSize) return
    const rect = getAvatarCropRect(
      imageSize.width,
      imageSize.height,
      zoom,
      offset,
      SIZE,
    )
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 512
    canvas
      .getContext("2d")
      .drawImage(image, rect.x, rect.y, rect.size, rect.size, 0, 0, 512, 512)
    canvas.toBlob((blob) => blob && onCrop(blob), "image/jpeg", 0.9)
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onCancel()
      }
    >
      <section
        aria-labelledby="avatar-crop-title"
        aria-modal="true"
        className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-7"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              className="text-lg font-bold text-slate-900"
              id="avatar-crop-title"
            >
              Atur foto profil
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Geser foto, lalu sesuaikan pembesaran.
            </p>
          </div>
          <button
            aria-label="Tutup pemotong foto"
            autoFocus
            className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sky-600"
            onClick={onCancel}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-6 grid justify-items-center">
          <div
            aria-label="Area potong foto berbentuk lingkaran"
            className="relative size-[280px] touch-none cursor-grab overflow-hidden rounded-full bg-slate-100 ring-4 ring-sky-100 active:cursor-grabbing"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              drag.current = {
                x: event.clientX,
                y: event.clientY,
                offset,
              }
            }}
            onPointerMove={(event) => {
              if (!drag.current) return
              setOffset(
                clampOffset(
                  drag.current.offset.x + event.clientX - drag.current.x,
                  drag.current.offset.y + event.clientY - drag.current.y,
                ),
              )
            }}
            onPointerUp={() => (drag.current = null)}
          >
            {imageUrl && (
              <img
                alt=""
                className="pointer-events-none absolute max-w-none select-none"
                draggable="false"
                onLoad={(event) =>
                  setImageSize({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  })
                }
                ref={imageRef}
                src={imageUrl}
                style={{
                  width,
                  height,
                  left: `calc(50% + ${offset.x}px)`,
                  top: `calc(50% + ${offset.y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
            <span className="pointer-events-none absolute inset-0 grid place-items-center text-white/80 drop-shadow">
              <Move className="size-7" />
            </span>
          </div>
          <label className="mt-6 w-full max-w-xs">
            <span className="mb-2 flex justify-between text-xs font-semibold text-slate-600">
              <span>Perbesar foto</span>
              <span>{zoom.toFixed(1)}×</span>
            </span>
            <input
              aria-label="Perbesar foto"
              className="w-full accent-sky-600"
              max="3"
              min="1"
              onChange={(event) => {
                const nextZoom = Number(event.target.value)
                setZoom(nextZoom)
                setOffset((current) =>
                  clampOffset(current.x, current.y, nextZoom),
                )
              }}
              step="0.01"
              type="range"
              value={zoom}
            />
          </label>
        </div>
        <div className="mt-7 flex justify-end gap-2">
          <button
            className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            onClick={onCancel}
            type="button"
          >
            Batal
          </button>
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
            disabled={!imageSize}
            onClick={crop}
            type="button"
          >
            <Check className="size-4" /> Gunakan foto
          </button>
        </div>
      </section>
    </div>
  )
}
