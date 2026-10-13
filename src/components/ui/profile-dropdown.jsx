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
        className="flex min-h-11 max-w-[min(18rem,65vw)] cursor-pointer list-none items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-1.5 text-left transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 [&::-webkit-details-marker]:hidden sm:gap-3 sm:py-2 sm:pl-3 sm:pr-2"
      >
        <span className="hidden min-w-0 flex-1 lg:block">
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
          className="hidden size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180 lg:block"
        />
      </summary>

      <div className="absolute right-0 top-full z-[60] mt-2 w-64 rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-xl shadow-slate-900/10 backdrop-blur-sm">
        <div className="border-b border-slate-100 px-3 py-2 lg:hidden">
          <p className="truncate text-sm font-semibold text-slate-900">
            {data.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">{data.email}</p>
        </div>
        <button
          className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-transparent px-3 text-left text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600"
          onClick={(event) => {
            event.currentTarget.closest("details").open = false
            onProfile()
          }}
          type="button"
        >
          <UserRound aria-hidden="true" className="size-4 text-sky-600" />
          Profil
        </button>
        <button
          className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-transparent px-3 text-left text-sm font-medium text-rose-600 transition hover:border-rose-200 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600"
          onClick={(event) => {
            event.currentTarget.closest("details").open = false
            onSignOut()
          }}
          type="button"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Keluar
        </button>
      </div>
    </details>
  )
}
