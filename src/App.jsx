import { useEffect, useRef, useState } from "react"
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom"
import {
  Activity,
  Apple,
  ArrowLeft,
  ArrowRight,
  Bot,
  Camera,
  Check,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Dumbbell,
  Flame,
  HeartPulse,
  History,
  Leaf,
  List,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageCircleMore,
  Mic,
  MoreHorizontal,
  Plus,
  ReceiptText,
  ScanLine,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  UserRound,
  Utensils,
  WandSparkles,
  X,
  Zap,
} from "lucide-react"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { api } from "./lib/api"
import { useAuth } from "./lib/AuthProvider"
import { supabase } from "./lib/supabase"

const cn = (...classes) => classes.filter(Boolean).join(" ")

function Button({
  children,

  onClick,

  variant = "primary",

  className,

  type = "button",

  disabled = false,
}) {
  const styles = {
    primary:
      "bg-sky-500 text-white shadow-[0_10px_25px_-10px_rgba(14,165,233,.8)] hover:bg-sky-600",

    secondary:
      "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-sky-200 hover:bg-sky-50",

    ghost: "text-slate-600 hover:bg-slate-100",

    dark: "bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-slate-800",
  }

  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50",

        styles[variant],

        className,
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}

function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-9 place-items-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-200">
        <Leaf className="size-5" strokeWidth={2.4} />
      </div>
      {!compact && (
        <div className="text-xl font-bold tracking-tight text-slate-900">
          Nutri<span className="text-sky-500">ly</span>
        </div>
      )}
    </div>
  )
}

function Input({
  icon: Icon,

  label,

  placeholder,

  type = "text",

  value,

  onChange,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <span className="relative block">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
        )}
        <input
          className={cn(
            "h-12 w-full rounded-xl border border-slate-200 bg-white pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100",

            Icon ? "pl-11" : "pl-4",
          )}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          required
          type={type}
          value={value}
        />
      </span>
    </label>
  )
}

function Pill({ icon: Icon, children, tone = "sky" }) {
  const tones = {
    sky: "bg-sky-50 text-sky-700 ring-sky-100",

    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",

    amber: "bg-amber-50 text-amber-700 ring-amber-100",

    rose: "bg-rose-50 text-rose-700 ring-rose-100",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1",

        tones[tone],
      )}
    >
      {Icon && <Icon className="size-3.5" />}
      {children}
    </span>
  )
}

function Landing({ navigate }) {
  const features = [
    {
      icon: ScanLine,

      title: "Pindai label makanan",

      text: "Arahkan kamera, pindai, dan pahami kandungan makananmu seketika.",

      color: "bg-sky-50 text-sky-600",
    },

    {
      icon: Bot,

      title: "Tanya AI gizi",

      text: "Dapatkan panduan praktis dan personal berdasarkan asupan harianmu.",

      color: "bg-violet-50 text-violet-600",
    },

    {
      icon: TrendingUp,

      title: "Pantau perkembanganmu",

      text: "Insight dan tren sederhana untuk membantumu terus menjalani kebiasaan sehat.",

      color: "bg-emerald-50 text-emerald-600",
    },
  ]

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Brand />
        <div className="flex items-center gap-2">
          <Button
            className="hidden sm:inline-flex"
            onClick={() => navigate("auth")}
            variant="ghost"
          >
            Masuk
          </Button>
          <Button className="px-4 sm:px-5" onClick={() => navigate("register")}>
            Mulai sekarang <ArrowRight className="size-4" />
          </Button>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-14 sm:px-8 md:pt-20 lg:grid-cols-[1.02fr_.98fr] lg:px-10 lg:pb-32 lg:pt-24">
        <div className="relative z-10 max-w-2xl">
          <h1 className="mt-7 text-5xl font-bold leading-[1.06] tracking-[-0.045em] text-slate-900 sm:text-6xl lg:text-7xl">
            Makan lebih cerdas.
            <br />
            Hidup <span className="relative text-sky-500">lebih sehat.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
            Pelacakan gizi berbasis AI yang mengubah makanan sehari-hari menjadi
            insight personal yang jelas—tanpa perlu menebak-nebak.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-13 px-7 text-base"
              onClick={() => navigate("register")}
            >
              Mulai perjalanan sehatmu <ArrowRight className="size-4.5" />
            </Button>
            <Button
              className="h-13 px-7 text-base"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              variant="secondary"
            >
              Lihat demo
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            {[
              "Gratis untuk memulai",
              "Tanpa kartu kredit",
              "Privat & aman",
            ].map((item) => (
              <span className="flex items-center gap-2" key={item}>
                <span className="grid size-5 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -left-16 -top-20 size-64 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="absolute -bottom-16 -right-20 size-64 rounded-full bg-cyan-100/60 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/80 bg-slate-50/80 p-3 shadow-[0_35px_80px_-25px_rgba(15,23,42,.22)] backdrop-blur sm:p-5">
            <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 sm:p-7">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Ringkasan hari ini
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                    Kamu hebat, Alex!
                  </p>
                </div>
                <div className="grid size-11 place-items-center rounded-full bg-sky-50 text-sky-600">
                  <Activity className="size-5" />
                </div>
              </div>
              <div className="mt-7 grid items-center gap-7 sm:grid-cols-[1fr_1.25fr]">
                <div className="relative mx-auto grid size-40 place-items-center rounded-full bg-[conic-gradient(#0ea5e9_0_73%,#e0f2fe_73%_100%)]">
                  <div className="grid size-29 place-items-center rounded-full bg-white text-center shadow-inner">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">73%</p>
                      <p className="text-xs font-medium text-slate-400">
                        target harian
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    [
                      "Kalori",

                      "1,620",

                      "2,100 kcal",

                      "bg-sky-500",

                      "w-[76%]",
                    ],

                    ["Protein", "74g", "96g", "bg-violet-500", "w-[70%]"],

                    ["Air", "1,8L", "2,5L", "bg-cyan-400", "w-[62%]"],
                  ].map(([name, value, total, color, width]) => (
                    <div key={name}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          {name}
                        </span>
                        <span className="text-slate-400">
                          <strong className="text-slate-600">{value}</strong> /{" "}
                          {total}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className={cn("h-full rounded-full", color, width)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-7 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-sky-600 shadow-sm">
                    <WandSparkles className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Saran cerdas untukmu
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Tambahkan camilan kaya protein agar asupanmu tetap sesuai
                      target sore ini.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl border border-white bg-white p-3 pr-5 shadow-xl shadow-slate-200/70 sm:-left-10">
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Pilihan sehat</p>
              <p className="text-[11px] text-slate-400">Kadar gula rendah</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24" id="features">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <Pill>Dirancang untuk keseharianmu</Pill>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Pilihan lebih baik, dengan cara yang mudah
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Satu tempat untuk memahami makananmu, membangun kebiasaan lebih
              baik, dan merasa lebih bugar.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text, color }) => (
              <article
                className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
                key={title}
              >
                <div
                  className={cn(
                    "grid size-12 place-items-center rounded-2xl",

                    color,
                  )}
                >
                  <Icon className="size-5.5" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 opacity-0 transition group-hover:opacity-100">
                  Pelajari lebih lanjut <ArrowRight className="size-3.5" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function Auth({ navigate, initialMode = "login" }) {
  const [register, setRegister] = useState(initialMode === "register")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState("")
  const user = useAuth().user

  useEffect(() => {
    setRegister(initialMode === "register")
  }, [initialMode])
  useEffect(() => {
    if (user) {
      api("/profile")
        .then((profile) =>
          navigate(
            profile.age && profile.weight_kg ? "/dashboard" : "/onboarding",
            { replace: true },
          ),
        )
        .catch(() => navigate("/dashboard", { replace: true }))
    }
  }, [navigate, user])

  const submit = async (event) => {
    event.preventDefault()
    if (!supabase)
      return setNotice("Supabase belum dikonfigurasi. Isi file .env.")
    setBusy(true)
    setNotice("")
    try {
      if (register) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        if (data.session) navigate("/onboarding", { replace: true })
        else
          setNotice(
            "Akun dibuat. Periksa email untuk mengonfirmasi pendaftaran.",
          )
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error) {
      setNotice(error.message || "Autentikasi gagal.")
    } finally {
      setBusy(false)
    }
  }

  const signInWithGoogle = async () => {
    if (!supabase)
      return setNotice("Supabase belum dikonfigurasi. Isi file .env.")
    setBusy(true)
    setNotice("")
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            import.meta.env.VITE_OAUTH_REDIRECT_URL ||
            `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      setNotice(error.message || "Google OAuth gagal.")
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_1.03fr]">
      <section className="relative hidden overflow-hidden bg-sky-500 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -left-24 top-1/4 size-80 rounded-full border border-white/15" />
        <div className="absolute -left-4 top-1/3 size-52 rounded-full border border-white/15" />
        <div className="absolute -bottom-32 -right-24 size-96 rounded-full bg-cyan-400/30 blur-2xl" />
        <button
          className="relative z-10 flex w-fit items-center gap-2.5 text-xl font-bold"
          onClick={() => navigate("landing")}
        >
          <span className="grid size-9 place-items-center rounded-xl bg-white text-sky-500">
            <Leaf className="size-5" />
          </span>
          Nutrily
        </button>
        <div className="relative z-10 my-auto max-w-lg">
          <Pill icon={Sparkles}>Gizi yang memahami kebutuhanmu</Pill>
          <h1 className="mt-7 text-5xl font-bold leading-tight tracking-[-0.04em]">
            Pilihan kecil.
            <br />
            Perubahan luar biasa.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-sky-50/90">
            Bergabunglah dengan ribuan orang yang membangun pola makan lebih
            sehat—dimulai dari satu insight sederhana.
          </p>
          <div className="mt-10 flex -space-x-2">
            {[
              { name: "AJ", src: "/avatars/aj.jpeg" },

              { name: "MK", src: "/avatars/mk.jpeg" },

              { name: "SR", src: "/avatars/sr.png" },
            ].map(({ name, src }) => (
              <img
                alt={`Foto profil ${name}`}
                className="size-10 rounded-full border-2 border-sky-500 object-cover"
                key={name}
                src={src}
              />
            ))}
            <div className="ml-4 text-sm leading-5 text-sky-50">
              <strong className="block text-white">12.000+ orang</strong>
              sudah merasa lebih baik
            </div>
          </div>
        </div>
        <p className="relative z-10 text-xs text-sky-100">
          Privasi adalah prioritas. Data kesehatanmu tetap milikmu.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-white px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between lg:hidden">
            <button onClick={() => navigate("landing")}>
              <Brand />
            </button>
            <Button onClick={() => navigate("landing")} variant="ghost">
              <X className="size-5" />
            </Button>
          </div>
          <div className="mt-12 lg:mt-0">
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-sky-600">
              {register
                ? "Mulai jalani hidup lebih sehat"
                : "Selamat Datang Kembali Bos!"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {register
                ? "Rutinitas yang lebih sehat dimulai dari beberapa informasi sederhana."
                : "Masuk untuk melanjutkan perjalanan gizimu."}
            </p>
          </div>

          <Button
            className="mt-8 w-full border-slate-200 text-slate-700"
            disabled={busy}
            onClick={signInWithGoogle}
            variant="secondary"
          >
            <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
              <path
                d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
                fill="#4285F4"
              />
              <path
                d="M12 22c2.7 0 4.98-.9 6.63-2.36l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.77-5.61-4.14H3.04v2.62A10 10 0 0 0 12 22Z"
                fill="#34A853"
              />
              <path
                d="M6.39 13.92A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.92V7.46H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.54l3.35-2.62Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.94c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.46l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z"
                fill="#EA4335"
              />
            </svg>
            Lanjutkan dengan Google
          </Button>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-slate-400">
              atau lanjutkan dengan email
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form className="space-y-5" onSubmit={submit}>
            {register && (
              <Input
                icon={UserRound}
                label="Nama lengkap"
                onChange={setName}
                placeholder="Budi Santoso"
                value={name}
              />
            )}
            <Input
              icon={Mail}
              label="Alamat email"
              onChange={setEmail}
              placeholder="nama@contoh.com"
              type="email"
              value={email}
            />
            <div>
              <Input
                icon={LockKeyhole}
                label="Kata sandi"
                onChange={setPassword}
                placeholder="Minimal 8 karakter"
                type="password"
                value={password}
              />
              {!register && (
                <button
                  className="mt-2 float-right text-xs font-semibold text-sky-600 hover:text-sky-700"
                  disabled={busy}
                  onClick={async () => {
                    if (!supabase || !email)
                      return setNotice("Masukkan alamat email terlebih dahulu.")
                    try {
                      const { error } =
                        await supabase.auth.resetPasswordForEmail(email, {
                          redirectTo: `${window.location.origin}/reset-password`,
                        })
                      setNotice(
                        error?.message ||
                          "Tautan reset kata sandi dikirim ke email.",
                      )
                    } catch (error) {
                      setNotice(error.message || "Gagal mengirim tautan reset.")
                    }
                  }}
                  type="button"
                >
                  Lupa kata sandi?
                </button>
              )}
            </div>
            <Button className="mt-3 w-full" disabled={busy} type="submit">
              {busy ? "Memproses…" : register ? "Buat akun" : "Masuk"}
              <ArrowRight className="size-4" />
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-500">
            {register ? "Sudah punya akun?" : "Baru di Nutrily?"}{" "}
            <button
              className="font-semibold text-sky-600 hover:text-sky-700"
              onClick={() => navigate(register ? "/login" : "/register")}
              type="button"
            >
              {register ? "Masuk" : "Buat akun"}
            </button>
          </p>
          {notice && (
            <p
              aria-live="polite"
              className="mt-4 rounded-xl bg-sky-50 p-3 text-sm text-sky-800"
            >
              {notice}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

function ChoiceCard({ active, icon: Icon, title, description, onClick }) {
  return (
    <button
      className={cn(
        "relative flex min-h-24 w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",

        active
          ? "border-sky-400 bg-sky-50 shadow-[0_0_0_3px_rgba(14,165,233,.08)]"
          : "border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50",
      )}
      onClick={onClick}
    >
      {Icon && (
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl",

            active ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500",
          )}
        >
          <Icon className="size-5" />
        </span>
      )}
      <span>
        <span className="block text-sm font-bold text-slate-800">{title}</span>
        {description && (
          <span className="mt-1 block text-xs leading-5 text-slate-500">
            {description}
          </span>
        )}
      </span>
      <span
        className={cn(
          "absolute right-4 top-4 grid size-5 place-items-center rounded-full border",

          active
            ? "border-sky-500 bg-sky-500 text-white"
            : "border-slate-300 bg-white",
        )}
      >
        {active && <Check className="size-3" strokeWidth={3} />}
      </span>
    </button>
  )
}

function Onboarding({ navigate }) {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [gender, setGender] = useState("Pria")
  const [status, setStatus] = useState("Tidak ada")
  const [activity, setActivity] = useState("Sedang")
  const [goal, setGoal] = useState("Menurunkan berat badan")
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState("")
  const steps = ["Tentang kamu", "Profil tubuh", "Aktivitas harian", "Targetmu"]

  useEffect(() => {
    api("/profile")
      .then((profile) => {
        if (profile.age) setAge(String(profile.age))
        if (profile.weight_kg) setWeight(String(profile.weight_kg))
        if (profile.height_cm) setHeight(String(profile.height_cm))
        if (profile.gender) setGender(profile.gender)
        if (profile.activity) setActivity(profile.activity)
        if (profile.goal) setGoal(profile.goal)
        if (profile.pregnancy_status) setStatus(profile.pregnancy_status)
      })
      .catch((error) => setNotice(error.message))
  }, [])

  const finishOnboarding = async () => {
    if (!age || !weight || !height) {
      setNotice("Lengkapi usia, berat badan, dan tinggi badan terlebih dahulu.")
      return
    }
    setSaving(true)
    setNotice("")
    try {
      await api("/profile", {
        method: "PUT",
        body: JSON.stringify({
          full_name: user?.user_metadata?.full_name || "",
          age: Number(age),
          gender,
          pregnancy_status: gender === "Wanita" ? status : null,
          weight_kg: Number(weight),
          height_cm: Number(height),
          activity,
          goal,
        }),
      })
      navigate("/dashboard", { replace: true })
    } catch (error) {
      setNotice(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Brand />
          <button
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
            onClick={async () => {
              await supabase?.auth.signOut()
              navigate("/")
            }}
          >
            Simpan dan keluar <X className="size-4" />
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 md:grid-cols-[220px_1fr] md:py-12 lg:gap-16">
        <aside className="hidden md:block">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
            Profilmu
          </p>
          <div className="mt-6 space-y-1">
            {steps.map((name, index) => (
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold",

                  index === step
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-slate-400",
                )}
                key={name}
              >
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full text-xs",

                    index < step
                      ? "bg-emerald-500 text-white"
                      : index === step
                        ? "bg-sky-500 text-white"
                        : "bg-slate-200 text-slate-500",
                  )}
                >
                  {index < step ? <Check className="size-3.5" /> : index + 1}
                </span>
                {name}
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-sky-100/60 p-4">
            <div className="grid size-9 place-items-center rounded-xl bg-white text-sky-600">
              <ShieldCheck className="size-4.5" />
            </div>
            <p className="mt-3 text-xs font-bold text-slate-700">
              Datamu bersifat pribadi
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Kami hanya menggunakannya untuk menyesuaikan target harianmu.
            </p>
          </div>
        </aside>

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-8 md:p-10">
          <div className="mb-8 md:hidden">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Langkah {step + 1} dari 4</span>
              <span className="text-sky-600">{steps[step]}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-500"
                style={{ width: `${((step + 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {step === 0 && (
            <div>
              <Pill icon={UserRound}>Mari berkenalan</Pill>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                Ceritakan sedikit tentang dirimu
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Informasi ini membantu kami menghitung target gizi yang sesuai
                dengan tubuh dan keseharianmu.
              </p>
              <div className="mt-8 max-w-xs">
                <Input
                  label="Berapa usiamu?"
                  onChange={setAge}
                  placeholder="Contoh: 28"
                  type="number"
                  value={age}
                />
              </div>
              <p className="mb-3 mt-8 text-sm font-semibold text-slate-700">
                Jenis kelamin
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Pria", "Wanita"].map((item) => (
                  <ChoiceCard
                    active={gender === item}
                    icon={CircleUserRound}
                    key={item}
                    onClick={() => setGender(item)}
                    title={item}
                  />
                ))}
              </div>
              {gender === "Wanita" && (
                <div className="mt-8">
                  <p className="mb-1 text-sm font-semibold text-slate-700">
                    Status kehamilan atau menyusui
                  </p>
                  <p className="mb-3 text-xs text-slate-400">
                    Ini membantu menyesuaikan rekomendasi energi dan zat gizi.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "Tidak ada",

                      "Trimester 1",

                      "Trimester 2",

                      "Trimester 3",

                      "Menyusui 6 bulan pertama",

                      "Menyusui 6 bulan kedua",
                    ].map((item) => (
                      <button
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left text-xs font-semibold transition",

                          status === item
                            ? "border-sky-400 bg-sky-50 text-sky-700"
                            : "border-slate-200 text-slate-600 hover:border-sky-200",
                        )}
                        key={item}
                        onClick={() => setStatus(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <Pill icon={Activity}>Profil tubuhmu</Pill>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                Beberapa informasi singkat tentang tubuhmu
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Digunakan untuk memperkirakan kebutuhan energi dan gizimu.
              </p>
              <div className="mt-9 grid gap-5 sm:grid-cols-2">
                <Input
                  label="Berat badan (kg)"
                  onChange={setWeight}
                  placeholder="Contoh: 68"
                  type="number"
                  value={weight}
                />
                <Input
                  label="Tinggi badan (cm)"
                  onChange={setHeight}
                  placeholder="Contoh: 172"
                  type="number"
                  value={height}
                />
              </div>
              <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
                <div className="flex gap-3">
                  <Sparkles className="mt-0.5 size-5 shrink-0 text-sky-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Mengapa kami menanyakannya?
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Tinggi dan berat badan membantu kami memperkirakan
                      metabolisme basal. Kamu bisa memperbaruinya kapan saja.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <Pill icon={Dumbbell}>Rutinitasmu</Pill>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                Seberapa aktif keseharianmu?
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Pilih opsi yang paling menggambarkan aktivitasmu selama
                seminggu.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  ["Minim gerak", "Lebih banyak duduk dan jarang berolahraga"],

                  ["Ringan", "Olahraga ringan 1–3 hari per minggu"],

                  ["Sedang", "Berolahraga 3–5 hari per minggu"],

                  ["Sangat aktif", "Olahraga berat 6–7 hari per minggu"],

                  [
                    "Aktivitas fisik berat",
                    "Pekerjaan atau latihan fisik berat",
                  ],
                ].map(([title, text]) => (
                  <ChoiceCard
                    active={activity === title}
                    icon={title === "Minim gerak" ? Clock3 : Activity}
                    key={title}
                    onClick={() => setActivity(title)}
                    title={title}
                    description={text}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <Pill icon={Target}>Targetmu</Pill>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                Apa yang ingin kamu capai?
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Kami akan membuat target harian yang seimbang, bukan pola diet
                ekstrem.
              </p>
              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                <ChoiceCard
                  active={goal === "Menurunkan berat badan"}
                  icon={TrendingUp}
                  onClick={() => setGoal("Menurunkan berat badan")}
                  title="Menurunkan berat badan"
                  description="Defisit kalori ringan yang berkelanjutan"
                />
                <ChoiceCard
                  active={goal === "Menambah berat badan"}
                  icon={Dumbbell}
                  onClick={() => setGoal("Menambah berat badan")}
                  title="Menambah berat badan"
                  description="Tingkatkan asupan kalori secara seimbang"
                />
              </div>
              <div className="mt-8 rounded-2xl bg-slate-900 p-5 text-white sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-sky-300">
                    Rencanamu siap dihitung
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    Target personal yang fleksibel untuk keseharianmu.
                  </p>
                </div>
                <Zap className="mt-4 size-7 text-amber-300 sm:mt-0" />
              </div>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
            <Button
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              variant="ghost"
            >
              <ArrowLeft className="size-4" /> Kembali
            </Button>
            <Button
              disabled={saving}
              onClick={() =>
                step < 3 ? setStep(step + 1) : finishOnboarding()
              }
            >
              {saving
                ? "Menyimpan…"
                : step === 3
                  ? "Hitung rencanaku"
                  : "Lanjutkan"}
              {step === 3 ? (
                <Sparkles className="size-4" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </Button>
          </div>
          {notice && (
            <p
              aria-live="polite"
              className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
            >
              {notice}
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

function AppShell({ children, active, navigate }) {
  const { user } = useAuth()
  const initials = (user?.user_metadata?.full_name || user?.email || "N")
    .split(/[ @]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
  const items = [
    ["dashboard", "Ringkasan", Activity],
    ["scanner", "Pemindai makanan", ScanLine],
    ["chat", "Konsultan gizi AI", MessageCircleMore],
    ["meals", "Riwayat makan", List],
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-100 bg-white p-5 lg:flex">
        <div className="px-2 py-2">
          <Brand />
        </div>
        <nav className="mt-8 space-y-1.5">
          {items.map(([screen, label, Icon]) => (
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition",

                active === screen
                  ? "bg-sky-50 text-sky-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
              )}
              key={screen}
              onClick={() => navigate(screen)}
            >
              <Icon className="size-5" />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="mb-4 rounded-2xl bg-slate-900 p-4 text-white">
            <Sparkles className="size-5 text-sky-300" />
            <p className="mt-3 text-sm font-bold">Catat asupanmu</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Pantau perkembangan gizimu setiap hari.
            </p>
          </div>
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
            onClick={async () => {
              await supabase?.auth.signOut()
              navigate("/login")
            }}
          >
            <LogOut className="size-5" /> Keluar
          </button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-100 bg-white/90 px-5 backdrop-blur sm:px-8">
          <div className="lg:hidden">
            <Brand compact />
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-medium text-slate-400">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <p className="mt-0.5 font-bold text-slate-800">
              Selamat pagi,{" "}
              {user?.user_metadata?.full_name?.split(" ")[0] ||
                user?.email?.split("@")[0] ||
                "teman"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Riwayat makan"
              onClick={() => navigate("/meals")}
              className="relative grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <History className="size-4.5" />
            </button>
            <button
              aria-label="Keluar dari akun"
              className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
              onClick={async () => {
                await supabase?.auth.signOut()
                navigate("/login")
              }}
            >
              <LogOut className="size-4" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
              {user?.user_metadata?.avatar_url ? (
                <img
                  alt="Foto profil pengguna"
                  className="size-10 rounded-xl object-cover"
                  src={user.user_metadata.avatar_url}
                />
              ) : (
                <div
                  aria-label="Inisial pengguna"
                  className="grid size-10 place-items-center rounded-xl bg-sky-100 text-sm font-bold text-sky-700"
                >
                  {initials}
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className="text-xs text-slate-400">Akun Nutrily</p>
              </div>
              <ChevronDown className="hidden size-4 text-slate-400 sm:block" />
            </div>
          </div>
        </header>
        {children}
      </div>
      <nav className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-around rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-300/70 backdrop-blur lg:hidden">
        {items.map(([screen, label, Icon]) => (
          <button
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-semibold",

              active === screen ? "bg-sky-50 text-sky-600" : "text-slate-400",
            )}
            key={screen}
            onClick={() => navigate(screen)}
          >
            <Icon className="size-5" />
            {label.split(" ")[0]}
          </button>
        ))}
      </nav>
    </div>
  )
}

function Dashboard({ navigate }) {
  const [summary, setSummary] = useState(null)
  const [loadError, setLoadError] = useState("")
  useEffect(() => {
    api("/dashboard")
      .then(setSummary)
      .catch((error) => setLoadError(error.message))
  }, [])
  const totals = summary?.totals || {}
  const targets = summary?.targets || {}
  const macros = [
    [
      "Kalori",
      totals.calories || 0,
      targets.calories || 2100,
      "kcal",
      "bg-sky-500",
    ],
    [
      "Protein",
      totals.protein_g || 0,
      targets.protein_g || 100,
      "g",
      "bg-violet-500",
    ],
    ["Lemak", totals.fat_g || 0, targets.fat_g || 70, "g", "bg-amber-400"],
    [
      "Karbohidrat",
      totals.carbs_g || 0,
      targets.carbs_g || 260,
      "g",
      "bg-emerald-500",
    ],
  ].map(([name, current, target, unit, color]) => ({
    name,
    current: Number(current).toFixed(0),
    target: `${target} ${unit}`,
    pct: `${Math.min(100, Math.round((current / target) * 100))}%`,
    color,
  }))
  const chartData = [
    { name: "Protein", value: totals.protein_g, color: "#8B5CF6" },
    { name: "Lemak", value: totals.fat_g, color: "#F59E0B" },
    { name: "Karbohidrat", value: totals.carbs_g, color: "#10B981" },
  ].filter(({ value }) => value > 0)
  return (
    <AppShell active="dashboard" navigate={navigate}>
      <main className="mx-auto max-w-7xl px-5 pb-28 pt-7 sm:px-8 lg:pb-10">
        <div className="mb-7 md:flex md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-600">
              Ringkasan harianmu
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Gambaran asupan gizimu
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Tinggal{" "}
              {Math.max(
                0,
                (targets.calories || 2100) - (totals.calories || 0),
              ).toFixed(0)}{" "}
              kkal lagi untuk mencapai target hari ini.
            </p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate("scanner")}>
            <Plus className="size-4" /> Catat makanan
          </Button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Asupan gizi harian
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Ringkasan catatan makanan hari ini
                </p>
              </div>
              <button className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-50">
                <MoreHorizontal className="size-5" />
              </button>
            </div>
            <div className="mt-5 grid items-center gap-7 md:grid-cols-[260px_1fr]">
              <div className="relative mx-auto h-60 w-full max-w-60">
                <ResponsiveContainer height="100%" width="100%">
                  <PieChart>
                    <Pie
                      cornerRadius={8}
                      data={chartData}
                      dataKey="value"
                      innerRadius={72}
                      outerRadius={96}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {chartData.map((entry) => (
                        <Cell fill={entry.color} key={entry.name} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        border: "none",

                        borderRadius: "12px",

                        boxShadow: "0 10px 30px rgba(15,23,42,.12)",

                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                  <div>
                    <p className="text-4xl font-bold tracking-tight text-slate-900">
                      {Math.min(
                        100,
                        Math.round(
                          ((totals.calories || 0) /
                            (targets.calories || 2100)) *
                            100,
                        ),
                      )}
                      %
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      dari target harian
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {macros.map((item) => (
                  <div key={item.name}>
                    <div className="mb-2 flex items-end justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn("size-2 rounded-full", item.color)}
                        />
                        <span className="text-xs font-semibold text-slate-600">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        <strong className="text-sm text-slate-800">
                          {item.current}
                          {item.name === "Kalori" ? "" : "g"}
                        </strong>{" "}
                        / {item.target}
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn("h-full rounded-full", item.color)}
                        style={{ width: item.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-200">
            <div className="absolute -right-12 -top-12 size-40 rounded-full bg-sky-500/20 blur-2xl" />
            <Pill icon={Sparkles}>Ringkasan asupan</Pill>
            <h2 className="relative mt-5 text-xl font-bold leading-7">
              {Number(totals.protein_g || 0) < 70
                ? "Tambahkan sumber protein pada menu berikutnya."
                : "Asupan proteinmu hari ini sudah tercatat dengan baik."}
            </h2>
            <p className="relative mt-3 text-sm leading-6 text-slate-400">
              Ringkasan dihitung dari makanan yang kamu catat hari ini.
            </p>
            <Button
              className="relative mt-6 w-full border-white/10 bg-white/10 text-white hover:bg-white/15"
              onClick={() => navigate("chat")}
              variant="secondary"
            >
              Tanya konsultan gizi AI <ArrowRight className="size-4" />
            </Button>
            <div className="relative mt-6 flex items-center gap-4 border-t border-white/10 pt-5">
              <div className="grid size-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <Leaf className="size-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Kualitas gizi</p>
                <p className="mt-0.5 text-sm font-bold">
                  {Math.round(
                    (Number(totals.calories || 0) /
                      Number(targets.calories || 2100)) *
                      100,
                  )}
                  % dari target
                </p>
              </div>
              <Pill tone="emerald">Hari ini</Pill>
            </div>
          </section>
        </div>

        {loadError && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
          >
            {loadError}
          </p>
        )}
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Riwayat tersimpan
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Makanan yang tersimpan dari hasil pemindaian
                </p>
              </div>
              <button
                className="text-xs font-semibold text-sky-600"
                onClick={() => navigate("/meals")}
              >
                Lihat semua
              </button>
            </div>
            <div className="mt-5 divide-y divide-slate-100">
              {(summary?.meals || []).slice(0, 5).map((meal) => (
                <button
                  className="flex w-full items-center gap-3 py-4 text-left first:pt-1 last:pb-0"
                  key={meal.id}
                  onClick={() => navigate("/meals")}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500">
                    <Utensils className="size-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-slate-700">
                      {meal.name}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">
                      {new Date(meal.created_at).toLocaleString("id-ID")}
                    </span>
                  </span>
                  <Pill>{meal.calories} kcal</Pill>
                </button>
              ))}
              {summary && !summary.meals?.length && (
                <p className="py-8 text-center text-sm text-slate-400">
                  Belum ada makanan tercatat hari ini.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-bold text-slate-900">Aksi cepat</h2>
            <p className="mt-1 text-xs text-slate-400">
              Apa yang ingin kamu lakukan?
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                className="group rounded-2xl border border-sky-100 bg-sky-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-100"
                onClick={() => navigate("scanner")}
              >
                <span className="grid size-11 place-items-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-200">
                  <ScanLine className="size-5" />
                </span>
                <span className="mt-5 flex items-center justify-between">
                  <span>
                    <span className="block text-sm font-bold text-slate-800">
                      Pindai makanan
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Baca label gizi
                    </span>
                  </span>
                  <ArrowRight className="size-4 text-sky-500 transition group-hover:translate-x-1" />
                </span>
              </button>
              <button
                className="group rounded-2xl border border-violet-100 bg-violet-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-100"
                onClick={() => navigate("chat")}
              >
                <span className="grid size-11 place-items-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-200">
                  <Bot className="size-5" />
                </span>
                <span className="mt-5 flex items-center justify-between">
                  <span>
                    <span className="block text-sm font-bold text-slate-800">
                      Tanya AI
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Dapatkan panduan personal
                    </span>
                  </span>
                  <ArrowRight className="size-4 text-violet-500 transition group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  )
}

function Scanner({ navigate }) {
  const [scanState, setScanState] = useState("ready")
  const [scanMode, setScanMode] = useState("label")
  const [items, setItems] = useState([])
  const [notice, setNotice] = useState("")
  const [busy, setBusy] = useState(false)
  const [advice, setAdvice] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState("")
  const imageInput = useRef(null)
  const toNumber = (value) => {
    if (value == null || value === "") return 0
    if (typeof value === "number") return Number.isFinite(value) ? value : 0
    const cleaned = String(value)
      .replace(",", ".")
      .replace(/[^0-9.\-]/g, "")
    if (!cleaned || cleaned === "-" || cleaned === ".") return 0
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : 0
  }
  const showNumber = (value) =>
    value == null || value === "" ? "?" : toNumber(value)
  const totals = items.reduce(
    (sum, item) => ({
      calories: sum.calories + toNumber(item.calories),
      protein_g: sum.protein_g + toNumber(item.protein_g),
      carbs_g: sum.carbs_g + toNumber(item.carbs_g),
      fat_g: sum.fat_g + toNumber(item.fat_g),
      sugar_g: sum.sugar_g + toNumber(item.sugar_g),
      sodium_mg: sum.sodium_mg + toNumber(item.sodium_mg),
    }),
    {
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      sugar_g: 0,
      sodium_mg: 0,
    },
  )
  const scanImage = async (event) => {
    const image = event.target.files?.[0]
    if (!image) return
    setScanState("scanning")
    setNotice("")
    const form = new FormData()
    form.append("image", image)
    form.append("mode", scanMode)
    try {
      const result = await api("/scan", { method: "POST", body: form })
      const found = Array.isArray(result.items) ? result.items : [result]
      if (!found.length) {
        setNotice(
          scanMode === "receipt"
            ? "Tidak ada makanan/minuman/buah terbaca di struk. Pastikan foto struk jelas."
            : "Tidak ada hasil terbaca. Pastikan label jelas.",
        )
        setScanState(items.length ? "confirm" : "ready")
        return
      }
      setItems((current) => [...current, ...found])
      setScanState("confirm")
    } catch (error) {
      setNotice(error.message)
      setScanState(items.length ? "confirm" : "ready")
    } finally {
      event.target.value = ""
    }
  }
  const removeItem = (index) =>
    setItems((current) => current.filter((_, i) => i !== index))
  const confirmItems = async () => {
    if (!items.length || busy) return
    setBusy(true)
    setNotice("")
    try {
      await Promise.all(
        items.map((item) =>
          api("/meals", {
            method: "POST",
            body: JSON.stringify({
              name: item.name || "Hasil pemindaian",
              calories: toNumber(item.calories),
              protein_g: toNumber(item.protein_g),
              carbs_g: toNumber(item.carbs_g),
              fat_g: toNumber(item.fat_g),
              ...(item.sugar_g != null
                ? { sugar_g: toNumber(item.sugar_g) }
                : {}),
              ...(item.sodium_mg != null
                ? { sodium_mg: toNumber(item.sodium_mg) }
                : {}),
              ...(item.serving_size ? { serving_size: item.serving_size } : {}),
            }),
          }),
        ),
      )
      const id = crypto.randomUUID()
      setSessionId(id)
      const lines = items.map(
        (item) =>
          `- ${item.name || "Makanan"} (${item.serving_size || "1 sajian"}): ${toNumber(item.calories)} kcal, protein ${toNumber(item.protein_g)}g, karbo ${toNumber(item.carbs_g)}g, lemak ${toNumber(item.fat_g)}g, gula ${toNumber(item.sugar_g)}g, natrium ${toNumber(item.sodium_mg)}mg`,
      )
      const { answer } = await api("/chat", {
        method: "POST",
        body: JSON.stringify({
          conversation_id: id,
          message: `Saya baru memindai makanan berikut:\n${lines.join("\n")}\nTotal: ${totals.calories} kcal, protein ${totals.protein_g}g, karbo ${totals.carbs_g}g, lemak ${totals.fat_g}g, gula ${totals.sugar_g}g, natrium ${totals.sodium_mg}mg.\nBeri saran gizi singkat (maksimal 5 poin) untuk sesi makan ini. Hanya bahas gizi dan kesehatan.`,
        }),
      })
      setAdvice(answer)
      setMessages([{ from: "ai", text: answer }])
      setScanState("summary")
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusy(false)
    }
  }
  const ask = async (event) => {
    event.preventDefault()
    if (!question.trim() || busy) return
    const text = question.trim()
    setBusy(true)
    setNotice("")
    setMessages((current) => [...current, { from: "user", text }])
    setQuestion("")
    try {
      const { answer } = await api("/chat", {
        method: "POST",
        body: JSON.stringify({ conversation_id: sessionId, message: text }),
      })
      setMessages((current) => [...current, { from: "ai", text: answer }])
    } catch (error) {
      setNotice(error.message)
      setMessages((current) =>
        current.filter((item) => !(item.from === "user" && item.text === text)),
      )
      setQuestion(text)
    } finally {
      setBusy(false)
    }
  }
  const resetScan = () => {
    setItems([])
    setAdvice("")
    setSessionId("")
    setMessages([])
    setQuestion("")
    setNotice("")
    setScanState("ready")
  }

  return (
    <AppShell active="scanner" navigate={navigate}>
      <main className="mx-auto max-w-6xl px-5 pb-28 pt-7 sm:px-8 lg:pb-10">
        <button
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
          onClick={() => navigate("dashboard")}
        >
          <ArrowLeft className="size-4" /> Kembali ke dasbor
        </button>
        <div>
          <p className="text-sm font-semibold text-sky-600">Pemindai cerdas</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Ketahui kandungannya dalam hitungan detik
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Pindai label informasi gizi produk atau struk belanja.
          </p>
          <div className="mt-4 grid max-w-md grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
            {[
              ["label", "Label produk", ScanLine],
              ["receipt", "Struk", ReceiptText],
            ].map(([value, label, Icon]) => (
              <button
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                  scanMode === value
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
                key={value}
                onClick={() => setScanMode(value)}
                type="button"
              >
                <Icon className="size-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        {notice && (
          <p
            aria-live="polite"
            className="mt-5 rounded-xl bg-sky-50 p-3 text-sm text-sky-800"
          >
            {notice}
          </p>
        )}
        <div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-2xl bg-slate-900">
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,rgba(14,165,233,.35),transparent_60%)]" />
              {scanState === "ready" && (
                <div className="relative z-10 max-w-sm px-6 text-center">
                  <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-white/10 text-sky-300 ring-1 ring-white/10 backdrop-blur">
                    <Camera className="size-7" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-white">
                    {scanMode === "receipt"
                      ? "Posisikan struk di dalam bingkai"
                      : "Posisikan label di dalam bingkai"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {scanMode === "receipt"
                      ? "Pastikan nama item dan jumlah terbaca jelas."
                      : "Pastikan label mendapat pencahayaan yang cukup dan mudah dibaca."}
                  </p>
                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button onClick={() => imageInput.current?.click()}>
                      <ScanLine className="size-4" /> Buka kamera
                    </Button>
                    <Button
                      className="border-white/10 bg-white/10 text-white hover:bg-white/15"
                      onClick={() => imageInput.current?.click()}
                      variant="secondary"
                    >
                      <Upload className="size-4" /> Unggah gambar
                    </Button>
                  </div>
                </div>
              )}
              {scanState === "scanning" && (
                <div className="relative z-10 text-center">
                  <div className="relative mx-auto h-52 w-72 rounded-2xl border-2 border-sky-400/70">
                    <span className="scan-line absolute inset-x-2 top-3 h-0.5 bg-sky-300 shadow-[0_0_18px_3px_rgba(125,211,252,.8)]" />
                    <span className="absolute -left-1 -top-1 size-7 border-l-4 border-t-4 border-sky-400" />
                    <span className="absolute -right-1 -top-1 size-7 border-r-4 border-t-4 border-sky-400" />
                    <span className="absolute -bottom-1 -left-1 size-7 border-b-4 border-l-4 border-sky-400" />
                    <span className="absolute -bottom-1 -right-1 size-7 border-b-4 border-r-4 border-sky-400" />
                  </div>
                  <p className="mt-7 text-sm font-semibold text-white">
                    {scanMode === "receipt"
                      ? "Membaca struk…"
                      : "Membaca label gizi…"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {scanMode === "receipt"
                      ? "Mendaftar item dan estimasi gizinya"
                      : "Mengambil data gula, natrium, dan takaran saji"}
                  </p>
                </div>
              )}
              {(scanState === "confirm" || scanState === "summary") && (
                <div className="relative z-10 max-w-sm px-6 text-center">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                    <Check className="size-8" strokeWidth={2.5} />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-white">
                    {scanState === "summary"
                      ? "Ringkasan siap"
                      : "Pemindaian selesai"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {items.length
                      ? `${items.length} item siap dikonfirmasi`
                      : "Periksa hasil OCR sebelum menyimpan."}
                  </p>
                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                      className="border-white/10 bg-white/10 text-white hover:bg-white/15"
                      onClick={() => imageInput.current?.click()}
                      variant="secondary"
                    >
                      Pindai lagi
                    </Button>
                    {scanState === "summary" && (
                      <Button onClick={resetScan} variant="secondary">
                        Sesi baru
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <input
              ref={imageInput}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={scanImage}
              type="file"
            />
            <div className="mt-4 flex items-center justify-center gap-5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" /> Gambar diproses sementara
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5" /> OCR berbasis AI
              </span>
            </div>
          </section>

          <section
            className={cn(
              "rounded-3xl border bg-white p-5 shadow-sm transition sm:p-6",

              scanState === "confirm" || scanState === "summary"
                ? "border-sky-100"
                : "border-slate-100",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-sky-500">
                  {scanState === "summary"
                    ? "Ringkasan sesi"
                    : scanState === "confirm"
                      ? "Konfirmasi hasil"
                      : "Ringkasan pemindaian"}
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {scanState === "summary"
                    ? "Total + saran AI"
                    : scanState === "confirm"
                      ? `${items.length} item dipindai`
                      : "Menunggu label"}
                </h2>
              </div>
              {(scanState === "confirm" || scanState === "summary") && (
                <Pill>Hasil OCR</Pill>
              )}
            </div>
            {scanState === "confirm" && (
              <p className="mt-2 text-xs text-slate-400">
                Hapus item yang salah, tambah bila kurang, lalu konfirmasi untuk
                simpan dan minta saran AI.
              </p>
            )}

            {scanState !== "confirm" && scanState !== "summary" ? (
              <div className="grid min-h-80 place-items-center text-center">
                <div>
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-50 text-slate-300">
                    <Utensils className="size-6" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-500">
                    {scanState === "scanning"
                      ? "Membaca label…"
                      : "Hasil pemindaian akan muncul di sini"}
                  </p>
                  <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                    Kami akan menandai nilai yang aman dan hal-hal yang perlu
                    diperhatikan.
                  </p>
                </div>
              </div>
            ) : scanState === "confirm" ? (
              <>
                <div className="mt-6 space-y-3">
                  {items.map((item, index) => (
                    <div
                      className="rounded-2xl border border-slate-100 p-4"
                      key={`${item.name}-${index}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-slate-800">
                              {item.name || "Hasil pemindaian"}
                            </p>
                            {item.category && (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {item.serving_size || "1 sajian"}
                          </p>
                        </div>
                        <button
                          aria-label={`Hapus ${item.name || "item"}`}
                          className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => removeItem(index)}
                          type="button"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        {[
                          [`${showNumber(item.calories)}`, "kcal"],
                          [`${showNumber(item.protein_g)}g`, "protein"],
                          [`${showNumber(item.carbs_g)}g`, "karbo"],
                          [`${showNumber(item.fat_g)}g`, "lemak"],
                          [`${showNumber(item.sugar_g)}g`, "gula"],
                          [`${showNumber(item.sodium_mg)}mg`, "natrium"],
                        ].map(([value, label]) => (
                          <div
                            className="rounded-xl bg-slate-50 px-2 py-2"
                            key={label}
                          >
                            <p className="text-xs font-bold text-slate-800">
                              {value}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>
                      {item.note && (
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {item.note}
                        </p>
                      )}
                    </div>
                  ))}
                  {!items.length && (
                    <p className="py-8 text-center text-sm text-slate-400">
                      Semua item dihapus. Pindai lagi untuk menambah.
                    </p>
                  )}
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Button
                    onClick={() => imageInput.current?.click()}
                    variant="secondary"
                  >
                    <Plus className="size-4" /> Tambah pindai
                  </Button>
                  <Button
                    disabled={!items.length || busy}
                    onClick={confirmItems}
                  >
                    {busy ? "Memproses…" : "Konfirmasi"}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                  {[
                    [`${totals.calories}`, "kcal"],
                    [`${totals.protein_g}g`, "protein"],
                    [`${totals.carbs_g}g`, "karbo"],
                    [`${totals.fat_g}g`, "lemak"],
                    [`${totals.sugar_g}g`, "gula"],
                    [`${totals.sodium_mg}mg`, "natrium"],
                  ].map(([value, label]) => (
                    <div
                      className="rounded-2xl border border-sky-100 bg-sky-50/60 px-2 py-3"
                      key={label}
                    >
                      <p className="text-sm font-bold text-slate-900">
                        {value}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
                {advice && (
                  <div className="mt-5 rounded-2xl bg-slate-900 p-5 text-white">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-sky-300" />
                      <p className="text-xs font-bold uppercase tracking-wide text-sky-300">
                        Saran AI sesi ini
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      {advice}
                    </p>
                  </div>
                )}
                <div className="mt-5 space-y-3">
                  {messages.slice(1).map((item, index) => (
                    <div
                      className={cn(
                        "max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6",
                        item.from === "ai"
                          ? "bg-sky-50 text-slate-700"
                          : "ml-auto bg-sky-500 text-white",
                      )}
                      key={`sesi-${index}`}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
                <form className="mt-4 flex gap-2" onSubmit={ask}>
                  <input
                    className="h-12 flex-1 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-50"
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Konsultasi lanjutan sesi ini…"
                    value={question}
                  />
                  <button
                    aria-label="Kirim pertanyaan sesi"
                    className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
                    disabled={busy}
                    type="submit"
                  >
                    <Send className="size-5" />
                  </button>
                </form>
                <p className="mt-2 text-[11px] text-slate-400">
                  Konsultasi hanya membahas gizi/kesehatan sesi makan ini.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="secondary"
                  >
                    Lihat dasbor
                  </Button>
                  <Button onClick={resetScan} variant="secondary">
                    Sesi baru
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
        {notice && (
          <p
            aria-live="polite"
            className="mt-4 rounded-xl bg-sky-50 p-3 text-sm text-sky-800"
          >
            {notice}
          </p>
        )}
      </main>
    </AppShell>
  )
}

function Chat({ navigate }) {
  const [message, setMessage] = useState("")
  const [notice, setNotice] = useState("")
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState([])
  const [conversationId, setConversationId] = useState("")
  const [conversations, setConversations] = useState([])
  const [showMobileChats, setShowMobileChats] = useState(false)
  useEffect(() => {
    Promise.all([api("/chat"), api("/conversations")])
      .then(([result, items]) => {
        setConversationId(result.conversation_id || crypto.randomUUID())
        setConversations(items)
        setMessages(
          result.messages.map((item) => ({
            from: item.role === "assistant" ? "ai" : "user",
            text: item.content,
          })),
        )
      })
      .catch((error) => setNotice(error.message))
  }, [])

  const openConversation = async (id) => {
    setNotice("")
    setShowMobileChats(false)
    try {
      const result = await api(
        `/chat?conversation_id=${encodeURIComponent(id)}`,
      )
      setConversationId(id)
      setMessages(
        result.messages.map((item) => ({
          from: item.role === "assistant" ? "ai" : "user",
          text: item.content,
        })),
      )
    } catch (error) {
      setNotice(error.message)
    }
  }

  const startNewChat = () => {
    setConversationId(crypto.randomUUID())

    setMessages([
      {
        from: "ai",
        text: "Percakapan baru. Ada yang ingin kamu tanyakan tentang makanan atau gizimu?",
      },
    ])
    setMessage("")
    setNotice("")
    setShowMobileChats(false)
  }

  const send = async (event) => {
    event.preventDefault()
    if (!message.trim() || sending) return
    const question = message.trim()
    setSending(true)
    setNotice("")
    setMessages((current) => [...current, { from: "user", text: question }])
    setMessage("")
    try {
      const result = await api("/chat", {
        method: "POST",
        body: JSON.stringify({
          message: question,
          conversation_id: conversationId,
        }),
      })
      setMessages((current) => [
        ...current,
        { from: "ai", text: result.answer },
      ])
      setConversations(await api("/conversations"))
    } catch (error) {
      setNotice(error.message)
      setMessages((current) =>
        current.filter(
          (item) => !(item.from === "user" && item.text === question),
        ),
      )
      setMessage(question)
    } finally {
      setSending(false)
    }
  }

  return (
    <AppShell active="chat" navigate={navigate}>
      <main className="h-[calc(100vh-5rem)] p-0 sm:p-5">
        <div className="relative mx-auto grid h-full max-w-7xl overflow-hidden border-slate-100 bg-white shadow-sm sm:rounded-3xl sm:border lg:grid-cols-[260px_1fr]">
          <aside className="hidden border-r border-slate-100 bg-slate-50/70 p-4 lg:block">
            <Button
              className="w-full"
              onClick={startNewChat}
              variant="secondary"
            >
              <Plus className="size-4" /> Percakapan baru
            </Button>
            <p className="mb-2 mt-7 px-2 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
              Obrolan terbaru
            </p>
            <div className="space-y-1">
              {conversations.map((item) => (
                <button
                  className="w-full truncate rounded-xl px-3 py-3 text-left text-xs text-slate-600 hover:bg-white"
                  key={item.id}
                  onClick={() => openConversation(item.id)}
                >
                  {String(item.preview || "Percakapan baru").slice(0, 54)}
                </button>
              ))}
              {!conversations.length && (
                <p className="px-2 text-xs leading-5 text-slate-400">
                  Belum ada percakapan.
                </p>
              )}
            </div>
          </aside>

          <section className="flex min-w-0 flex-col">
            <header className="flex h-18 shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  aria-label="Buka daftar obrolan"
                  aria-expanded={showMobileChats}
                  className="grid size-9 place-items-center rounded-xl bg-slate-50 text-slate-500 lg:hidden"
                  onClick={() => setShowMobileChats((shown) => !shown)}
                  type="button"
                >
                  <Menu className="size-4.5" />
                </button>
                <div className="relative grid size-10 place-items-center rounded-xl bg-sky-500 text-white">
                  <Bot className="size-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-400" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-800">
                    Nutrily AI
                  </h1>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Asisten gizi personal
                  </p>
                </div>
              </div>
              <Pill icon={ShieldCheck}>Konteks kesehatan aktif</Pill>
            </header>

            {showMobileChats && (
              <div className="absolute inset-x-0 top-18 z-30 border-b border-slate-100 bg-white p-4 shadow-lg lg:hidden">
                <Button
                  className="w-full"
                  onClick={startNewChat}
                  variant="secondary"
                >
                  <Plus className="size-4" /> Percakapan baru
                </Button>
                <p className="mb-2 mt-4 px-2 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
                  Obrolan terbaru
                </p>
                {conversations.map((item) => (
                  <button
                    className="block w-full truncate rounded-xl px-3 py-3 text-left text-xs text-slate-600 hover:bg-slate-50"
                    key={item.id}
                    onClick={() => openConversation(item.id)}
                  >
                    {String(item.preview || "Percakapan baru").slice(0, 54)}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-7 sm:px-8">
              <div className="mx-auto max-w-3xl">
                <div className="mb-8 text-center">
                  <Pill icon={Sparkles}>Hari ini</Pill>
                  <p className="mt-3 text-xs text-slate-400">
                    Nutrily menggunakan profilmu sebagai konteks.
                  </p>
                </div>
                <div className="space-y-6">
                  {messages.map((item, index) =>
                    item.from === "ai" ? (
                      <div
                        className="flex max-w-2xl items-start gap-3"
                        key={item.id || `${item.from}-${index}`}
                      >
                        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky-500 text-white">
                          <Bot className="size-4" />
                        </div>
                        <div>
                          <div className="rounded-2xl rounded-tl-sm bg-sky-50 px-4 py-3 text-sm leading-6 text-slate-700">
                            {item.text}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="ml-auto flex max-w-xl justify-end"
                        key={item.id || `${item.from}-${index}`}
                      >
                        <div className="rounded-2xl rounded-tr-sm bg-sky-500 px-4 py-3 text-sm leading-6 text-white shadow-md shadow-sky-100">
                          {item.text}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white p-3 sm:p-5">
              <form
                className="mx-auto flex max-w-3xl items-end gap-2"
                onSubmit={send}
              >
                <div className="flex min-h-13 flex-1 items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-50">
                  <input
                    className="h-12 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tanyakan tentang makanan, target, atau hasil pemindaian..."
                    value={message}
                  />
                </div>
                <button
                  aria-label="Input suara belum tersedia"
                  className="grid size-13 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-400"
                  disabled
                  type="button"
                >
                  <Mic className="size-5" />
                </button>
                <button
                  className="grid size-13 shrink-0 place-items-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600 disabled:opacity-50"
                  disabled={sending}
                  type="submit"
                >
                  <Send className="size-5" />
                </button>
              </form>
              {notice && (
                <p
                  aria-live="polite"
                  className="mx-auto mt-2 max-w-3xl rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
                >
                  {notice}
                </p>
              )}
              <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-slate-400">
                Jawaban Nutrily mungkin tidak selalu tepat. Untuk saran medis,
                konsultasikan dengan tenaga kesehatan profesional.
              </p>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  )
}

function MealHistory({ navigate }) {
  const [meals, setMeals] = useState([])
  const [error, setError] = useState("")
  useEffect(() => {
    api("/meals")
      .then(setMeals)
      .catch((reason) => setError(reason.message))
  }, [])
  return (
    <AppShell active="meals" navigate={navigate}>
      <main className="mx-auto max-w-5xl px-5 pb-28 pt-7 sm:px-8 lg:pb-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-sky-600">Catatan gizi</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Riwayat makanan
            </h1>
          </div>
          <Button onClick={() => navigate("/scanner")}>
            <Plus className="size-4" /> Catat makanan
          </Button>
        </div>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
          >
            {error}
          </p>
        )}
        <section className="mt-7 divide-y divide-slate-100 rounded-3xl border border-slate-100 bg-white px-5 shadow-sm">
          {meals.map((meal) => (
            <article className="flex items-center gap-4 py-4" key={meal.id}>
              <span className="grid size-11 place-items-center rounded-xl bg-sky-50 text-sky-600">
                <Utensils className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold text-slate-800">
                  {meal.name}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(meal.created_at).toLocaleString("id-ID")} ·{" "}
                  {meal.serving_size || "1 sajian"}
                </p>
              </div>
              <div className="text-right text-sm font-semibold text-slate-700">
                {meal.calories} kcal
                <p className="text-xs font-normal text-slate-400">
                  P {meal.protein_g}g · K {meal.carbs_g}g · L {meal.fat_g}g
                </p>
              </div>
            </article>
          ))}
          {!meals.length && !error && (
            <p className="py-14 text-center text-sm text-slate-400">
              Belum ada makanan tersimpan.
            </p>
          )}
        </section>
      </main>
    </AppShell>
  )
}

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth()
  if (loading)
    return (
      <main className="grid min-h-screen place-items-center text-sm text-slate-500">
        Memuat sesi…
      </main>
    )
  return user ? children : <Navigate replace to="/login" />
}

function AuthCallback() {
  const { loading, user } = useAuth()
  const [destination, setDestination] = useState(null)
  useEffect(() => {
    if (loading) return
    if (!user) {
      setDestination("/login")
      return
    }
    api("/profile")
      .then((profile) =>
        setDestination(
          profile.age && profile.weight_kg ? "/dashboard" : "/onboarding",
        ),
      )
      .catch(() => setDestination("/onboarding"))
  }, [loading, user])
  if (loading)
    return (
      <main className="grid min-h-screen place-items-center text-sm text-slate-500">
        Memverifikasi akun…
      </main>
    )
  if (!destination)
    return (
      <main className="grid min-h-screen place-items-center text-sm text-slate-500">
        Memuat profil…
      </main>
    )
  return <Navigate replace to={destination} />
}

function ResetPassword() {
  const [password, setPassword] = useState("")
  const [notice, setNotice] = useState("")
  const [saving, setSaving] = useState(false)
  const { user, loading } = useAuth()
  if (loading)
    return (
      <main className="grid min-h-screen place-items-center text-sm text-slate-500">
        Memverifikasi tautan…
      </main>
    )
  if (!user) return <Navigate replace to="/login" />
  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setNotice(error?.message || "Kata sandi diperbarui.")
    setSaving(false)
  }
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <form
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
        onSubmit={submit}
      >
        <Brand />
        <h1 className="mt-8 text-2xl font-bold text-slate-900">
          Buat kata sandi baru
        </h1>
        <p className="mb-6 mt-2 text-sm text-slate-500">
          Pilih kata sandi baru untuk akun Nutrily.
        </p>
        <Input
          label="Kata sandi baru"
          onChange={setPassword}
          placeholder="Minimal 8 karakter"
          type="password"
          value={password}
        />
        <Button
          className="mt-5 w-full"
          disabled={saving || password.length < 8}
          type="submit"
        >
          Simpan kata sandi
        </Button>
        {notice && (
          <p aria-live="polite" className="mt-4 text-sm text-sky-700">
            {notice}
          </p>
        )}
      </form>
    </main>
  )
}

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  const go = (next, options) => {
    const routes = {
      landing: "/",
      auth: "/login",
      register: "/register",
      onboarding: "/onboarding",
      dashboard: "/dashboard",
      scanner: "/scanner",
      chat: "/chat",
      meals: "/meals",
    }
    navigate(next.startsWith("/") ? next : routes[next] || "/", options)
  }

  return (
    <Routes>
      <Route element={<Landing navigate={go} />} path="/" />
      <Route element={<Auth navigate={go} />} path="/login" />
      <Route
        element={<Auth initialMode="register" navigate={go} />}
        path="/register"
      />
      <Route element={<AuthCallback />} path="/auth/callback" />
      <Route element={<ResetPassword />} path="/reset-password" />
      <Route
        element={
          <ProtectedRoute>
            <Onboarding navigate={go} />
          </ProtectedRoute>
        }
        path="/onboarding"
      />
      <Route
        element={
          <ProtectedRoute>
            <Dashboard navigate={go} />
          </ProtectedRoute>
        }
        path="/dashboard"
      />
      <Route
        element={
          <ProtectedRoute>
            <Scanner navigate={go} />
          </ProtectedRoute>
        }
        path="/scanner"
      />
      <Route
        element={
          <ProtectedRoute>
            <Chat navigate={go} />
          </ProtectedRoute>
        }
        path="/chat"
      />
      <Route
        element={
          <ProtectedRoute>
            <MealHistory navigate={go} />
          </ProtectedRoute>
        }
        path="/meals"
      />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
