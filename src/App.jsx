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
  CircleAlert,
  Clock3,
  Dumbbell,
  Flame,
  ExternalLink,
  HeartPulse,
  History,
  Leaf,
  List,
  LogOut,
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

import { hasOnboardingInput, validateOnboardingStep } from "./lib/onboarding"

import { supabase } from "./lib/supabase"

import PhoneScrollHero from "./components/PhoneScrollHero"

import PhoneCarouselSection from "./components/PhoneCarouselSection"

import Preloader from "./components/Preloader"

import FaqSection from "./components/FaqSection"

import CtaSection from "./components/CtaSection"

import AuthGridBackground from "./components/AuthGridBackground"

import ProfileDropdown from "./components/ui/profile-dropdown"

import Turnstile from "./components/Turnstile"

import GlowCard from "./components/GlowCard"

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

function Brand({ compact = false, light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-9 place-items-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-200">
        <Leaf className="size-5" strokeWidth={2.4} />
      </div>
      {!compact && (
        <div
          className={cn(
            "text-xl font-bold tracking-tight",

            light ? "text-white" : "text-slate-900",
          )}
        >
          Nutri
          <span className={light ? "text-sky-300" : "text-sky-500"}>ly</span>
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

  min,

  max,

  step,
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
          placeholder={placeholder}
          min={min}
          max={max}
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
      className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-white p-4 shadow-[0_16px_38px_-28px_rgba(14,165,233,.45)] transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_20px_42px_-26px_rgba(14,165,233,.4)] sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-sky-600 shadow-sm">
          <HeartPulse className="size-5" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {targets
              ? "Estimasi kebutuhan personal"
              : "Acuan AKG harian"}
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
            <p className="mt-1 text-[1.7rem] font-bold tracking-[-0.04em] text-sky-700">
              {targets.calories.toLocaleString("id-ID")}{" "}
              <span className="text-sm font-semibold">kkal</span>
            </p>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2 xl:grid-cols-1 xl:gap-0">
            {nutrients.map(([label, amount, unit]) => (
              <div
                className="rounded-lg bg-white/75 px-2.5 py-2.5 transition-colors hover:bg-white xl:flex xl:items-center xl:justify-between xl:rounded-none xl:border-b xl:border-sky-100 xl:bg-transparent xl:px-1"
                key={label}
              >
                <dt className="text-[13px] font-medium text-slate-500">
                  {label}
                </dt>
                <dd className="mt-0.5 text-[15px] font-semibold tracking-[-0.02em] text-slate-800 xl:mt-0">
                  {amount} {unit}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[13px] leading-6 text-slate-500">
            Kelompok usia {age} tahun. AKG resmi menjadi dasar; faktor
            tubuh dan aktivitas membentuk estimasi personal.
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
              <span className="block font-semibold">ISSN · Protein & olahraga</span>
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
      const y = window.scrollY

      setScrolled(y > 24)

      const max = document.documentElement.scrollHeight - window.innerHeight

      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0)
    }

    onScroll()

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-30 flex justify-center px-4">
      <div
        className={cn(
          "w-full transition-all duration-300",

          scrolled ? "mt-3 w-full rounded-xl p-[5px] sm:w-[85%]" : "max-w-7xl",
        )}
        style={
          scrolled
            ? {
                background: `conic-gradient(#0ea5e9 ${progress * 360}deg, rgba(255,255,255,.18) 0deg)`,
              }
            : undefined
        }
      >
        <nav
          className={cn(
            "flex w-full items-center justify-between transition-all duration-300",

            scrolled
              ? "gap-6 rounded-xl bg-sky-950/20 px-4 py-2 shadow-md shadow-sky-950/20 backdrop-blur-[2px]"
              : "bg-transparent px-1 py-5 sm:px-3",
          )}
        >
          <Brand light />
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
    <main className="relative min-h-screen overflow-x-clip bg-white text-slate-900">
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
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
                      Nutrily di genggamanmu
                    </p>
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
    <main className="relative grid min-h-screen bg-sky-50 lg:grid-cols-[1fr_1.03fr]">
      <section className="relative hidden overflow-hidden bg-sky-50 p-12 text-slate-900 lg:flex lg:flex-col">
        <AuthGridBackground />
        <div className="relative z-10 my-auto max-w-lg">
          <h1 className="text-5xl font-bold leading-tight tracking-[-0.04em] text-white">
            Beri tubuhmu gizi terbaik.
          </h1>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-50 px-5 py-5 sm:px-10 sm:py-6 lg:bg-white">
        <AuthGridBackground className="lg:hidden" />
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-sky-100 bg-white/90 p-5 backdrop-blur sm:p-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
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
          <div className="mt-7 sm:mt-8 lg:mt-0">
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

          <div className="mt-8 hidden gap-3 xl:grid">
            {[
              [ScanLine, "Pindai label makanan dalam sekejap"],
              [Bot, "Tanya AI gizi yang personal"],
              [TrendingUp, "Pantau progres harianmu"],
            ].map(([Icon, text]) => (
              <div
                className="group flex cursor-default items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-gradient-to-r hover:from-sky-50 hover:to-white hover:shadow-lg hover:shadow-sky-100"
                key={text}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-sky-600 shadow-sm transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-sky-200">
                  <Icon className="size-4.5" />
                </span>
                <p className="text-sm font-semibold text-slate-700 transition-colors duration-300 group-hover:text-sky-700">
                  {text}
                </p>
              </div>
            ))}
          </div>
          <div className="group mt-4 hidden cursor-default gap-3 rounded-2xl bg-sky-500 p-4 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-r hover:from-sky-500 hover:to-sky-400 hover:shadow-xl hover:shadow-sky-200 xl:flex">
            <ShieldCheck className="size-5 shrink-0 text-white transition-transform duration-300 group-hover:scale-110" />
            <div>
              <p className="text-sm font-bold">Datamu aman</p>
              <p className="mt-1 text-xs leading-5 text-sky-50">
                Privasi adalah prioritas. Data kesehatanmu tetap milikmu.
              </p>
            </div>
          </div>
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

function Onboarding({ navigate }) {
  const { user } = useAuth()

  const [step, setStep] = useState(0)

  const [gender, setGender] = useState("")

  const [status, setStatus] = useState("")

  const [activity, setActivity] = useState("")

  const [isGym, setIsGym] = useState(null)

  const [goal, setGoal] = useState("")

  const [age, setAge] = useState("")

  const [weight, setWeight] = useState("")

  const [height, setHeight] = useState("")

  const [saving, setSaving] = useState(false)

  const [notice, setNotice] = useState("")

  const [profileLoaded, setProfileLoaded] = useState(false)

  const [previewTargets, setPreviewTargets] = useState(null)

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
      kilograms < 1 ||
      kilograms > 500 ||
      !Number.isFinite(centimeters) ||
      centimeters < 30 ||
      centimeters > 275 ||
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

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(""), 4500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const validateStep = (stepIndex) =>
    validateOnboardingStep(stepIndex, {
      age,
      gender,
      status,
      weight,
      height,
      activity,
      isGym,
      goal,
    })

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

  const finishOnboarding = async () => {
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
      kilograms < 1 ||
      kilograms > 500 ||
      !Number.isFinite(centimeters) ||
      centimeters < 30 ||
      centimeters > 275
    ) {
      setStep(1)
      setNotice("Periksa kembali berat dan tinggi badanmu.")

      return
    }

    setSaving(true)

    setNotice("")

    try {
      await api("/profile", {
        method: "PUT",

        body: JSON.stringify({
          full_name: user?.user_metadata?.full_name || "",

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

      navigate("/dashboard", { replace: true })
    } catch (error) {
      setNotice(error.message)
    } finally {
      setSaving(false)
    }
  }

  const continueStep = () => {
    const error = validateStep(step)
    if (error) {
      setNotice(error)
      return
    }

    setNotice("")
    setStep((current) => Math.min(3, current + 1))
  }

  return (
    <main className="font-poppins min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/70 via-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 shadow-[0_6px_24px_-20px_rgba(15,23,42,.45)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Brand />
          <ProfileDropdown
            data={{
              name:
                user?.user_metadata?.full_name ||
                user?.email?.split("@")[0] ||
                "Profil Nutrily",
              email: user?.email || "",
              avatar: user?.user_metadata?.avatar_url || "",
            }}
            onSignOut={async () => {
              await supabase?.auth.signOut()
              navigate("/")
            }}
          />
        </div>
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
                  disabled={index > step}
                  className={cn(
                    "relative z-10 flex min-h-[4.5rem] w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600",
                    index === step
                      ? "bg-white shadow-sm ring-1 ring-sky-100"
                      : index < step
                        ? "hover:bg-white"
                        : "cursor-not-allowed",
                  )}
                  onClick={() => {
                    setNotice("")
                    setStep(index)
                  }}
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
            <div className="mb-3 flex items-center justify-between gap-3 text-[13px] font-semibold text-slate-500">
              <span>
                Langkah {step + 1} dari {steps.length}
              </span>
              <span className="truncate text-right text-sky-700">
                {steps[step]}
              </span>
            </div>
            <div
              aria-label={`Langkah ${step + 1} dari ${steps.length}`}
              aria-valuemax={steps.length}
              aria-valuemin={1}
              aria-valuenow={step + 1}
              className="h-2 overflow-hidden rounded-full bg-slate-100 shadow-inner"
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 shadow-[0_0_12px_rgba(14,165,233,.35)] transition-[width] duration-500 ease-out"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
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
                  max={500}
                  min={1}
                  onChange={setWeight}
                  placeholder="Contoh: 68"
                  step={0.1}
                  type="number"
                  value={weight}
                />
                <Input
                  label="Tinggi badan (cm)"
                  max={275}
                  min={30}
                  onChange={setHeight}
                  placeholder="Contoh: 172"
                  step={0.1}
                  type="number"
                  value={height}
                />
              </div>
              <div className="mt-6 rounded-2xl border border-sky-400 bg-gradient-to-r from-sky-500 to-blue-600 p-4 text-white shadow-lg shadow-sky-200/50 transition duration-200 hover:border-blue-700 hover:shadow-md hover:shadow-sky-200/70 sm:p-5">
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
              <div className="mt-6 rounded-2xl border border-sky-400 bg-gradient-to-r from-sky-500 to-blue-600 p-4 text-white shadow-lg shadow-sky-200/50 transition duration-200 hover:border-blue-700 hover:shadow-xl hover:shadow-sky-200/70 sm:flex sm:items-center sm:justify-between sm:p-5">
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
              className="min-w-36 bg-gradient-to-r from-sky-500 to-blue-600 px-4 shadow-[0_10px_24px_-12px_rgba(2,132,199,.8)] transition duration-200 hover:-translate-y-0.5 hover:from-sky-600 hover:to-blue-700 hover:shadow-lg hover:shadow-sky-200 sm:px-5"
              disabled={saving}
              onClick={() => (step < 3 ? continueStep() : finishOnboarding())}
            >
              {saving
                ? "Menyimpan…"
                : step === 3
                  ? "Simpan profil"
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
      {notice && (
        <div className="pointer-events-none fixed inset-x-4 top-20 z-[70] mx-auto max-w-xl sm:top-24">
          <div
            aria-atomic="true"
            aria-live="assertive"
            className="onboarding-toast pointer-events-auto flex items-start gap-3 rounded-2xl border border-rose-200/90 bg-white/95 p-3.5 text-sm text-slate-700 shadow-[0_18px_48px_-20px_rgba(127,29,29,.28)] backdrop-blur-xl sm:p-4"
            role="alert"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600">
              <CircleAlert aria-hidden="true" className="size-5" />
            </span>
            <p className="min-w-0 flex-1 pt-1 text-[13px] font-medium leading-5 sm:text-sm">
              {notice}
            </p>
            <button
              aria-label="Tutup notifikasi"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
              onClick={() => setNotice("")}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
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

*/

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
                  <br />
                  Gula {meal.sugar_g ?? 0}g · Natrium {meal.sodium_mg ?? 0}mg
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
