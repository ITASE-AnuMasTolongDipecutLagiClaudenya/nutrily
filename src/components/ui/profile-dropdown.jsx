import { ChevronDown, LogOut, UserRound } from "lucide-react"

const cn = (...classes) => classes.filter(Boolean).join(" ")

export default function ProfileDropdown({
  data,

  onProfile,

  onSignOut,

  className = "",
}) {
  const initials = (data.name || data.email || "N")

    .split(/[ @]/)

    .filter(Boolean)

    .slice(0, 2)

    .map((part) => part[0].toUpperCase())

    .join("")

  return (
    <details className={cn("group relative", className)}>
      <summary
        aria-label={`Profil ${data.name}`}
        className="flex min-h-11 max-w-[min(18rem,65vw)] cursor-pointer list-none items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-1.5 text-left transition-all duration-300 ease-out hover:translate-x-1 hover:border-sky-100 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 hover:shadow-[0_8px_20px_-14px_rgba(14,165,233,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 motion-reduce:transition-none [&::-webkit-details-marker]:hidden sm:gap-3 sm:py-2 sm:pl-3 sm:pr-2"
      >
        <span className="hidden min-w-0 flex-1 sm:block">
          <span className="block truncate text-sm font-semibold leading-tight text-slate-900">
            {data.name}
          </span>
          <span className="mt-0.5 block max-w-48 truncate text-xs leading-tight text-slate-500">
            {data.email}
          </span>
        </span>
        <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-emerald-400 p-0.5 sm:size-10">
          {data.avatar ? (
            <img
              alt=""
              className="size-full rounded-full bg-white object-cover"
              referrerPolicy="no-referrer"
              src={data.avatar}
            />
          ) : (
            <span className="grid size-full place-items-center rounded-full bg-white text-xs font-bold text-sky-700">
              {initials}
            </span>
          )}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="hidden size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180 sm:block"
        />
      </summary>

      <div className="absolute right-0 top-full z-[60] mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.22)] ring-1 ring-slate-100">
        <div className="mb-2 flex min-w-0 items-center gap-3 border-b border-sky-100/80 px-2 pb-3 pt-1">
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 p-0.5 shadow-md shadow-sky-200/70">
            {data.avatar ? (
              <img
                alt=""
                className="size-full rounded-full bg-white object-cover"
                referrerPolicy="no-referrer"
                src={data.avatar}
              />
            ) : (
              <span className="grid size-full place-items-center rounded-full bg-white text-xs font-bold text-sky-700">
                {initials}
              </span>
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-slate-900">
              {data.name}
            </span>
            <span className="mt-0.5 block truncate text-xs text-slate-500">
              {data.email}
            </span>
          </span>
        </div>
        <button
          className="group/item flex min-h-11 w-full items-center gap-3 rounded-xl border border-transparent px-3 text-left text-sm font-black text-slate-700 transition-all duration-300 ease-out hover:translate-x-1 hover:border-sky-100 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 hover:shadow-[0_8px_20px_-14px_rgba(14,165,233,0.8)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600 motion-reduce:transition-none"
          onClick={(event) => {
            event.currentTarget.closest("details").open = false

            onProfile()
          }}
          type="button"
        >
          <UserRound
            aria-hidden="true"
            className="size-4 text-sky-600 transition-transform duration-300 group-hover/item:scale-110"
            strokeWidth={3}
          />
          Profil
        </button>
        <button
          className="group/item flex min-h-11 w-full items-center gap-3 rounded-xl border border-transparent px-3 text-left text-sm font-black text-slate-600 transition-all duration-300 ease-out hover:translate-x-1 hover:border-rose-100 hover:bg-gradient-to-r hover:from-rose-50 hover:to-red-50 hover:text-rose-700 hover:shadow-[0_8px_20px_-14px_rgba(225,29,72,0.45)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-600 motion-reduce:transition-none"
          onClick={(event) => {
            if (!window.confirm("Yakin ingin keluar dari akun?")) return
            event.currentTarget.closest("details").open = false
            onSignOut()
          }}
          type="button"
        >
          <LogOut
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover/item:scale-110"
            strokeWidth={3}
          />
          Keluar
        </button>
      </div>
    </details>
  )
}
