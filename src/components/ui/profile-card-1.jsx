import { useEffect, useState } from "react"

import { ArrowUpRight, Pencil } from "lucide-react"

export default function ProfileCard1({
  avatarUrl,
  name,
  email,
  onEdit,
  onView,
}) {
  const [avatarError, setAvatarError] = useState(false)

  useEffect(() => setAvatarError(false), [avatarUrl])

  return (
    <section className="relative isolate flex min-h-[30rem] items-center justify-center overflow-hidden rounded-3xl border border-white/80 bg-white/60 p-6 shadow-[0_8px_32px_rgba(15,23,42,.1)] backdrop-blur-xl sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br from-sky-100/70 via-white/30 to-violet-100/60"
      />
      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <button
          aria-label="Lihat profil"
          className="relative mb-5 grid size-32 place-items-center rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-violet-400 p-1 shadow-lg shadow-sky-200/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:size-36"
          onClick={onView}
          type="button"
        >
          <span className="grid size-full place-items-center rounded-full bg-white text-3xl font-bold text-sky-700">
            {(name || email || "N")
              .split(/[ @]/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0].toUpperCase())
              .join("")}
          </span>
          {avatarUrl && !avatarError && (
            <img
              alt={`Foto profil ${name}`}
              className="absolute inset-1 size-[calc(100%-0.5rem)] rounded-full bg-white object-cover"
              onError={() => setAvatarError(true)}
              referrerPolicy="no-referrer"
              src={avatarUrl}
            />
          )}
        </button>

        <h2 className="max-w-full break-words text-2xl font-bold tracking-tight text-slate-900">
          {name || "Nama belum diatur"}
        </h2>
        <p className="mt-1 break-all text-sm font-medium text-sky-700">
          {email}
        </p>
        <div className="my-6 h-px w-1/2 rounded-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

        <div className="flex flex-wrap justify-center gap-2">
          <button
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(14,165,233,.8)] transition-all duration-300 hover:scale-[1.03] hover:bg-sky-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onEdit}
            type="button"
          >
            <Pencil aria-hidden="true" className="size-4" /> Edit Profil
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:rotate-45"
            />
          </button>
        </div>
      </div>
    </section>
  )
}
