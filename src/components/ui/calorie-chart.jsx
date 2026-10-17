import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
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

const metrics = [
  {
    key: "calories",
    label: "Kalori",
    unit: "kkal",
    target: 2100,
    color: "#0ea5e9",
  },
  {
    key: "protein_g",
    label: "Protein",
    unit: "g",
    target: 100,
    color: "#8b5cf6",
  },
  {
    key: "carbs_g",
    label: "Karbohidrat",
    unit: "g",
    target: 260,
    color: "#10b981",
  },
  { key: "fat_g", label: "Lemak", unit: "g", target: 70, color: "#f59e0b" },
  { key: "sugar_g", label: "Gula", unit: "g", target: 50, color: "#f43f5e" },
  {
    key: "sodium_mg",
    label: "Natrium",
    unit: "mg",
    target: 2000,
    color: "#f97316",
  },
]

export default function CalorieChart({ targets = {} }) {
  const [period, setPeriod] = useState("day")
  const [metricKey, setMetricKey] = useState("calories")
  const [data, setData] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const metric = metrics.find(({ key }) => key === metricKey) || metrics[0]
  const periodLabel = periods.find(([value]) => value === period)?.[1] || "Hari"
  const target = Number(targets[metric.key]) || metric.target

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900">
            {metric.label} {periodLabel.toLowerCase()}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {loading
              ? `Memuat catatan ${metric.label.toLowerCase()}…`
              : `Total ${metric.label.toLowerCase()} dari catatan makananmu`}
          </p>
        </div>
        <div className="flex w-full items-center gap-2 lg:w-auto lg:shrink-0">
          <div className="group relative min-w-0 flex-1 lg:min-w-36 lg:flex-none">
            <label className="sr-only" htmlFor="nutrition-chart-metric">
              Pilih jenis gizi
            </label>
            <select
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-xs font-semibold text-slate-700 shadow-sm outline-none transition-all duration-300 ease-out hover:translate-x-1 hover:border-sky-100 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 hover:shadow-[0_8px_20px_-14px_rgba(14,165,233,0.8)] focus:border-sky-300 focus:ring-4 focus:ring-sky-100 motion-reduce:transition-none"
              id="nutrition-chart-metric"
              onChange={(event) => setMetricKey(event.target.value)}
              value={metricKey}
            >
              {metrics.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-transform duration-300 group-focus-within:rotate-180 group-hover:text-sky-600"
            />
          </div>
          <div className="group relative min-w-0 flex-1 lg:min-w-36 lg:flex-none">
            <label className="sr-only" htmlFor="nutrition-chart-period">
              Pilih periode
            </label>
            <select
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-xs font-semibold text-slate-700 shadow-sm outline-none transition-all duration-300 ease-out hover:translate-x-1 hover:border-sky-100 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 hover:shadow-[0_8px_20px_-14px_rgba(14,165,233,0.8)] focus:border-sky-300 focus:ring-4 focus:ring-sky-100 motion-reduce:transition-none"
              id="nutrition-chart-period"
              onChange={(event) => setPeriod(event.target.value)}
              value={period}
            >
              {periods.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-transform duration-300 group-focus-within:rotate-180 group-hover:text-sky-600"
            />
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-3 text-xs text-rose-600" role="alert">
          {error}
        </p>
      )}
      <div
        aria-label={`Grafik asupan ${metric.label.toLowerCase()}`}
        className="calorie-chart-scroll mt-5 w-full overflow-x-auto pb-3"
      >
        <div
          className={`h-64 sm:h-80 lg:h-96 ${period === "month" ? "w-[200%] sm:w-full" : "w-full"}`}
          style={{
            "--color-nutrition": metric.color,
          }}
        >
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ top: 20, right: 12, bottom: 0, left: 4 }}
            >
              <defs>
                <linearGradient id="nutrition-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-nutrition)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-nutrition)"
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
                minTickGap={14}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                domain={[
                  0,
                  Math.max(
                    Number(target) || 0,
                    ...data.map((item) => Number(item[metric.key]) || 0),
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
                  `${Number(value).toLocaleString("id-ID")} ${metric.unit}`,
                  metric.label,
                ]}
                contentStyle={{
                  border: "none",
                  borderRadius: 12,
                  boxShadow: "0 10px 30px rgba(15,23,42,.12)",
                }}
              />
              <ReferenceLine
                y={target}
                stroke="#94a3b8"
                strokeDasharray="5 5"
              />
              <Area
                dataKey={metric.key}
                type="natural"
                fill="url(#nutrition-fill)"
                stroke="var(--color-nutrition)"
                strokeWidth={2}
                filter="url(#calories-line-glow)"
                dot={{
                  r: 4,
                  fill: "var(--color-nutrition)",
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
