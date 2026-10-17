export default function Brand({ compact = false, light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        alt={compact ? "Nutrily" : ""}
        aria-hidden={!compact}
        className="size-9 object-contain"
        src={`${import.meta.env.BASE_URL}logo-biru.png`}
      />
      {!compact && (
        <div
          className={`text-2xl font-bold tracking-tight ${
            light ? "text-white" : "text-black"
          }`}
        >
          Nutri
          <span className={light ? "text-sky-300" : "text-sky-500"}>ly</span>
        </div>
      )}
    </div>
  )
}
