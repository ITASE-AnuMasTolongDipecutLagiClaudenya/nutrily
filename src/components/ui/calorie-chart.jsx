import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { api } from "../../lib/api"

const periods = [
  ["day", "Hari"],
  ["week", "Minggu"],
  ["month", "Bulan"],
  ["year", "Tahun"],
]

export default function CalorieChart({ target = 2100 }) {
  const [period, setPeriod] = useState("day")
  const [data, setData] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")
    api(`/calories?period=${period}`)
      .then((result) => {
        if (active)
          setData(
            (result.data || []).map((item) => ({
              ...item,
              tick: period === "month" ? item.label.slice(0, 3) : item.label,
            })),
          )
      })
      .catch((reason) => active && setError(reason.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [period])

  return (
    <section className="mt-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900">Kalori harian</h2>
          <p className="mt-1 text-xs text-slate-400">
            {loading
              ? "Memuat catatan kalori…"
              : "Total dari catatan makananmu"}
          </p>
        </div>
        <div
          aria-label="Filter periode kalori"
          className="grid w-full grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1 sm:w-fit sm:shrink-0"
          role="group"
        >
          {periods.map(([value, label]) => (
            <button
              aria-pressed={period === value}
              className={`whitespace-nowrap rounded-md px-2 py-1.5 font-poppins text-[11px] font-bold leading-4 transition sm:px-3 ${
                period === value
                  ? "bg-white text-sky-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              key={value}
              onClick={() => setPeriod(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p className="mt-3 text-xs text-rose-600" role="alert">
          {error}
        </p>
      )}
      <div
        aria-label="Grafik asupan kalori"
        className="calorie-chart-scroll mt-5 w-full overflow-x-auto pb-3"
      >
        <div
          className={`h-96 ${period === "month" ? "w-[200%]" : "w-full"}`}
          style={{
            "--color-calories": "#0ea5e9",
          }}
        >
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ top: 20, right: 12, bottom: 0, left: 4 }}
            >
              <defs>
                <linearGradient id="calories-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-calories)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-calories)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <filter
                  id="calories-dot-glow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter
                  id="calories-line-glow"
                  x="-10%"
                  y="-20%"
                  width="120%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="tick"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={11}
                interval={0}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                domain={[
                  0,
                  Math.max(
                    Number(target) || 0,
                    ...data.map((item) => item.calories),
                    1,
                  ),
                ]}
                tickFormatter={(value) => Number(value).toLocaleString("id-ID")}
                tickLine={false}
                width={52}
                fontSize={11}
              />
              <Tooltip
                labelFormatter={(_, payload) => payload?.[0]?.payload?.label}
                formatter={(value) => [
                  `${Number(value).toLocaleString("id-ID")} kcal`,
                  "Kalori",
                ]}
                contentStyle={{
                  border: "none",
                  borderRadius: 12,
                  boxShadow: "0 10px 30px rgba(15,23,42,.12)",
                }}
              />
              <ReferenceLine
                y={Number(target)}
                stroke="#94a3b8"
                strokeDasharray="5 5"
              />
              <Area
                dataKey="calories"
                type="natural"
                fill="url(#calories-fill)"
                stroke="var(--color-calories)"
                strokeWidth={2}
                filter="url(#calories-line-glow)"
                dot={{
                  r: 4,
                  fill: "var(--color-calories)",
                  strokeWidth: 2,
                  stroke: "white",
                  filter: "url(#calories-dot-glow)",
                }}
                activeDot={{ r: 6, strokeWidth: 3, stroke: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
