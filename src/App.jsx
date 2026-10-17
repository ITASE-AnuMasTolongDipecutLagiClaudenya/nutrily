import { Fragment, useEffect, useRef, useState } from "react"

import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"

import { createPortal } from "react-dom"

import { AnimatePresence, motion } from "framer-motion"

import Markdown from "./components/ui/markdown"

import {
  Activity,
  Apple,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Dumbbell,
  Flame,
  ExternalLink,
  History,
  HeartPulse,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  ReceiptText,
  ScanLine,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  Utensils,
  UserRound,
  WandSparkles,
  X,
  Zap,
} from "lucide-react"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import Lenis from "lenis"

import gsap from "gsap"

import { ScrollTrigger } from "gsap/ScrollTrigger"

import { api, verifyTurnstile } from "./lib/api"

import { useAuth } from "./lib/AuthProvider"

import {
  firstInvalidOnboardingStep,
  hasOnboardingInput,
  validateOnboardingStep,
} from "./lib/onboarding"

import {
  getOriginalGoogleAvatarUrl,
  getProfileAvatarUrl,
  hasCustomAvatar,
} from "./lib/avatar"

import { supabase } from "./lib/supabase"

import { useScrollLock } from "./lib/use-scroll-lock"

import PhoneScrollHero from "./components/PhoneScrollHero"

import PhoneCarouselSection from "./components/PhoneCarouselSection"

import Preloader from "./components/Preloader"

import FaqSection from "./components/FaqSection"

import CtaSection from "./components/CtaSection"

import AuthGridBackground from "./components/AuthGridBackground"

import ProfileDropdown from "./components/ui/profile-dropdown"

import ProfileCard1 from "./components/ui/profile-card-1"

import { LimelightNav } from "./components/ui/limelight-nav"

import CalorieChart from "./components/ui/calorie-chart"

import BarRaceChart from "./components/ui/bar-race-chart.tsx"

import BasicSteps from "./components/ui/steps"

import Turnstile from "./components/Turnstile"

import GlowCard from "./components/GlowCard"

import ScannerFlow from "./components/ScannerFlow"

import AnimatedAIChat from "./components/ui/animated-ai-chat"

import AvatarCropper from "./components/AvatarCropper"

import ProfilePreviewDialog from "./components/ProfilePreviewDialog"

import NoticeAlert from "./components/ui/notice-alert"

import NoticeToast from "./components/ui/notice-toast"

import ConfirmDialog from "./components/ui/confirm-dialog"

import Brand from "./components/brand"

import ScrollProgressBar from "./components/ui/scroll-progress-bar"

const cn = (...classes) => classes.filter(Boolean).join(" ")

const isCompleteProfile = (profile) =>
  Boolean(
    profile?.full_name?.trim() &&
      Number.isInteger(Number(profile.age)) &&
      profile.gender &&
      (profile.gender !== "Wanita" || profile.pregnancy_status) &&
      Number(profile.weight_kg) >= 20 &&
      Number(profile.weight_kg) <= 200 &&
      Number(profile.height_cm) >= 30 &&
      Number(profile.height_cm) <= 200 &&
      profile.activity &&
      typeof profile.is_gym === "boolean" &&
      profile.goal,
  )

const profileBlue = "bg-sky-500 hover:bg-sky-600"

const newConversationId = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16)

    return (character === "x" ? random : (random & 0x3) | 0x8).toString(16)
  })

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

    ghostLight: "text-white hover:bg-white/10",

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

function HeaderBackButton({ label, onClick, disabled = false }) {
  return (
    <button
      aria-label={label}
      className="grid size-9 place-items-center rounded-xl bg-sky-500 text-white shadow-[0_10px_25px_-10px_rgba(14,165,233,.8)] transition-all duration-300 hover:scale-[1.03] hover:bg-sky-600 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:pointer-events-none disabled:opacity-50"
      onClick={onClick}
      title={label}
      disabled={disabled}
      type="button"
    >
      <ArrowLeft className="size-4.5" />
    </button>
  )
}

function UnsavedChangesDialog({ onCancel, onDiscard }) {
  useScrollLock()

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <section
        aria-labelledby="unsaved-changes-title"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
        role="dialog"
      >
        <h2
          className="text-lg font-semibold text-slate-900"
          id="unsaved-changes-title"
        >
          Perubahan belum disimpan
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Perubahan yang dibuat akan hilang jika kembali sekarang.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            className="h-10 rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-100"
            onClick={onCancel}
            type="button"
          >
            Tetap di sini
          </button>
          <button
            className="h-10 rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-700"
            onClick={onDiscard}
            type="button"
          >
            Buang perubahan
          </button>
        </div>
      </section>
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

  min,

  max,

  maxLength,

  step,

  inputRef,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold tracking-[-0.015em] text-slate-800">
        {label}
      </span>
      <span className="relative block">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
        )}
        <input
          className={cn(
            "h-12 w-full rounded-xl border border-slate-200 bg-white pr-4 text-[15px] text-slate-900 shadow-sm shadow-slate-900/[0.02] outline-none transition duration-200 placeholder:text-slate-400 hover:border-sky-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100",

            Icon ? "pl-11" : "pl-4",
          )}
          onChange={(event) => onChange?.(event.target.value)}
          ref={inputRef}
          placeholder={placeholder}
          min={min}
          max={max}
          maxLength={maxLength}
          step={step}
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
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ring-1 ring-inset",

        tones[tone],
      )}
    >
      {Icon && <Icon className="size-3.5" />}
      {children}
    </span>
  )
}

function AKGReferenceCard({ targets, age, dropdownOpensDown }) {
  const nutrients = targets
    ? [
        ["Protein", targets.protein_g, "g"],

        ["Lemak total", targets.fat_g, "g"],

        ["Karbohidrat", targets.carbs_g, "g"],

        ["Gula (maks.)", targets.sugar_g, "g"],

        ["Natrium (maks.)", targets.sodium_mg, "mg"],
      ]
    : []

  return (
    <aside
      aria-live="polite"
      className="@container w-full min-w-0 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-white p-4 shadow-[0_16px_38px_-28px_rgba(14,165,233,.45)] transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_20px_42px_-26px_rgba(14,165,233,.4)] sm:p-5"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-sky-600 shadow-sm">
          <HeartPulse className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-sm font-bold text-slate-900">
            {targets ? "Estimasi kebutuhan personal" : "Acuan AKG harian"}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Permenkes RI No. 28 Tahun 2019
          </p>
        </div>
      </div>

      {targets ? (
        <>
          <div className="mt-4 rounded-xl bg-white p-3.5">
            <p className="text-[13px] font-medium tracking-[-0.01em] text-slate-500">
              Estimasi energi
              {targets.addition ? " · termasuk penyesuaian kondisi" : ""}
            </p>
            <p className="mt-1 break-words text-2xl font-bold tracking-[-0.04em] text-sky-700 sm:text-[1.7rem]">
              {targets.calories.toLocaleString("id-ID")}{" "}
              <span className="text-sm font-semibold">kkal</span>
            </p>
          </div>
          <dl className="mt-3 grid min-w-0 grid-cols-1 gap-2 @xs:grid-cols-2 xl:grid-cols-1 xl:gap-0">
            {nutrients.map(([label, amount, unit]) => (
              <div
                className="min-w-0 rounded-lg bg-white/75 px-2.5 py-2.5 transition-colors hover:bg-white xl:flex xl:items-center xl:justify-between xl:rounded-none xl:border-b xl:border-sky-100 xl:bg-transparent xl:px-1"
                key={label}
              >
                <dt className="break-words text-[13px] font-medium text-slate-500">
                  {label}
                </dt>
                <dd className="mt-0.5 break-words text-[15px] font-semibold tracking-[-0.02em] text-slate-800 xl:mt-0">
                  {amount} {unit}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[13px] leading-6 text-slate-500">
            Kelompok usia {age} tahun. AKG resmi menjadi dasar; faktor tubuh dan
            aktivitas membentuk estimasi personal.
          </p>
        </>
      ) : (
        <p className="mt-4 text-[13px] leading-6 text-slate-600">
          Isi usia dan pilih jenis kelamin untuk melihat acuan AKG yang sesuai.
        </p>
      )}

      <details className="group relative mt-3">
        <summary className="flex min-h-11 w-full cursor-pointer list-none items-center justify-between gap-2 rounded-xl border border-sky-100 bg-gradient-to-r from-white to-sky-50/60 px-3.5 text-[13px] font-semibold text-sky-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:from-sky-50 hover:to-white hover:text-sky-900 hover:shadow-[0_12px_24px_-14px_rgba(14,165,233,.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 group-open:border-sky-200 group-open:bg-sky-50/70 [&::-webkit-details-marker]:hidden">
          Sumber & metode
          <ChevronDown className="size-4 text-sky-500 transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div
          className={cn(
            "absolute left-0 z-20 w-full rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_20px_48px_-20px_rgba(15,23,42,.28)] backdrop-blur-xl",

            dropdownOpensDown
              ? "bottom-full mb-2 lg:top-full lg:bottom-auto lg:mt-2 lg:mb-0"
              : "bottom-full mb-2 lg:top-auto lg:bottom-full lg:mt-0 lg:mb-2",
          )}
        >
          <a
            className="group/link flex items-center justify-between gap-1.5 rounded-lg border border-transparent px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-sky-100 hover:bg-sky-50/70 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600"
            href="https://peraturan.go.id/files/bn956-2019.pdf"
            rel="noreferrer"
            target="_blank"
          >
            <span>
              <span className="block font-semibold">
                Permenkes RI No. 28/2019
              </span>
              <span className="block text-[9px] leading-3 text-slate-500">
                Tabel AKG resmi · Lampiran I
              </span>
            </span>
            <ExternalLink
              aria-hidden="true"
              className="size-3.5 shrink-0 text-slate-400 transition duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-sky-600"
            />
          </a>
          <a
            className="group/link flex items-center justify-between gap-1.5 rounded-lg border border-transparent px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-sky-100 hover:bg-sky-50/70 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600"
            href="https://doi.org/10.1093/ajcn/51.2.241"
            rel="noreferrer"
            target="_blank"
          >
            <span>
              <span className="block font-semibold">Mifflin–St Jeor</span>
              <span className="block text-[9px] leading-3 text-slate-500">
                Estimasi metabolisme berdasarkan profil tubuh
              </span>
            </span>
            <ExternalLink
              aria-hidden="true"
              className="size-3.5 shrink-0 text-slate-400 transition duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-sky-600"
            />
          </a>
          <a
            className="group/link flex items-center justify-between gap-1.5 rounded-lg border border-transparent px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-sky-100 hover:bg-sky-50/70 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600"
            href="https://doi.org/10.1186/s12970-017-0177-8"
            rel="noreferrer"
            target="_blank"
          >
            <span>
              <span className="block font-semibold">
                ISSN · Protein & olahraga
              </span>
              <span className="block text-[9px] leading-3 text-slate-500">
                Acuan 1,4–2,0 g/kg/hari; estimasi gym memakai 1,6 g/kg
              </span>
            </span>
            <ExternalLink
              aria-hidden="true"
              className="size-3.5 shrink-0 text-slate-400 transition duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-sky-600"
            />
          </a>
          <a
            className="group/link flex items-center justify-between gap-1.5 rounded-lg border border-transparent px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-sky-100 hover:bg-sky-50/70 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600"
            href="https://peraturan.bpk.go.id/Details/172111/permenkes-no-30-tahun-2013"
            rel="noreferrer"
            target="_blank"
          >
            <span>
              <span className="block font-semibold">
                Permenkes RI No. 30/2013
              </span>
              <span className="block text-[9px] leading-3 text-slate-500">
                Batas konsumsi gula 50 g per hari
              </span>
            </span>
            <ExternalLink
              aria-hidden="true"
              className="size-3.5 shrink-0 text-slate-400 transition duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-sky-600"
            />
          </a>
          <a
            className="group/link flex items-center justify-between gap-1.5 rounded-lg border border-transparent px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-sky-100 hover:bg-sky-50/70 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600"
            href="https://www.who.int/news-room/fact-sheets/detail/sodium-reduction"
            rel="noreferrer"
            target="_blank"
          >
            <span>
              <span className="block font-semibold">WHO · Natrium</span>
              <span className="block text-[9px] leading-3 text-slate-500">
                Dewasa maks. 2.000 mg; usia 13–15 menyesuaikan energi
              </span>
            </span>
            <ExternalLink
              aria-hidden="true"
              className="size-3.5 shrink-0 text-slate-400 transition duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-sky-600"
            />
          </a>
        </div>
      </details>
    </aside>
  )
}

function NutrilyHero() {
  const base = import.meta.env.BASE_URL

  const sectionRef = useRef(null)

  const viewerRef = useRef(null)

  const wrapRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    let tx = 0

    let ty = 0

    let cx = 0

    let cy = 0

    let raf = 0

    const onMove = (event) => {
      const rect = section.getBoundingClientRect()

      tx = ((event.clientX - rect.left) / rect.width) * 2 - 1

      ty = ((event.clientY - rect.top) / rect.height) * 2 - 1
    }

    const onLeave = () => {
      tx = 0

      ty = 0
    }

    const tick = () => {
      cx += (tx - cx) * 0.05

      cy += (ty - cy) * 0.05

      if (wrapRef.current)
        wrapRef.current.style.transform = `perspective(900px) rotateY(${cx * 6}deg) rotateX(${-cy * 4}deg) translate3d(${cx * 9}px, ${cy * 6}px, 0)`

      if (viewerRef.current)
        viewerRef.current.cameraOrbit = `${cx * 12}deg ${72 - cy * 6}deg 2.4m`

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    section.addEventListener("pointermove", onMove)

    section.addEventListener("pointerleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)

      section.removeEventListener("pointermove", onMove)

      section.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[102svh] items-center overflow-hidden bg-sky-950"
    >
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        src={`${base}hero-nutrily.jpg`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky-950/55 to-transparent"
      />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-5 pb-16 pt-28 sm:px-8 lg:px-10 lg:pb-24 lg:pt-32">
        <div className="relative mx-auto w-full max-w-2xl">
          <span
            aria-hidden="true"
            className="font-poppins hero-reveal pointer-events-none absolute left-0 top-12 z-0 text-9xl font-extrabold leading-none tracking-tight text-white drop-shadow-lg sm:top-0 lg:-left-14 lg:-top-4 sm:text-[10rem] lg:text-[13rem]"
          >
            Nutri
          </span>
          <span
            aria-hidden="true"
            className="font-poppins hero-reveal pointer-events-none absolute bottom-10 right-0 z-0 text-9xl font-extrabold leading-none tracking-tight text-sky-500 drop-shadow-lg sm:bottom-0 lg:-bottom-4 lg:-right-14 sm:text-[10rem] lg:text-[13rem]"
          >
            Ly
          </span>
          <div
            ref={wrapRef}
            className="hero-reveal relative z-10 will-change-transform"
          >
            <img
              alt="Ilustrasi makanan sehat Nutrily"
              className="pointer-events-none absolute inset-0 z-[1] m-auto max-h-[480px] w-full object-contain"
              src={`${base}nutrily.png`}
            />
            <model-viewer
              ref={viewerRef}
              className="relative z-10"
              alt="Ilustrasi 3D makanan sehat Nutrily"
              camera-orbit="0deg 72deg 2.4m"
              disable-zoom
              exposure="1"
              field-of-view="30deg"
              interaction-prompt="none"
              loading="eager"
              min-camera-orbit="auto auto 1.8m"
              max-camera-orbit="auto auto 3.5m"
              reveal="auto"
              shadow-intensity="0"
              src={`${base}nutrily.glb`}
              style={{
                width: "100%",

                height: "480px",

                background: "transparent",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function LandingNav({ navigate }) {
  const [scrolled, setScrolled] = useState(false)

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)

      const max = document.documentElement.scrollHeight - window.innerHeight

      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }

    onScroll()

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-30 flex justify-center px-4">
      <div
        className={cn(
          "landing-nav-frame relative isolate w-full rounded-2xl transition-[width,max-width,margin,padding] duration-500 ease-in-out",

          scrolled ? "mt-3 w-full p-[5px] sm:w-[85%]" : "max-w-7xl p-0",
        )}
        data-scrolled={scrolled}
        style={{ "--landing-nav-progress": `${progress * 360}deg` }}
      >
        <nav
          className={cn(
            "relative z-[1] flex w-full items-center justify-between transition-[padding,border-radius,background-color] duration-500 ease-in-out",

            scrolled
              ? "min-h-[68px] gap-6 rounded-xl bg-white px-4 py-3"
              : "min-h-[68px] rounded-none bg-transparent px-1 py-4 sm:px-3",
          )}
        >
          <Brand compact />
          <div className="flex items-center gap-2">
            <Button className="px-4 sm:px-5" onClick={() => navigate("auth")}>
              Mulai sekarang <ArrowRight className="size-4" />
            </Button>
          </div>
        </nav>
      </div>
    </div>
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
      icon: Sparkles,

      title: "Panduan AI personal",

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

  const stackRef = useRef(null)

  const phoneRef = useRef(null)

  const featRef = useRef(null)

  const footerRef = useRef(null)

  const [loading, setLoading] = useState(true)

  const landingRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.config({ ignoreMobileResize: true })

    const phone = phoneRef.current

    const feat = featRef.current

    if (!phone || !feat) return

    const pin = ScrollTrigger.create({
      trigger: phone,

      start: "bottom bottom",

      end: () => `+=${feat.offsetHeight}`,

      pin: true,

      pinSpacing: false,

      anticipatePin: 1,

      invalidateOnRefresh: true,
    })

    const refresh = () => ScrollTrigger.refresh()

    window.addEventListener("load", refresh)

    if (document.fonts?.ready)
      document.fonts.ready.then(refresh).catch(() => {})

    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener("load", refresh)

      pin.kill()
    }
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.config({ ignoreMobileResize: true })

    ScrollTrigger.refresh()
  }, [])

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden"

      window.__lenis?.stop()
    } else {
      document.body.style.overflow = ""

      window.__lenis?.start()

      if (landingRef.current) {
        gsap.fromTo(
          landingRef.current,

          { opacity: 0, y: 60, scale: 1.04, filter: "blur(12px)" },

          {
            opacity: 1,

            y: 0,

            scale: 1,

            filter: "blur(0px)",

            duration: 1.3,

            ease: "power4.out",

            clearProps: "transform,filter",
          },
        )

        gsap.fromTo(".hero-reveal", { opacity: 0, y: 48 }, {
          opacity: 1,

          y: 0,

          duration: 1,

          stagger: 0.12,

          ease: "power3.out",

          delay: 0.25,

          clearProps: "transform",
        })
      }

      ScrollTrigger.refresh()
    }
  }, [loading])

  return (
    <main className="landing-page font-poppins relative min-h-screen overflow-x-clip bg-white text-slate-900">
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <div ref={landingRef} style={{ opacity: 0 }}>
        <LandingNav navigate={navigate} />

        <div className="relative z-10">
          <NutrilyHero />

          <div
            ref={stackRef}
            className="relative -mb-px overflow-clip rounded-b-[2.5rem] bg-sky-500"
          >
            <div ref={phoneRef} className="relative z-0 will-change-transform">
              <PhoneScrollHero
                titleComponent={
                  <>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                      Seluruh gizimu,
                      <br />
                      <span className="mt-1 block text-sky-500">
                        dalam sakumu
                      </span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-500">
                      Pindai, catat, dan pantau gizimu kapan saja langsung dari
                      ponsel.
                    </p>
                  </>
                }
              >
                <img
                  alt="Aplikasi Nutrily di ponsel"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80"
                />
              </PhoneScrollHero>
            </div>

            <section
              ref={featRef}
              className="relative z-10 -mt-6 overflow-hidden rounded-t-[2.5rem] bg-sky-500 pb-28 pt-20 shadow-[0_-24px_60px_-20px_rgba(2,132,199,.45)] sm:-mt-10 sm:pb-32 sm:pt-24"
              id="features"
            >
              <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-2xl text-center">
                  <Pill>Fitur unggulan</Pill>
                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Semua yang kamu butuhkan untuk hidup sehat
                  </h2>
                  <p className="mt-4 leading-7 text-sky-50">
                    Tiga fitur utama yang membuat perjalanan gizimu lebih mudah
                    dan menyenangkan.
                  </p>
                </div>
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                  {features.map(({ icon: Icon, title, text }, i) => (
                    <GlowCard
                      className="h-auto min-h-80 w-full"
                      customSize
                      glowColor={["blue", "purple", "green"][i % 3]}
                      key={title}
                    >
                      <div>
                        <div className="grid size-12 place-items-center rounded-2xl bg-sky-500/10 text-sky-600">
                          <Icon className="size-5.5" />
                        </div>
                        <h3 className="mt-6 text-lg font-bold text-slate-900">
                          {title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {text}
                        </p>
                      </div>
                    </GlowCard>
                  ))}
                </div>
              </div>
              <PhoneCarouselSection />
              <FaqSection />
            </section>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none h-[100svh]" />

        <footer
          ref={footerRef}
          className="fixed inset-x-0 bottom-0 z-0 flex h-[100svh] touch-none flex-col justify-center overflow-hidden bg-white"
        >
          <CtaSection />
        </footer>
      </div>
    </main>
  )
}

function Auth({ navigate }) {
  const [busy, setBusy] = useState(false)

  const [notice, setNotice] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")

  const [turnstileKey, setTurnstileKey] = useState(0)

  const user = useAuth().user

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

  const signInWithGoogle = async () => {
    if (!supabase)
      return setNotice("Supabase belum dikonfigurasi. Isi file .env.")

    if (!import.meta.env.VITE_TURNSTILE_SITE_KEY)
      return setNotice("Turnstile belum dikonfigurasi.")

    if (!turnstileToken)
      return setNotice("Selesaikan verifikasi keamanan terlebih dahulu.")

    setBusy(true)

    setNotice("")

    try {
      await verifyTurnstile(turnstileToken)

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

      setTurnstileToken("")

      setTurnstileKey((key) => key + 1)

      setBusy(false)
    }
  }

  return (
    <main className="relative grid min-h-screen bg-sky-50 max-lg:h-dvh max-lg:min-h-0 max-lg:overflow-hidden lg:grid-cols-[1fr_1.03fr]">
      <section className="relative hidden overflow-hidden bg-sky-50 p-12 text-slate-900 lg:flex lg:flex-col">
        <AuthGridBackground />
        <div className="relative z-10 my-auto max-w-lg">
          <h1 className="text-5xl font-bold leading-tight tracking-[-0.04em] text-white">
            Beri tubuhmu gizi terbaik.
          </h1>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-50 px-5 py-5 sm:px-10 sm:py-6 max-lg:h-dvh max-lg:min-h-0 max-lg:!py-3 lg:bg-white">
        <AuthGridBackground className="lg:hidden" />
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-sky-100 bg-white/90 p-4 backdrop-blur sm:p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div className="flex items-center justify-between lg:hidden">
            <button onClick={() => navigate("landing")}>
              <Brand compact />
            </button>
            <button
              aria-label="Kembali ke beranda"
              className="grid size-10 place-items-center rounded-xl border border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-600 hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-300"
              onClick={() => navigate("landing")}
              type="button"
            >
              <ArrowLeft className="size-5" />
            </button>
          </div>
          <div className="mt-4 sm:mt-5 lg:mt-0">
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-sky-600 sm:text-3xl">
              Selamat Datang!
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:mt-3">
              Masuk untuk melanjutkan perjalanan gizimu.
            </p>
          </div>

          <Turnstile
            key={turnstileKey}
            onError={() => {
              setTurnstileToken("")

              setNotice("Turnstile gagal dimuat. Muat ulang halaman.")
            }}
            onExpired={() => setTurnstileToken("")}
            onVerify={(token) => {
              setNotice("")

              setTurnstileToken(token)
            }}
          />

          <Button
            className="mt-4 w-full border-slate-200 text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:bg-gradient-to-r hover:from-sky-500 hover:to-sky-400 hover:text-white hover:shadow-xl hover:shadow-sky-200 sm:mt-6"
            disabled={busy || !turnstileToken}
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

          <div className="mt-3 grid grid-cols-1 gap-2 xl:mt-8 xl:gap-3">
            {[
              [ScanLine, "Pindai label makanan"],

              [Bot, "Tanya AI gizi"],

              [TrendingUp, "Pantau perkembanganmu"],
            ].map(([Icon, text]) => (
              <div
                className="group flex cursor-default items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-gradient-to-r hover:from-sky-50 hover:to-white hover:shadow-lg hover:shadow-sky-100 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3"
                key={text}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-sky-600 shadow-sm transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-sky-200 sm:size-9 sm:rounded-xl">
                  <Icon className="size-4" />
                </span>
                <p className="text-xs font-semibold text-slate-700 transition-colors duration-300 group-hover:text-sky-700 sm:text-sm">
                  {text}
                </p>
              </div>
            ))}
          </div>
          <div className="group mt-2 flex cursor-default gap-2 rounded-xl bg-sky-500 p-2.5 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-r hover:from-sky-500 hover:to-sky-400 hover:shadow-xl hover:shadow-sky-200 sm:mt-3 sm:gap-3 sm:rounded-2xl sm:p-4 xl:mt-4">
            <ShieldCheck className="size-4 shrink-0 text-white transition-transform duration-300 group-hover:scale-110 sm:size-5" />
            <div>
              <p className="text-xs font-bold sm:text-sm">Datamu aman</p>
              <p className="mt-0.5 text-[10px] leading-4 text-sky-50 sm:mt-1 sm:text-xs sm:leading-5">
                Privasi adalah prioritas. Data kesehatanmu tetap milikmu.
              </p>
            </div>
          </div>
          <NoticeToast message={notice} onClose={() => setNotice("")} />
        </div>
      </section>
    </main>
  )
}

function ChoiceCard({
  active,

  icon: Icon,

  title,

  description,

  onClick,

  className,
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "group relative flex min-h-32 w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ease-out focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:gap-4 sm:p-5",

        className,

        active
          ? "-translate-y-0.5 border-sky-300 bg-gradient-to-br from-sky-50 to-white shadow-[0_14px_32px_-20px_rgba(14,165,233,.55)] ring-1 ring-sky-200"
          : "border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03] hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50/40 hover:shadow-lg hover:shadow-sky-100/80",
      )}
      onClick={onClick}
      type="button"
    >
      {Icon && (
        <span
          className={cn(
            "mt-0.5 grid size-11 shrink-0 place-items-center rounded-xl transition duration-200 group-hover:scale-105",

            active
              ? "bg-sky-500 text-white shadow-md shadow-sky-200"
              : "bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-700",
          )}
        >
          <Icon className="size-5" />
        </span>
      )}
      <span className="min-w-0 pr-6">
        <span className="block text-[15px] font-semibold tracking-[-0.02em] text-slate-900">
          {title}
        </span>
        {description && (
          <span className="mt-1.5 block text-[13px] leading-5 text-slate-500">
            {description}
          </span>
        )}
      </span>
      <span
        className={cn(
          "absolute right-4 top-4 grid size-5 place-items-center rounded-full border transition duration-200",

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

function Onboarding({ navigate, editMode = false }) {
  const { user } = useAuth()

  const [step, setStep] = useState(0)

  const [gender, setGender] = useState("")

  const [status, setStatus] = useState("")

  const [activity, setActivity] = useState("")

  const [isGym, setIsGym] = useState(null)

  const [goal, setGoal] = useState("")

  const [age, setAge] = useState("")

  const [fullName, setFullName] = useState("")

  const [weight, setWeight] = useState("")

  const [height, setHeight] = useState("")

  const [saving, setSaving] = useState(false)

  const [notice, setNotice] = useState("")

  const [confirmUpdate, setConfirmUpdate] = useState(false)

  const [profileLoaded, setProfileLoaded] = useState(false)

  const [initialValues, setInitialValues] = useState(null)

  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false)

  const [previewTargets, setPreviewTargets] = useState(null)

  useScrollLock(confirmUpdate)

  const steps = ["Tentang kamu", "Profil tubuh", "Aktivitas harian", "Targetmu"]

  const stepDescriptions = [
    "Tentukan acuan dasarmu",

    "Berat dan tinggi badan",

    "Rutinitas selama seminggu",

    "Pilih tujuan gizimu",
  ]

  useEffect(() => {
    api("/profile")

      .then((profile) => {
        const loadedFullName =
          profile.full_name || user?.user_metadata?.full_name || ""

        const loadedValues = [
          loadedFullName,

          profile.age ? String(profile.age) : "",

          profile.gender || "",

          profile.pregnancy_status || "",

          profile.weight_kg ? String(profile.weight_kg) : "",

          profile.height_cm ? String(profile.height_cm) : "",

          profile.activity || "",

          typeof profile.is_gym === "boolean" ? profile.is_gym : null,

          profile.goal || "",
        ]

        setInitialValues(loadedValues)

        setFullName(loadedFullName)

        if (profile.age) setAge(String(profile.age))

        if (profile.weight_kg) setWeight(String(profile.weight_kg))

        if (profile.height_cm) setHeight(String(profile.height_cm))

        if (profile.gender) setGender(profile.gender)

        if (profile.activity) setActivity(profile.activity)

        if (typeof profile.is_gym === "boolean") setIsGym(profile.is_gym)

        if (profile.goal) setGoal(profile.goal)

        if (profile.pregnancy_status) setStatus(profile.pregnancy_status)
      })

      .catch((error) => setNotice(error.message))

      .finally(() => setProfileLoaded(true))
  }, [])

  useEffect(() => {
    const years = Number(age)

    const kilograms = Number(weight)

    const centimeters = Number(height)

    if (
      !Number.isInteger(years) ||
      years < 13 ||
      years > 120 ||
      !gender ||
      !Number.isFinite(kilograms) ||
      kilograms < 20 ||
      kilograms > 200 ||
      !Number.isFinite(centimeters) ||
      centimeters < 30 ||
      centimeters > 200 ||
      !activity ||
      typeof isGym !== "boolean" ||
      !goal ||
      (gender === "Wanita" && !status)
    ) {
      setPreviewTargets(null)

      return
    }

    let active = true

    setPreviewTargets(null)

    const timer = window.setTimeout(() => {
      api("/targets", {
        method: "POST",

        body: JSON.stringify({
          age: years,

          gender,

          pregnancy_status: gender === "Wanita" ? status : null,

          weight_kg: kilograms,

          height_cm: centimeters,

          activity,

          is_gym: isGym,

          goal,
        }),
      })

        .then((result) => {
          if (active)
            setPreviewTargets({ ...result.targets, addition: result.addition })
        })

        .catch((error) => {
          if (active) {
            setPreviewTargets(null)

            setNotice(error.message)
          }
        })
    }, 150)

    return () => {
      active = false

      window.clearTimeout(timer)
    }
  }, [age, gender, status, weight, height, activity, isGym, goal])

  const onboardingProfile = {
    age,

    gender,

    status,

    weight,

    height,

    activity,

    isGym,

    goal,
  }

  const validateStep = (stepIndex) =>
    validateOnboardingStep(stepIndex, onboardingProfile)

  const formStarted = hasOnboardingInput({
    age,

    gender,

    status,

    weight,

    height,

    activity,

    isGym,

    goal,
  })

  const dropdownOpensDown = profileLoaded && (!formStarted || !previewTargets)

  const finishOnboarding = async (confirmed = false) => {
    for (let index = 0; index < steps.length; index += 1) {
      const error = validateStep(index)

      if (error) {
        setStep(index)

        setNotice(error)

        return
      }
    }

    const years = Number(age)

    const kilograms = Number(weight)

    const centimeters = Number(height)

    if (!Number.isInteger(years) || years < 13 || years > 120) {
      setStep(0)

      setNotice("Masukkan usia antara 13 hingga 120 tahun.")

      return
    }

    if (
      !Number.isFinite(kilograms) ||
      kilograms < 20 ||
      kilograms > 200 ||
      !Number.isFinite(centimeters) ||
      centimeters < 30 ||
      centimeters > 200
    ) {
      setStep(1)

      setNotice("Masukkan berat 20–200 kg dan tinggi 30–200 cm.")

      return
    }

    if (editMode && !confirmed) {
      setConfirmUpdate(true)

      return
    }

    setSaving(true)

    setNotice("")

    try {
      await api("/profile", {
        method: "PUT",

        body: JSON.stringify({
          full_name: fullName || user?.user_metadata?.full_name || "",

          age: years,

          gender,

          pregnancy_status: gender === "Wanita" ? status : null,

          weight_kg: kilograms,
          height_cm: centimeters,
          activity,
          goal,
          is_gym: isGym,
        }),
      })

      navigate(
        editMode ? "/profile" : "/dashboard",

        {
          replace: true,
          state: {
            notice: editMode
              ? "Data berhasil diubah."
              : "Data onboarding berhasil disimpan.",
          },
        },
      )
    } catch (error) {
      setNotice(error.message)

      setConfirmUpdate(false)
    } finally {
      setSaving(false)
    }
  }

  const goToStep = (nextStep) => {
    if (nextStep > step) {
      const invalid = firstInvalidOnboardingStep(nextStep, onboardingProfile)
      if (invalid) {
        setStep(invalid.step)
        setNotice(invalid.error)
        return
      }
    }
    setNotice("")
    setStep(nextStep)
  }

  const continueStep = () => goToStep(Math.min(3, step + 1))

  const onboardingValues = [
    fullName,

    age,

    gender,

    status,

    weight,

    height,

    activity,

    isGym,

    goal,
  ]

  const hasUnsavedChanges =
    editMode &&
    profileLoaded &&
    initialValues &&
    JSON.stringify(onboardingValues) !== JSON.stringify(initialValues)

  return (
    <main className="font-poppins min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/70 via-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white shadow-[0_6px_24px_-20px_rgba(15,23,42,.45)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 py-3.5 sm:min-h-[86px] sm:px-6 lg:px-8">
          <Brand />
          {editMode && (
            <HeaderBackButton
              disabled={saving}
              label="Kembali ke profil"
              onClick={() =>
                hasUnsavedChanges
                  ? setShowUnsavedChanges(true)
                  : navigate("/profile")
              }
            />
          )}
          {!editMode && (
            <ProfileDropdown
              data={{
                name:
                  user?.user_metadata?.full_name ||
                  user?.email?.split("@")[0] ||
                  "Profil Nutrily",

                email: user?.email || "",

                avatar: getProfileAvatarUrl(user),
              }}
              onEditProfile={() => navigate("/profile/account")}
              onSignOut={async () => {
                await supabase?.auth.signOut()

                navigate("/")
              }}
            />
          )}
        </div>
        {editMode && <ScrollProgressBar />}
      </header>

      <div className="mx-auto grid max-w-7xl items-start gap-5 px-4 py-5 pb-10 sm:px-6 sm:py-8 lg:grid-cols-[180px_minmax(0,1fr)_270px] lg:gap-5 lg:px-6 xl:grid-cols-[210px_minmax(0,1fr)_310px] xl:gap-7 xl:px-8">
        <aside className="sticky top-24 hidden lg:flex lg:flex-col">
          <p className="text-[13px] font-bold tracking-wide text-slate-400">
            Profilmu
          </p>
          <nav aria-label="Langkah pengisian profil" className="mt-4">
            {steps.map((name, index) => (
              <div className="relative pb-2" key={name}>
                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-[-1.875rem] left-[1.875rem] top-[1.875rem] z-0 w-px",

                      index < step ? "bg-emerald-300" : "bg-slate-200",
                    )}
                  />
                )}
                <button
                  aria-current={index === step ? "step" : undefined}
                  className={cn(
                    "relative z-10 flex min-h-[4.5rem] w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600",

                    index === step
                      ? "bg-white shadow-sm ring-1 ring-sky-100"
                      : "hover:bg-white",
                  )}
                  onClick={() => goToStep(index)}
                  type="button"
                >
                  <span
                    className={cn(
                      "relative grid size-9 shrink-0 place-items-center rounded-full border text-xs font-semibold transition duration-200",

                      index < step
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : index === step
                          ? "border-sky-500 bg-sky-500 text-white ring-4 ring-sky-100"
                          : "border-slate-200 bg-white text-slate-400",
                    )}
                  >
                    {index === step && (
                      <>
                        <span
                          aria-hidden="true"
                          className="onboarding-step-pulse absolute inset-0 rounded-full bg-sky-300/60"
                        />
                        <span
                          aria-hidden="true"
                          className="onboarding-step-pulse onboarding-step-pulse-delayed absolute inset-0 rounded-full bg-sky-300/45"
                        />
                      </>
                    )}
                    <span className="relative z-10">
                      {index < step ? (
                        <Check className="size-3.5" strokeWidth={3} />
                      ) : (
                        index + 1
                      )}
                    </span>
                  </span>
                  <span className="mt-0.5 min-w-0">
                    <span
                      className={cn(
                        "block text-[13px] font-semibold leading-5",

                        index === step ? "text-sky-800" : "text-slate-700",
                      )}
                    >
                      {name}
                    </span>
                    <span className="mt-0.5 block text-xs leading-4 text-slate-500">
                      {stepDescriptions[index]}
                    </span>
                  </span>
                </button>
              </div>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm shadow-slate-900/[0.03]">
            <div className="grid size-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
              <ShieldCheck className="size-4.5" />
            </div>
            <p className="mt-3 text-[13px] font-semibold tracking-[-0.01em] text-slate-900">
              Datamu tetap pribadi
            </p>
            <p className="mt-1 text-[13px] leading-6 text-slate-500">
              Dipakai untuk menyusun acuan kebutuhan gizi profilmu.
            </p>
          </div>
        </aside>

        <section className="min-w-0 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_20px_60px_-36px_rgba(15,23,42,.3)] transition-shadow duration-300 sm:rounded-3xl sm:p-7 lg:col-start-2 xl:p-9">
          <div className="mb-7 lg:hidden">
            <nav aria-label="Langkah pengisian profil">
              <BasicSteps
                currentStep={step}
                onStepChange={goToStep}
                steps={steps}
              />
            </nav>
          </div>

          {step === 0 && (
            <div>
              <Pill icon={UserRound}>Mari berkenalan</Pill>
              <h1 className="mt-5 max-w-2xl text-[1.7rem] font-bold leading-[1.2] tracking-[-0.04em] text-slate-900 sm:text-[2.15rem] sm:leading-[1.15]">
                Ceritakan sedikit tentang dirimu
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
                Usia dan jenis kelamin menentukan kelompok acuan AKG. Kami
                gunakan juga aktivitas dan targetmu untuk menyusun profil gizi.
              </p>
              <div className="mt-7 w-full">
                <Input
                  label="Usia (tahun)"
                  max={120}
                  min={13}
                  onChange={setAge}
                  placeholder="Contoh: 28"
                  step={1}
                  type="number"
                  value={age}
                />
              </div>
              <p className="mb-3 mt-7 text-[15px] font-semibold tracking-[-0.015em] text-slate-800">
                Jenis kelamin
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Pria", icon: UserRound },

                  { name: "Wanita", icon: UserRound },
                ].map(({ name, icon }) => (
                  <ChoiceCard
                    active={gender === name}
                    icon={icon}
                    key={name}
                    onClick={() => setGender(name)}
                    title={name}
                  />
                ))}
              </div>
              {gender === "Wanita" && (
                <div className="mt-7">
                  <p className="mb-1 text-[15px] font-semibold tracking-[-0.015em] text-slate-800">
                    Status kehamilan atau menyusui
                  </p>
                  <p className="mb-3 text-[13px] leading-6 text-slate-500">
                    Dipakai untuk menambahkan acuan AKG sesuai trimester atau
                    masa menyusui.
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
                        aria-pressed={status === item}
                        className={cn(
                          "group flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[13px] font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600",

                          status === item
                            ? "-translate-y-0.5 border-sky-300 bg-gradient-to-r from-sky-50 to-white text-sky-800 shadow-sm shadow-sky-100 ring-1 ring-sky-100"
                            : "border-slate-200 bg-white text-slate-600 shadow-sm shadow-slate-900/[0.02] hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/60 hover:text-sky-800 hover:shadow-md hover:shadow-sky-100/70",
                        )}
                        key={item}
                        onClick={() => setStatus(item)}
                        type="button"
                      >
                        {item}
                        <span
                          className={cn(
                            "grid size-4 shrink-0 place-items-center rounded-full border transition",

                            status === item
                              ? "border-sky-500 bg-sky-500 text-white"
                              : "border-slate-300 bg-white text-transparent group-hover:border-sky-300",
                          )}
                        >
                          {status === item && (
                            <Check className="size-2.5" strokeWidth={3} />
                          )}
                        </span>
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
              <h1 className="mt-5 max-w-2xl text-[1.7rem] font-bold leading-[1.2] tracking-[-0.04em] text-slate-900 sm:text-[2.15rem] sm:leading-[1.15]">
                Beberapa informasi singkat tentang tubuhmu
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
                Lengkapi profil tubuh untuk mendapatkan ringkasan kebutuhan
                harian yang lebih relevan.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Berat badan (kg)"
                  max={200}
                  min={20}
                  onChange={setWeight}
                  placeholder="Contoh: 68"
                  step={0.1}
                  type="number"
                  value={weight}
                />
                <Input
                  label="Tinggi badan (cm)"
                  max={200}
                  min={30}
                  onChange={setHeight}
                  placeholder="Contoh: 172"
                  step={0.1}
                  type="number"
                  value={height}
                />
              </div>
              <div
                className={cn(
                  "mt-6 rounded-2xl border border-sky-500 p-4 text-white shadow-[0_10px_25px_-10px_rgba(14,165,233,.8)] transition duration-300 hover:-translate-y-0.5 hover:border-sky-600 hover:shadow-xl sm:p-5",

                  profileBlue,
                )}
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 size-5 shrink-0 text-white" />
                  <div>
                    <p className="text-[15px] font-semibold tracking-[-0.015em] text-white">
                      Angka referensi, disesuaikan dengan profilmu
                    </p>
                    <p className="mt-1.5 text-[13px] leading-6 text-white/90">
                      AKG merupakan kecukupan rata-rata kelompok, bukan
                      diagnosis atau pengganti saran tenaga kesehatan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <Pill icon={Dumbbell}>Rutinitasmu</Pill>
              <h1 className="mt-5 max-w-2xl text-[1.7rem] font-bold leading-[1.2] tracking-[-0.04em] text-slate-900 sm:text-[2.15rem] sm:leading-[1.15]">
                Seberapa aktif keseharianmu?
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
                Pilih opsi yang paling menggambarkan aktivitasmu selama
                seminggu.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
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
                    className={
                      title === "Aktivitas fisik berat" ? "sm:col-span-2" : ""
                    }
                    icon={title === "Minim gerak" ? Clock3 : Activity}
                    key={title}
                    onClick={() => setActivity(title)}
                    title={title}
                    description={text}
                  />
                ))}
              </div>
              <p className="mb-3 mt-7 text-[15px] font-semibold tracking-[-0.015em] text-slate-800">
                Apakah kamu rutin latihan di gym?
              </p>
              <p className="mb-3 text-[13px] leading-6 text-slate-500">
                Ini menyesuaikan target protein dewasa. Acuan latihan memakai
                1,6 g/kg berat badan per hari.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  [true, "Ya, rutin gym"],

                  [false, "Tidak rutin gym"],
                ].map(([value, title]) => (
                  <ChoiceCard
                    active={isGym === value}
                    icon={Dumbbell}
                    key={title}
                    onClick={() => setIsGym(value)}
                    title={title}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <Pill icon={Target}>Targetmu</Pill>
              <h1 className="mt-5 max-w-2xl text-[1.7rem] font-bold leading-[1.2] tracking-[-0.04em] text-slate-900 sm:text-[2.15rem] sm:leading-[1.15]">
                Apa yang ingin kamu capai?
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
                Pilih arah targetmu. Rekomendasi tetap mengacu pada AKG dan
                dibuat dengan penyesuaian yang bertahap.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <ChoiceCard
                  active={goal === "Menurunkan berat badan"}
                  icon={TrendingUp}
                  onClick={() => setGoal("Menurunkan berat badan")}
                  title="Menurunkan berat badan"
                  description="Penyesuaian energi bertahap, bukan diet ekstrem"
                />
                <ChoiceCard
                  active={goal === "Menjaga berat badan"}
                  icon={HeartPulse}
                  onClick={() => setGoal("Menjaga berat badan")}
                  title="Menjaga berat badan"
                  description="Pertahankan kebutuhan energi harian"
                />
                <ChoiceCard
                  active={goal === "Menambah berat badan"}
                  className="sm:col-span-2"
                  icon={Dumbbell}
                  onClick={() => setGoal("Menambah berat badan")}
                  title="Menambah berat badan"
                  description="Tingkatkan asupan secara seimbang"
                />
              </div>
              <div
                className={cn(
                  "mt-6 rounded-2xl border border-sky-500 p-4 text-white shadow-[0_10px_25px_-10px_rgba(14,165,233,.8)] transition duration-300 hover:-translate-y-0.5 hover:border-sky-600 hover:shadow-xl sm:flex sm:items-center sm:justify-between sm:p-5",

                  profileBlue,
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    Acuanmu siap dihitung
                  </p>
                  <p className="mt-1.5 text-[14px] leading-6 text-white/90">
                    Rangkuman AKG menyesuaikan usia, jenis kelamin, dan kondisi
                    kehamilan atau menyusui.
                  </p>
                </div>
                <Zap className="mt-3 size-6 shrink-0 text-white sm:ml-4 sm:mt-0" />
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5 sm:mt-9 sm:pt-6">
            <Button
              disabled={step === 0 || saving}
              onClick={() => {
                setNotice("")

                setStep((current) => Math.max(0, current - 1))
              }}
              variant="secondary"
            >
              <ArrowLeft className="size-4" /> Kembali
            </Button>
            <Button
              className={cn(
                "min-w-36 px-4 shadow-[0_10px_24px_-12px_rgba(2,132,199,.8)] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-200 sm:px-5",

                profileBlue,
              )}
              disabled={saving || (editMode && !profileLoaded)}
              onClick={() => (step < 3 ? continueStep() : finishOnboarding())}
            >
              {saving
                ? "Menyimpan…"
                : step === 3
                  ? editMode
                    ? "Simpan perubahan"
                    : "Simpan profil"
                  : "Lanjutkan"}
              {step === 3 ? (
                <Sparkles className="size-4" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </Button>
          </div>
        </section>

        <div className="lg:sticky lg:top-24 lg:col-start-3">
          <AKGReferenceCard
            targets={previewTargets}
            age={age}
            dropdownOpensDown={dropdownOpensDown}
          />
          <p className="mt-3 px-1 text-xs leading-5 text-slate-400 lg:hidden">
            Angka acuan penduduk Indonesia. Kebutuhan individu dapat berbeda.
          </p>
        </div>
      </div>
      <NoticeToast message={notice} onClose={() => setNotice("")} />
      {confirmUpdate && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving)
              setConfirmUpdate(false)
          }}
        >
          <section
            aria-labelledby="profile-update-dialog-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            role="dialog"
          >
            <h2
              className="text-lg font-semibold text-slate-900"
              id="profile-update-dialog-title"
            >
              Simpan perubahan?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Data onboarding akan diperbarui dan digunakan untuk menghitung
              kembali acuan gizimu.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="h-10 rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                disabled={saving}
                onClick={() => setConfirmUpdate(false)}
                type="button"
              >
                Batal
              </button>
              <button
                className="h-10 rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                disabled={saving}
                onClick={() => finishOnboarding(true)}
                type="button"
              >
                {saving ? "Menyimpan…" : "Ya, simpan perubahan"}
              </button>
            </div>
          </section>
        </div>
      )}
      {showUnsavedChanges && (
        <UnsavedChangesDialog
          onCancel={() => setShowUnsavedChanges(false)}
          onDiscard={() => navigate("/profile")}
        />
      )}
    </main>
  )
}

function ProfilePage({ navigate }) {
  const { user } = useAuth()

  const location = useLocation()
  const [showProfilePreview, setShowProfilePreview] = useState(false)

  const avatarUrl = getProfileAvatarUrl(user)

  const [form, setForm] = useState({
    full_name: user?.user_metadata?.full_name || "",

    age: "",

    gender: "",

    pregnancy_status: "",

    weight_kg: "",

    height_cm: "",

    activity: "",

    is_gym: null,

    goal: "",
  })

  const [loading, setLoading] = useState(true)

  const [profileLoaded, setProfileLoaded] = useState(false)

  const [loadError, setLoadError] = useState("")

  const [reload, setReload] = useState(0)

  const [notice, setNotice] = useState("")

  useEffect(() => {
    if (location.state?.notice) setNotice(location.state.notice)
  }, [location.state?.notice])

  useEffect(() => {
    let active = true

    setLoading(true)

    setLoadError("")

    api("/profile")

      .then((profile) => {
        if (!active) return

        setForm({
          full_name: profile.full_name || user?.user_metadata?.full_name || "",

          age: profile.age == null ? "" : String(profile.age),

          gender: profile.gender || "",

          pregnancy_status: profile.pregnancy_status || "",

          weight_kg: profile.weight_kg == null ? "" : String(profile.weight_kg),

          height_cm: profile.height_cm == null ? "" : String(profile.height_cm),

          activity: profile.activity || "",

          is_gym: typeof profile.is_gym === "boolean" ? profile.is_gym : null,

          goal: profile.goal || "",
        })
      })

      .catch((error) => active && setLoadError(error.message))

      .finally(() => {
        if (active) {
          setLoading(false)

          setProfileLoaded(true)
        }
      })

    return () => {
      active = false
    }
  }, [reload, user?.user_metadata?.full_name])

  return (
    <main className="font-poppins min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/70 via-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white shadow-[0_6px_24px_-20px_rgba(15,23,42,.45)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 py-3.5 sm:min-h-[86px] sm:px-6 lg:px-8">
          <Brand />
          <button
            aria-label="Kembali ke dasbor"
            className="grid size-9 place-items-center rounded-xl bg-sky-500 text-white shadow-[0_10px_25px_-10px_rgba(14,165,233,.8)] transition-all duration-300 hover:scale-[1.03] hover:bg-sky-600 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
            onClick={() => navigate("/dashboard")}
            title="Kembali ke dasbor"
            type="button"
          >
            <ArrowLeft className="size-4.5" />
          </button>
        </div>
        <ScrollProgressBar />
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 pb-12 sm:px-6 sm:py-10 lg:px-8">
        {loadError ? (
          <section className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
            <NoticeAlert message={loadError} />
            <Button
              className="mt-4"
              onClick={() => setReload((value) => value + 1)}
              variant="secondary"
            >
              Coba lagi
            </Button>
          </section>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <ProfileCard1
              avatarUrl={avatarUrl}
              email={user?.email || ""}
              name={loading ? "Memuat akun…" : form.full_name}
              onEdit={() => navigate("/profile/account")}
              onView={() => setShowProfilePreview(true)}
            />

            <section className="rounded-3xl border border-white/80 bg-white/95 p-5 shadow-[0_20px_60px_-36px_rgba(15,23,42,.3)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="font-bold text-slate-900">Onboarding</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Acuan gizimu dihitung dari data berikut.
                  </p>
                </div>
                <Button
                  className="group shadow-[0_10px_25px_-10px_rgba(14,165,233,.8)] transition-all hover:scale-[1.03] active:scale-95"
                  disabled={loading || !profileLoaded}
                  onClick={() => navigate("/profile/onboarding")}
                >
                  <Pencil className="size-4" /> Edit data onboarding
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                </Button>
              </div>
              {loading ? (
                <p className="py-6 text-sm text-slate-500">Memuat data…</p>
              ) : loadError ? (
                <NoticeAlert className="mt-4" message={loadError} />
              ) : (
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Usia", form.age ? `${form.age} tahun` : "—"],

                    ["Jenis kelamin", form.gender || "—"],

                    [
                      "Berat badan",

                      form.weight_kg ? `${form.weight_kg} kg` : "—",
                    ],

                    [
                      "Tinggi badan",

                      form.height_cm ? `${form.height_cm} cm` : "—",
                    ],

                    ["Aktivitas", form.activity || "—"],

                    [
                      "Latihan gym",

                      form.is_gym
                        ? "Rutin"
                        : form.is_gym === false
                          ? "Tidak rutin"
                          : "—",
                    ],

                    ["Kehamilan/menyusui", form.pregnancy_status || "—"],

                    ["Target", form.goal || "—"],
                  ].map(([label, value]) => (
                    <div
                      className="rounded-xl bg-slate-50 px-4 py-3"
                      key={label}
                    >
                      <dt className="text-xs font-medium text-slate-500">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-800">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          </div>
        )}
      </div>
      <NoticeToast
        message={notice}
        onClose={() => {
          setNotice("")

          if (location.state?.notice)
            navigate("/profile", { replace: true, state: null })
        }}
      />
      {showProfilePreview && (
        <ProfilePreviewDialog
          avatar={avatarUrl}
          name={form.full_name}
          onClose={() => setShowProfilePreview(false)}
        />
      )}
    </main>
  )
}

function ProfileAccountPage({ navigate }) {
  const { user, updateUserMetadata } = useAuth()
  const avatarInput = useRef(null)
  const [cropFile, setCropFile] = useState(null)
  const [pendingAvatarBlob, setPendingAvatarBlob] = useState(null)
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState("")
  const [showProfilePreview, setShowProfilePreview] = useState(false)
  const originalAvatarUrl = getOriginalGoogleAvatarUrl(user)
  const [name, setName] = useState(user?.user_metadata?.full_name || "")
  const avatarUrl = getProfileAvatarUrl(user)
  const [loading, setLoading] = useState(true)

  const [profileLoaded, setProfileLoaded] = useState(false)

  const [hasProfile, setHasProfile] = useState(false)

  const [initialName, setInitialName] = useState(
    user?.user_metadata?.full_name || "",
  )

  const [saving, setSaving] = useState(false)

  const [notice, setNotice] = useState("")
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false)

  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)

  const [deleteAvatarPending, setDeleteAvatarPending] = useState(false)

  useScrollLock(showSaveConfirmation)

  const customAvatar = hasCustomAvatar(avatarUrl, originalAvatarUrl)
  const nameHasChanged = name.trim() !== initialName.trim()
  const hasUnsavedChanges =
    nameHasChanged || Boolean(pendingAvatarBlob) || deleteAvatarPending

  useEffect(
    () => () => {
      if (pendingAvatarPreview) URL.revokeObjectURL(pendingAvatarPreview)
    },
    [pendingAvatarPreview],
  )

  useEffect(() => {
    let active = true

    api("/profile")

      .then((profile) => {
        if (active) {
          setHasProfile(Boolean(profile.user_id))

          setProfileLoaded(true)

          const loadedName =
            profile.full_name || user?.user_metadata?.full_name || ""

          setName(loadedName)

          setInitialName(loadedName)
        }
      })

      .catch((error) => active && setNotice(error.message))

      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [user?.user_metadata?.full_name])

  const saveName = (event) => {
    event.preventDefault()

    const fullName = name.trim()
    if (nameHasChanged && (!fullName || fullName.length > 120)) {
      setNotice("Nama wajib diisi dan maksimal 120 karakter.")
      return
    }

    if (hasUnsavedChanges) setShowSaveConfirmation(true)
  }

  const confirmSaveName = async () => {
    const fullName = name.trim()
    setSaving(true)
    setNotice("")
    try {
      const metadata = {}
      if (nameHasChanged) {
        const query = supabase.from("profiles")
        const { error } = hasProfile
          ? await query.update({ full_name: fullName }).eq("user_id", user.id)
          : await query.insert({ user_id: user.id, full_name: fullName })
        if (error) throw error
        metadata.full_name = fullName
      }
      if (pendingAvatarBlob) {
        const body = new FormData()
        body.append("avatar", pendingAvatarBlob, "avatar.jpg")
        const result = await api("/profile/avatar", { method: "POST", body })
        metadata.avatar_url = `${result.avatar_url}?t=${Date.now()}`
        metadata.google_avatar_url = originalAvatarUrl
      } else if (deleteAvatarPending) {
        await api("/profile/avatar", { method: "DELETE" })
        metadata.avatar_url = originalAvatarUrl
      }
      if (Object.keys(metadata).length) await updateUserMetadata(metadata)
      const notice = deleteAvatarPending
        ? nameHasChanged
          ? "Profil diperbarui dan foto Google dipulihkan."
          : "Foto profil berhasil dihapus."
        : pendingAvatarBlob && !nameHasChanged
          ? "Foto profil berhasil diperbarui."
          : "Data berhasil diubah."
      navigate("/profile", { replace: true, state: { notice } })
    } catch (error) {
      setNotice(error.message || "Nama profil gagal diperbarui.")
    } finally {
      setSaving(false)
      setShowSaveConfirmation(false)
    }
  }

  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0]

    event.target.value = ""

    if (!file) return

    if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type))
      return setNotice("Gunakan foto JPG, PNG, atau WebP.")
    if (file.size > 5 * 1024 * 1024)
      return setNotice("Ukuran foto maksimal 5 MB.")

    setNotice("")
    setCropFile(file)
  }

  return (
    <main className="font-poppins min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/70 via-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white shadow-[0_6px_24px_-20px_rgba(15,23,42,.45)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 py-3.5 sm:min-h-[86px] sm:px-6 lg:px-8">
          <Brand />
          <HeaderBackButton
            disabled={saving}
            label="Kembali ke profil"
            onClick={() =>
              hasUnsavedChanges
                ? setShowUnsavedChanges(true)
                : navigate("/profile")
            }
          />
        </div>
        <ScrollProgressBar />
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 pb-12 sm:px-6 sm:py-10 lg:px-8">
        <section className="min-h-[28rem] rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_60px_-36px_rgba(15,23,42,.3)] sm:min-h-[30rem] sm:p-9">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Edit profil
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Perbarui nama dan foto akunmu.
          </p>
          <form
            className="mt-6 grid gap-6 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center sm:gap-8"
            onSubmit={saveName}
          >
            <div className="flex flex-col items-center gap-4">
              <button
                aria-label="Lihat profil"
                className="grid size-36 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-violet-400 p-1 text-3xl font-bold text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:size-40"
                onClick={() => setShowProfilePreview(true)}
                type="button"
              >
                {pendingAvatarPreview || avatarUrl ? (
                  <img
                    alt="Foto profil"
                    className="size-full rounded-full bg-white object-cover"
                    src={pendingAvatarPreview || avatarUrl}
                  />
                ) : (
                  <span className="grid size-full place-items-center rounded-full bg-white">
                    {(name || user?.email || "N").slice(0, 1).toUpperCase()}
                  </span>
                )}
              </button>
              <input
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={uploadAvatar}
                ref={avatarInput}
                type="file"
              />
              <div className="flex items-center gap-3">
                <button
                  aria-label="Edit foto"
                  className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm disabled:opacity-50"
                  disabled={saving}
                  onClick={() => avatarInput.current?.click()}
                  type="button"
                >
                  <Pencil aria-hidden="true" className="size-4" />
                </button>
                {customAvatar && (
                  <button
                    aria-label="Hapus foto profil"
                    className="grid size-11 place-items-center rounded-xl border border-rose-200 bg-white text-rose-600 shadow-sm disabled:opacity-50"
                    disabled={saving}
                    onClick={() => {
                      setPendingAvatarBlob(null)
                      setPendingAvatarPreview("")
                      setDeleteAvatarPending(true)
                      setShowSaveConfirmation(true)
                    }}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-5">
              <Input
                label="Nama lengkap"
                maxLength={120}
                onChange={setName}
                placeholder="Nama lengkap"
                value={name}
              />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold tracking-[-0.015em] text-slate-800">
                  Email
                </span>
                <input
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 text-[15px] text-slate-500 shadow-sm shadow-slate-900/[0.02]"
                  readOnly
                  value={user?.email || ""}
                />
              </label>
              <Button
                className="w-full"
                disabled={
                  loading ||
                  saving ||
                  !profileLoaded ||
                  !user ||
                  !hasUnsavedChanges
                }
                type="submit"
              >
                {saving ? "Menyimpan…" : "Simpan perubahan"}
              </Button>
            </div>
          </form>
          <NoticeToast message={notice} onClose={() => setNotice("")} />
        </section>
      </div>
      {showUnsavedChanges && (
        <UnsavedChangesDialog
          onCancel={() => setShowUnsavedChanges(false)}
          onDiscard={() => navigate("/profile")}
        />
      )}
      {showSaveConfirmation && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving)
              setShowSaveConfirmation(false)
          }}
        >
          <section
            aria-labelledby="account-save-dialog-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            role="dialog"
          >
            <h2
              className="text-lg font-semibold text-slate-900"
              id="account-save-dialog-title"
            >
              Simpan perubahan?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {deleteAvatarPending
                ? nameHasChanged
                  ? "Nama akan diperbarui, foto kustom dihapus, dan foto Google dipulihkan."
                  : "Foto kustom akan dihapus dan foto Google dipulihkan."
                : pendingAvatarBlob
                  ? "Perubahan nama dan foto profil akan disimpan."
                  : "Nama profil akan diperbarui."}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="h-10 rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                disabled={saving}
                onClick={() => {
                  setShowSaveConfirmation(false)
                  setDeleteAvatarPending(false)
                }}
                type="button"
              >
                Batal
              </button>
              <button
                className="h-10 rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                disabled={saving}
                onClick={confirmSaveName}
                type="button"
              >
                {saving ? "Menyimpan…" : "Ya, simpan perubahan"}
              </button>
            </div>
          </section>
        </div>
      )}
      {cropFile && (
        <AvatarCropper
          file={cropFile}
          onCancel={() => setCropFile(null)}
          onCrop={(blob) => {
            if (pendingAvatarPreview) URL.revokeObjectURL(pendingAvatarPreview)
            setPendingAvatarBlob(blob)
            setPendingAvatarPreview(URL.createObjectURL(blob))
            setCropFile(null)
            setDeleteAvatarPending(false)
          }}
        />
      )}
      {showProfilePreview && (
        <ProfilePreviewDialog
          avatar={pendingAvatarPreview || avatarUrl}
          name={name}
          onClose={() => setShowProfilePreview(false)}
        />
      )}
    </main>
  )
}

/*
function OnboardingLegacy({ navigate }) {
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
                    icon={UserRound}
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
      {false && notice && (
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

*/

function AppShell({
  children,

  active,

  navigate,

  minimal = false,

  scannerBack = false,

  summaryNav = false,

  summaryTitle = "",

  camera = false,
}) {
  const { user } = useAuth()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [sidebarHovered, setSidebarHovered] = useState(false)

  const [suppressSidebarHover, setSuppressSidebarHover] = useState(false)

  const sidebarExpanded =
    !sidebarCollapsed || (sidebarHovered && !suppressSidebarHover)

  const items = [
    ["dashboard", "Ringkasan", Activity],

    ["scanner", "Scan", ScanLine],

    ["chat", "Nutrily AI", Sparkles],

    ["meals", "Riwayat", History],
  ]

  return (
    <div className="dashboard-shell min-h-screen bg-slate-50 text-slate-900">
      {!minimal && active !== "chat" && (
        <aside
          className={cn(
            "group fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-100 bg-white p-5 font-poppins font-semibold transition-[width,box-shadow,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:flex",

            sidebarExpanded ? "w-64 px-5" : "w-20 px-2",

            sidebarCollapsed &&
              sidebarExpanded &&
              "shadow-[12px_0_40px_-18px_rgba(14,165,233,0.35)]",
          )}
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => {
            setSidebarHovered(false)

            setSuppressSidebarHover(false)
          }}
        >
          <div
            className={cn(
              "flex items-center py-2",

              sidebarExpanded ? "justify-between" : "justify-center",
            )}
          >
            <button
              aria-expanded={sidebarExpanded}
              aria-label={
                sidebarCollapsed
                  ? "Buka sidebar permanen"
                  : "Tutup sidebar permanen"
              }
              className={cn(
                "grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-white to-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100 transition-all duration-300 hover:scale-105 hover:rotate-[-3deg] hover:shadow-md hover:shadow-sky-200/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100 motion-reduce:transition-none",

                sidebarExpanded ? "size-10" : "size-7",
              )}
              onClick={() => {
                const collapse = !sidebarCollapsed

                setSidebarCollapsed(collapse)

                setSuppressSidebarHover(collapse && sidebarHovered)
              }}
              title={
                sidebarCollapsed
                  ? "Buka sidebar permanen"
                  : "Tutup sidebar permanen"
              }
              type="button"
            >
              <Menu className="size-5" strokeWidth={2.2} />
            </button>
          </div>
          <nav className="mt-8 space-y-1.5">
            {items.map(([screen, label, Icon]) => (
              <button
                aria-label={sidebarCollapsed ? label : undefined}
                className={cn(
                  "group/item flex w-full items-center rounded-xl py-3 text-xs font-normal transition-all duration-300 ease-out hover:translate-x-1 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 hover:text-sky-700 hover:shadow-[0_8px_20px_-14px_rgba(14,165,233,0.8)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100 motion-reduce:transition-none",

                  !sidebarExpanded ? "justify-center px-0" : "gap-3 px-3",

                  active === screen
                    ? "bg-gradient-to-r from-sky-50 via-sky-50 to-indigo-50 text-sky-700 shadow-sm ring-1 ring-sky-100"
                    : "text-slate-500",
                )}
                key={screen}
                onClick={() => navigate(screen)}
                title={sidebarCollapsed ? label : undefined}
              >
                <Icon className="size-5 shrink-0 transition-transform duration-300 group-hover/item:scale-110 motion-reduce:transition-none" />
                <span
                  className={cn(
                    "overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-300 ease-out motion-reduce:transition-none",

                    !sidebarExpanded && "max-w-0 -translate-x-2 opacity-0",

                    sidebarExpanded && "max-w-48 translate-x-0 opacity-100",
                  )}
                >
                  {label}
                </span>
              </button>
            ))}
          </nav>
          <button
            aria-label="Buka sidebar secara permanen"
            className={cn(
              "mt-auto flex min-w-0 items-center rounded-xl border-t border-slate-100 pt-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100",

              !sidebarExpanded ? "mx-auto" : "gap-2.5 px-2",
            )}
            onClick={() => setSidebarCollapsed(false)}
            title={sidebarCollapsed ? "Buka sidebar" : undefined}
            type="button"
          >
            <Brand compact />
            <span
              className={cn(
                "text-xl font-semibold tracking-tight text-slate-900",

                !sidebarExpanded && "hidden",
              )}
            >
              Nutri<span className="text-sky-500">ly</span>
            </span>
          </button>
        </aside>
      )}
      <div
        className={cn(
          minimal || active === "chat"
            ? ""
            : sidebarExpanded
              ? "lg:pl-64"
              : "lg:pl-20",

          !minimal &&
            "transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        )}
      >
        {!camera && active !== "chat" && (
          <header
            className={cn(
              "sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white px-5 sm:px-8",

              ["dashboard", "meals", "scanner"].includes(active)
                ? "h-20"
                : "h-16",
            )}
          >
            {minimal ? (
              <>
                <Brand compact={summaryNav} />
                {summaryNav && (
                  <p className="absolute left-1/2 max-w-[55%] -translate-x-1/2 truncate text-sm font-semibold text-slate-800 sm:text-base">
                    {summaryTitle}
                  </p>
                )}
                {summaryNav ? (
                  <HeaderBackButton
                    label="Kembali ke pemindai"
                    onClick={() => navigate("/scanner")}
                  />
                ) : (
                  <>
                    {scannerBack && (
                      <button
                        className="absolute left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-sky-700 sm:gap-2 sm:px-3 sm:text-sm"
                        onClick={() => navigate("/scanner")}
                        type="button"
                      >
                        <ArrowLeft className="size-4" />
                        <span className="hidden sm:inline">
                          Kembali ke pemindai
                        </span>
                        <span className="sm:hidden">Pemindai</span>
                      </button>
                    )}
                    <ProfileDropdown
                      data={{
                        name:
                          user?.user_metadata?.full_name ||
                          user?.email?.split("@")[0] ||
                          "Profil Nutrily",

                        email: user?.email || "",

                        avatar: getProfileAvatarUrl(user),
                      }}
                      onEditProfile={() => navigate("/profile/account")}
                      onSignOut={async () => {
                        await supabase?.auth.signOut()

                        navigate("/")
                      }}
                    />
                  </>
                )}
              </>
            ) : (
              <>
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
                <ProfileDropdown
                  data={{
                    name:
                      user?.user_metadata?.full_name ||
                      user?.email?.split("@")[0] ||
                      "Profil Nutrily",

                    email: user?.email || "",

                    avatar: getProfileAvatarUrl(user),
                  }}
                  onEditProfile={() => navigate("/profile/account")}
                  onSignOut={async () => {
                    await supabase?.auth.signOut()

                    navigate("/")
                  }}
                />
              </>
            )}
            <ScrollProgressBar className="absolute inset-x-0 bottom-0 h-[5px] overflow-hidden bg-sky-100/70" />
          </header>
        )}
        {children}
      </div>
      {!minimal &&
        active !== "chat" &&
        createPortal(
          <LimelightNav
            activeIndex={Math.max(
              0,

              items.findIndex(([screen]) => screen === active),
            )}
            className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-50 h-16 w-[92vw] -translate-x-1/2 rounded-2xl border-slate-200 bg-white/95 shadow-[0_12px_36px_-14px_rgba(15,23,42,0.3)] backdrop-blur lg:hidden"
            iconContainerClassName="flex-1 px-3"
            items={items.map(([screen, label, Icon]) => ({
              id: screen,

              icon: <Icon />,

              label,

              onClick: () => navigate(screen),
            }))}
          />,

          document.body,
        )}
    </div>
  )
}

function Dashboard({ navigate }) {
  const location = useLocation()
  const [dashboardNotice, setDashboardNotice] = useState(
    location.state?.notice || "",
  )
  const [summary, setSummary] = useState(null)
  const [dailyConsulting, setDailyConsulting] = useState(false)

  useEffect(() => {
    if (!location.state?.notice) return

    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

  const [loadError, setLoadError] = useState("")

  const [featureLoadError, setFeatureLoadError] = useState("")

  const [featureUsage, setFeatureUsage] = useState({
    label: 0,

    receipt: 0,

    chatbot: 0,
  })

  const { user } = useAuth()

  useEffect(() => {
    let active = true

    const onFeatureUsage = (event) => {
      if (event.detail?.userId !== user?.id) return

      api("/features")

        .then((usage) => {
          if (!active) return

          setFeatureUsage(usage)

          setFeatureLoadError("")
        })

        .catch((error) => active && setFeatureLoadError(error.message))
    }

    window.addEventListener("nutrily:feature-usage", onFeatureUsage)

    return () => {
      active = false

      window.removeEventListener("nutrily:feature-usage", onFeatureUsage)
    }
  }, [user?.id])

  useEffect(() => {
    let active = true

    api("/dashboard")

      .then((result) => active && setSummary(result))

      .catch((error) => active && setLoadError(error.message))

    api("/features")

      .then((usage) => {
        if (!active) return

        setFeatureUsage(usage)

        setFeatureLoadError("")
      })

      .catch((error) => active && setFeatureLoadError(error.message))

    return () => {
      active = false
    }
  }, [user?.id])

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

    [
      "Gula total",

      totals.sugar_g || 0,

      targets.sugar_g || 50,

      "g",

      "bg-rose-400",
    ],

    [
      "Natrium",

      totals.sodium_mg || 0,

      targets.sodium_mg || 2000,

      "mg",

      "bg-orange-500",
    ],
  ].map(([name, current, target, unit, color]) => ({
    name,

    current: Number(current).toFixed(0),

    target: `${target} ${unit}`,

    unit,

    pct: `${Math.min(100, Math.round((current / target) * 100))}%`,

    color,
  }))

  const startDailyConsultation = async () => {
    if (dailyConsulting || !summary) return

    setDailyConsulting(true)

    const conversationId = newConversationId()

    const mealLines = (summary.meals || [])

      .slice(0, 10)

      .map(
        (meal) =>
          `- ${String(meal.name || "Makanan").slice(0, 80)} (${meal.serving_size || "1 sajian"}): ${meal.calories ?? "?"} kkal, P ${meal.protein_g ?? "?"}g, K ${meal.carbs_g ?? "?"}g, L ${meal.fat_g ?? "?"}g, gula ${meal.sugar_g ?? "?"}g, Na ${meal.sodium_mg ?? "?"}mg`,
      )

    const totals = [
      "calories",

      "protein_g",

      "carbs_g",

      "fat_g",

      "sugar_g",

      "sodium_mg",
    ]

      .map((key) => `${key}: ${summary.totals?.[key] ?? "belum diketahui"}`)

      .join(", ")

    const targetValues = [
      "calories",

      "protein_g",

      "carbs_g",

      "fat_g",

      "sugar_g",

      "sodium_mg",
    ]

      .map((key) => `${key}: ${targets[key] ?? "belum ditetapkan"}`)

      .join(", ")

    try {
      await api("/chat", {
        method: "POST",

        body: JSON.stringify({
          conversation_id: conversationId,

          message: `Ringkasan asupan harian Nutrily:\n${mealLines.join("\n") || "Belum ada makanan tercatat hari ini."}\n${
            (summary.meals || []).length > 25
              ? `Makanan lain: ${(summary.meals || []).length - 25} item tambahan; gunakan total untuk analisis.\n`
              : ""
          }Total hari ini (${totals}). Target harian (${targetValues}). Analisis kecukupan, pola, dan saran perbaikan dibanding target. Jelaskan keterbatasan bila data kosong.`,
        }),
      })

      navigate(`/chat/${conversationId}`)
    } catch (error) {
      setLoadError(error.message)
    } finally {
      setDailyConsulting(false)
    }
  }

  const chartData = [
    { name: "Protein", value: totals.protein_g, color: "#8B5CF6" },

    { name: "Lemak", value: totals.fat_g, color: "#F59E0B" },

    { name: "Karbohidrat", value: totals.carbs_g, color: "#10B981" },
  ].filter(({ value }) => value > 0)

  const donutData = chartData.length
    ? chartData
    : [{ name: "Belum ada data", value: 1, color: "#e2e8f0" }]

  return (
    <AppShell active="dashboard" navigate={navigate}>
      <main className="mx-auto max-w-7xl px-5 pb-28 pt-7 sm:px-8 lg:pb-10">
        <NoticeToast
          message={dashboardNotice}
          onClose={() => setDashboardNotice("")}
        />
        <div className="mb-7 md:flex md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-600">
              Ringkasan harianmu
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Gambaran asupan gizimu
            </h1>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate("scanner")}>
            <Plus className="size-4" /> Catat makanan
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.55fr_.85fr]">
          <section className="h-fit self-start rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
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
                      data={donutData}
                      dataKey="value"
                      innerRadius={72}
                      outerRadius={96}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {donutData.map((entry) => (
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
                          {item.name === "Kalori" ? "" : item.unit}
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

          <section className="relative overflow-hidden rounded-3xl bg-sky-500 p-6 text-white shadow-xl shadow-sky-200">
            <div className="absolute -right-12 -top-12 size-40 rounded-full bg-white/20 blur-2xl" />
            <Pill icon={Sparkles}>Ringkasan asupan</Pill>
            <h2 className="relative mt-5 text-xl font-bold leading-7 text-white">
              {Number(totals.protein_g || 0) < 70
                ? "Analisis asupan gizi harianmu di sini!"
                : "Asupan proteinmu hari ini sudah tercatat dengan baik."}
            </h2>
            <p className="relative mt-3 text-sm leading-6 text-white">
              Ringkasan dihitung dari makanan yang kamu catat hari ini.
            </p>
            <Button
              className="relative mt-6 w-full border border-white/80 bg-white !font-bold !text-sky-700 shadow-lg shadow-sky-200 transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:bg-sky-50 hover:!text-sky-800"
              onClick={startDailyConsultation}
              disabled={dailyConsulting || !summary}
              variant="secondary"
            >
              {dailyConsulting ? "Menganalisis…" : "Tanya Nutrily AI"}{" "}
              <ArrowRight className="size-4" />
            </Button>
            <div className="relative mt-6 flex items-center gap-4 rounded-2xl border border-white/15 bg-sky-600 p-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white">
                <img
                  alt=""
                  aria-hidden="true"
                  className="size-5 object-contain"
                  src={`${import.meta.env.BASE_URL}logo-biru.png`}
                />
              </div>
              <div>
                <p className="text-xs text-white/85">Kualitas gizi</p>
                <p className="mt-0.5 text-sm font-bold text-white">
                  {Math.round(
                    (Number(totals.calories || 0) /
                      Number(targets.calories || 2100)) *
                      100,
                  )}
                  % dari target
                </p>
              </div>
            </div>
          </section>
        </div>

        <CalorieChart targets={targets} />

        {loadError && <NoticeAlert className="mt-4" message={loadError} />}
        <div className="mt-5 grid items-stretch gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <section className="h-full rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Riwayat Tampilan
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Tiga catatan makanan terbaru
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
              {(summary?.meals || []).slice(0, 3).map((meal) => (
                <button
                  className="group flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 first:pt-1 last:pb-0"
                  key={meal.id}
                  onClick={() =>
                    meal.scan_session_id
                      ? navigate(`/scanner/summary/${meal.scan_session_id}`)
                      : navigate("/meals")
                  }
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500">
                    <Utensils className="size-4.5 transition-colors group-hover:text-sky-600" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-slate-700 transition-colors group-hover:text-sky-700">
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

          <section className="h-full rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Fitur yang Sering Dipakai
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {featureLoadError
                ? "Jalankan migrasi statistik fitur untuk memuat data"
                : "Diurutkan berdasarkan pemakaian"}
            </p>
            <div className="mt-4">
              <BarRaceChart
                topN={3}
                caption="Jumlah pemakaian"
                data={[
                  {
                    id: "label",

                    label: "Scan label produk",

                    value: featureUsage.label,

                    color: 1,

                    icon: <ScanLine className="size-4 shrink-0 text-sky-600" />,
                  },

                  {
                    id: "receipt",

                    label: "Scan struk",

                    value: featureUsage.receipt,

                    color: 3,

                    icon: (
                      <ReceiptText className="size-4 shrink-0 text-emerald-600" />
                    ),
                  },

                  {
                    id: "chatbot",

                    label: "Chatbot",

                    value: featureUsage.chatbot,

                    color: 2,

                    icon: <Bot className="size-4 shrink-0 text-violet-600" />,
                  },
                ]}
                formatValue={(value) => `${value} kali`}
                onItemClick={({ id }) =>
                  navigate(id === "chatbot" ? "chat" : "scanner")
                }
              />
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  )
}

function LegacyScanner({ navigate }) {
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

        {notice && <NoticeAlert className="mt-5" message={notice} />}
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
        {notice && <NoticeAlert className="mt-4" message={notice} />}
      </main>
    </AppShell>
  )
}

function Scanner({ navigate }) {
  const { pathname } = useLocation()

  const isScannerHome = pathname === "/scanner"

  const isCamera =
    pathname === "/scanner/receipt" || pathname === "/scanner/label"

  const isConfirm =
    pathname === "/scanner/receipt/confirm" ||
    pathname === "/scanner/label/confirm"

  const isSummary = pathname.startsWith("/scanner/summary/")

  const [sessionName, setSessionName] = useState("")

  return (
    <AppShell
      active="scanner"
      minimal={!isScannerHome}
      scannerBack={!isScannerHome && !isCamera}
      summaryNav={isSummary}
      summaryTitle={sessionName}
      camera={isCamera || isConfirm}
      navigate={navigate}
    >
      <ScannerFlow navigate={navigate} onSessionName={setSessionName} />
    </AppShell>
  )
}

function ChatRoute({ navigate }) {
  const { conversationId } = useParams()

  return (
    <ProtectedRoute>
      <Chat
        key={conversationId || "new"}
        navigate={navigate}
        routeConversationId={conversationId}
      />
    </ProtectedRoute>
  )
}

function Chat({ navigate, routeConversationId }) {
  const { search } = useLocation()

  const requestedConversationId =
    routeConversationId || new URLSearchParams(search).get("conversation_id")

  const [message, setMessage] = useState("")

  const [image, setImage] = useState(null)

  const [notice, setNotice] = useState("")

  const [sending, setSending] = useState(false)

  const [messages, setMessages] = useState([])

  const [conversationId, setConversationId] = useState(
    () => routeConversationId || requestedConversationId || "",
  )

  const [conversations, setConversations] = useState([])

  const [showMobileChats, setShowMobileChats] = useState(false)

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [sidebarHovered, setSidebarHovered] = useState(false)

  const [deletingId, setDeletingId] = useState("")

  const [conversationToDelete, setConversationToDelete] = useState(null)

  const imageInput = useRef(null)

  const messagesPanel = useRef(null)

  const imageUrls = useRef([])

  const sidebarExpanded = sidebarOpen || sidebarHovered || showMobileChats

  useEffect(
    () => () => imageUrls.current.forEach((url) => URL.revokeObjectURL(url)),

    [],
  )

  useEffect(() => {
    api("/conversations")

      .then((items) => setConversations(Array.isArray(items) ? items : []))

      .catch((error) => setNotice(error.message))
  }, [])

  useEffect(() => {
    if (!requestedConversationId) return

    let active = true

    setConversationId(requestedConversationId)

    setMessages([])

    api(`/chat?conversation_id=${encodeURIComponent(requestedConversationId)}`)

      .then((result) => {
        if (!active) return

        setMessages(
          (Array.isArray(result?.messages) ? result.messages : [])

            .filter(Boolean)

            .map((item) => ({
              from: item.role === "assistant" ? "ai" : "user",

              text: item.content || "",
            })),
        )
      })

      .catch((error) => active && setNotice(error.message))

    return () => {
      active = false
    }
  }, [requestedConversationId])

  useEffect(() => {
    if (!routeConversationId && requestedConversationId)
      navigate(`/chat/${requestedConversationId}`, { replace: true })
    else if (!routeConversationId && conversationId && messages.length)
      navigate(`/chat/${conversationId}`, { replace: true })
  }, [
    conversationId,
    messages.length,
    navigate,
    requestedConversationId,
    routeConversationId,
  ])

  useEffect(() => {
    const panel = messagesPanel.current

    if (panel) panel.scrollTop = panel.scrollHeight
  }, [messages])

  const openConversation = (id) => {
    setNotice("")

    setShowMobileChats(false)

    navigate(`/chat/${id}`)
  }

  const startNewChat = () => {
    setShowMobileChats(false)

    setConversationId("")

    setMessages([])

    setMessage("")

    setImage(null)

    setNotice("")

    navigate("/chat", { replace: true })
  }

  const deleteConversation = async (id) => {
    setDeletingId(id)

    setNotice("")

    try {
      await api(`/conversations?conversation_id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })

      setConversations((items) => items.filter((item) => item.id !== id))

      setShowMobileChats(false)

      if (conversationId === id) {
        setConversationId("")

        setMessages([])

        setMessage("")

        setImage(null)

        navigate("/chat", { replace: true })
      }
    } catch (error) {
      setNotice(error.message)
    } finally {
      setDeletingId("")
    }
  }

  const chooseImage = (event) => {
    const file = event.target.files?.[0]

    event.target.value = ""

    if (!file) return

    if (!/^image\/(jpeg|png)$/.test(file.type)) {
      setNotice("Gunakan gambar JPG atau PNG.")

      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setNotice("Ukuran gambar maksimal 8 MB.")

      return
    }

    const url = URL.createObjectURL(file)

    imageUrls.current.push(url)

    setImage({ file, url })

    setNotice("")
  }

  const send = async (event) => {
    event.preventDefault()

    if ((!message.trim() && !image) || sending) return

    const question = message.trim()

    const activeConversationId = conversationId || newConversationId()

    const userMessage = {
      from: "user",

      text: question,

      imageUrl: image?.url,
    }

    setSending(true)

    setNotice("")

    setMessages((current) => [...current, userMessage])

    setMessage("")

    setImage(null)

    try {
      const body = image
        ? (() => {
            const form = new FormData()

            form.append("message", question)

            form.append("conversation_id", activeConversationId)

            form.append("image", image.file)

            return form
          })()
        : JSON.stringify({
            message: question,

            conversation_id: activeConversationId,
          })

      const result = await api("/chat", {
        method: "POST",

        body,
      })

      setMessages((current) => [
        ...current,

        { from: "ai", text: result.answer },
      ])

      setConversationId(activeConversationId)

      const items = await api("/conversations").catch(() => null)

      if (items) setConversations(Array.isArray(items) ? items : [])

      if (!routeConversationId)
        navigate(`/chat/${activeConversationId}`, { replace: true })
    } catch (error) {
      setNotice(error.message)

      setMessages((current) => current.filter((item) => item !== userMessage))

      setMessage(question)

      setImage(image)
    } finally {
      setSending(false)
    }
  }

  return (
    <AppShell active="chat" navigate={navigate}>
      <main
        className="font-poppins relative h-dvh overflow-hidden bg-white text-slate-900"
        data-lenis-prevent
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <div className="absolute -left-40 -top-48 size-[34rem] rounded-full bg-sky-100/80 blur-[120px]" />
          <div className="absolute -bottom-64 right-[-8rem] size-[36rem] rounded-full bg-indigo-100/60 blur-[130px]" />
          <div className="absolute right-[28%] top-[18%] size-64 rounded-full bg-cyan-100/70 blur-[100px]" />
        </div>
        <div
          className={cn(
            "relative z-10 mx-auto grid h-full max-w-[1600px] overflow-hidden border-x border-slate-100 bg-transparent transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",

            sidebarExpanded
              ? "lg:grid-cols-[260px_minmax(0,1fr)]"
              : "lg:grid-cols-[72px_minmax(0,1fr)]",
          )}
        >
          <button
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-30 bg-slate-950/20 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 motion-reduce:transition-none lg:hidden",

              showMobileChats
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none",
            )}
            onClick={() => setShowMobileChats(false)}
            tabIndex={-1}
            type="button"
          />
          <aside
            onMouseEnter={() => {
              setSidebarHovered(true)
            }}
            onMouseLeave={() => {
              setSidebarHovered(false)
            }}
            className={cn(
              "fixed inset-y-0 left-0 z-40 flex w-[min(82vw,260px)] min-h-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white/95 p-3 backdrop-blur-xl transition-[translate,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:static lg:z-auto lg:w-auto lg:translate-x-0 lg:bg-white/85",

              showMobileChats ? "translate-x-0" : "-translate-x-full",

              sidebarExpanded ? "items-stretch" : "items-center px-2",
            )}
          >
            <button
              aria-label="Tutup sidebar"
              className="grid size-10 shrink-0 place-items-center self-start rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 lg:hidden"
              onClick={() => setShowMobileChats(false)}
              type="button"
            >
              <X className="size-5" />
            </button>
            <button
              aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
              aria-expanded={sidebarExpanded}
              className={cn(
                "hidden shrink-0 place-items-center rounded-xl text-slate-500 transition-[width,height,margin,background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 motion-reduce:transition-none lg:grid",

                sidebarExpanded
                  ? "size-10 self-start"
                  : "mx-auto size-8 self-center",
              )}
              onClick={() => {
                setSidebarHovered(false)

                setSidebarOpen((open) => !open)
              }}
              title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
              type="button"
            >
              <Menu className="size-5" />
            </button>
            <button
              aria-label="Percakapan baru"
              className={cn(
                "mt-5 flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-sky-500 bg-sky-500 text-[11px] font-bold text-white transition-[width,padding,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-sky-600 hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 motion-reduce:transition-none",

                sidebarExpanded ? "w-full px-3" : "size-10",
              )}
              onClick={startNewChat}
              type="button"
              title="Percakapan baru"
            >
              <Plus className="size-4 shrink-0 text-white" />
              <AnimatePresence initial={false}>
                {sidebarExpanded && (
                  <motion.span
                    animate={{ opacity: 1, x: 0 }}
                    className="whitespace-nowrap"
                    exit={{ opacity: 0, x: -4 }}
                    initial={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Percakapan Baru
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <AnimatePresence initial={false}>
              {sidebarExpanded && (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="flex min-h-0 flex-1 flex-col"
                  exit={{ opacity: 0, x: -8 }}
                  initial={{ opacity: 0, x: -8 }}
                  key="expanded-sidebar"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="mb-2 mt-7 px-3 text-xs font-semibold text-slate-400">
                    Riwayat percakapan
                  </p>
                  <div
                    className="min-h-0 flex-1 space-y-1 overflow-y-auto"
                    data-lenis-prevent
                  >
                    {conversations.map((item) => (
                      <div
                        className={cn(
                          "group/history relative rounded-xl transition-colors",

                          conversationId === item.id
                            ? "bg-sky-50 ring-1 ring-sky-100"
                            : "hover:bg-slate-100",
                        )}
                        key={item.id}
                      >
                        <button
                          aria-current={
                            conversationId === item.id ? "page" : undefined
                          }
                          className={cn(
                            "block w-full min-w-0 truncate rounded-xl px-3 py-2.5 pr-10 text-left text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600",

                            conversationId === item.id
                              ? "font-semibold text-sky-800"
                              : "text-slate-600 hover:text-slate-900",
                          )}
                          onClick={() => openConversation(item.id)}
                          type="button"
                        >
                          <motion.span
                            animate={{ opacity: 1, x: 0 }}
                            className="block truncate"
                            initial={{ opacity: 0, x: -4 }}
                            transition={{
                              duration: 0.2,

                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            {String(item.preview || "Percakapan baru").slice(
                              0,

                              54,
                            )}
                          </motion.span>
                          <span className="mt-1 block truncate text-[9px] text-slate-400">
                            {item.updated_at
                              ? new Date(item.updated_at).toLocaleDateString(
                                  "id-ID",

                                  { day: "numeric", month: "short" },
                                )
                              : "Percakapan"}
                          </span>
                        </button>
                        <button
                          aria-label="Hapus percakapan"
                          className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-slate-400 opacity-60 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-rose-500 group-hover/history:opacity-100 disabled:opacity-40"
                          disabled={Boolean(deletingId)}
                          onClick={() => setConversationToDelete(item.id)}
                          title="Hapus percakapan"
                          type="button"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                    {!conversations.length && (
                      <p className="px-3 text-xs leading-5 text-slate-500">
                        Mulai percakapan pertamamu.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div
              className={cn(
                "mt-auto flex min-h-12 shrink-0 items-center overflow-hidden border-t border-slate-100 pt-3 transition-[gap,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",

                sidebarExpanded ? "gap-2 px-2" : "justify-center",
              )}
            >
              <motion.img
                alt="Nutrily"
                className="size-9 shrink-0 object-contain"
                layout
                src={`${import.meta.env.BASE_URL}logo-biru.png`}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
              <AnimatePresence initial={false} mode="popLayout">
                {sidebarExpanded && (
                  <motion.span
                    animate={{ opacity: 1, x: 0 }}
                    className="whitespace-nowrap text-lg font-semibold tracking-tight text-slate-900"
                    exit={{ opacity: 0, x: -6 }}
                    initial={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Nutri<span className="text-sky-500">ly</span> AI
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col">
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  aria-label={
                    showMobileChats ? "Tutup sidebar" : "Buka sidebar"
                  }
                  aria-expanded={showMobileChats}
                  className="grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                  onClick={() => setShowMobileChats((shown) => !shown)}
                  type="button"
                >
                  {showMobileChats ? (
                    <X className="size-4.5" />
                  ) : (
                    <Menu className="size-4.5" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  aria-label="Kembali ke ringkasan"
                  className="grid size-9 place-items-center rounded-xl bg-sky-500 text-white transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                  onClick={() => navigate("dashboard")}
                  title="Kembali ke ringkasan"
                  type="button"
                >
                  <ArrowLeft className="size-4.5" />
                </button>
              </div>
            </header>

            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-6 sm:px-8"
              data-lenis-prevent
              ref={messagesPanel}
            >
              <div className="mx-auto flex min-h-full w-[90%] max-w-none flex-col justify-end">
                {!messages.length && (
                  <div className="m-auto max-w-lg px-4 text-center">
                    <div className="mx-auto mb-5 grid size-14 place-items-center rounded-[1.2rem] border border-sky-100 bg-gradient-to-br from-sky-50 to-indigo-50 text-sky-600 shadow-[0_12px_40px_-20px_rgba(56,189,248,.35)]">
                      <img
                        alt=""
                        className="size-8 object-contain"
                        src={`${import.meta.env.BASE_URL}logo-biru.png`}
                      />
                    </div>
                    <h2 className="text-2xl font-medium tracking-tight text-slate-900 sm:text-[1.75rem]">
                      Ada yang ingin kamu tanyakan?
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Ceritakan tentang makanan, nutrisi, atau target harianmu.
                    </p>
                  </div>
                )}
                <div className="space-y-7 py-4">
                  {messages.map((item, index) =>
                    item.from === "ai" ? (
                      <div
                        className="flex w-full items-start gap-3 text-slate-800"
                        key={item.id || `${item.from}-${index}`}
                      >
                        <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600">
                          <img
                            alt=""
                            className="size-5 object-contain"
                            src={`${import.meta.env.BASE_URL}logo-biru.png`}
                          />
                        </div>
                        <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-white px-5 py-4 text-[15px] leading-7 text-slate-700 shadow-[0_8px_28px_-22px_rgba(15,23,42,.28)] sm:px-6">
                          <Markdown content={item.text} />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="ml-auto flex max-w-[90%] justify-end"
                        key={item.id || `${item.from}-${index}`}
                      >
                        <div className="rounded-[1.4rem] rounded-br-md border border-sky-500 bg-sky-500 px-5 py-3 text-[15px] leading-6 text-white shadow-[0_10px_28px_-20px_rgba(14,165,233,.7)]">
                          {item.imageUrl && (
                            <img
                              alt="Gambar terlampir"
                              className="mb-2 max-h-64 max-w-full rounded-2xl object-contain"
                              src={item.imageUrl}
                            />
                          )}
                          {item.text}
                        </div>
                      </div>
                    ),
                  )}
                  <AnimatePresence>
                    {sending && (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                        exit={{ opacity: 0, y: -4 }}
                        initial={{ opacity: 0, y: 6 }}
                        role="status"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600">
                          <img
                            alt=""
                            className="size-5 object-contain"
                            src={`${import.meta.env.BASE_URL}logo-biru.png`}
                          />
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-600 shadow-[0_8px_28px_-22px_rgba(15,23,42,.28)]">
                          Nutrily AI sedang berpikir
                          <span aria-hidden="true" className="flex gap-1">
                            {[0, 1, 2].map((dot) => (
                              <motion.span
                                animate={{
                                  opacity: [0.3, 1, 0.3],

                                  y: [0, -3, 0],
                                }}
                                className="size-1.5 rounded-full bg-sky-500"
                                key={dot}
                                transition={{
                                  duration: 0.9,

                                  repeat: Infinity,

                                  delay: dot * 0.15,
                                }}
                              />
                            ))}
                          </span>
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="relative z-10 shrink-0 bg-gradient-to-t from-white via-white/95 to-transparent px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-5 sm:px-5 sm:pb-5">
              <AnimatedAIChat
                hasMessages={messages.length > 0}
                image={image}
                imageInputRef={imageInput}
                message={message}
                onChooseImage={chooseImage}
                onMessageChange={setMessage}
                onRemoveImage={() => setImage(null)}
                onSend={send}
                sending={sending}
              />
              <NoticeToast message={notice} onClose={() => setNotice("")} />
            </div>
          </section>
        </div>
      </main>
      {conversationToDelete && (
        <ConfirmDialog
          title="Hapus riwayat percakapan?"
          description="Riwayat percakapan ini akan dihapus permanen. Tindakan ini tidak bisa dibatalkan."
          confirmLabel="Hapus"
          destructive
          onCancel={() => setConversationToDelete(null)}
          onConfirm={() => {
            const id = conversationToDelete
            setConversationToDelete(null)
            deleteConversation(id)
          }}
        />
      )}
    </AppShell>
  )
}

function MealHistory({ navigate }) {
  const [meals, setMeals] = useState([])

  const [loading, setLoading] = useState(true)

  const [actionBusy, setActionBusy] = useState(false)

  const [notice, setNotice] = useState("")

  const [query, setQuery] = useState("")

  const [currentPage, setCurrentPage] = useState(1)

  const [selectedSessions, setSelectedSessions] = useState([])

  const [expandedSessions, setExpandedSessions] = useState([])

  const [sessionNameDraft, setSessionNameDraft] = useState("")

  const [sessionDialog, setSessionDialog] = useState(null)

  const [scanTypeFilter, setScanTypeFilter] = useState("all")

  const [dayFilter, setDayFilter] = useState("")

  useEffect(() => {
    let active = true

    api("/meals", { method: "GET" })

      .then((rows) => active && setMeals(rows))

      .catch((error) => active && setNotice(error.message))

      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!sessionDialog) return

    const scrollY = window.__lenis?.scroll ?? window.scrollY

    const previousBodyStyles = {
      overflow: document.body.style.overflow,

      position: document.body.style.position,

      top: document.body.style.top,

      left: document.body.style.left,

      right: document.body.style.right,

      width: document.body.style.width,
    }

    const previousDocumentOverflow = document.documentElement.style.overflow

    window.__lenis?.stop()

    document.body.style.overflow = "hidden"

    document.body.style.position = "fixed"

    document.body.style.top = `-${scrollY}px`

    document.body.style.left = "0"

    document.body.style.right = "0"

    document.body.style.width = "100%"

    document.documentElement.style.overflow = "hidden"

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSessionDialog(null)
    }

    window.addEventListener("keydown", closeOnEscape)

    return () => {
      window.removeEventListener("keydown", closeOnEscape)

      Object.assign(document.body.style, previousBodyStyles)

      document.documentElement.style.overflow = previousDocumentOverflow

      window.scrollTo(0, scrollY)

      window.__lenis?.start()
    }
  }, [sessionDialog])

  const pageSize = 6

  const sessions = Object.values(
    meals.reduce((groups, meal) => {
      const id = meal.scan_session_id || `single-${meal.id}`

      const session = groups[id] || {
        id,

        meals: [],

        created_at: meal.created_at,

        calories: 0,

        scan_mode: meal.scan_mode || "label",

        scan_session_id: meal.scan_session_id || "",

        scan_session_name: meal.scan_session_name || "",
      }

      session.meals.push(meal)

      session.created_at =
        new Date(meal.created_at) > new Date(session.created_at)
          ? meal.created_at
          : session.created_at

      session.calories += Number(meal.calories) || 0

      groups[id] = session

      return groups
    }, {}),
  )

  const sessionNumbers = new Map()

  const sessionCounts = { receipt: 0, label: 0 }
  ;[...sessions]

    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

    .forEach((session) => {
      sessionCounts[session.scan_mode] =
        (sessionCounts[session.scan_mode] || 0) + 1

      sessionNumbers.set(session.id, sessionCounts[session.scan_mode])
    })

  sessions.forEach((session) => {
    session.session_name =
      session.scan_session_name ||
      `${
        session.scan_mode === "receipt" ? "Scan struk" : "Scan label"
      } ${sessionNumbers.get(session.id)}`
  })

  const filteredSessions = sessions.filter((session) => {
    const searchText = query.trim().toLowerCase()

    const sessionName = session.session_name

    const created = new Date(session.created_at)

    const sessionDay = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}-${String(created.getDate()).padStart(2, "0")}`

    const matchesFilters =
      (scanTypeFilter === "all" || session.scan_mode === scanTypeFilter) &&
      (!dayFilter || sessionDay === dayFilter)

    const matchesSearch =
      sessionName.toLowerCase().includes(searchText) ||
      session.meals.some((meal) =>
        `${meal.name} ${meal.serving_size || ""}`

          .toLowerCase()

          .includes(searchText),
      )

    return matchesFilters && matchesSearch
  })

  const pageCount = Math.max(1, Math.ceil(filteredSessions.length / pageSize))

  useEffect(
    () => setCurrentPage((page) => Math.min(page, pageCount)),

    [pageCount],
  )

  const currentSessions = filteredSessions.slice(
    (currentPage - 1) * pageSize,

    currentPage * pageSize,
  )

  const openSummary = (session) =>
    session.scan_session_id &&
    navigate(`/scanner/summary/${session.scan_session_id}`, {
      state: {
        scanSession: {
          sessionId: session.scan_session_id,
          mode: session.scan_mode,
          sessionName: session.session_name,
          savedCount: session.meals.length,
          advice: "",
          items: session.meals.map((meal) => ({
            name: meal.name,
            serving_size: meal.serving_size,
            calories: meal.calories,
            protein_g: meal.protein_g,
            carbs_g: meal.carbs_g,
            fat_g: meal.fat_g,
            sugar_g: meal.sugar_g,
            sodium_mg: meal.sodium_mg,
            sources: meal.nutrition_sources || [],
          })),
        },
      },
    })

  const allSelected =
    currentSessions.length > 0 &&
    currentSessions.every((session) => selectedSessions.includes(session.id))

  const toggleSession = (sessionId) =>
    setSelectedSessions((previous) =>
      previous.includes(sessionId)
        ? previous.filter((id) => id !== sessionId)
        : [...previous, sessionId],
    )

  const toggleCurrentPage = () =>
    setSelectedSessions((previous) =>
      allSelected
        ? previous.filter(
            (id) => !currentSessions.some((session) => session.id === id),
          )
        : [...new Set([...previous, ...currentSessions.map(({ id }) => id)])],
    )

  const toggleExpanded = (sessionId) =>
    setExpandedSessions((previous) =>
      previous.includes(sessionId)
        ? previous.filter((id) => id !== sessionId)
        : [...previous, sessionId],
    )

  const selectedSession = sessions.find(
    (session) => session.id === selectedSessions[0],
  )

  const startRenaming = () => {
    if (!selectedSession) return

    setSessionNameDraft(selectedSession.session_name)

    setSessionDialog({ type: "rename", ids: [selectedSession.id] })
  }

  const saveSessionName = async () => {
    const name = sessionNameDraft.trim()

    if (!name || sessionDialog?.type !== "rename" || !selectedSession) return

    setActionBusy(true)

    setNotice("")

    try {
      const session = sessions.find(({ id }) => id === sessionDialog.ids[0])

      const query = session?.scan_session_id
        ? `scan_session_id=${encodeURIComponent(session.scan_session_id)}`
        : `meal_id=${encodeURIComponent(session?.meals[0]?.id)}`

      await api(`/meals?${query}`, {
        method: "PATCH",
        body: JSON.stringify({ scan_session_name: name }),
      })

      setMeals((previous) =>
        previous.map((meal) =>
          selectedSession.scan_session_id
            ? meal.scan_session_id === selectedSession.scan_session_id
              ? { ...meal, scan_session_name: name }
              : meal
            : meal.id === selectedSession.meals[0]?.id
              ? { ...meal, scan_session_name: name }
              : meal,
        ),
      )

      setSessionDialog(null)

      setNotice("Nama sesi berhasil diubah.")
    } catch (error) {
      setNotice(error.message)
    } finally {
      setActionBusy(false)
    }
  }

  const deleteSelectedSessions = () => {
    if (!selectedSessions.length) return

    setSessionDialog({ type: "delete", ids: selectedSessions })
  }

  const confirmDeleteSessions = async () => {
    const selected = new Set(sessionDialog?.ids || [])

    if (!selected.size) return

    setActionBusy(true)

    setNotice("")

    const failures = []

    try {
      for (const sessionId of selected) {
        const session = sessions.find(({ id }) => id === sessionId)

        const query = session?.scan_session_id
          ? `scan_session_id=${encodeURIComponent(session.scan_session_id)}`
          : `meal_id=${encodeURIComponent(sessionId.slice("single-".length))}`

        try {
          await api(`/meals?${query}`, { method: "DELETE" })
        } catch (error) {
          failures.push(error.message)
        }
      }

      const rows = await api("/meals", { method: "GET" })

      setMeals(rows)

      setSelectedSessions([])

      setSessionDialog(null)

      setExpandedSessions((previous) =>
        previous.filter((id) => !selected.has(id)),
      )

      setCurrentPage(1)

      setNotice(
        failures.length
          ? failures[0]
          : `${selected.size} sesi berhasil dihapus.`,
      )
    } catch (error) {
      setNotice(error.message)
    } finally {
      setActionBusy(false)
    }
  }

  return (
    <AppShell active="meals" navigate={navigate}>
      <main className="mx-auto min-w-0 max-w-7xl px-4 pb-28 pt-7 sm:px-6 sm:pt-9 lg:px-8 lg:pb-10">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-sky-600">Catatan gizi</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Riwayat makanan
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Semua makanan yang sudah kamu catat, tersusun dalam satu tempat.
            </p>
          </div>
          <Button
            className="w-full self-start sm:w-auto sm:self-auto"
            onClick={() => navigate("/scanner")}
          >
            <Plus className="size-4" /> Catat makanan
          </Button>
        </div>
        <section
          aria-busy={loading || actionBusy}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl"
        >
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-poppins text-base font-semibold text-slate-900">
                  Sesi pemindaian
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredSessions.length} sesi ·{" "}
                  {filteredSessions.reduce(
                    (total, session) => total + session.meals.length,

                    0,
                  )}{" "}
                  makanan
                  {selectedSessions.length > 0 &&
                    ` · ${selectedSessions.length} dipilih`}
                </p>
              </div>
              {selectedSessions.length > 0 && (
                <div className="flex shrink-0 items-center gap-2">
                  {selectedSessions.length === 1 && (
                    <button
                      aria-label="Ubah nama sesi"
                      className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:size-10"
                      onClick={startRenaming}
                      title="Ubah nama sesi"
                      type="button"
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                    </button>
                  )}
                  <button
                    aria-label="Hapus sesi"
                    className="grid size-9 place-items-center rounded-lg border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 sm:size-10"
                    onClick={deleteSelectedSessions}
                    title="Hapus sesi"
                    type="button"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:flex xl:shrink-0 xl:items-center">
              <select
                aria-label="Filter jenis pemindaian"
                className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 font-poppins text-sm font-medium text-slate-800 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 sm:px-3 xl:w-auto"
                onChange={(event) => {
                  setScanTypeFilter(event.target.value)

                  setCurrentPage(1)

                  setSelectedSessions([])
                }}
                value={scanTypeFilter}
              >
                <option value="all">Semua jenis</option>
                <option value="receipt">Scan struk</option>
                <option value="label">Scan label</option>
              </select>
              <input
                aria-label="Filter berdasarkan hari"
                className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 font-poppins text-sm font-medium text-slate-800 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 sm:px-3 xl:w-auto"
                onChange={(event) => {
                  setDayFilter(event.target.value)

                  setCurrentPage(1)

                  setSelectedSessions([])
                }}
                type="date"
                value={dayFilter}
              />
              <label className="relative col-span-2 block w-full sm:col-span-2 xl:col-span-1 xl:w-64">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  aria-label="Cari makanan"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 font-poppins text-sm font-medium text-slate-800 outline-none transition placeholder:font-poppins placeholder:font-medium placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  onChange={(event) => {
                    setQuery(event.target.value)

                    setCurrentPage(1)

                    setSelectedSessions([])
                  }}
                  placeholder="Cari sesi atau makanan..."
                  type="search"
                  value={query}
                />
              </label>
            </div>
          </div>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="w-12 p-4">
                    <input
                      aria-label="Pilih semua sesi di halaman"
                      checked={allSelected}
                      className="size-4 rounded border-slate-300 accent-sky-600"
                      onChange={toggleCurrentPage}
                      type="checkbox"
                    />
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Sesi scan
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Waktu pemindaian
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total kalori
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total item
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentSessions.map((session, index) => (
                  <Fragment key={session.id}>
                    <tr className="transition-colors hover:bg-slate-50/70">
                      <td className="p-4">
                        <input
                          aria-label={`Pilih sesi scan ${index + 1}`}
                          checked={selectedSessions.includes(session.id)}
                          className="size-4 rounded border-slate-300 accent-sky-600"
                          onChange={() => toggleSession(session.id)}
                          type="checkbox"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
                            <ScanLine aria-hidden="true" className="size-4" />
                          </span>
                          <button
                            className="min-w-0 text-left"
                            onClick={() => openSummary(session)}
                            type="button"
                          >
                            <p className="font-semibold text-slate-800 hover:text-sky-700">
                              {session.session_name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {session.scan_mode === "receipt"
                                ? "Scan struk"
                                : "Scan label"}
                            </p>
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap p-4 text-slate-600">
                        {new Date(session.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",

                          timeStyle: "short",
                        })}
                      </td>
                      <td className="whitespace-nowrap p-4 font-semibold text-slate-800">
                        {session.calories.toLocaleString("id-ID")} kkal
                      </td>
                      <td className="whitespace-nowrap p-4 text-slate-600">
                        {session.meals.length} makanan
                      </td>
                      <td className="p-4">
                        <button
                          aria-expanded={expandedSessions.includes(session.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
                          onClick={() => toggleExpanded(session.id)}
                          type="button"
                        >
                          {expandedSessions.includes(session.id)
                            ? "Tutup"
                            : "Lihat item"}
                          <ChevronDown
                            aria-hidden="true"
                            className={`size-3.5 transition-transform ${
                              expandedSessions.includes(session.id)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                    {expandedSessions.includes(session.id) && (
                      <tr className="bg-slate-50/70">
                        <td className="px-5 pb-5 pt-1" colSpan={6}>
                          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Makanan dalam sesi ini
                            </div>
                            <div className="divide-y divide-slate-100">
                              {session.meals.map((meal) => (
                                <div
                                  className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                  key={meal.id}
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600">
                                      <Utensils
                                        aria-hidden="true"
                                        className="size-3.5"
                                      />
                                    </span>
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium text-slate-800">
                                        {meal.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {meal.serving_size || "1 sajian"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-1.5 pl-11 sm:min-w-[270px] sm:pl-0">
                                    {[
                                      [meal.calories, "kcal", "bg-sky-500"],

                                      [
                                        `${meal.protein_g}g`,

                                        "protein",

                                        "bg-violet-500",
                                      ],

                                      [
                                        `${meal.carbs_g}g`,

                                        "karbo",

                                        "bg-emerald-500",
                                      ],

                                      [
                                        `${meal.fat_g}g`,

                                        "lemak",

                                        "bg-amber-400",
                                      ],

                                      [
                                        `${meal.sugar_g ?? 0}g`,

                                        "gula",

                                        "bg-rose-400",
                                      ],

                                      [
                                        `${meal.sodium_mg ?? 0}mg`,

                                        "natrium",

                                        "bg-orange-500",
                                      ],
                                    ].map(([value, label, color]) => (
                                      <div
                                        className="rounded-lg bg-slate-50 px-2 py-1.5 text-center"
                                        key={label}
                                      >
                                        <p className="text-xs font-bold text-slate-800">
                                          {value}
                                        </p>
                                        <p className="mt-1 flex items-center justify-center gap-1 text-[10px] text-slate-500">
                                          <span
                                            className={`size-1.5 rounded-full ${color}`}
                                          />
                                          {label}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {!currentSessions.length && (
                  <tr>
                    <td className="p-12 text-center" colSpan={6}>
                      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                        <Utensils aria-hidden="true" className="size-5" />
                      </span>
                      <p className="mt-3 font-medium text-slate-700">
                        {loading
                          ? "Memuat riwayat makanan…"
                          : query
                            ? "Sesi scan tidak ditemukan"
                            : "Belum ada sesi pemindaian"}
                      </p>
                      {!loading && (
                        <p className="mt-1 text-sm text-slate-500">
                          {query
                            ? "Coba kata kunci lain."
                            : "Catat makanan untuk membuat sesi pemindaian pertama."}
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-slate-100 lg:hidden">
            {currentSessions.length > 0 && (
              <label className="flex min-h-11 items-center gap-2 bg-slate-50 px-4 text-sm font-medium text-slate-600 sm:px-5">
                <input
                  aria-label="Pilih semua sesi di halaman"
                  checked={allSelected}
                  className="size-4 rounded border-slate-300 accent-sky-600"
                  onChange={toggleCurrentPage}
                  type="checkbox"
                />
                Pilih semua sesi
              </label>
            )}
            {currentSessions.map((session, index) => (
              <article className="p-4 sm:p-5" key={`mobile-${session.id}`}>
                <div className="flex items-start gap-3">
                  <input
                    aria-label={`Pilih sesi scan ${index + 1}`}
                    checked={selectedSessions.includes(session.id)}
                    className="mt-1 size-4 shrink-0 rounded border-slate-300 accent-sky-600"
                    onChange={() => toggleSession(session.id)}
                    type="checkbox"
                  />
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
                    <ScanLine aria-hidden="true" className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <button
                      className="min-w-0 text-left"
                      onClick={() => openSummary(session)}
                      type="button"
                    >
                      <h3 className="truncate text-left text-sm font-semibold text-slate-800 hover:text-sky-700">
                        {session.session_name}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {session.scan_mode === "receipt"
                          ? "Scan struk"
                          : "Scan label"}
                      </p>
                    </button>
                  </div>
                  <time className="text-right text-xs text-slate-500">
                    {new Date(session.created_at).toLocaleString("id-ID", {
                      dateStyle: "medium",

                      timeStyle: "short",
                    })}
                  </time>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-sky-50/70 px-3 py-2">
                    <p className="text-[11px] text-slate-500">Total kalori</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                      {session.calories.toLocaleString("id-ID")} kkal
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-[11px] text-slate-500">Total item</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                      {session.meals.length} makanan
                    </p>
                  </div>
                </div>
                <button
                  aria-expanded={expandedSessions.includes(session.id)}
                  className="mt-3 inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                  onClick={() => toggleExpanded(session.id)}
                  type="button"
                >
                  {expandedSessions.includes(session.id)
                    ? "Tutup detail"
                    : "Lihat item"}
                  <ChevronDown
                    aria-hidden="true"
                    className={`size-4 transition-transform ${
                      expandedSessions.includes(session.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSessions.includes(session.id) && (
                  <div className="mt-3 space-y-2 pl-7">
                    {session.meals.map((meal) => (
                      <div
                        className="rounded-xl border border-slate-100 bg-white p-3"
                        key={meal.id}
                      >
                        <p className="text-sm font-medium text-slate-800">
                          {meal.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {meal.serving_size || "1 sajian"}
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-1.5">
                          {[
                            [meal.calories, "kcal", "bg-sky-500"],

                            [`${meal.protein_g}g`, "protein", "bg-violet-500"],

                            [`${meal.carbs_g}g`, "karbo", "bg-emerald-500"],

                            [`${meal.fat_g}g`, "lemak", "bg-amber-400"],

                            [`${meal.sugar_g ?? 0}g`, "gula", "bg-rose-400"],

                            [
                              `${meal.sodium_mg ?? 0}mg`,

                              "natrium",

                              "bg-orange-500",
                            ],
                          ].map(([value, label, color]) => (
                            <div
                              className="rounded-lg bg-slate-50 px-1.5 py-2 text-center"
                              key={label}
                            >
                              <p className="text-xs font-bold text-slate-800">
                                {value}
                              </p>
                              <p className="mt-1 flex items-center justify-center gap-1 text-[10px] text-slate-500">
                                <span
                                  className={`size-1.5 rounded-full ${color}`}
                                />
                                {label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {!currentSessions.length && (
              <p className="px-4 py-12 text-center text-sm text-slate-500">
                {loading
                  ? "Memuat riwayat makanan…"
                  : query || scanTypeFilter !== "all" || dayFilter
                    ? "Tidak ada sesi yang cocok dengan filter."
                    : "Belum ada sesi pemindaian."}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-slate-500">
              {filteredSessions.length ? (
                <>
                  Menampilkan {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, filteredSessions.length)}{" "}
                  dari {filteredSessions.length} sesi
                </>
              ) : (
                "Tidak ada catatan"
              )}
            </p>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                aria-label="Halaman sebelumnya"
                className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                type="button"
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
              </button>
              <span className="px-2 text-sm font-medium text-slate-700">
                {currentPage} / {pageCount}
              </span>
              <button
                aria-label="Halaman berikutnya"
                className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage >= pageCount}
                onClick={() => setCurrentPage((page) => page + 1)}
                type="button"
              >
                <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
        </section>
        {sessionDialog && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSessionDialog(null)
            }}
          >
            <section
              aria-labelledby="session-dialog-title"
              aria-modal="true"
              className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
              role="dialog"
            >
              {sessionDialog.type === "rename" ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault()

                    saveSessionName()
                  }}
                >
                  <h2
                    className="text-lg font-semibold text-slate-900"
                    id="session-dialog-title"
                  >
                    Ubah nama sesi
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Nama baru akan terlihat di riwayat pemindaian.
                  </p>
                  <input
                    aria-label="Nama sesi baru"
                    autoFocus
                    className="mt-5 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    maxLength={60}
                    onChange={(event) =>
                      setSessionNameDraft(event.target.value)
                    }
                    required
                    value={sessionNameDraft}
                  />
                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      className="h-10 rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-100"
                      onClick={() => setSessionDialog(null)}
                      type="button"
                    >
                      Batal
                    </button>
                    <button
                      className="h-10 rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                      disabled={!sessionNameDraft.trim() || actionBusy}
                      type="submit"
                    >
                      {actionBusy ? "Menyimpan…" : "Simpan perubahan"}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2
                    className="text-lg font-semibold text-slate-900"
                    id="session-dialog-title"
                  >
                    Hapus sesi?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Sesi
                    {sessionDialog.ids.length > 1
                      ? ` dan ${sessionDialog.ids.length - 1} sesi lainnya`
                      : " ini"}{" "}
                    beserta seluruh makanan di dalamnya akan dihapus. Tindakan
                    ini tidak dapat dibatalkan.
                  </p>
                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      className="h-10 rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-100"
                      onClick={() => setSessionDialog(null)}
                      type="button"
                    >
                      Batal
                    </button>
                    <button
                      className="h-10 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700"
                      onClick={confirmDeleteSessions}
                      disabled={actionBusy}
                      type="button"
                    >
                      {actionBusy ? "Menghapus…" : "Ya, hapus sesi"}
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
        <NoticeToast message={notice} onClose={() => setNotice("")} />
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
        <NoticeToast message={notice} onClose={() => setNotice("")} />
      </form>
    </main>
  )
}

function OnboardingRoute({ navigate }) {
  const [state, setState] = useState("loading")

  useEffect(() => {
    api("/profile")

      .then((profile) =>
        setState(isCompleteProfile(profile) ? "complete" : "incomplete"),
      )

      .catch(() => setState("incomplete"))
  }, [])

  if (state === "loading")
    return (
      <main className="grid min-h-screen place-items-center text-sm text-slate-500">
        Memuat profil…
      </main>
    )

  if (state === "complete") return <Navigate replace to="/dashboard" />

  return <Onboarding navigate={navigate} />
}

export default function App() {
  const navigate = useNavigate()

  const { pathname } = useLocation()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })

    window.__lenis = lenis

    lenis.on("scroll", ScrollTrigger.update)

    const tick = (time) => lenis.raf(time * 1000)

    gsap.ticker.add(tick)

    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)

      lenis.destroy()

      window.__lenis = null
    }
  }, [])

  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    else window.scrollTo({ top: 0 })
  }, [pathname])

  const go = (next, options) => {
    const routes = {
      landing: "/",

      auth: "/login",

      onboarding: "/onboarding",

      profile: "/profile",

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
      <Route element={<AuthCallback />} path="/auth/callback" />
      <Route element={<ResetPassword />} path="/reset-password" />
      <Route
        element={
          <ProtectedRoute>
            <OnboardingRoute navigate={go} />
          </ProtectedRoute>
        }
        path="/onboarding"
      />
      <Route
        element={
          <ProtectedRoute>
            <ProfilePage navigate={go} />
          </ProtectedRoute>
        }
        path="/profile"
      />
      <Route
        element={
          <ProtectedRoute>
            <ProfileAccountPage navigate={go} />
          </ProtectedRoute>
        }
        path="/profile/account"
      />
      <Route
        element={
          <ProtectedRoute>
            <Onboarding editMode navigate={go} />
          </ProtectedRoute>
        }
        path="/profile/onboarding"
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
            <Scanner navigate={go} />
          </ProtectedRoute>
        }
        path="/scanner/:mode"
      />
      <Route
        element={
          <ProtectedRoute>
            <Scanner navigate={go} />
          </ProtectedRoute>
        }
        path="/scanner/:mode/confirm"
      />
      <Route
        element={
          <ProtectedRoute>
            <Scanner navigate={go} />
          </ProtectedRoute>
        }
        path="/scanner/summary/:sessionId"
      />
      <Route element={<ChatRoute navigate={go} />} path="/chat" />
      <Route
        element={<ChatRoute navigate={go} />}
        path="/chat/:conversationId"
      />
      <Route element={<ChatRoute navigate={go} />} path="*" />
      <Route
        element={
          <ProtectedRoute>
            <MealHistory navigate={go} />
          </ProtectedRoute>
        }
        path="/meals"
      />
    </Routes>
  )
}
